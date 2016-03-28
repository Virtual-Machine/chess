var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

var count = 0
var primary
var holdColor
var p1Name
var p2Name
var secondary
io.on('connection', function(socket){
	++count
	if(count == 1){
		p1Name = null;
		p2Name = null;
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

		primary.on('name1', function(name){
			p1Name = name;
			if(secondary){
				secondary.emit('nameUpdate', name);
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
		secondary.on('name2', function(name){
			primary.emit('nameUpdate', name)
		})

		if(holdColor){
			secondary.emit('sendColor', holdColor);
		}
		if(p1Name){
			secondary.emit('nameUpdate', p1Name);
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