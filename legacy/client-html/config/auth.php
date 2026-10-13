<?php

session_start();
define('REMEMBER_ME_DAYS',   30);           // how long the cookie lasts
define('REMEMBER_COOKIE',    'be_remember'); // cookie name
define('SESSION_TIMEOUT',    1800);         // 30 min inactivity timeout

function clean($value) {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

function checkSessionTimeout() {
    if (isset($_SESSION['last_activity'])) {
        if (time() - $_SESSION['last_activity'] > SESSION_TIMEOUT) {
            session_unset();
            session_destroy();
            header("Location: login.php?msg=timeout");
            exit();
        }
    }
    $_SESSION['last_activity'] = time();
}

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function requireLogin() {
    if (isLoggedIn()) {
        checkSessionTimeout();
        return;
    }

    if (autoLoginFromCookie()) {
        return;
    }

    header("Location: login.php?msg=please_login");
    exit();
}

function requireAdmin() {
    requireLogin();
    if ($_SESSION['role'] !== 'admin') {
        header("Location: dashboard.php?msg=no_access");
        exit();
    }
}

function loginUser($user) {
    session_regenerate_id(true);

    $_SESSION['user_id'] = $user['user_id'];
    $_SESSION['full_name'] = $user['full_name'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['role'] = $user['role'];
    $_SESSION['last_activity'] = time();
    $_SESSION['login_time'] = date('Y-m-d H:i:s');
}

function setRememberMeCookie($userId) {
    $pdo   = getDB();
    $token = bin2hex(random_bytes(32)); 
    $expiry = time() + (REMEMBER_ME_DAYS * 24 * 60 * 60);
    $expiryDate = date('Y-m-d H:i:s', $expiry);

    $stmt = $pdo->prepare(
        "INSERT INTO remember_tokens (user_id, token, expires_at)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE token = ?, expires_at = ?"
    );
    $stmt->execute([$userId, $token, $expiryDate, $token, $expiryDate]);

    setcookie(
        REMEMBER_COOKIE,               
        $userId . ':' . $token,        
        [
            'expires' => $expiry,
            'path' => '/',
            'httponly' => true,          
            'samesite' => 'Strict',      
        ]
    );
}

function autoLoginFromCookie() {
    if (!isset($_COOKIE[REMEMBER_COOKIE])) {
        return false;
    }

    $parts = explode(':', $_COOKIE[REMEMBER_COOKIE], 2);
    if (count($parts) !== 2) {
        clearRememberMeCookie();
        return false;
    }

    [$userId, $token] = $parts;
    $pdo = getDB();

    $stmt = $pdo->prepare(
        "SELECT u.user_id, u.full_name, u.email, u.role
         FROM remember_tokens rt
         JOIN users u ON u.user_id = rt.user_id
         WHERE rt.user_id = ? AND rt.token = ? AND rt.expires_at > NOW()"
    );
    $stmt->execute([$userId, $token]);
    $user = $stmt->fetch();

    if (!$user) {
        clearRememberMeCookie();
        return false;
    }

    loginUser($user);
    setRememberMeCookie($userId);
    return true;
}

function clearRememberMeCookie() {
    if (isset($_COOKIE[REMEMBER_COOKIE])) {
        setcookie(REMEMBER_COOKIE, '', time() - 3600, '/');
    }

    if (isLoggedIn()) {
        $pdo  = getDB();
        $stmt = $pdo->prepare("DELETE FROM remember_tokens WHERE user_id = ?");
        $stmt->execute([$_SESSION['user_id']]);
    }
}

function logoutUser() {
    clearRememberMeCookie();
    session_unset();
    session_destroy();

    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(), '',
            time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
}

function setFlash($type, $message) {
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

function getFlash() {
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $flash;
    }
    return null;
}

function getUser() {
    if (!isset($_SESSION['user_id'])) {
        return null;
    }

    return [
        'user_id' => $_SESSION['user_id'],
        'full_name' => $_SESSION['full_name'],
        'email' => $_SESSION['email'],
        'role' => $_SESSION['role'],
    ];
}
?>