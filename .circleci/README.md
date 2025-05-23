# CircleCI Configuration for CreaVibe

This document explains the production-grade CircleCI configuration implemented for the CreaVibe project, including deploy markers and the CI/CD pipeline.

## Overview

The CircleCI configuration provides a comprehensive CI/CD pipeline with the following features:

- Linting and type checking
- Unit and E2E testing
- Automated deployments to development and production environments
- Deploy markers for tracking deployment status
- Approval gates for production deployments
- Deployment verification

## Pipeline Stages

### 1. Code Quality Checks

- **Linting**: Runs ESLint to ensure code quality standards
- **Type Checking**: Verifies TypeScript types to catch type-related issues

### 2. Testing

- **Unit Tests**: Runs Jest tests and stores test results and coverage reports
- **E2E Tests**: Runs Playwright tests across multiple browsers and stores test results and reports

### 3. Build

- Builds the Next.js application for production
- Persists the build artifacts for deployment jobs

### 4. Deployment

#### Development Deployment

- Automatically deploys to the development environment when changes are pushed to the `dev` branch
- Uses deploy markers to track deployment status
- Verifies the deployment after it's complete

#### Production Deployment

- Requires manual approval before deploying to production
- Only runs on the `main` branch
- Uses deploy markers to track deployment status
- Verifies the deployment after it's complete

## Deploy Markers

Deploy markers are implemented using CircleCI's built-in functionality to track deployments across environments. The configuration includes:

1. **Planning a Deployment**: Before deployment, a marker is created with a pending status
2. **Updating to Running**: When deployment starts, the status is updated to running
3. **Final Status Updates**: After deployment, the status is updated to success, failed, or canceled based on the outcome
4. **Deployment Verification**: Custom verification logic can be added to ensure deployments are successful

## Environment Variables

The following environment variables need to be configured in CircleCI:

- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

## Customization

You can customize the configuration by modifying:

- **Branch Parameters**: Change `deploy_branch` and `dev_branch` parameters to match your branching strategy
- **Deployment Verification**: Add custom verification logic in the verification steps
- **Resource Allocation**: Adjust the `resource_class` based on your project's needs

## Troubleshooting

If deployments fail, check:

1. CircleCI environment variables
2. Vercel project configuration
3. Deployment logs in CircleCI and Vercel
4. Deploy markers in the CircleCI Deploys UI
