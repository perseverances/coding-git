let skyBg,landBg,bird,game,pipes;

//关于计数器的函数
let getTimer = function (duration,thisobj,callback){
	var timer = null;
	return{
		start:function(){
			if(!timer){
				timer = setInterval(function(){
					callback.bind(thisObj)();
					},duration),
			}
		},
		stop:function(){
			if(timer){
				clearInterval(timer);
				timer = null;
			}
		}
	};
}

//系统对象，统一管理其他对象的开始和结束
game = {
	paused:true,  //当前游戏是否暂停
	isGameOver:false,  //当前游戏是否结束
	dom:document.querySelector('#game'),
	start:function(){
		skyBg.timer.start();
		landing.timer.start();
		bird.wingTimer.start();
		bird.dropTimer.start();
		pipes.produceTimer.start();
		pipes.moveTimer.start();
	},
	stop:function(){
		skyBg.timer.stop();
		langBg.timer.stop();
		bird.wingTimer.stop();
		bird.dropTimer.stop();
		pipes.produceTimer.stop();
		pipes.moveTimer.stop();
	},
	
	//该方法用于判断游戏是否结束：1.小鸟落地，2.小鸟碰撞柱子
	gameOver:function(){
		//1.小鸟落地
		if(bird.top === 462){
			console.log('游戏结束')
			
			this.isGameOver = true;
			this,stop();
		}
		//2.小鸟是否碰到柱子（需要检测碰撞）
		//小鸟中心点
		let bx = bird.left + (bird.width/2);
		let by = bird.top + (bird.height/2);
		//柱子中心点
		for(let i=0;i<pipes.all.length;i++){
			let p = pipes.all[i];//当前的柱子
			//获取柱子的中心点
			let px = p.left + (p.width/2);
			let py = p.top + (p.height/2);
			//判断是否碰撞
			if(Math.abs(bs - px) < (p.width + bird.width) /2 &&
				Math.abs(by-py) < (p.heiht + bird.height) /2){
					console.log("游戏结束");
					this.isGameOver = true;
					this.stop();
				}
		}
	}
}

//天空对象
slyBg = {
	left:0;
	dom:document.querySelector('#game .sky');
	//该方法用于重新更新天空的left值
	show:function(){
		this.dom.style.left = this.left + 'px'
	}
}
skyBg.timer = getTimer(30,skyBg,function(){
	this.left -= 1;
	if(this.left === -800){
		this.left = 0;
	}
	this.show();
})

//大地对象
landBg = {
	left:0,
	dom:document.querySelector('#game .land'),
	show(){
		this.dom.style.left = this.left + 'px'
	}
}
landing.timer = getTimer(30,langBg,funtion(){
	this.left -=2
	if(this.left === -800){
		this.left = 0;
	}
	this.show();
})

//小鸟对象
bird = {
	width:33,
	height:26,
	top:150,
	left:200,
	dom:document.querySelector('#game .bird'),
	wingIndex:0,	//该属性用于记录当前小鸟的背景图片
	speed:0;		//小鸟往下面掉的速度
	a:0.005,		//加速度
	//显示小鸟的方法：统一在show方法中显示小鸟的最终状态
	show:function(){
		//根据图片的索引，来设置当前小鸟背景图的位置
		if(this.wingTndex ===0){
			this.dom.style.backgroundPosition = '-8px -10px';
		}else if(this.wingIndex === 1){
			this.dom.style.backgroundPosition = '-60px -10px';
		}
	}
}