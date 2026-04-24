<?php
/**
 * Auth API
 * POST /api/auth.php?action=login    → { email, password }
 * POST /api/auth.php?action=register → { full_name, email, phone, password }
 * GET  /api/auth.php?action=me       → current user info (requires token)
 */

require_once __DIR__ . '/../config/database.php';
initAPI();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    if ($method === 'POST' && $action === 'login')    { handleLogin($db); }
    elseif ($method === 'POST' && $action === 'register') { handleRegister($db); }
    elseif ($method === 'POST' && $action === 'update_settings') { handleUpdateSettings($db); }
    elseif ($method === 'GET'  && $action === 'me')       { handleMe($db); }
    else { jsonResponse(['error' => 'Invalid action'], 400); }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}

function handleLogin(PDO $db): void {
    $data = getInput();
    if (empty($data['email']) || empty($data['password'])) {
        jsonResponse(['error' => 'Email and password are required'], 400);
    }

    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($data['password'], $user['password_hash'])) {
        jsonResponse(['error' => 'Invalid email or password'], 401);
    }

    $token = generateToken($user['user_id'], $user['role']);
    unset($user['password_hash']);

    jsonResponse([
        'token' => $token,
        'user'  => $user,
    ]);
}

function handleRegister(PDO $db): void {
    $data = getInput();

    $required = ['full_name', 'email', 'phone', 'password'];
    foreach ($required as $field) {
        if (empty($data[$field])) jsonResponse(['error' => "$field is required"], 400);
    }

    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['error' => 'Invalid email format'], 400);
    }

    if (strlen($data['password']) < 6) {
        jsonResponse(['error' => 'Password must be at least 6 characters'], 400);
    }

    // Check duplicate email
    $stmt = $db->prepare("SELECT user_id FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    if ($stmt->fetch()) {
        jsonResponse(['error' => 'Email already registered'], 409);
    }

    $hash = password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 10]);

    $stmt = $db->prepare("
        INSERT INTO users (full_name, email, phone, password_hash, role)
        VALUES (?, ?, ?, ?, 'customer')
    ");
    $stmt->execute([
        htmlspecialchars($data['full_name']),
        $data['email'],
        $data['phone'],
        $hash,
    ]);

    $userId = (int) $db->lastInsertId();
    $token  = generateToken($userId, 'customer');

    $stmt = $db->prepare("SELECT user_id, full_name, email, phone, role, created_at FROM users WHERE user_id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    jsonResponse(['token' => $token, 'user' => $user], 201);
}

function handleMe(PDO $db): void {
    $auth = requireAuth();

    $stmt = $db->prepare("SELECT user_id, full_name, email, phone, role, created_at FROM users WHERE user_id = ?");
    $stmt->execute([$auth['user_id']]);
    $user = $stmt->fetch();

    if (!$user) jsonResponse(['error' => 'User not found'], 404);
    jsonResponse($user);
}

function handleUpdateSettings(PDO $db): void {
    $auth = requireAuth();
    $data = getInput();

    if (empty($data['current_password'])) {
        jsonResponse(['error' => 'Current password is required to save changes'], 400);
    }

    $stmt = $db->prepare("SELECT password_hash FROM users WHERE user_id = ?");
    $stmt->execute([$auth['user_id']]);
    $hash = $stmt->fetchColumn();

    if (!password_verify($data['current_password'], $hash)) {
        jsonResponse(['error' => 'Incorrect current password'], 403);
    }

    $updates = [];
    $params = [];

    if (!empty($data['full_name'])) {
        $updates[] = "full_name = ?";
        $params[] = htmlspecialchars($data['full_name']);
    }
    if (!empty($data['phone'])) {
        $updates[] = "phone = ?";
        $params[] = htmlspecialchars($data['phone']);
    }
    if (!empty($data['new_password'])) {
        if (strlen($data['new_password']) < 6) {
            jsonResponse(['error' => 'New password must be at least 6 characters'], 400);
        }
        $updates[] = "password_hash = ?";
        $params[] = password_hash($data['new_password'], PASSWORD_BCRYPT, ['cost' => 10]);
    }

    if (empty($updates)) {
        jsonResponse(['message' => 'No changes made']);
    }

    $params[] = $auth['user_id'];
    $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE user_id = ?";
    $db->prepare($sql)->execute($params);

    $stmt = $db->prepare("SELECT user_id, full_name, email, phone, role, created_at FROM users WHERE user_id = ?");
    $stmt->execute([$auth['user_id']]);
    $user = $stmt->fetch();

    jsonResponse(['message' => 'Settings updated successfully', 'user' => $user]);
}
