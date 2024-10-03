const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;
const httpsOptions = {
  key: fs.readFileSync(process.env.DEV_SERVER_KEY_PATH),
  cert: fs.readFileSync(process.env.DEV_SERVER_CERT_PATH)
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, '0.0.0.0', err => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log(`> Server started on https://127.0.0.1:${port}`);
  });
});
