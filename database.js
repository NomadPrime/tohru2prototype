console.log("DATABASE ONLINE");

var io;

var db = {
	activate: function(server)
	{
		io = require('socket.io').listen(server);
		io.sockets.on('connection', function(socket)
		{
			console.log("NEW SOCKET CONNECTED");
		});
		console.log("SERVER ACTIVE");
	}
};

module.exports = db;