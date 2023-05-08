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
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const path = require('path');
require("dotenv").config();

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/backend',userRouter);
app.use('/backend',postRouter);
app.use('/backend/admin',adminRouter);
app.use('/backend/chat',chatRoutes);
app.use('/backend/message',messageRoutes);

//-----------------Deployment---------------------

const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1,"/frontend/buid")))
    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"));
    })
} else {
    app.get("/",(req,res) => {
        res.send("API is running successfully");
    });
}

//-----------------Deployment----------------------


mongoose.connect('mongodb://localhost:27017/shayanara',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const server = app.listen(port, () => console.log(`app listening on port ${port}`));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "https://shayanara.online/backend"
    }
});

io.on("connection", (socket) => {
console.log("connected to socket.io");

socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected'); 
});

socket.on('join chat',(room) => {
    socket.join(room);
    console.log("User Joined Room: ",room);
});

socket.on('typing', (room) => socket.in(room).emit("typing"));
socket.on('stop typing', (room) => socket.in(room).emit("stop typing"));

socket.on('new message', (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if(!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach(user => {
        if(user._id == newMessageRecieved.sender._id) return;

        socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
});

socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
})

});