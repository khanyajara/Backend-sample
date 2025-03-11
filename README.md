# RestaurantAppBackend

Welcome to the normal backend server repo! This backend application serves as the server-side . 

This backend is built using **Node.js**, **Express.js**, **MongoDB**, **Paypal**, **Nodemailer**, and **Moment.js** for handling date and time operations across different time zones.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)

## Features

- **Time Zone Support**: Supports time zone conversion for time-related data like `createdAt`, `startTime`, and `endTime`.
- **User Authentication**: A basic user authentication flow, ensuring access to restaurant data.
- **MongoDB Integration**: Data is stored and managed in MongoDB.
- **Paypal Integration**: Supports payment processing through PayPal.
- **Nodemailer Integration**: Sends email notifications to users.

## Technologies Used

- **Node.js**: JavaScript runtime environment for building server-side applications.
- **Nodemon**: Automatically restarts the node application when file changes are detected.
- **Express.js**: Web framework for Node.js, used for handling routing, rate-limiting, and middleware.
- **MongoDB**: NoSQL database for storing restaurant data.
- **Bcrypt.js**: Helps in hashing passwords.
- **Moment.js**: Library for handling dates and times, especially for converting and formatting date/time data.
- **Mongoose**: ODM library for MongoDB, used to define data models and manage collections.
- **Paypal**: Payment gateway for handling transactions.
- **Nodemailer**: Library for sending email notifications.
- **Timezone Middleware**: Custom middleware for managing time zone conversions for date/time data.

## Installation

Ensure that you have Node.js and npm installed. If not, you can install them from the official Node.js website. Ensure you have a MongoDB instance running locally or use MongoDB Atlas. Update the database connection settings in the `.env` file.

### 1. Clone the repository
     git clone https://github.com/khanyajara/Backend-sample.git
````bash
cd server/Backend

2. **Install dependencies**
```bash
npm install

3.**Run The Server**
 
 run:
```bash
node Server.js or
npx nodemon Server.js

This will start the server on port 4000 (or the one you configured).

### 4. Set up Paypal and NodeMailer

PayPal: You will need to create a PayPal Developer account to obtain your Client ID and Secret for testing payments. Follow PayPal's documentation for setup or here https://developer.paypal.com/docs/checkout/.
NodeMailer: Set up an email provider (e.g., Gmail, SendGrid) for sending emails and configure the SMTP settings in the .env file.


## Configuration

Before running the server, make sure to create a .env file in the root of the project.

PORT=3000
MONGODB_URI=mongodb://localhost:27017/(this is just locally use MongoDBAtlas to get a proper connection url/string if you move out of dev to live)
TIMEZONE=Africa/Johannesburg(Or the one you used)
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_SECRET=your-paypal-secret
MAIL_HOST=smtp.gmail.com(or your prefered host)
MAIL_PORT=587
MAIL_USER=your-email@example.com
MAIL_PASS=your-email-password

## Api Endpoints

Just use Postman to test these also remember the port your server is running on like
this http://localhost:<your-port>/api/ just remember to login in first otherwise the
authMiddleware will prevent you from using the CUD methoods from CRUD.
