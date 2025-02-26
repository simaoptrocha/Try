This is a [Next.js](https://nextjs.org/) project bootstrapped with [create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 🚀 Getting Started

First, run the development server:

```sh
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [next/font](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## 🌍 Environment Variables

This project requires the following environment variable:

- `NEXT_PUBLIC_PROXY_SERVER_URL`
  - **Description:** This variable defines the URL of the proxy server used by the application.
  - **Usage:** The application will use this variable to make API requests via the proxy.
  - **Local Development:** When running locally, set this variable in a `.env` file:
  ```sh
  NEXT_PUBLIC_PROXY_SERVER_URL=https://k7rtugk1re.execute-api.eu-west-1.amazonaws.com/proxy
  ```
  - **AWS Amplify Configuration:** On the Amplify app settings, ensure that this variable is configured under the environment settings.
  - **Template File:** A `.env.template` file is included in the repository, listing all required environment variables for reference.

## 🚢 Deployment

The application is deployed using **AWS Amplify**.

### Steps to Deploy

1. Go to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/home).
2. Create a new Amplify app and connect it to the GitHub repository.
3. Set up the necessary build settings and environment variables in Amplify.
4. Once the app is connected and configured, Amplify will handle deployments automatically.

### Triggering a Deployment

A **GitHub Action** is already set up to trigger a new deployment from the `main` branch.

To trigger a new deployment manually:

1. Navigate to the **GitHub Actions** tab in your repository.
2. Find the `Trigger Amplify Webhook` workflow.
3. Click **Run workflow** to initiate a deployment.

This will trigger AWS Amplify to deploy the latest version of the application from `main`. 🎉

## 📬 Contact Us

If you need support, please contact the team.

