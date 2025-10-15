import express from "express";

const app = express();



// // server.js - Starter Express server for Week 2 assignment

// // Import required modules
// const express = require('express');
// const bodyParser = require('body-parser');
// const { v4: uuidv4 } = require('uuid');

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware setup
// app.use(bodyParser.json());

// // Sample in-memory products database
// let products = [
//   {
//     id: '1',
//     name: 'Laptop',
//     description: 'High-performance laptop with 16GB RAM',
//     price: 1200,
//     category: 'electronics',
//     inStock: true
//   },
//   {
//     id: '2',
//     name: 'Smartphone',
//     description: 'Latest model with 128GB storage',
//     price: 800,
//     category: 'electronics',
//     inStock: true
//   },
//   {
//     id: '3',
//     name: 'Coffee Maker',
//     description: 'Programmable coffee maker with timer',
//     price: 50,
//     category: 'kitchen',
//     inStock: false
//   }
// ];

// // Root route
// app.get('/', (req, res) => {
//   res.send('Welcome to the Product API! Go to /api/products to see all products.');
// });

// // TODO: Implement the following routes:

// // GET /api/products - Get all products
// app.get('/api/products', (req, res) => {
//   res.json(products);
// })

// // GET /api/products/:id - Get a specific product
// app.get('api/products/:id', (req, res) => {
//   const product = products.find(p => p.id == req.params.id);
//   if (!product) return res.status(404).send('Product not found!');
// });

// // POST /api/products - Create a new product
// app.post('api/products', (req, res) => {
//   const {
//     name,
//     description,
//     price,
//     category,
//     inStock
//   } = req.body;

//   if (!name || !description || !price || !category || !inStock) return res.status(400).json({message: 'All input are required!'});

//   const newProduct = {
//     id: products.length + 1,
//     name,
//     description,
//     price,
//     category,
//     inStock
//   };

//   products.push(newProduct);

//   res.status(201).json({
//     message: 'product created successfully!',
//     product: newProduct
//   });
// });

// // PUT /api/products/:id - Update a product

// app.put('api/products/:id', (req, res) => {
//   const product = products.find(p => p.id == parseInt(req.params.id));

//   if (!product) return res.status(404).send('Product not found!');
// });

// // DELETE /api/products/:id - Delete a product

// app.delete('api/products/:id', (req, res) => {
//   const product = products.filter(p => p.id !== parseInt(req.params.id));

//   if (!product) return res.send('Ops!, Dont exist this product');
// });

// // Example route implementation for GET /api/products
// app.get('/api/products', (req, res) => {
//   res.json(products);
// });

// // TODO: Implement custom middleware for:
// // - Request logging

// app.use('/', (req, res, next) => {
//   res.status(200).json({message: 'Logged successfully'}),
//   next()
// })

// // - Authentication

// app.use()

// // - Error handling

// app.use((err, req, res, next) => {
//   res.status(417).send({})
// })

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// // Export the app for testing purposes
// module.exports = app; 