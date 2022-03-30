const allowedCors = [
  'https://api.darkwingduck.nomoredomains.xyz',
  'http://api.darkwingduck.nomoredomains.xyz',
  'http://localhost:3000',
  'https://darkwingduck.nomoredomains.work',
  'http://darkwingduck.nomoredomains.work',
];

const cors = (req, res, next) => {
  const { origin } = req.headers;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
};

module.exports = cors;
