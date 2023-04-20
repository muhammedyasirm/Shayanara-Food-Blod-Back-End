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

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/',userRouter);
app.use('/',postRouter);
app.use('/admin',adminRouter);
app.use('/chat',chatRoutes);
app.use('/message',messageRoutes);


mongoose.connect('mongodb://localhost:27017/shayanara',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const server = app.listen(port, () => console.log(`app listening on port ${port}`));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
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