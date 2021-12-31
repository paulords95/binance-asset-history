const Binance = require('node-binance-api');

const binance = new Binance().options({
  APIKEY: process.env.BINACE_API_KEY,
  APISECRET: process.env.BINANCE_SECRET_KEY,
});
