const production = "production";
const NODE_ENV = process.env.NODE_ENV || production;
const WEBPACK_ADDONS = JSON.parse(process.env.WEBPACK_ADDONS || "[]");

module.exports = {
  NODE_ENV: NODE_ENV,
  WEBPACK_ADDONS: WEBPACK_ADDONS,
  isProduction: () => String(NODE_ENV === production)
};