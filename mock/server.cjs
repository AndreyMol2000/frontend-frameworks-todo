const jsonServer = require('json-server');
const fs = require('node:fs');
const path = require('node:path');

async function start() {
  const { handleRequest } = await import('./engine.ts');
  const { default: auth } = await import('./middlewares/auth.js');
  const dbPath = path.join(__dirname, 'db.local.json');
  if (!fs.existsSync(dbPath)) fs.copyFileSync(path.join(__dirname, 'db.json'), dbPath);
  const router = jsonServer.router(dbPath);
  const server = jsonServer.create();
  server.use(jsonServer.defaults({ logger: false }));
  server.use(jsonServer.bodyParser);
  server.use(jsonServer.rewriter(require('./routes.json')));
  server.use(auth);
  server.use((req, res) => {
    setTimeout(() => {
      const db = router.db.getState();
      const result = handleRequest(db, { method: req.method, path: req.url, body: req.body, token: req.mockToken });
      if (result.status < 400 && !['GET', 'HEAD', 'OPTIONS'].includes(req.method)) router.db.setState(db).write();
      res.status(result.status).json(result.data);
    }, 300);
  });
  server.listen(3001, '127.0.0.1', () => process.stdout.write('Mock API: http://127.0.0.1:3001/api\n'));
}
start().catch((error) => { process.stderr.write(String(error)); process.exitCode = 1; });
