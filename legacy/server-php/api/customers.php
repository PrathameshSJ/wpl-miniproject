<?php
/** Customers API — GET /api/customers.php (admin) */
require_once __DIR__ . '/../config/database.php';
initAPI();

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $db = getDB();
    requireAdmin();
    $id = (int) ($_GET['id'] ?? 0);
    $data = getInput();
    if (!$id) jsonResponse(['error' => 'User ID required'], 400);
    if (!isset($data['role'])) jsonResponse(['error' => 'Role is required'], 400);
    
    $stmt = $db->prepare("UPDATE users SET role = ? WHERE user_id = ?");
    $stmt->execute([$data['role'], $id]);
    jsonResponse(['message' => 'User role updated']);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') jsonResponse(['error' => 'Method not allowed'], 405);

$db = getDB();
requireAdmin();

$stmt = $db->query("
    SELECT 
        u.user_id, 
        u.full_name, 
        u.email, 
        u.phone, 
        u.role,
        u.created_at,
        COUNT(o.order_id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_spend
    FROM users u
    LEFT JOIN orders o ON u.user_id = o.user_id AND o.status != 'cancelled'
    WHERE u.role IN ('customer', 'admin')
    GROUP BY u.user_id
    ORDER BY u.created_at DESC
");
$customers = $stmt->fetchAll();

// Add logic to calculate membership tier based on total spend
foreach ($customers as &$c) {
    $spend = (float)$c['total_spend'];
    if ($spend > 5000) {
        $c['tier'] = 'Gold Crust Member';
    } elseif ($spend > 1000) {
        $c['tier'] = "Baker's Guild";
    } elseif ($spend > 0) {
        $c['tier'] = 'Sourdough Society';
    } else {
        $c['tier'] = 'New Artisan';
    }
}

jsonResponse($customers);
