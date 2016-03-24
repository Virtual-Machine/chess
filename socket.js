var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

var count = 0
var primary
var holdColor
var secondary
io.on('connection', function(socket){
	++count
	if(count == 1){
		primary = socket
		primary.emit('showColorDisplay')
		console.log('primary user connected')
	} else if(count == 2){
		secondary = socket
		if(holdColor){
			secondary.emit('sendColor', holdColor);
		}
		console.log('secondary user connected')
	} else {
		console.log('spectator connected')
	}

	primary.on('requestColor', function(color){
		if(color === 'White'){
			holdColor = 'Black'
		} else {
			holdColor = 'White'
		}
		if(secondary){
			secondary.emit('sendColor', holdColor);
		}
	})

	socket.on('sendMove', function(move){
		socket.broadcast.emit('broadcastMove', move);
	})

	socket.on('sendUpgrade', function(data){
		socket.broadcast.emit('broadcastUpgrade', data);
	})

	socket.on('disconnect', function(){
		--count
		console.log('socket disconnected')
	})
})

http.listen(3000, function(){
	console.log('listening on *:3000')
})