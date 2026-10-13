<?php
/**
 * Products API
 * GET    /api/products.php              → all available products
 * GET    /api/products.php?id=X         → single product
 * GET    /api/products.php?category=X   → filter by category_id
 * GET    /api/products.php?search=X     → search by name
 * GET    /api/products.php?sort=X       → price_asc, price_desc, newest, popular
 * POST   /api/products.php              → create product (admin)
 * PUT    /api/products.php?id=X         → update product (admin)
 * DELETE /api/products.php?id=X         → delete product (admin)
 */

require_once __DIR__ . '/../config/database.php';
initAPI();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGet($db);
            break;
        case 'POST':
            handlePost($db);
            break;
        case 'PUT':
            handlePut($db);
            break;
        case 'DELETE':
            handleDelete($db);
            break;
        default:
            jsonResponse(['error' => 'Method not allowed'], 405);
    }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}

/* ── GET ──────────────────────────────────────────────────── */

function handleGet(PDO $db): void {
    // Single product
    if (isset($_GET['id'])) {
        $stmt = $db->prepare("
            SELECT p.*, c.name AS category_name, c.icon_url AS category_icon,
                   COALESCE(AVG(r.rating), 0) AS avg_rating,
                   COUNT(r.review_id) AS review_count
            FROM products p
            JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN reviews r ON p.product_id = r.product_id AND r.is_approved = 1
            WHERE p.product_id = ?
            GROUP BY p.product_id
        ");
        $stmt->execute([(int) $_GET['id']]);
        $product = $stmt->fetch();
        if (!$product) jsonResponse(['error' => 'Product not found'], 404);
        jsonResponse($product);
    }

    // Build query
    $where  = [];
    if (!isset($_GET['all'])) {
        $where[] = 'p.is_available = 1';
    }
    $params = [];

    if (!empty($_GET['category'])) {
        $where[]  = 'p.category_id = ?';
        $params[] = (int) $_GET['category'];
    }

    if (!empty($_GET['search'])) {
        $where[]  = '(p.name LIKE ? OR p.description LIKE ?)';
        $term     = '%' . $_GET['search'] . '%';
        $params[] = $term;
        $params[] = $term;
    }

    if (!empty($_GET['min_price'])) {
        $where[]  = 'p.base_price >= ?';
        $params[] = (float) $_GET['min_price'];
    }

    if (!empty($_GET['max_price'])) {
        $where[]  = 'p.base_price <= ?';
        $params[] = (float) $_GET['max_price'];
    }

    $orderBy = 'p.created_at DESC';
    switch ($_GET['sort'] ?? '') {
        case 'price_asc':  $orderBy = 'p.base_price ASC';  break;
        case 'price_desc': $orderBy = 'p.base_price DESC'; break;
        case 'newest':     $orderBy = 'p.created_at DESC'; break;
        case 'popular':    $orderBy = 'COALESCE(AVG(r.rating),0) DESC'; break;
    }

    $limit  = min((int) ($_GET['limit'] ?? 50), 100);
    $offset = max((int) ($_GET['offset'] ?? 0), 0);

    $whereSQL = empty($where) ? '1=1' : implode(' AND ', $where);

    $stmt = $db->prepare("
        SELECT p.*, c.name AS category_name, c.icon_url AS category_icon,
               COALESCE(AVG(r.rating), 0) AS avg_rating,
               COUNT(r.review_id) AS review_count
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN reviews r ON p.product_id = r.product_id AND r.is_approved = 1
        WHERE $whereSQL
        GROUP BY p.product_id
        ORDER BY $orderBy
        LIMIT $limit OFFSET $offset
    ");
    $stmt->execute($params);
    $products = $stmt->fetchAll();

    // Total count
    $stmtCount = $db->prepare("SELECT COUNT(DISTINCT p.product_id) FROM products p WHERE $whereSQL");
    $stmtCount->execute($params);
    $total = (int) $stmtCount->fetchColumn();

    jsonResponse(['products' => $products, 'total' => $total]);
}

/* ── POST ─────────────────────────────────────────────────── */

function handlePost(PDO $db): void {
    requireAdmin();
    $data = getInput();

    $required = ['name', 'category_id', 'base_price'];
    foreach ($required as $field) {
        if (empty($data[$field])) jsonResponse(['error' => "$field is required"], 400);
    }

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../../client/images/';
        $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $filename = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $data['name'])) . '.' . $ext;
        move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $filename);
        $data['image_url'] = $filename;
    }

    $stmt = $db->prepare("
        INSERT INTO products (category_id, name, description, base_price, image_url, is_available, stock_quantity)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        (int) $data['category_id'],
        $data['name'],
        $data['description'] ?? null,
        (float) $data['base_price'],
        $data['image_url'] ?? null,
        (int) ($data['is_available'] ?? 1),
        (int) ($data['stock_quantity'] ?? 20),
    ]);

    jsonResponse(['message' => 'Product created', 'product_id' => (int) $db->lastInsertId()], 201);
}

/* ── PUT ──────────────────────────────────────────────────── */

function handlePut(PDO $db): void {
    requireAdmin();
    $id   = (int) ($_GET['id'] ?? 0);
    $data = getInput();
    if (!$id) jsonResponse(['error' => 'Product ID required'], 400);

    $fields = [];
    $params = [];

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../../client/images/';
        $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $filename = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $data['name'] ?? 'product-' . $id)) . '.' . $ext;
        move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $filename);
        $data['image_url'] = $filename;
    }

    foreach (['name', 'description', 'image_url'] as $f) {
        if (isset($data[$f])) { $fields[] = "$f = ?"; $params[] = $data[$f]; }
    }
    foreach (['category_id', 'is_available', 'stock_quantity'] as $f) {
        if (isset($data[$f])) { $fields[] = "$f = ?"; $params[] = (int) $data[$f]; }
    }
    if (isset($data['base_price'])) { $fields[] = "base_price = ?"; $params[] = (float) $data['base_price']; }

    if (empty($fields)) jsonResponse(['error' => 'No fields to update'], 400);

    $params[] = $id;
    $stmt = $db->prepare("UPDATE products SET " . implode(', ', $fields) . " WHERE product_id = ?");
    $stmt->execute($params);

    jsonResponse(['message' => 'Product updated']);
}

/* ── DELETE ───────────────────────────────────────────────── */

function handleDelete(PDO $db): void {
    requireAdmin();
    $id = (int) ($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'Product ID required'], 400);

    // Delete dependent records first to avoid foreign key constraints
    $db->prepare("DELETE FROM order_items WHERE product_id = ?")->execute([$id]);
    $db->prepare("DELETE FROM reviews WHERE product_id = ?")->execute([$id]);
    
    $stmt = $db->prepare("DELETE FROM products WHERE product_id = ?");
    $stmt->execute([$id]);

    jsonResponse(['message' => 'Product deleted']);
}
