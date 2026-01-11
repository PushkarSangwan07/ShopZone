# ShopZone 🛒

**ShopZone** is a full-stack e-commerce application built with **React** (frontend) and **Node.js/Express** (backend), using **MongoDB** for the database. Users can browse products, add items to cart, place orders, and manage profiles. Admins can manage products, users, and orders.

---

## 🛠️ Tech Stack

| Layer           | Technology                                 |
|-----------------|--------------------------------------------|
| Frontend        | React, React Router, Axios                 |
| Backend         | Node.js, Express, MongoDB, Mongoose        |
| Authentication  | JWT (JSON Web Tokens)                      |
| Deployment      | Vercel (frontend), Render (backend)        |
| Environment     | dotenv (environment variables)             |

---

## 💻 Features

### User Features
- User registration and login  
- Browse products by category or search  
- Add/remove/update items in cart  
- Place and view orders  
- View order details  

### Admin Features
- Admin dashboard  
- Manage products (CRUD)  
- Manage users (view, delete, promote/demote)  
- Manage orders (view, update status, cancel)  
- Create flash deals and offers  

### Other Features
- Protected routes with JWT  
- Responsive UI  
- Environment-based API URLs  

---

## ⚙️ Project Structure

- ecommerce-app
  - backend (Node.js + Express API)
    - controllers (Route handlers)
    - middleware (Auth and validation middleware)
    - models (MongoDB models)
    - routes (API routes)
    - .env (Environment variables, not pushed)
    - index.js (Server entry point)
  - frontend (React app)
    - src
      - components (React components)
      - pages (React pages)
      - api.js (API helper functions)
      - App.js (Main app component)
    - .env (Environment variables)
    - package.json (Frontend dependencies)
  - README.md (Project documentation)



## 📝 API Endpoints

### Authentication

- POST /auth/signup – Register a new user
- POST /auth/login – Login user


### Products
- GET /products – List all products
- POST /products – Create product (admin)
- PUT /products/:id – Update product (admin)
- DELETE /products/:id – Delete product (admin)


### Cart
- GET /cart/:userId – Get cart for user
- POST /cart – Add item to cart
- PUT /cart/:userId/:productId – Update item quantity
- DELETE /cart/:userId/:productId – Remove item


### Orders
- POST /orders – Place order
- GET /orders/user/me – Get orders for logged-in user
- PUT /orders/:id/status – Update order status (admin)


> More endpoints can be found in the `/routes` folder

---

## 🚀 Local Setup

**Clone Repo:**
```bash
git clone https://github.com/PushkarSangwan07/ShopZone.git
cd ecommerce-app

cd backend:
npm install
# Create .env with:
# MONGO_URI=<your_mongo_connection_string>
# PORT=4000
# JWT_SECRET=<your_jwt_secret>
npm start

cd frontend:
npm install
# Create .env with:
# REACT_APP_API_URL=http://localhost:4000
npm start

*Backend: http://localhost:4000
*Frontend: http://localhost:3000






