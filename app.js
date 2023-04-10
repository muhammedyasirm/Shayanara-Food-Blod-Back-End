const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 5000;
const cors = require('cors');
const bodyParser = require('body-parser');
// const json = require('express-json')
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const adminRouter = require('./routes/adminRoutes');

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/',userRouter);
app.use('/',postRouter);
app.use('/admin',adminRouter);


mongoose.connect('mongodb://localhost:27017/shayanara',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.listen(port, () => console.log(`app listening on port ${port}`));