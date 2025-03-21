const crypto = require('crypto');

function verifyTelegramWebAppData(botToken, initData) {
  // Parse the initData string into an object
  const initDataObj = Object.fromEntries(new URLSearchParams(initData));
  const { hash, ...data } = initDataObj;

  if (!hash) {
    return false;
  }

  // Sort the data alphabetically and stringify it
  const dataCheckString = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('\n');

  // Create a secret key from the bot token
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();

  // Generate a hash of the data check string
  const calculatedHash = crypto.createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  // Compare the calculated hash with the provided hash
  return calculatedHash === hash;
}

function telegramAuthMiddleware(req, res, next) {
  const initData = req.headers['telegram-data'];
  
  if (!initData) {
    return res.status(401).json({ message: 'Missing authentication data' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const isValid = verifyTelegramWebAppData(botToken, initData);

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid authentication data' });
  }

  // Extract user data from initData
  const parsedData = Object.fromEntries(new URLSearchParams(initData));
  req.telegramUser = JSON.parse(parsedData.user || '{}');
  
  next();
}

module.exports = telegramAuthMiddleware; 