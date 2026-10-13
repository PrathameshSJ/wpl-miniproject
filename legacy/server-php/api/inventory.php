<?php
/**
 * Inventory API
 * GET /api/inventory.php       → all inventory items
 * PUT /api/inventory.php?id=X  → update stock (admin)
 */

require_once __DIR__ . '/../config/database.php';
initAPI();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $db->query("SELECT * FROM inventory ORDER BY name ASC");
        $items = $stmt->fetchAll();
        foreach ($items as &$item) {
            $item['is_low_stock'] = $item['low_stock_threshold'] !== null
                && (float)$item['quantity_kg'] <= (float)$item['low_stock_threshold'];
        }
        jsonResponse($items);
    }

    if ($method === 'PUT') {
        requireAdmin();
        $id   = (int) ($_GET['id'] ?? 0);
        $data = getInput();
        if (!$id) jsonResponse(['error' => 'Ingredient ID required'], 400);

        $fields = [];
        $params = [];
        if (isset($data['quantity_kg'])) {
            $fields[] = 'quantity_kg = ?';
            $params[] = (float) $data['quantity_kg'];
        }
        if (isset($data['name'])) {
            $fields[] = 'name = ?';
            $params[] = $data['name'];
        }
        if (isset($data['low_stock_threshold'])) {
            $fields[] = 'low_stock_threshold = ?';
            $params[] = (float) $data['low_stock_threshold'];
        }
        if (empty($fields)) jsonResponse(['error' => 'No fields to update'], 400);

        $params[] = $id;
        $db->prepare("UPDATE inventory SET " . implode(', ', $fields) . " WHERE ingredient_id = ?")->execute($params);
        jsonResponse(['message' => 'Inventory updated']);
    }

    jsonResponse(['error' => 'Method not allowed'], 405);
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
