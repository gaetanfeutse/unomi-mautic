// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://marketing.qilinsa.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Remove "/api" from the request path
      },
    })
  );
};
