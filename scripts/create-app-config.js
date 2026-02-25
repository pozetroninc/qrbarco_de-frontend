// This script is for repo cleanliness, not security.
//
// https://stackoverflow.com/questions/48453493/set-environment-variable-for-build-in-netlify/48466680#48466680

import {writeFileSync} from 'node:fs'
writeFileSync('./app.config.json', `{
  "DEV_QRCODE_SERVICE": "http://localhost:9001",
  "PROD_QRCODE_SERVICE": "${process.env.PROD_QRCODE_SERVICE}",
  "RECAPTCHA_SITE_KEY": "${process.env.RECAPTCHA_SITE_KEY}",
  "SENTRY_API_URL": "${process.env.SENTRY_API_URL}",
  "GITHUB_LINK": "https://github.com/pozetroninc/qrbarco_de-frontend"\n}`)
