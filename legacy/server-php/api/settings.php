<?php
/** Settings API — GET/POST /api/settings.php (admin) */
require_once __DIR__ . '/../config/database.php';
initAPI();

$method = $_SERVER['REQUEST_METHOD'];
requireAdmin();

$settingsFile = __DIR__ . '/../config/settings.json';

if ($method === 'GET') {
    if (!file_exists($settingsFile)) {
        // Default settings
        $defaults = [
            'bakery_name' => 'The Artisan Editorial',
            'contact_email' => 'hello@bakeease.admin',
            'phone_number' => '+1 (555) 892-0442',
            'address' => "122 Artisan Lane, Suite 400\nThe Flour District, NY 10014",
            'currency' => 'USD',
            'hours' => [
                'Monday' => ['open' => '06:00', 'close' => '18:00', 'status' => 'Open'],
                'Tuesday' => ['open' => '06:00', 'close' => '18:00', 'status' => 'Open'],
                'Wednesday' => ['open' => '06:00', 'close' => '18:00', 'status' => 'Open'],
                'Thursday' => ['open' => '06:00', 'close' => '18:00', 'status' => 'Open'],
                'Friday' => ['open' => '06:00', 'close' => '20:00', 'status' => 'Open'],
                'Saturday' => ['open' => '07:00', 'close' => '20:00', 'status' => 'Open'],
                'Sunday' => ['open' => '', 'close' => '', 'status' => 'Closed']
            ]
        ];
        file_put_contents($settingsFile, json_encode($defaults, JSON_PRETTY_PRINT));
        jsonResponse($defaults);
    }
    jsonResponse(json_decode(file_get_contents($settingsFile), true));
}

if ($method === 'POST') {
    $data = getInput();
    if (empty($data)) jsonResponse(['error' => 'No data provided'], 400);
    
    file_put_contents($settingsFile, json_encode($data, JSON_PRETTY_PRINT));
    jsonResponse(['message' => 'Settings saved successfully']);
}

jsonResponse(['error' => 'Method not allowed'], 405);
