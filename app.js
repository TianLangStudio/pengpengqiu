var app = require('http').createServer(handler)
	,fs = require('fs')
	,io = require('socket.io').listen(app)
	,Game = require('./Game').Game;
	
app.listen(8888);
console.log("listen on port 8888");
function handler(request, response) {

	fs.readFile(__dirname + '/index.html',function(err,data) {
		response.writeHead(200,{'Content-Type':'text/html'});
		response.write(data);
		response.end();
	});
}
io.set('log level', 0);
var games = {},//保存房间的game对象
	game = new Game({});
	
io.sockets.on('connection', function( socket ) {
    socket.emit('gameInfo', game.info());//初始化游戏状态
	socket.on( 'join' , function(data){
	    
		if( io.sockets.clients(data.roomId)   &&io.sockets.clients(data.roomId).length === 2 ){
			socket.emit( 'roomful', data);
			socket.leave();
		} else {
			socket.join(data.roomId);
			
			if( io.sockets.clients(data.roomId) && io.sockets.clients(data.roomId).length === 2 ){
			    io.sockets.in(data.roomId).emit('twoplayer', data);
				/*socket.in(data.roomId).broadcast.emit('twoplayer', data);
				socket.in(data.roomId).emit('twoplayer', data);*/
				//玩家到齐 开始游戏
				
				games[data.roomId] = new Game({
					onWin:function(winData) {
						io.sockets.in(data.roomId).emit('win',winData);
					},
					onFlush:function(gameInfo) {
						io.sockets.in(data.roomId).emit('gameInfo',gameInfo);
					}
					
				});
				games[data.roomId].begin();
				
				
			} else {
			    data.userName = "A";
			    io.sockets.in(data.roomId).emit('oneplayer', data);
				/*
				socket.in(data.roomId).broadcast.emit('oneplayer', data);
				socket.in(data.roomId).emit('oneplayer', data);*/
				
			}
			//玩家离开房间游戏结束
			socket.on('disconnect', function() {
			    var game = games[data.roomId];//停止游戏
				if(game){
					game.stop();
				}
				io.sockets.in(data.roomId).emit('leave', data);
			})
		}
	});
	socket.on('board2Left',function(data){//球拍向左移动
		games[data.roomId].board2Left(data);
	})
	socket.on('board2Right',function(data){
		games[data.roomId].board2Right(data);//球拍向右移动
	})
});