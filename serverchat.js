var fs = require('fs')
 var https = require('https')

 var app = require('express')();
 var http = require('http');

var options = {
    key: fs.readFileSync('./mycert1.key'),
    cert:fs.readFileSync('./mycert1.cer'),
    ca: fs.readFileSync('myCA.cer')
}
var port = process.env.PORT || 1337;
//var server = https.createServer(options,app)
var server = http.Server(app)

var io = require('socket.io')(server);

var userList = {}
var socketList = {}
var address = server.address()
server.listen(port, function () {
    console.log('Listening on *:',port);
    console.log(server.address());
    console.log(server.address());
    console.log(server.address().port);
    io.on('connection',function (clientSocket) {
        console.log('a new user connected with id ',clientSocket.id);

        userList[clientSocket.id] = clientSocket.id;
        socketList[clientSocket.id] = clientSocket;

        clientSocket.emit('updateId',clientSocket.id)
        // Notify all sockets to update after new one connected
        io.sockets.emit('updateFriendList',userList)



        clientSocket.on('disconnect', function(){
            console.log('user disconnected');
            delete userList[clientSocket.id]
            delete socketList[clientSocket.id]

            // Notify all sockets to update after new one connected
            io.sockets.emit('updateFriendList',userList)
        });

        clientSocket.on('newChatMessage',function (TargetId, content,fromId) {
            var sender = userList[clientSocket.id]
            var receiver = TargetId
            var content = content
            console.log("---------------------");
            console.log("Sender (from system): ", sender);
            console.log("Sender (from sender): ", fromId);
            console.log("Receiver: ", receiver);
            console.log("Content",content)
            console.log("---------------------");
            var TargetSocket = socketList[TargetId]
            TargetSocket.emit("newChatMessage",{fromId: fromId,message :content})
        });
    })
})





