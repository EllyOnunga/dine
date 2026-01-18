# AWS Deployment Guide

This guide details how to deploy the Savannah Restaurant application to AWS using modern, managed services for maximum reliability and ease of use.

## 🏗️ Architecture Overview

For production on AWS, we recommend moving away from manual Docker Compose management to fully managed services:

1. **AWS App Runner**: For the containerized Express/React application.
2. **AWS RDS (PostgreSQL)**: For the managed database.
3. **AWS SES**: For email notifications.
4. **AWS Secrets Manager**: For secure environment variable storage.

---

## 🏗️ Deployment Methods

### Option A: Terraform (Recommended)

This uses Infrastructure as Code to provision your VPC, RDS Database, and App Runner service automatically.

1. **Install Terraform** on your local machine.
2. Navigate to the `terraform/` directory.
3. Initialize: `terraform init`
4. Apply: `terraform apply`
    * You will be prompted for your GitHub Repo URL and App Runner Connection ARN.
    * *Note: You must create a GitHub Connection in the AWS App Runner console first to get the ARN.*

### Option B: Manual Console Setup (Step-by-Step)

For those who prefer using the AWS UI directly.

## 🚀 Step-by-Step Deployment (Manual)

### 1. Database: AWS RDS (PostgreSQL)

1. Navigate to the **RDS Console**.
2. Create a new **PostgreSQL** instance (Free Tier available: `db.t3.micro`).
3. Set a Master Username & Password.
4. In **Connectivity**, ensure it's in a VPC and note the **Endpoint**.
5. Create a security group that allows inbound traffic on port `5432` from your App Runner service.
6. Your Connection String will look like: `postgresql://username:password@endpoint:5432/postgres`

### 2. Application: AWS App Runner

This is the easiest way to deploy your Docker container.

1. Navigate to the **App Runner Console**.
2. **Source**:
    * **Option A**: Connect your GitHub repository (simplest for CI/CD).
    * **Option B**: Push your Docker image to **AWS ECR** and select it.
3. **Build Settings**:
    * Runtime: `Python or Node.js` (if using code) or `Docker` (if using ECR).
    * Start Command: `/app/entrypoint.sh` (as defined in your Dockerfile).
    * Port: `3000`.
4. **Configuration**:
    * Add **Environment Variables** (see below).
    * Instance: `1 vCPU, 2GB RAM` (standard).
5. **Security**:
    * Ensure the IAM Role has access to Secrets Manager if you use it.

### 3. Networking & SSL

AWS App Runner provides a default `awsapprunner.com` URL with **automatic SSL**.

1. To use your own domain, go to the **Custom Domains** tab in the App Runner console.
2. Follow the DNS validation steps (CNAME and TXT records).
3. AWS will issue and renew the SSL certificates automatically via ACM.

---

## 🔐 Environment Variables

Add these in the App Runner configuration:

| Variable | Description |
| :--- | :--- |
| `NODE_ENV` | Set to `production` |
| `DATABASE_URL` | Your RDS connection string (see Step 1) |
| `SESSION_SECRET` | A secure random string |
| `SMTP_HOST` | `email-smtp.<region>.amazonaws.com` (if using SES) |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Your SES SMTP Username |
| `SMTP_PASS` | Your SES SMTP Password |
| `ADMIN_EMAIL` | The restaurant owner's email |

---

## 📧 Email: AWS SES Setup

1. Go to the **SES Console**.
2. **Verify Identities**: Verify your domain or the specific sender email address.
3. **SMTP Settings**: Create SMTP Credentials to get your username and password.
4. **Production Access**: If you are in the SES Sandbox, you must either verify the recipient addresses or request production access to send to anyone.

---

## 🔍 Monitoring

* **CloudWatch Logs**: App Runner automatically streams all logs (including your Pino structured logs) to CloudWatch.
* **X-Ray**: Enable X-Ray in App Runner for detailed request tracing.

## 🔄 Updates

Every time you push to your `main` branch on GitHub, App Runner will:

1. Pull the latest code.
2. Build the new Docker image.
3. Run migrations (`npm run db:migrate`).
4. Perform a zero-downtime rolling deployment.
