const jwt = require('jsonwebtoken');

// const auth = (req, res) => {
//   const token = req.cookies.webToken;
//   let payload;

//   try {
//     payload = jwt.verify(token, 'DarkwingDuck255%');
//     req.user = payload;
//   } catch (err) {
//     res.status(403).send({ message: 'Нужна авторизация' });
//   }
// };

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(403).send({ message: 'Нужна авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'DarkwingDuck255%');
    req.user = payload;
  } catch (err) {
    res.status(403).send({ message: 'Нужна авторизация' });
  }

  next();
};

// module.exports = auth;
