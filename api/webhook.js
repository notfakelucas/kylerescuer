module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Event, X-Delivery, X-Timestamp, X-Signature');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'active', gateway: 'xxpay' });
  }

  try {
    const event = req.body;
    console.log('[webhook] Received event from XXPay:', event?.event || event?.id);

    // Always reply 200 within 10s as specified in XXPay integration guide
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('[webhook] Error processing webhook:', err);
    return res.status(200).json({ received: true });
  }
};
