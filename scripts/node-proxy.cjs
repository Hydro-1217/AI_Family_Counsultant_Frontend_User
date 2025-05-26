const http = require('http'),
    httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();
http.createServer(function (req, res) {
  // This simulates an operation that takes 500ms to execute
  setTimeout(function () {
    proxy.web(req, res, {
      target: 'https://ai-familycounselor.rxqin.com:8080'
    });
  }, 500);
}).listen(3000);