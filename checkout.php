<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Client-Id, X-Client-Secret');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true) ?: [];

$amount    = isset($body['amount'])    ? floatval($body['amount'])                 : null;
$phone     = isset($body['phone'])     ? preg_replace('/\s+/', '', $body['phone']) : '';
$email     = isset($body['email'])     ? trim($body['email'])                      : '';
$name      = isset($body['name'])      ? trim($body['name'])                       : '';
$anon      = isset($body['anonymous']) ? (bool)$body['anonymous']                 : true;
$returnUrl = isset($body['return_url']) ? trim($body['return_url'])               : '';
$monthly   = isset($body['monthly'])   ? (bool)$body['monthly']                   : false;

if (!$amount || $amount <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid amount.']);
    exit;
}

$cleanAmount = round($amount, 2);
$externalRef = 'kr-' . time() . '-' . substr(md5(uniqid()), 0, 5);

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host   = $_SERVER['HTTP_HOST'] ?? 'donate.kylerescuer.org';
$origin = $scheme . '://' . $host;

$defaultReturnUrl = $origin . '/thank-you/?amount=' . $cleanAmount . '&method=paypal';

$payload = [
    'amount'             => $cleanAmount,
    'currency'           => 'EUR',
    'method'             => 'paypal',
    'description'        => 'Donation',
    'external_reference' => $externalRef,
    'payer'              => [
        'name'    => $anon ? 'Anonymous Donor' : ($name ?: 'Donor'),
        'country' => 'PT',
    ],
    'callback_url'       => XXPAY_CALLBACK_URL,
    'return_url'         => $returnUrl ?: $defaultReturnUrl,
];

if ($phone) {
    $payload['payer']['phone'] = (strpos($phone, '+') === 0) ? $phone : ('+351' . $phone);
}
if ($email && strpos($email, '@') !== false) {
    $payload['payer']['email'] = $email;
}

$ch = curl_init(XXPAY_BASE . '/payments');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Accept: application/json',
        'X-Client-Id: ' . XXPAY_CLIENT_ID,
        'X-Client-Secret: ' . XXPAY_CLIENT_SECRET,
    ],
    CURLOPT_TIMEOUT        => 20,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$data = json_decode($response, true);

if ($httpCode >= 200 && $httpCode < 300 && isset($data['next_action']['url'])) {
    echo json_encode([
        'success'     => true,
        'message'     => 'Redirecting to PayPal...',
        'saleId'      => $data['id'] ?? null,
        'redirectUrl' => $data['next_action']['url'],
        'next_action' => $data['next_action'],
    ]);
} else {
    $msg = $data['message'] ?? $data['error'] ?? 'Error processing payment.';
    echo json_encode([
        'success' => false,
        'message' => $msg,
    ]);
}

