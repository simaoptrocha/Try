# embedded-exp-fe

## 📌 Overview
`embedded-exp-fe` is a monorepo that contains:
- **TryNow App** (`packages/trynow`): The core widget application.
- **SDK Package** (`packages/sdk`): An npm package to load and integrate the widget.
- **Demo Application** (`packages/demo`): A parent website demonstrating the widget integration.

## ✨ Features
- **Widget Integration**: Easily embed the Unblock widget into web applications.
- **Domains Authentication**: Ensures the widget is used only on whitelisted domains via `postMessage` communication.
- **Authorization with Proxy Server**: API requests are routed through a secure proxy server to protect API keys and ensure domain-level authorization.
- **Customizable UI**: Merchants can configure the widget’s appearance and functionality.

## 🏗 Architecture
The monorepo consists of the following components:
- **TryNow App** (`packages/trynow`): The Next.js-based widget application.
- **SDK Package** (`packages/sdk`): Provides an easy way to integrate the widget.
- **Demo Application** (`packages/demo`): A sample parent website demonstrating widget usage.
- **Proxy Server**: Handles API requests securely, validating domains and managing API keys.

## 🚀 Getting Started
### ✅ Prerequisites
- Node.js (latest LTS version recommended)
- npm or Yarn

### 📜 Steps
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd embedded-exp-fe
   ```
2. Install dependencies:
   ```sh
   yarn install
   ```
3. Run the development server:
   ```sh
   yarn run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to see the TryNow widget in action.

## 📡 Widget App System Overview

The widget app encapsulates a system allowing its usage inside whitelisted domains only. This is executed by involving the sendMessage API, which facilitates communication between the parent website and the widget. Upon loading the app, the parent website sends a handshake message, which is received by the widget. Upon reception, the widget stores the domain (which is a property you can retrieve from the call) and uses it throughout the app. Alongside the domain, other parameters—like the wallet address, chain, token, and custom styling—are communicated and handled in the same way.

## 🔒 Widget Authentication
The widget uses `postMessage` to communicate with the parent website:
- **Handshake Process**: The parent website sends a handshake message upon loading the widget.
- **Domain Storage**: The widget extracts and stores the domain from the handshake message.
- **Parameter Exchange**: Other parameters such as `walletAddress`, `chain`, `token`, and `custom styling` are also shared this way.

## 🔑 Authorization with Proxy Server

API calls are abstracted away by using a proxy server which forwards all the requests to Unblock API. Each API call within the app, when sent to the proxy server has a x-parent-origin header. Proxy server refers to a Key-Value storage to check whether a domain is whitelisted and retrieve its API key if that is the case. This way proxy server allows safe communication with API without exposing the API key and ensures widget can only be used by whitelisted merchants.

1. The widget sends requests to the proxy server with an `x-parent-origin` header.
2. The proxy server checks a Key-Value store (DynamoDB) to validate the domain and retrieve an API key.
3. If the domain is whitelisted, the request is forwarded to the Unblock API.

## 🛠 Development

### Running all the Packages
Inside the root folder run `yarn dev`

This will automatically build the SDK package and launch both the TryNow App and Demo Application on their respective ports. You can visit http://localhost:3000 to see the widget in action and http://localhost:5173 to view the demo website.

TryNow App will run on port 3000 (the widget application).
Demo Application will run on port 5173 (the parent website demonstrating the widget integration).

### Running Individual Packages
You can run each package separately:
- **TryNow App**: `cd packages/trynow && npm run dev`
- **SDK Package**: `cd packages/sdk && npm run build`
- **Demo Application**: `cd packages/demo && npm start`


## GitHub Actions Workflows

### 1. Publish SDK Package to GitHub Packages

This workflow is responsible for publishing the SDK package to GitHub Packages.

#### Workflow File: `.github/workflows/publish-sdk.yml`

#### Trigger:

- Manually triggered via `workflow_dispatch`

#### Secrets Required:

- `TRY_NOW_PACKAGE_TOKEN`: GitHub authentication token for package release

### 2. Publish SDK Package to npm

This workflow is responsible for publishing the SDK package to npm.

#### Workflow File: `.github/workflows/publish-sdk-npm.yml`

#### Trigger:

- Manually triggered via `workflow_dispatch`

#### Secrets Required:

- `NPM_TOKEN`: npm authentication token for package release

### 3. Trigger Amplify Webhook

This workflow triggers an AWS Amplify deployment using a webhook.

#### Workflow File: `.github/workflows/trigger-amplify.yml`

#### Trigger:

- Manually triggered via `workflow_dispatch`

#### Secrets Required:

- `DEPLOYMENT_WEBHOOK_URL`: Webhook URL to trigger AWS Amplify deployment

## Setup Instructions

To ensure these workflows function correctly, add the required secrets to your repository:

1. Navigate to your GitHub repository.
2. Go to **Settings** > **Secrets and variables** > **Actions**.
3. Click **New repository secret**.
4. Add the following secrets:
   - `TRY_NOW_PACKAGE_TOKEN` (for publishing packages to GitHub Packages)
   - `NPM_TOKEN` (for publishing packages to npm)
   - `DEPLOYMENT_WEBHOOK_URL` (for triggering AWS Amplify deployment)

### How to Get Your npm Authentication Token

To obtain your `NPM_TOKEN` and add it to your repository secrets:

1. Log in to your npm account at [npmjs.com](https://www.npmjs.com/).
2. Click on your profile icon and go to **Access Tokens**.
3. Click **Generate New Token**.
4. Select **Automation** as the token type.
5. Copy the generated token.
6. Go to your GitHub repository.
7. Navigate to **Settings** > **Secrets and variables** > **Actions**.
8. Click **New repository secret** and add the following:
   - **Name:** `NPM_TOKEN`
   - **Value:** Paste the copied npm token
9. Click **Add Secret**.

Once these secrets are set, you can manually trigger the workflows via the GitHub Actions tab.

## 🗑 Cleanup
To remove dependencies:
```sh
rm -rf node_modules
```

## 📬 Contact Us
For support or inquiries, please contact the team.
