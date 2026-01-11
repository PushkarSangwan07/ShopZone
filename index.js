const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const AuthRouter = require('./routes/AuthRouter');
const productRouter = require('./routes/productRouter')
const orderRouter = require('./routes/orderRouter');
const cartRouter = require('./routes/cartRouter')
const userRouter = require("./routes/userRouter");
const adminRoutes = require("./routes/adminRoutes")




app.use(express.json());
app.use(cors());

app.use('/auth', AuthRouter);
app.use('/products', productRouter);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);
app.use("/users", userRouter);
app.use("/admin",adminRoutes)


app.get('/', (req, res) => {
    res.send("Backend is running");
});



mongoose.connect(process.env.Mongo_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
    })
    .catch(err => {
        console.error("❌ MongoDB Error:", err);
        process.exit(1);
    });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});


