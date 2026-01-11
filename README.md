ShopZone 🛒

ShopZone is a full-stack e-commerce web application built with React (frontend) and Node.js/Express (backend), with MongoDB as the database. Users can browse products, add items to cart, place orders, and manage their profile. Admins can manage products, users, orders, and view reports.

🛠️ Tech Stack       Layer	Technology
Frontend          	React, React Router, Axios
Backend	            Node.js, Express, MongoDB, Mongoose
Authentication	    JWT (JSON Web Tokens)
Deployment	        Vercel (frontend), Render (backend)
Environment        	dotenv for environment variables


💻 Features
User:-
*User registration and login
*Browse products by category or search
*Add/remove/update products in cart
*Place and view orders
*View order details

Admin:-
*Admin Dashboard
*Manage products (CRUD)
*Manage users (view , delete,promote and demote user)
*Manage orders (view, update status, cancel)
*Create flash deals and offers

Others:-
*Protected routes with JWT
*Responsive UI
*Environment-based API URLs

⚙️ Project Structure:
ecommerce-app/
├── backend/            # Node.js + Express API
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth and validation middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── .env            # Environment variables (not pushed)
│   └── index.js        # Server entry point
│
├── frontend/           # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.js      # API helper functions
│   │   └── App.js
│   ├── .env            # Environment variables
│   └── package.json
│
└── README.md           # Project documentation


📝 API Endpoints

Authentication
POST /auth/signup – Register a new user
POST /auth/login – Login user

Products
GET /products – List all products
POST /products – Create product (admin)
PUT /products/:id – Update product (admin)
DELETE /products/:id – Delete product (admin)

Cart
GET /cart/:userId – Get cart for user
POST /cart – Add item to cart
PUT /cart/:userId/:productId – Update item quantity
DELETE /cart/:userId/:productId – Remove item

Orders
POST /orders – Place order
GET /orders/user/me – Get orders for logged-in user
PUT /orders/:id/status – Update order status (admin)

More endpoints can be found in the /routes folder
