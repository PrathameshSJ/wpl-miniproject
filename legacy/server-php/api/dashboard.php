<?php
/** Dashboard API — GET /api/dashboard.php (admin) */
require_once __DIR__ . '/../config/database.php';
initAPI();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') jsonResponse(['error' => 'Method not allowed'], 405);

$db = getDB();
requireAdmin();

// Today's revenue
$rev = $db->query("SELECT COALESCE(SUM(total_amount),0) AS revenue FROM orders WHERE DATE(created_at) = CURDATE() AND status != 'cancelled'")->fetch();
// Today's order count
$cnt = $db->query("SELECT COUNT(*) AS count FROM orders WHERE DATE(created_at) = CURDATE()")->fetch();
// Pending orders
$pen = $db->query("SELECT COUNT(*) AS count FROM orders WHERE status = 'pending'")->fetch();
// Low stock
$low = $db->query("SELECT COUNT(*) AS count FROM inventory WHERE low_stock_threshold IS NOT NULL AND quantity_kg <= low_stock_threshold")->fetch();

// Revenue last 7 days
$rev7 = $db->query("
    SELECT DATE(created_at) AS date, COALESCE(SUM(total_amount),0) AS revenue
    FROM orders WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND status != 'cancelled'
    GROUP BY DATE(created_at) ORDER BY date
")->fetchAll();

// Recent orders (last 10)
$recent = $db->query("
    SELECT o.order_id, o.total_amount, o.status, o.created_at, u.full_name AS customer_name
    FROM orders o JOIN users u ON o.user_id = u.user_id
    ORDER BY o.created_at DESC LIMIT 10
")->fetchAll();
foreach ($recent as &$r) {
    $items = $db->prepare("SELECT oi.quantity, p.name FROM order_items oi JOIN products p ON oi.product_id = p.product_id WHERE oi.order_id = ?");
    $items->execute([$r['order_id']]);
    $r['items_summary'] = implode(', ', array_map(fn($i) => $i['quantity'].'x '.$i['name'], $items->fetchAll()));
}

// Best sellers (top 5)
$best = $db->query("
    SELECT p.name, SUM(oi.quantity) AS units_sold, SUM(oi.quantity * oi.unit_price) AS revenue
    FROM order_items oi JOIN products p ON oi.product_id = p.product_id
    JOIN orders o ON oi.order_id = o.order_id WHERE o.status != 'cancelled'
    GROUP BY p.product_id ORDER BY units_sold DESC LIMIT 5
")->fetchAll();

jsonResponse([
    'today_revenue' => (float) $rev['revenue'],
    'today_orders'  => (int) $cnt['count'],
    'pending_orders' => (int) $pen['count'],
    'low_stock_count' => (int) $low['count'],
    'revenue_7days'  => $rev7,
    'recent_orders'  => $recent,
    'best_sellers'   => $best,
]);
