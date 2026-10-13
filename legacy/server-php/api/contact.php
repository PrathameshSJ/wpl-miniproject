<?php
/** Contact API — POST /api/contact.php */
require_once __DIR__ . '/../config/database.php';
initAPI();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);

$data = getInput();
$required = ['name', 'email', 'message'];
foreach ($required as $f) {
    if (empty($data[$f])) jsonResponse(['error' => "$f is required"], 400);
}

$db = getDB();

// Create table if not exists
$db->exec("CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(15) DEFAULT NULL,
    subject VARCHAR(100) DEFAULT NULL,
    message TEXT NOT NULL,
    rating TINYINT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$stmt = $db->prepare("INSERT INTO contact_messages (name, email, phone, subject, message, rating) VALUES (?,?,?,?,?,?)");
$stmt->execute([
    htmlspecialchars($data['name']), $data['email'],
    $data['phone'] ?? null, $data['subject'] ?? null,
    htmlspecialchars($data['message']), $data['rating'] ?? null,
]);

jsonResponse(['message' => 'Thank you! We will get back to you within 24 hours.'], 201);
