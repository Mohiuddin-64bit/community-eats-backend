# Community-Eats-Backend

This is the backend for the Community Eats project. It is built with Node.js, Express.js, and MongoDB. It supports CRUD operations for managing community-based food sharing.

## Installation:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Rename `.env.example` to `.env` and fill in your environment variables.

## Running the Server:

Run the server using `npm start`.

## Configuration:

- Environment Variables:
    - `PORT`: Port number the server listens on. Default: 3000
    - `MONGODB_URI`: URI for MongoDB database.
    - `JWT_SECRET`: Secret key for JWT token generation.

## Usage:

- API Endpoints:
    - GET `/api/supplies`: Fetches all food items.
    - POST `/api/supplies`: Creates a new food item.
    - PUT `/api/supplies/:id`: Updates a food item with the given ID.
    - DELETE `/api/supplies/:id`: Deletes a food item with the given ID.

## Dependencies:

- `express`: Web framework for Node.js.
- `mongodb`: MongoDB driver for Node.js.
- `jsonwebtoken`: Library for generating and verifying JWT tokens.
- `dotenv`: Loads environment variables from .env file.