const XXPAY_BASE = 'https://api.xxpayconnect.com/api/v1/public';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Client-Id, X-Client-Secret');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const clientId = process.env.XXPAY_CLIENT_ID || 'xxc_n6ahpk3i8zocyguimy5wsbvezkkb';
  const clientSecret = process.env.XXPAY_CLIENT_SECRET || 'xxs_ewDGC8BnsmL0ICYDjSIwkn09r1imZmHYcbzTdMT2';

  if (!clientId || !clientSecret) {
    console.error('[checkout] Missing XXPay credentials');
    return res.status(500).json({ success: false, message: 'Server configuration error.' });
  }

  const {
    amount,
    phone,
    email,
    name,
    method = 'paypal',
    anonymous = true,
    return_url,
    monthly = false,
    description
  } = req.body || {};

  if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid donation amount.' });
  }

  const cleanPhone = phone ? String(phone).replace(/\s+/g, '') : '';
  const externalRef = `kr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const cleanAmount = parseFloat(parseFloat(amount).toFixed(2));

  const origin = req.headers['origin'] || (req.headers['referer'] ? new URL(req.headers['referer']).origin : 'https://donate.kylerescuer.org');
  const callbackUrl = process.env.XXPAY_CALLBACK_URL || `${origin}/api/webhook`;
  const defaultReturnUrl = `${origin}/thank-you/?amount=${cleanAmount}&method=paypal`;

  const body = {
    amount: cleanAmount,
    currency: 'EUR',
    method: 'paypal',
    description: description || 'Donation',
    external_reference: externalRef,
    payer: {
      name: anonymous ? 'Anonymous Donor' : (name || 'Donor'),
      country: 'PT'
    },
    callback_url: callbackUrl,
    return_url: return_url || defaultReturnUrl
  };

  if (cleanPhone) {
    body.payer.phone = cleanPhone.startsWith('+') ? cleanPhone : `+351${cleanPhone}`;
  }

  if (email && String(email).includes('@')) {
    body.payer.email = String(email).trim();
  }

  // Attempt call with 1 retry on 502 (acquirer unavailable)
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const xxpayRes = await fetch(`${XXPAY_BASE}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Client-Id': clientId,
          'X-Client-Secret': clientSecret
        },
        body: JSON.stringify(body)
      });

      const data = await xxpayRes.json();

      if (!xxpayRes.ok) {
        if (xxpayRes.status === 502 && attempt === 1) {
          console.warn('[checkout] 502 acquirer_unavailable, retrying...');
          await new Promise(r => setTimeout(r, 600));
          continue;
        }
        const msg = data.message || data.error || 'Failed to process payment.';
        console.error('[checkout] XXPay error:', xxpayRes.status, msg);
        return res.status(200).json({ success: false, message: msg });
      }

      const redirectUrl = (data.next_action && data.next_action.url) || null;

      return res.status(200).json({
        success: true,
        message: 'Redirecting to PayPal...',
        saleId: data.id,
        redirectUrl: redirectUrl,
        next_action: data.next_action
      });
    } catch (err) {
      if (attempt === 1) {
        await new Promise(r => setTimeout(r, 600));
        continue;
      }
      console.error('[checkout] fetch error:', err);
      return res.status(500).json({ success: false, message: 'Communication error with payment processor.' });
    }
  }
};

