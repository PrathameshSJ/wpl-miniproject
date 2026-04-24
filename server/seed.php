<?php
/**
 * One-time seed script — creates admin user and seeds data
 * Run via: http://localhost/bakeease/server/seed.php
 */
require_once __DIR__ . '/config/database.php';

$db = getDB();

echo "<pre>\n";

// 1. Drop bakeease_admin table if exists
try {
    $db->exec("DROP TABLE IF EXISTS bakeease_admin");
    echo "✓ Dropped bakeease_admin table\n";
} catch (Exception $e) { echo "⚠ " . $e->getMessage() . "\n"; }

// 2. Add stock_quantity column
try {
    $db->exec("ALTER TABLE products ADD COLUMN stock_quantity INT NOT NULL DEFAULT 20");
    echo "✓ Added stock_quantity column\n";
} catch (Exception $e) {
    if (strpos($e->getMessage(), 'Duplicate column') !== false) {
        echo "✓ stock_quantity column already exists\n";
    } else { echo "⚠ " . $e->getMessage() . "\n"; }
}

// 3. Create/update admin user with proper bcrypt hash
$adminPass = password_hash('admin123', PASSWORD_BCRYPT);
$stmt = $db->prepare("SELECT user_id FROM users WHERE email = ?");
$stmt->execute(['admin@bakeease.in']);
if ($stmt->fetch()) {
    $db->prepare("UPDATE users SET password_hash = ?, full_name = 'Amit Kumar', role = 'admin' WHERE email = ?")
       ->execute([$adminPass, 'admin@bakeease.in']);
    echo "✓ Updated admin user password\n";
} else {
    $db->prepare("INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)")
       ->execute(['Amit Kumar', 'admin@bakeease.in', '9998887777', $adminPass, 'admin']);
    echo "✓ Created admin user (admin@bakeease.in / admin123)\n";
}

// 4. Ensure sample customers exist
$customers = [
    ['Priya Sharma', 'priya@example.com', '9876543210'],
    ['Rahul Kapoor', 'rahul@example.com', '9876543211'],
    ['Ananya Mehra', 'ananya@example.com', '9876543212'],
    ['Siddharth Verma', 'sid@example.com', '9876543213'],
    ['Neha Gupta', 'neha@example.com', '9876543214'],
];
$custPass = password_hash('customer123', PASSWORD_BCRYPT);
foreach ($customers as $c) {
    $stmt = $db->prepare("SELECT user_id FROM users WHERE email = ?");
    $stmt->execute([$c[1]]);
    if (!$stmt->fetch()) {
        $db->prepare("INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'customer')")
           ->execute([$c[0], $c[1], $c[2], $custPass]);
        echo "✓ Created customer: {$c[0]}\n";
    } else {
        echo "✓ Customer exists: {$c[0]}\n";
    }
}

// Get user IDs for seeding
$userIds = [];
$stmt = $db->query("SELECT user_id, email FROM users ORDER BY user_id");
while ($row = $stmt->fetch()) $userIds[$row['email']] = $row['user_id'];

$adminId = $userIds['admin@bakeease.in'];
$cust1 = $userIds['priya@example.com'];
$cust2 = $userIds['rahul@example.com'];
$cust3 = $userIds['ananya@example.com'];
$cust4 = $userIds['sid@example.com'];
$cust5 = $userIds['neha@example.com'];

// 5. Seed orders if none exist
$orderCount = $db->query("SELECT COUNT(*) FROM orders")->fetchColumn();
if ($orderCount == 0) {
    $orders = [
        [$cust1, 1398.00, 'completed', 'delivery', '42 Marine Drive, Mumbai', 'NOW() - INTERVAL 2 DAY'],
        [$cust2, 538.00, 'baking', 'pickup', null, 'NOW() - INTERVAL 1 DAY'],
        [$cust3, 999.00, 'pending', 'delivery', '15 Linking Rd, Bandra', 'NOW() - INTERVAL 12 HOUR'],
        [$cust4, 747.00, 'out_for_delivery', 'delivery', '88 SV Road, Andheri', 'NOW() - INTERVAL 6 HOUR'],
        [$cust1, 349.00, 'completed', 'pickup', null, 'NOW() - INTERVAL 3 DAY'],
        [$cust5, 1698.00, 'pending', 'delivery', '77 FC Road, Pune', 'NOW() - INTERVAL 3 HOUR'],
        [$cust2, 238.00, 'completed', 'delivery', '22 MG Road, Mumbai', 'NOW() - INTERVAL 5 DAY'],
        [$cust3, 449.00, 'cancelled', 'pickup', null, 'NOW() - INTERVAL 4 DAY'],
    ];
    foreach ($orders as $o) {
        $db->exec("INSERT INTO orders (user_id, total_amount, status, delivery_type, delivery_address, created_at) VALUES ({$o[0]}, {$o[1]}, '{$o[2]}', '{$o[3]}', " . ($o[4] ? "'{$o[4]}'" : "NULL") . ", {$o[5]})");
    }
    echo "✓ Seeded 8 orders\n";

    // Order items
    $items = [
        [1, 1, 2, 699.00], [2, 4, 3, 89.00], [2, 5, 2, 149.00], [3, 6, 1, 999.00],
        [4, 1, 1, 699.00], [4, 4, 1, 89.00], [5, 3, 1, 349.00], [6, 6, 1, 999.00],
        [6, 1, 1, 699.00], [7, 4, 2, 89.00], [7, 5, 1, 149.00], [8, 2, 1, 599.00],
    ];
    foreach ($items as $i) {
        $db->prepare("INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)")
           ->execute($i);
    }
    echo "✓ Seeded 12 order items\n";

    // Payments
    $pays = [
        [1, 'upi', 'success'], [2, 'cod', 'pending'], [3, 'upi', 'pending'],
        [4, 'upi', 'success'], [5, 'cod', 'success'], [6, 'upi', 'pending'],
        [7, 'cod', 'success'], [8, 'upi', 'failed'],
    ];
    foreach ($pays as $p) {
        $paidAt = $p[2] === 'success' ? 'NOW()' : 'NULL';
        $db->exec("INSERT INTO payments (order_id, method, status, paid_at) VALUES ({$p[0]}, '{$p[1]}', '{$p[2]}', {$paidAt})");
    }
    echo "✓ Seeded 8 payments\n";
} else {
    echo "✓ Orders already exist ({$orderCount}), skipping\n";
}

