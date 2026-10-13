<?php
/**
 * Orders API
 * GET   /api/orders.php          → all orders (admin)
 * GET   /api/orders.php?my=1     → current user's orders (auth)
 * POST  /api/orders.php          → place a new order (auth)
 * PATCH /api/orders.php?id=X     → update order status (admin)
 */

require_once __DIR__ . '/../config/database.php';
initAPI();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':   handleGet($db);   break;
        case 'POST':  handlePost($db);  break;
        case 'PATCH': handlePatch($db); break;
        default:      jsonResponse(['error' => 'Method not allowed'], 405);
    }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}

function handleGet(PDO $db): void {
    if (isset($_GET['my'])) {
        $auth = requireAuth();
        $stmt = $db->prepare("
            SELECT o.*, u.full_name AS customer_name
            FROM orders o
            JOIN users u ON o.user_id = u.user_id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        ");
        $stmt->execute([$auth['user_id']]);
        $orders = $stmt->fetchAll();

        foreach ($orders as &$order) {
            $items = $db->prepare("
                SELECT oi.*, p.name AS product_name, p.image_url
                FROM order_items oi
                JOIN products p ON oi.product_id = p.product_id
                WHERE oi.order_id = ?
            ");
            $items->execute([$order['order_id']]);
            $order['items'] = $items->fetchAll();
        }
        jsonResponse($orders);
    }

    // Admin: all orders
    requireAdmin();

    $status = $_GET['status'] ?? '';
    $where  = '';
    $params = [];

    if ($status) {
        $where  = 'WHERE o.status = ?';
        $params = [$status];
    }

    $stmt = $db->prepare("
        SELECT o.*, u.full_name AS customer_name, u.email AS customer_email, u.phone AS customer_phone
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        $where
        ORDER BY o.created_at DESC
    ");
    $stmt->execute($params);
    $orders = $stmt->fetchAll();

    foreach ($orders as &$order) {
        $items = $db->prepare("
            SELECT oi.*, p.name AS product_name, p.image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.product_id
            WHERE oi.order_id = ?
        ");
        $items->execute([$order['order_id']]);
        $order['items'] = $items->fetchAll();

        $pay = $db->prepare("SELECT * FROM payments WHERE order_id = ?");
        $pay->execute([$order['order_id']]);
        $order['payment'] = $pay->fetch() ?: null;
    }

    jsonResponse($orders);
}

function handlePost(PDO $db): void {
    $auth = requireAuth();
    $data = getInput();

    if (empty($data['items']) || !is_array($data['items'])) {
        jsonResponse(['error' => 'Order items are required'], 400);
    }
    if (empty($data['delivery_type'])) {
        jsonResponse(['error' => 'Delivery type is required'], 400);
    }

    $db->beginTransaction();
    try {
        // Calculate total
        $total = 0;
        foreach ($data['items'] as $item) {
            $stmt = $db->prepare("SELECT base_price FROM products WHERE product_id = ? AND is_available = 1");
            $stmt->execute([$item['product_id']]);
            $product = $stmt->fetch();
            if (!$product) throw new Exception("Product {$item['product_id']} not found or unavailable");
            $total += $product['base_price'] * ($item['quantity'] ?? 1);
        }

        // Create order
        $stmt = $db->prepare("
            INSERT INTO orders (user_id, total_amount, status, delivery_type, delivery_address, scheduled_at)
            VALUES (?, ?, 'pending', ?, ?, ?)
        ");
        $stmt->execute([
            $auth['user_id'],
            $total,
            $data['delivery_type'],
            $data['delivery_address'] ?? null,
            $data['scheduled_at'] ?? null,
        ]);
        $orderId = (int) $db->lastInsertId();

        // Insert items
        $stmtItem = $db->prepare("
            INSERT INTO order_items (order_id, product_id, quantity, unit_price, customisation)
            VALUES (?, ?, ?, ?, ?)
        ");
        foreach ($data['items'] as $item) {
            $stmt = $db->prepare("SELECT base_price FROM products WHERE product_id = ?");
            $stmt->execute([$item['product_id']]);
            $price = $stmt->fetchColumn();

            $stmtItem->execute([
                $orderId,
                $item['product_id'],
                $item['quantity'] ?? 1,
                $price,
                isset($item['customisation']) ? json_encode($item['customisation']) : null,
            ]);
        }

        // Create payment record
        $payMethod = $data['payment_method'] ?? 'cod';
        $payStatus = $payMethod === 'cod' ? 'pending' : 'pending';
        $db->prepare("INSERT INTO payments (order_id, method, status) VALUES (?, ?, ?)")
           ->execute([$orderId, $payMethod, $payStatus]);

        $db->commit();
        jsonResponse(['message' => 'Order placed', 'order_id' => $orderId], 201);
    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }
}

function handlePatch(PDO $db): void {
    requireAdmin();
    $id   = (int) ($_GET['id'] ?? 0);
    $data = getInput();

    if (!$id) jsonResponse(['error' => 'Order ID required'], 400);
    if (empty($data['status'])) jsonResponse(['error' => 'Status is required'], 400);

    $valid = ['pending', 'baking', 'out_for_delivery', 'completed', 'cancelled'];
    if (!in_array($data['status'], $valid)) {
        jsonResponse(['error' => 'Invalid status'], 400);
    }

    $stmt = $db->prepare("UPDATE orders SET status = ? WHERE order_id = ?");
    $stmt->execute([$data['status'], $id]);

    if ($data['status'] === 'completed') {
        $db->prepare("UPDATE payments SET status = 'success', paid_at = NOW() WHERE order_id = ? AND status = 'pending'")
           ->execute([$id]);
    }

    jsonResponse(['message' => 'Order status updated']);
}
