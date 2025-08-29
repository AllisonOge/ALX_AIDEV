# Simple REST API

A basic REST API built with Node.js and Express that provides endpoints for managing items.

## Features

- **GET /items** - Retrieve all items
- **POST /items** - Create a new item
- CORS enabled for cross-origin requests
- Basic error handling and validation
- In-memory data storage

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   # Production mode
   npm start
   
   # Development mode (with auto-restart)
   npm run dev
   ```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### GET /items
Retrieves all items.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sample Item 1",
      "description": "This is a sample item"
    }
  ],
  "count": 1
}
```

### POST /items
Creates a new item.

**Request Body:**
```json
{
  "name": "New Item",
  "description": "Description of the new item"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "New Item",
    "description": "Description of the new item",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Item created successfully"
}
```

## Testing the API

You can test the API using tools like:
- **cURL**
- **Postman**
- **Insomnia**
- **Browser developer tools**

### Example cURL commands:

**Get all items:**
```bash
curl http://localhost:3000/items
```

**Create a new item:**
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item", "description": "This is a test item"}'
```

## Project Structure

```
simple_rest_api/
├── package.json      # Project dependencies and scripts
├── server.js         # Main server file with API endpoints
└── README.md         # This file
```

## Dependencies

- **express**: Web framework for Node.js
- **cors**: Cross-Origin Resource Sharing middleware
- **nodemon**: Development dependency for auto-restarting the server

## Next Steps

To enhance this API, consider adding:
- Database integration (MongoDB, PostgreSQL, etc.)
- User authentication
- Input validation middleware
- Rate limiting
- Logging
- Unit tests
- Environment configuration
