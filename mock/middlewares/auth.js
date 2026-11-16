// Проверка срока и вида учебного JWT выполняется общим mock/engine.ts.
export default function auth(req, _res, next) {
  req.mockToken = String(req.headers.authorization || '').replace(/^Bearer /, '');
  next();
}
