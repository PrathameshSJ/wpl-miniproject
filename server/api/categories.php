<?php
/** Categories API — GET /api/categories.php */

require_once __DIR__ . '/../config/database.php';
initAPI();

$db = getDB();

$stmt = $db->query("
    SELECT c.*, COUNT(p.product_id) AS product_count
    FROM categories c
    LEFT JOIN products p ON c.category_id = p.category_id AND p.is_available = 1
    GROUP BY c.category_id
    ORDER BY c.category_id
");
jsonResponse($stmt->fetchAll());
