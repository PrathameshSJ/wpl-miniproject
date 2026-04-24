<?php
/**
 * Reviews API
 * GET   /api/reviews.php?product_id=X → approved reviews for a product
 * GET   /api/reviews.php              → all reviews (admin)
 * POST  /api/reviews.php              → submit a review (auth)
 * PATCH /api/reviews.php?id=X         → approve/reject (admin)
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
    // Public: top-rated reviews for homepage
    if (isset($_GET['top'])) {
        $stmt = $db->query("
            SELECT r.rating, r.comment, r.created_at, u.full_name AS reviewer_name, p.name AS product_name
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            JOIN products p ON r.product_id = p.product_id
            WHERE r.is_approved = 1
            ORDER BY r.rating DESC, r.created_at DESC
            LIMIT 6
        ");
        jsonResponse($stmt->fetchAll());
    }

    if (isset($_GET['product_id'])) {
        $stmt = $db->prepare("
            SELECT r.*, u.full_name AS reviewer_name
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.product_id = ? AND r.is_approved = 1
            ORDER BY r.created_at DESC
        ");
        $stmt->execute([(int) $_GET['product_id']]);
        jsonResponse($stmt->fetchAll());
    }

    // Admin: all reviews
    requireAdmin();
    $stmt = $db->query("
        SELECT r.*, u.full_name AS reviewer_name, p.name AS product_name
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        JOIN products p ON r.product_id = p.product_id
        ORDER BY r.created_at DESC
    ");
    jsonResponse($stmt->fetchAll());
}

function handlePost(PDO $db): void {
    $auth = requireAuth();
    $data = getInput();

    if (empty($data['product_id']) || empty($data['rating'])) {
        jsonResponse(['error' => 'product_id and rating are required'], 400);
    }
    if ($data['rating'] < 1 || $data['rating'] > 5) {
        jsonResponse(['error' => 'Rating must be 1-5'], 400);
    }

    $stmt = $db->prepare("
        INSERT INTO reviews (user_id, product_id, rating, comment, is_approved)
        VALUES (?, ?, ?, ?, 0)
    ");
    $stmt->execute([
        $auth['user_id'],
        (int) $data['product_id'],
        (int) $data['rating'],
        $data['comment'] ?? null,
    ]);

    jsonResponse(['message' => 'Review submitted for approval'], 201);
}

function handlePatch(PDO $db): void {
    requireAdmin();
    $id   = (int) ($_GET['id'] ?? 0);
    $data = getInput();

    if (!$id) jsonResponse(['error' => 'Review ID required'], 400);

    if (isset($data['is_approved'])) {
        $stmt = $db->prepare("UPDATE reviews SET is_approved = ? WHERE review_id = ?");
        $stmt->execute([(int) $data['is_approved'], $id]);
        jsonResponse(['message' => 'Review updated']);
    }

    if (isset($data['delete']) && $data['delete']) {
        $stmt = $db->prepare("DELETE FROM reviews WHERE review_id = ?");
        $stmt->execute([$id]);
        jsonResponse(['message' => 'Review deleted']);
    }

    jsonResponse(['error' => 'No valid action'], 400);
}
