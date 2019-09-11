/***
Game 对象   完成游戏状态保存和更新操作 例如移动球和球拍 和碰撞检测
*/

function Game(config) {
    var me = this;
	//游戏区域信息  包括坐标大小  xs:左边界坐标x值   xs：右边界坐标x值  ys:上边界坐标值  ye:下边界坐标y值  
	me._playground = {width:320,height:420,xs:20,xe:300,ys:20,ye:400};
	//球信息  包括球心坐标位置 半径 
	me._ball = {x:160,y:210,r:20};
	//球移动速度   随机产生
	me._vx = Math.random() * 10 + 10;
	me._vy = Math.random()*10 + 10;
	
	me.onWin = config.onWin;//当有人赢了时调用的函数
	me.onFlush = config.onFlush;//当更新游戏游戏时调用的函数
	
	//球拍信息   包括球拍名称 坐标位置  长度宽度
	me._boardA = {boardName:'A',x:160,y:0,width:80,height:10};
	me._boardB = {boardName:'B',x:160,y:410,width:80,height:10};
	
	/****球移动方法  通过修改球的坐标位置移动球  
		并做碰撞检测  当球碰到游戏区域左右边界和球拍时弹回  
		碰到游戏区域上边界时玩家B赢  碰到游戏区域下边界时玩家A赢
	****/
	me._ball.move = function() {
	    var pg = me._playground;
		me._ball.x += me._vx;
		me._ball.y += me._vy;
		
		//小球碰到球拍A调头
		if( (me._ball.y-me._ball.r) <= (me._boardA.y + me._boardA.height)
			&&(me._ball.x + me._ball.r) >= me._boardA.x 
			&&(me._ball.x-me._ball.r) <= (me._boardA.x + me._boardA.width)
		){//检测小球是否碰到球拍A
			me._ball.y = me._boardA.y + me._boardA.height+me._ball.r;
			me._vy = -(me._vy + Math.round(Math.random() * 10));//每击中一次速度加快
			me._vx += Math.round(Math.random() * 10);
		}else if( 
		    (me._ball.y+me._ball.r) >= (me._boardB.y)//小球碰到球拍B调头
			&&(me._ball.x +　me._ball.x) >= me._boardB.x 
			&&(me._ball.x-me._ball.r) <= (me._boardB.x + me._boardB.width)
		){//检测小球是否碰到球拍B
			
			me._ball.y = me._boardB.y - me._ball.r;
			me._vy = -(me._vy + Math.round(Math.random() * 10));//每击中一次速度加快
			me._vx += Math.round(Math.random() * 10);
		}
		
		if(me._ball.x < pg.xs) {//检测小球是否碰到游戏区域左边界 如果碰到弹回 
		   me._ball.x = pg.xs;
		   me._vx = -me._vx;
		}else if(me._ball.x > pg.xe) {//检测小球是否碰到游戏区域右边界 如果碰到弹回 
		   me._ball.x = pg.xe;
		   me._vx = -me._vx;
		}
		if(me._ball.y < pg.ys) {//检测小球是否碰到游戏区域上边界  如果碰到停止游戏并宣布玩家B获胜
		    //me._vy = -me._vy;
			me.stop();
			me.onWin({winner:'B'});
		}
		else if(me._ball.y > pg.ye){//检测小球是否碰到游戏区域下边界  如果碰到停止游戏并宣布玩家A获胜
			//me._vy = -me._vy;
			me.stop();
			me.onWin({winner:'A'});
		}
	
			
		
	}
}
//游戏开始方法  开始一直移动球
Game.prototype.begin = function() {
	var me = this;
	//3秒钟后开始游戏
    setTimeout(function() {
		me._flushId = setInterval(function() {//每隔0.1秒移动球一次
			me._ball.move();
			me.onFlush(me.info());
		},100);
	},3000);
	
}
//向左移动球拍
Game.prototype.board2Left = function(data) {
	var me = this,
		board = me['_board' + data.userName];
		
	board.x -= 40;//球拍向左移动40像素
	if(board.x < 0) {//球拍不能移出左边界
		board.x = 0;
	}
}
//向右移动球拍
Game.prototype.board2Right = function(data) {
	var me = this,
		board = me['_board' + data.userName];
		
	board.x += 40;//球拍向右移动40像素
	if((board.x + board.width) > me._playground.width) {//球拍不能移出右边界
		board.x = me._playground.width-board.width;
	}
}
//获取游戏信息方法  信息包括球和球拍的信息 用于前端绘制游戏界面
Game.prototype.info = function() {
	var me = this;
	return {
		ball:me._ball,
		boardA:me._boardA,
		boardB:me._boardB
	}
	
}
/**
	停止游戏方法  停止移动球
**/
Game.prototype.stop = function() {
	clearInterval(this._flushId);
}
exports.Game = Game;	