const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors());

const mongoURI = "mongodb://127.0.0.1:27017/bulk_purchase_app";

mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log("MongoDB connected..."))
    .catch(err => console.log(err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/product', require('./routes/product'));
app.use('/api/order', require('./routes/order'));

app.use(passport.initialize());

require('./config/passport')(passport);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('../frontend/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});