// 6. Seed reviews if none exist
$reviewCount = $db->query("SELECT COUNT(*) FROM reviews")->fetchColumn();
if ($reviewCount == 0) {
    $reviews = [
        [$cust1, 1, 5, 'Absolutely divine! The chocolate cake was moist, rich, and the ganache was perfectly balanced. Best cake in Mumbai!'],
        [$cust2, 4, 5, 'These croissants are flaky perfection. Reminds me of Paris. Will order every weekend!'],
        [$cust3, 6, 5, 'The custom birthday cake exceeded our expectations. Beautiful design and incredible taste!'],
        [$cust4, 2, 4, 'Lovely vanilla cake, very light and fluffy. The buttercream could be a touch less sweet for my taste.'],
        [$cust5, 3, 5, 'Red velvet cupcakes are to die for! Cream cheese frosting is perfect. Our office favourite!'],
        [$cust1, 5, 4, 'Great multigrain loaf, perfect for sandwiches. Stays fresh for days. Healthy and delicious!'],
        [$cust2, 1, 5, 'Ordered again for my anniversary. The chocolate cake never disappoints. Pure artisan quality.'],
        [$cust3, 4, 5, 'Best butter croissants in the city. Golden, flaky, buttery — exactly how they should be.'],
        [$cust4, 3, 4, 'Beautiful cupcakes that taste as good as they look. Presentation is always top-notch.'],
        [$cust5, 2, 5, 'BakeEase vanilla cake is now our go-to for celebrations. Never disappoints!'],
        [$cust1, 6, 5, 'The custom cake team understood exactly what I wanted. The result was stunning!'],
        [$cust2, 5, 4, 'Wholesome bread that actually tastes great. My kids love it for their school sandwiches.'],
        [$cust3, 1, 5, 'Third time ordering the chocolate cake. Its consistently amazing. BakeEase is the real deal.'],
        [$cust4, 4, 5, 'Fresh from the oven taste every single time. These croissants are addictive!'],
        [$cust5, 6, 4, 'Custom cake was beautiful but delivery was slightly delayed. Taste was fantastic though!'],
        [$cust1, 3, 5, 'The cupcake assortment is always a hit at parties. Everyone asks where we get them from!'],
        [$cust2, 2, 5, 'Light, airy, and absolutely delicious. The vanilla cake is perfection in every bite.'],
    ];
    foreach ($reviews as $r) {
        $db->prepare("INSERT INTO reviews (user_id, product_id, rating, comment, is_approved) VALUES (?, ?, ?, ?, 1)")
           ->execute([$r[0], $r[1], $r[2], $r[3]]);
    }
    echo "✓ Seeded 17 approved reviews\n";
} else {
    echo "✓ Reviews already exist ({$reviewCount}), skipping\n";
}

// 7. Update product stock quantities
$db->exec("UPDATE products SET stock_quantity = 15 WHERE product_id = 1");
$db->exec("UPDATE products SET stock_quantity = 22 WHERE product_id = 2");
$db->exec("UPDATE products SET stock_quantity = 30 WHERE product_id = 3");
$db->exec("UPDATE products SET stock_quantity = 50 WHERE product_id = 4");
$db->exec("UPDATE products SET stock_quantity = 25 WHERE product_id = 5");
$db->exec("UPDATE products SET stock_quantity = 10 WHERE product_id = 6");
echo "✓ Updated product stock quantities\n";

echo "\n✅ Seeding complete! Admin login: admin@bakeease.in / admin123\n";
echo "</pre>";
