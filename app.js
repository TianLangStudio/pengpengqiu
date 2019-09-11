var app = require('express')()
    ,http = require('http').createServer(app)
	,fs = require('fs')
	,io = require('socket.io')(http)
	,Game = require('./Game').Game;
	
http.listen(8888);
console.log("listen on port 8888");
function handler(request, response) {

	fs.readFile(__dirname + '/index.html',function(err,data) {
		response.writeHead(200,{'Content-Type':'text/html'});
		response.write(data);
		response.end();
	});
}
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
//io.set('log level', 0); 2.2 not supply
var games = {},//���淿���game����
	game = new Game({});
	
io.on('connection', function( socket ) {
    socket.emit('gameInfo', game.info());//��ʼ����Ϸ״̬
	socket.on( 'join' , function(data){
	   
        console.dir(data);
        io.clients(function(err, clients) {
          if(clients && clients.length > 2) {
             socket.emit( 'roomful', data);     
             socket.leave();
              console.log("roomful");
              console.dir(clients);
          } else {
             socket.join(data.roomId);
		    	console.log("room");
                console.log(socket.id);
                console.dir(clients);
			 io.clients(function(err, roomClients) {
                if( roomClients.length === 2 ){
			            io.in(data.roomId).emit('twoplayer', data);
				        /*socket.in(data.roomId).broadcast.emit('twoplayer', data);
				        socket.in(data.roomId).emit('twoplayer', data);*/
				        //��ҵ��� ��ʼ��Ϸ
				        
				        games[data.roomId] = new Game({
					        onWin:function(winData) {
						        io.in(data.roomId).emit('win',winData);
					        },
					        onFlush:function(gameInfo) {
						        io.in(data.roomId).emit('gameInfo',gameInfo);
					        }
					        
				        });
				        games[data.roomId].begin();
				        
				
			        } else {
			            data.userName = "A";
			            io.in(data.roomId).emit('oneplayer', data);
				        /*
				        socket.in(data.roomId).broadcast.emit('oneplayer', data);
				        socket.in(data.roomId).emit('oneplayer', data);*/
				        
			        }
			        //����뿪������Ϸ����
			        socket.on('disconnect', function() {
			            var game = games[data.roomId];//ֹͣ��Ϸ
				        if(game){
					        game.stop();
				        }
				        io.in(data.roomId).emit('leave', data);
			        })
             });
          }
        });
	});
	socket.on('board2Left',function(data){//���������ƶ�
		games[data.roomId].board2Left(data);
	})
	socket.on('board2Right',function(data){
		games[data.roomId].board2Right(data);//���������ƶ�
	})
});
