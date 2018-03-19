import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { resolve } from 'path';
import historyFallback from 'connect-history-api-fallback';
import webpackConfig from '../../webpack.config';
import morgan from 'morgan';

import authConfig from './config/auth.config';

const { NODE_ENV = 'development', PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set auth values
app.set('authSecret', authConfig.secret);
app.set('authExpireMinutes', authConfig.authExpireMinutes);

// use morgan to log requests to the console
app.use(morgan('dev'));

// set up routing
var apiRouter = require('./router')(app);
app.use(historyFallback());

if (NODE_ENV === 'production') {
  const FE_DIR = resolve(__dirname, '..', 'client');

  app.use(express.static(FE_DIR));

  app.get('/*', (req, res) => {
    res.sendFile(resolve(FE_DIR, 'index.html'));
  });
} else {
  const compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler, {
    stats: { colors: true },
  }));
  app.use(webpackHotMiddleware(compiler));
}

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`The server is running at http://localhost:${PORT}`);
});
