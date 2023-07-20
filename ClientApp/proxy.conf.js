const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:27569';

const PROXY_CONFIG = [
  {
    context: [
      "/RESTAdapter/WLMS_Q/BPValidation",
      // Add other API endpoints here as needed
    ],
    target: "https://orchestrationhubqa.capetown.gov.za",
    secure: false,
    changeOrigin: true,
    headers: {
      Connection: 'Keep-Alive'
    }
  }
]

module.exports = PROXY_CONFIG;
