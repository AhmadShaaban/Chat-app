const path = require('path');
const express = require('express');
const socketio = require("socket.io");
const http = require('http');
const Fitler = require('bad-words');
const {adduser,removeUser,getRoomUsers,getUser} = require('./utils/users');
const app = express();
const {generateMessage} = require('./utils/message');
const server = http.createServer(app);
const PublicDirectory = path.join(__dirname,'../public');
app.use(express.static(PublicDirectory));


const io = socketio(server);
const filter = new Fitler();
io.on('connection', (socket)=>{
    socket.on('join',({username,room})=>{
        socket.join(room);
        adduser(socket.id,username,room);
        socket.emit('recieve',generateMessage("Admin",`Welcome ${username}`));
        socket.broadcast.to(room).emit('recieve',generateMessage("Admin",`${username} joined`));

    })
    
    socket.on('send',(msg,callback)=>{
        const user = getUser(socket.id);
        if (filter.isProfane(msg)){
            callback(1);
            return io.to(user.room).emit('recieve',generateMessage(user.username,filter.clean(msg)));
        }
        callback();
        io.to(user.room).emit('recieve',generateMessage(user.username,(msg)));
    })

    socket.on('sendLocation',(coords)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit('loc',generateMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        console.log(user);
        if (user) {
            io.to(user.room).emit('recieve', generateMessage('Admin', `${user.username} has left!`))
        }
    })
})




const port = process.env.port || 8080;
server.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})