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

		primary.on('drawOffer', function(){
			secondary.emit('drawOffered');
		})


		primary.on('declineOffer', function(){
			secondary.emit('offerDeclined');
		})
	} else if(count == 2){
		secondary = socket
		secondary.on('drawOffer', function(){
			primary.emit('drawOffered');
		})
		secondary.on('declineOffer', function(){
			primary.emit('offerDeclined');
		})
		if(holdColor){
			secondary.emit('sendColor', holdColor);
		}
		console.log('secondary user connected')
	} else {
		console.log('spectator connected')
	}

	socket.on('sendMove', function(move){
		socket.broadcast.emit('broadcastMove', move);
	})

	socket.on('sendUpgrade', function(data){
		socket.broadcast.emit('broadcastUpgrade', data);
	})

	socket.on('acceptOffer', function(){
		socket.broadcast.emit('offerAccepted');
	})

	socket.on('sendMessage', function(data){
		io.emit('pulseMessage', data);
	});

	socket.on('disconnect', function(){
		--count
		console.log('socket disconnected')
	})
})

http.listen(3000, function(){
	console.log('listening on *:3000')
})