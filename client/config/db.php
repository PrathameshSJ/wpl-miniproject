<?php

define('DB_HOST', 'localhost');
define('DB_NAME', 'exp7_bakeease');
define('DB_USER', 'root');
define('DB_PASS', '');        
define('DB_CHARSET', 'utf8mb4');

function getDB() {
    static $pdo = null;         

    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST
             . ";dbname=" . DB_NAME
             . ";charset=" . DB_CHARSET;

        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log("DB connection failed: " . $e->getMessage());
            die("Database connection failed. Please try again later.");
        }
    }

    return $pdo;
}
?>