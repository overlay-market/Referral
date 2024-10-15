# Referral Program

This project implements a referral program system using NestJS and MongoDB. It allows for the registration of affiliates, validation of affiliates, and storage of user signatures for future batch processing on a smart contract.

## Features

- Affiliate registration (dev mode only)
- Affiliate validation
- User signature storage
- MongoDB integration for data persistence

## Installation

1. Clone the repository

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:
   ```
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/referral
   ```

## Running the Application

To start the server in development mode:

```
npm run start:dev
```

The server will be available at `http://localhost:3000`.

## API Endpoints

### Affiliates

- `POST /affiliates` (Dev mode only): Register a new affiliate
  - Body: `{ "address": "0x..." }`

- `GET /affiliates/:address`: Check if an affiliate is valid
  - Response: `{ "isValid": true/false }`

### Signatures

- `POST /signatures`: Store a user's signature and affiliate address
  - Body: `{ "trader": "0x...", "affiliate": "0x...", "signature": "0x..." }`

Note: Each trader can only submit their signature once, and their affiliate cannot be changed after submission.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Development Notes

- The application uses MongoDB for data storage. Ensure you have MongoDB running locally or update the `MONGO_URI` in the `.env` file to point to your MongoDB instance.
- Affiliate registration is only available in development mode for security reasons.
- User signatures are stored for future batch processing on a smart contract.


## License

This project is [MIT licensed](LICENSE).
