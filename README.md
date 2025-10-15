# Express.js RESTful API — Products

Small Express.js REST API for managing products. Includes request logging, API-key authentication, input validation, error handling, filtering, pagination, search, and statistics.

Status: working example (in-memory data store)

## Quick start

Prerequisites
- Node.js v18+
- npm

Install and run
```bash
npm install
npm start
```
Server defaults to http://localhost:3000

API key for protected endpoints: `prodx231` (send as header `x-api-key`)

## Endpoints

Base path: /api/products

- GET /api/products
  - Query params:
    - category — filter by category (exact match, case-insensitive)
    - q or name — search by product name (case-insensitive, substring)
    - page — page number (default 1)
    - limit — items per page (default 10)
  - Response: { page, limit, total, results: [...] }

- GET /api/products/:id
  - Get product by id (UUID or numeric id when seeded)

- POST /api/products
  - Protected (requires `x-api-key: prodx231`)
  - Body (JSON, all required):
    - name (string)
    - description (string)
    - price (number, >= 0)
    - category (string)
    - inStock (boolean)
  - Response: 201 created with created product

- PUT /api/products/:id
  - Protected
  - Body (JSON, at least one of the fields above; partial updates allowed)
  - Response: updated product

- DELETE /api/products/:id
  - Protected
  - Response: 200 with deletion message

- GET /api/products/search?q=term
  - Alias search endpoint (same behavior as ?q on list)

- GET /api/products/stats
  - Returns total and counts by category:
    - { total: number, byCategory: { categoryName: count, ... } }

## Validation & Errors

- 400 ValidationError — invalid or missing input
- 401 AuthError — missing/invalid API key for protected endpoints
- 404 NotFoundError — resource not found
- 500 AppError — unexpected server error

Error response format:
```json
{ "message": "Description of the error" }
```

## Examples

List products (first page)
```bash
curl "http://localhost:3000/api/products"
```

List filtered by category and paginated
```bash
curl "http://localhost:3000/api/products?category=electronics&page=1&limit=5"
```

Search products by name
```bash
curl "http://localhost:3000/api/products?q=laptop"
```

Get a product by id
```bash
curl "http://localhost:3000/api/products/<PRODUCT_ID>"
```

Create a product (requires API key)
```bash
curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -H "x-api-key: prodx231" \
  -d '{
    "name":"Wireless Mouse",
    "description":"Ergonomic wireless mouse",
    "price":25.5,
    "category":"electronics",
    "inStock":true
  }'
```

Update a product (partial update allowed)
```bash
curl -X PUT "http://localhost:3000/api/products/<PRODUCT_ID>" \
  -H "Content-Type: application/json" \
  -H "x-api-key: prodx231" \
  -d '{"price": 30}'
```

Delete a product
```bash
curl -X DELETE "http://localhost:3000/api/products/<PRODUCT_ID>" \
  -H "x-api-key: prodx231"
```

## Notes

- Data is stored in memory for this example; restarting the server resets products.
- New products use UUIDs for ids.
- The included validation middleware enforces types and required fields for creation and safe partial updates for PUT.
- Logging prints method, URL and timestamp to console.

## Contributing / Testing

This is a small learning project — open issues or pull requests in the repository. For local testing use curl, Postman or similar tools.

## License

ISC