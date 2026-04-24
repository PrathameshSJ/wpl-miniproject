<?php
/** Coupons API — POST /api/coupons.php */
require_once __DIR__ . '/../config/database.php';
initAPI();

$db   = getDB();
$data = getInput();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
if (empty($data['code'])) jsonResponse(['error' => 'Coupon code required'], 400);

$stmt = $db->prepare("SELECT * FROM coupons WHERE code = ? AND is_active = 1");
$stmt->execute([strtoupper(trim($data['code']))]);
$coupon = $stmt->fetch();

if (!$coupon) jsonResponse(['error' => 'Invalid or inactive coupon'], 404);
if ($coupon['valid_until'] && strtotime($coupon['valid_until']) < time()) {
    jsonResponse(['error' => 'Coupon has expired'], 410);
}

$cartTotal = (float) ($data['cart_total'] ?? 0);
if ($coupon['min_order_value'] && $cartTotal < (float) $coupon['min_order_value']) {
    jsonResponse(['error' => 'Min order ₹' . number_format($coupon['min_order_value'], 0)], 400);
}

$discount = round($cartTotal * (float) $coupon['discount_pct'] / 100, 2);
jsonResponse([
    'valid' => true, 'code' => $coupon['code'],
    'discount_pct' => (float) $coupon['discount_pct'],
    'discount_amt' => $discount, 'new_total' => $cartTotal - $discount,
]);
