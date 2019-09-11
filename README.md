## 碰碰球
----------------
双人对战小游戏
![KeepLearning QQ](https://raw.githubusercontent.com/TianLangStudio/pengpengqiu/master/images/pengpengqiu.png)

## 更新日志
20190911 
　　　　升级socket.io为2.2.0并修复api不兼容问题
20140514
        1.搭建后端环境（安装nodejs socket.io   参考链接http://raytaylorlin.com/category/Tech/web/Node.js/socket-io-advanced/)  
        2.前端通过socket链接实现游戏状态共享 俩个玩家看到的界面一致	
    20140515
	    1.前端界面添加键盘KeyDown事件 当按下“←”时向服务端发送球拍左移消息 当按下“→”时向服务端发送球拍右移消息
		2.服务端添加接受球拍移动消息处理方法并执行球拍移动操作
		3.添加小球和球拍的碰撞检测 当小球碰到球拍时折回并加速（增加趣味性）
    20140516
	    1.调整前端布局美化界面
	20140517
		1.调整前端页面适合手机浏览
		2.添加触屏事件控制球拍
    
## 运行方法：
        进入项目目录执行　yarn install
        执行 node app.js  （请确保已经安装node  安装参考链接：http://www.infoq.com/cn/articles/nodejs-npm-install-config）
		打开Chrome或火狐（支持html5）浏览器访问：http://127.0.0.1:8888/  开始游戏
## 问题交流可加群
QQ群：579896894
----------------
![KeepLearning QQ](https://raw.githubusercontent.com/TianLangStudio/DataXServer/master/images/tianlangstudio-keeplearning-qrcode.jpg)      		
