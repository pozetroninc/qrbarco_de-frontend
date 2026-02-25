# qrbarco.de Deployment Details

## Architecture

```
Browser --> Cloudflare Pages (qrbarco.de)
              |
              | POST (from frontend JS)
              v
        AWS API Gateway (EDGE) --> Lambda (Python/WSGI)
```

The frontend is a Vue.js SPA hosted on Cloudflare Pages. It calls the backend
Lambda directly via the API Gateway execute-api endpoint. There is no custom
domain on API Gateway — the URL is baked into the frontend at build time.

## Domain: qrbarco.de

| Field              | Value                                        |
|--------------------|----------------------------------------------|
| Registrar          | DENIC (.de registry)                         |
| DNS                | Cloudflare                                   |
| Cloudflare Zone ID | `d753891e3540ec85f35257bb72dbf922`            |
| Nameservers        | `lochlan.ns.cloudflare.com`, `raphaela.ns.cloudflare.com` |
| Cloudflare Account | `neil@pozetroninc.com` (`d970d97104da36a53d4a2dac26aa7da7`) |

## Frontend: Cloudflare Pages

| Field              | Value                                        |
|--------------------|----------------------------------------------|
| Project Name       | `qrbarco-de-frontend`                        |
| Project ID         | `5b068441-4898-46d1-b546-ffb359137171`       |
| Pages URL          | https://qrbarco-de-frontend.pages.dev        |
| Custom Domain      | https://qrbarco.de                           |
| GitHub Repo        | `pozetroninc/qrbarco_de-frontend` (branch: `master`) |
| Framework          | Vue.js 2 (vue-cli)                           |
| Build Command      | `node ./scripts/create-app-config.js && npm run build` |
| Output Directory   | `dist`                                       |
| Build Image        | v1                                           |

### Build-time Environment Variables

| Variable              | Description                              |
|-----------------------|------------------------------------------|
| `PROD_QRCODE_SERVICE` | API Gateway endpoint URL for the backend |
| `RECAPTCHA_SITE_KEY`  | Google reCAPTCHA v2 site key             |
| `SENTRY_API_URL`      | Sentry error reporting DSN               |

The `scripts/create-app-config.js` script writes these env vars into
`app.config.json` at build time. The same variables are set for both
preview and production environments.

### Deployments

Production deploys automatically on push to `master`. Preview deploys
on all other branches (including Dependabot PRs).

## Backend: AWS Lambda + API Gateway

### AWS Account

| Field      | Value            |
|------------|------------------|
| Account ID | `186173029663`   |
| Region     | `us-east-1`      |

### Lambda Function (Production)

| Field        | Value                            |
|--------------|----------------------------------|
| Function     | `qrbarcode-production-api`       |
| Runtime      | Python 3.8                       |
| Handler      | `wsgi.handler`                   |
| Memory       | 1024 MB                          |
| Timeout      | 6 seconds                        |
| Architecture | x86_64                           |
| Code Size    | ~61 MB                           |
| Last Modified| 2025-04-26                       |

The Lambda runs a Falcon (Python) WSGI app that generates QR code images.
It accepts POST requests with a text or base64 payload and returns a PNG.

### API Gateway (Production)

| Field          | Value                                                       |
|----------------|-------------------------------------------------------------|
| API Name       | `production-qrbarcode`                                      |
| API ID         | `mwsnn65m0j`                                                |
| Endpoint Type  | EDGE (CloudFront-backed)                                    |
| Stage          | `production`                                                |
| Endpoint URL   | `https://mwsnn65m0j.execute-api.us-east-1.amazonaws.com/production/` |
| Binary Types   | `*/*`, `image/png`                                          |
| Security       | TLS 1.0                                                     |
| Auth           | NONE                                                        |
| Methods        | POST (root), ANY (root + `{proxy+}`)                        |
| Throttle       | 10 req/s, burst 50                                          |

### API Gateway (Dev)

| Field          | Value                                                       |
|----------------|-------------------------------------------------------------|
| API Name       | `dev-qrbarcode`                                             |
| API ID         | `urapiq4crj`                                                |
| Endpoint URL   | `https://urapiq4crj.execute-api.us-east-1.amazonaws.com/`   |
| Note           | Lambda function `qrbarcode-dev-api` has been deleted        |

### CloudFormation Stacks

| Stack                  | Status          | Created    |
|------------------------|-----------------|------------|
| `qrbarcode-production` | UPDATE_COMPLETE | 2018-07-10 |
| `qrbarcode-dev`        | UPDATE_COMPLETE | 2018-07-10 |

Originally deployed via the Serverless Framework (`serverless.yml` not in repo).

### S3

| Bucket | Purpose |
|--------|---------|
| `qrbarcode-production-serverlessdeploymentbucket-1d3knqw1e2r7f` | Serverless Framework deployment artifacts |

## Backend Source Code

| Field       | Value                                   |
|-------------|-----------------------------------------|
| GitHub Repo | `pozetroninc/pozetron-barcode-service`  |
| Framework   | Falcon (Python WSGI)                    |
| Entry Point | `pozetron_barcode/app.py`               |
| Last Commit | 2018-07-17                              |

## Notes

- The `app.config.example.json` references `https://service.qrbarco.de` but
  the Cloudflare Pages build overrides this with the direct API Gateway URL.
- The `serverless.yml` used to deploy the backend is not in the repo.
- The dev Lambda (`qrbarcode-dev-api`) has been deleted; the dev API Gateway
  and CloudFormation stack still exist.
