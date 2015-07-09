import compression = require('compression');
import express     = require('express');
import processor   = require('./processor');

let app = express();
app.use(compression());

app.use((req: express.Request, res: express.Response, next: Function) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/lazy-bot-endpoint', processor);

let server = app.listen(3001,  () => {
  let host = server.address().address
  let port = server.address().port
  console.log('server listening at http://%s:%s', host, port)
});
