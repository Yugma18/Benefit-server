const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const errorMiddleware = require('./middlewares/errorMiddleware');
const path = require("path");
const { MongoClient } =  require('mongodb');
const fs = require('fs');
const csv = require('csv-parser');
const multer = require('multer');
const router = express.Router();
require("./models/File")
const File = mongoose.model("file");

const app = express();

const corsOptions = {
    origin: true,
    credentials: true,
};

//middleware
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(`${__dirname}/files`));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api', routes);
app.use(errorMiddleware); // must be last


app.get('/', (req, res) => {
    res.send('Benefit API running 🥳');
});


async function initServer() {
    try {
        //configure mongoose
        mongoose.set('strictQuery', false);
        await mongoose
            .connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => console.log('Connected to mongoDB'));
        app.listen(3001, '0.0.0.0', () => {
            console.log(
                `Server is running on port ${process.env.PORT || 5001}`
            );
        });
    } catch (error) {
        console.log(error);
    }
}

initServer();

module.exports = app;
