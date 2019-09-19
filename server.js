// RUN THE SERVER USING NPM _ node server command
// Editing this file will need the server to be restarted to see changes 
// HTML Files will reflect the changes while the server is running

var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require('socket.io')(server);

users = [];
connections = [];

// specify the port the server must listen on
server.listen(process.env.PORT || 3000);

console.log("Server Running . . .");

app.get('/', function(request,result){
    result.sendFile(__dirname + "/index.html");
});

// Check for any connections 
io.on('connection', function(socket){
    connections.push(socket);
    console.log("Connected: %s sockets connected", connections.length);

    // add a disconnect check
    socket.on('disconnect',function(data){
        
        users.splice(users.indexOf(socket.username),1);
        updateUsernames();
        connections.splice(connections.indexOf(socket, 1));
        console.log("Connected: %s sockets connected", connections.length);
    
    });

    // Listen for the send messsage
    socket.on('send message',function(data){
        io.emit('new message',{msg: data, user: socket.username});
    })

    // Listen for the new user
    socket.on('new user',function(data,callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    }) 
    
    // Function to update the user connections on the client interface
    function updateUsernames(){
        io.emit('get users', users);
    }
});
