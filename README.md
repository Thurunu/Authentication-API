# MERN Authentication API

Welcome to the MERN Authentication API! This API is built using the MERN stack (MongoDB, Express.js, React, Node.js) and provides robust authentication features for your applications.

## Features

- User Registration
- User Login
- Password Hashing
- JWT Authentication
- Protected Routes
- User Profile Management

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- MongoDB

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/MERN-AUTH.git
    ```

2. Navigate to the server directory:
    ```bash
    cd MERN-AUTH/server
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the root of the server directory and add your environment variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

5. Start the server:
    ```bash
    npm start
    ```

## API Endpoints

### Auth Routes

- **Register User**
    - `POST /api/auth/register`
    - Request Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`

- **Login User**
    - `POST /api/auth/login`
    - Request Body: `{ "email": "john@example.com", "password": "password123" }`

### User Routes

- **Get User Profile**
    - `GET /api/users/profile`
    - Headers: `{ "Authorization": "Bearer <token>" }`

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any questions or feedback, please contact me at [your-email@example.com].

Thank you for using the MERN Authentication API!