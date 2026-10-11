# Manish EDU

Manish EDU is a web application for a training institute. The public site lets visitors explore courses and instruments, submit inquiries, enroll, and pay online. A separate admin app supports managing classes and products, reviewing orders and customers, and viewing sales analytics.

## Project structure

```text
manish_edu/
├── frontend/   # Public Angular website
├── admin/      # Angular admin dashboard
└── backend/    # Express and TypeScript API
```

## Tech stack

- **Public site and admin:** Angular 21, TypeScript, HTML, and CSS/SCSS
- **API:** Node.js, Express 5, and TypeScript
- **Database:** MongoDB
- **Payments:** Stripe Checkout
- **Other integrations:** Nodemailer for contact email; ECharts for admin analytics

## Requirements

- Node.js and npm
- A MongoDB database
- Stripe API credentials to use checkout
- Gmail account credentials configured for the contact form, if email submission is needed

## Configure the backend

Create `backend/.env` with the following values. Keep this file private and never commit real credentials.

```dotenv
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
DB_NAME=<database_name>
JWT_SECRET=<long_random_secret>
STRIPE_SECRET_KEY=<stripe_secret_key>
GMAIL_USER=<gmail_address>
GMAIL_APP_PASSWORD=<gmail_app_password>
```

`PORT` is optional; the server defaults to `3000`. Use a Stripe secret key for the same Stripe account as the configured frontend publishable key. The app's deployed frontend and admin currently call the hosted API directly, so local UI development may still read or write data through that hosted API unless you update the API URLs in the source.

## Run locally

Open three terminal windows from the repository root.

### 1. Start the API

```bash
cd backend
npm install
npm run dev
```

The API starts on `http://localhost:3000` by default. Its root endpoint (`/`) returns a simple running status. MongoDB connection is required at startup.

### 2. Start the public website

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200`.

### 3. Start the admin dashboard

```bash
cd admin
npm install
npm start -- --port 4300
```

Open `http://localhost:4300`.

The backend CORS configuration allows the local frontend (`4200`) and admin (`4300`) origins.

## Build

Run from the corresponding application directory:

```bash
npm run build
```

For the backend, this compiles TypeScript into `backend/dist`; start the compiled server with:

```bash
cd backend
npm start
```

## Main capabilities

- Browse courses and instruments, and maintain a shopping cart
- Submit student enrollment and contact inquiries
- Pay for courses or products through Stripe Checkout
- Authenticate administrators with JWT-protected API routes
- Manage classes and products, and review orders and customer records
- View sales/revenue analytics in the admin dashboard

## Deployment

The repository contains separate Angular projects for the public site and admin dashboard, each with a `vercel.json` configuration. The backend is an Express service and can be deployed to a Node-compatible host. Configure the backend environment variables in the hosting provider, and make sure the CORS allowlist and frontend API URLs match the deployed domains.

## Security notes

- Do not share or commit `.env` files, database credentials, JWT secrets, or Stripe secret keys.
- Use test-mode Stripe credentials for local development.
- Rotate any credential that has been exposed publicly.
