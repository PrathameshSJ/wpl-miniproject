<?php
/** Reports API — GET /api/reports.php (admin) */
require_once __DIR__ . '/../config/database.php';
initAPI();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') jsonResponse(['error' => 'Method not allowed'], 405);

$db = getDB();
requireAdmin();

// Total Orders & Avg Order Value
$ordersStats = $db->query("
    SELECT COUNT(order_id) as total_orders, COALESCE(AVG(total_amount), 0) as avg_order_value 
    FROM orders 
    WHERE status != 'cancelled'
")->fetch();

// Customer Growth (Users created in last 30 days vs total)
$newCust = $db->query("SELECT COUNT(*) as cnt FROM users WHERE role = 'customer' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)")->fetch()['cnt'];
$totCust = $db->query("SELECT COUNT(*) as cnt FROM users WHERE role = 'customer'")->fetch()['cnt'];

// Sales by Category
$catSales = $db->query("
    SELECT c.name as category_name, SUM(oi.quantity * oi.unit_price) as revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    JOIN categories c ON p.category_id = c.category_id
    JOIN orders o ON oi.order_id = o.order_id
    WHERE o.status != 'cancelled'
    GROUP BY c.category_id
    ORDER BY revenue DESC
")->fetchAll();

// Top Selling Locations (Mocked via Delivery Address since location isn't strictly normalized)
// Let's just group by delivery_address if available, or just send a mock if it's too unstructured
$locSales = $db->query("
    SELECT SUBSTRING_INDEX(delivery_address, ',', 1) as location, SUM(total_amount) as revenue
    FROM orders
    WHERE status != 'cancelled' AND delivery_address IS NOT NULL AND delivery_address != ''
    GROUP BY location
    ORDER BY revenue DESC
    LIMIT 5
")->fetchAll();

// Recent High Value Orders
$highValue = $db->query("
    SELECT o.order_id, u.full_name, o.delivery_address, o.total_amount 
    FROM orders o 
    JOIN users u ON o.user_id = u.user_id
    WHERE o.status != 'cancelled'
    ORDER BY o.total_amount DESC 
    LIMIT 5
")->fetchAll();

foreach ($highValue as &$hv) {
    $items = $db->prepare("SELECT oi.quantity, p.name FROM order_items oi JOIN products p ON oi.product_id = p.product_id WHERE oi.order_id = ?");
    $items->execute([$hv['order_id']]);
    $hv['items_summary'] = implode(', ', array_map(fn($i) => $i['quantity'].'x '.$i['name'], $items->fetchAll()));
    
    // Initials
    $parts = explode(' ', $hv['full_name']);
    $hv['initials'] = count($parts) >= 2 ? strtoupper($parts[0][0] . $parts[1][0]) : strtoupper(substr($hv['full_name'], 0, 2));
}

jsonResponse([
    'total_orders' => (int) $ordersStats['total_orders'],
    'avg_order_value' => (float) $ordersStats['avg_order_value'],
    'customer_growth' => $newCust,
    'total_customers' => $totCust,
    'category_sales' => $catSales,
    'location_sales' => $locSales,
    'high_value_orders' => $highValue
]);
