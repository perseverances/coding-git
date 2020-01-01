let skyBg,landBg,bird,game,pipes;

//封装一个关于计数器的函数，返回一个对象，对象包括两个属性
//start：创建一个计时器；   stop：停止计时器；   duration：计时器每隔多少毫秒执行；
//callback：每隔duration毫秒执行callback函数；   thisObj：为了得到正确德this指向

let getTimer = function (duration,thisObj,callback){	//let用来声明局部变量，只在let命令所在的代码内有效，而且有暂时性死区的约束
	var timer = null;									//[错误]O要大写
	return{
		start:function(){
			if(!timer){
				timer = setInterval(function(){
					callback.bind(thisObj)();		//定时器：timer = setInterval(function(){要执行的操作}，30)
					},duration);			//[错误] ;写成了,
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
	dom:document.querySelector('#game'),		//获取文档中"game"元素
	start:function(){
		skyBg.timer.start();
		landbg.timer.start();			//[错误]landBg写成了landing
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
			console.log('游戏结束');		//[错误] 没写;
			
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
			if(Math.abs(bx - px) < (p.width + bird.width) /2 &&		//[错误]bx写成了bs
				Math.abs(by-py) < (p.heiht + bird.height) /2){
					console.log('游戏结束');		//之前是''
					this.isGameOver = true;
					this.stop();
				}
		}
	}
}

//天空对象
skyBg = {			//[错误]skyBg写成了slyBg
	left:0,			//[错误] ,写成了;
	dom:document.querySelector('#game .sky'),		//[错误]写成了;
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
landBg.timer = getTimer(30,langBg,funtion(){		//[错误]langBg写成了landing
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
		if(this.wingIndex ===0){		//I写成了T
			this.dom.style.backgroundPosition = '-8px -10px';
		}else if(this.wingIndex === 1){
			this.dom.style.backgroundPosition = '-60px -10px';
		}else{
			this.dom.style.backgroundPositon = '-113px -10px';
		}
		//设置小鸟的top值
		this.dom.style.top = this.top + 'px';
	},			//[错误]应该写,
	//设置小鸟的top值
	setTop(newTop){
		if(newTop < 0){
			newTop = 0;
		}
		if(newTop > 462){
			newTop = 462;
		}
		this.top = newTop;
	},
	jump(){
		this.speed = -0.5;
	}
}

//让小鸟不停的扇动翅膀的计时器
bird.wingTimer = getTimer(100,bird,function(){
	//这里面主要要做的事儿：修改wingIndex，然后调用show
	this.wingIndex = (this.wingIndex +1 )%3;
	this.show();
});
bird.dropTimer = getTimer(16,bird,function(){
	//主要要做的事儿：改变高度，然后调用setTop方法以及show方法
	//小鸟做的事匀加速运动
	//s = vt + 1/2 * a * t * t
	//如何获取匀加速的末速度：v = v0 + at
	let s = this.speed * 16 + 0.5 * this.a * 16 * 16;//[错误]表达式没有写=
	this.speed = this.speed + this.a * 16;
	this.setTop(this.top + s);
	this.show();
});

//上下的管道
pipes = {
	width:52,
	getRandom:function(min,max){
		return Math.floor(Math.random() * (max - min) + min);	//[错误]Math.
	},
	all:[],		//用于存放所有的柱子
	//创建柱子的方法
	createPipe(){
		let minHeight = 60,		//柱子最小的高度
		gap = 150;				//中间的间隙
		maxHeight = 488 - gap - minHeight;
		
		//接下来确定一组柱子的高度
		let h1 = this.getRandom(minHeight,maxHeight),
			h1 = 488 - gap - h1;
		//接下来根据这两个高度来创建柱子
		//上面的柱子
		let div1 = document.createElemet("div");
		div1.className = "pipeUp";		//[错误]name写成了nmae  pipeUp
		div1.style.height = h1 + "px";
		div1.style.left = "800px";
		game.dom.appendChild(div1);		//[错误]dom写成了som
		this.all.push({
			dom:div1,
			height:h1,
			width:this.width,		//[错误] 四个,写成了;
			top:0,
			left:800
		});
		//下面的柱子
		let div2 = document.createElement("div");
		div2.className = "pipedown";			//[错误]name写成了nmae
		div2.style.height = h2 + "px";
		div2.style.left = "800px";
		game.dom.appendChild(div2);
		this.all.push({
			dom:div2,
			height:h2,
			width:this.width,
			top:h1 + gap,
			left:800
		});
	},
}

//创建柱子的方法
pipes.produceTimer = getTimer(2500,pipes,function(){
	this.createPipe();
})

//移动柱子
pipes.moveTimer = getTimer(30,pipes,function(){		//[错误]首字母不应该大写
	//因为要移动所有的柱子  &&  对游戏进行积分
	for(let i=0;i<this.all.length;i++){
		let p = this.all[i];	//得到当前的柱子
		p.left -= 2;
		if(p.left < -p.width){
			p.dom.remove();
			this.all.splice(i,1);
			i--;
		}else{
			p.dom.style.left = p.left + 'px';
		}
		
		//判断柱子是否过了小鸟，若过了则说明小鸟过了一根柱子
		if(p.left<= (bird.left-pipes.width)){		//[错误] <= 写成了<
			console.log("+1");		//[错误]缺少/log
		}
	}
	
	game.gameOver();		//每次移动柱子后，都需要判断游戏是否结束
})；

document.documentElement.onkeydown = function(e){
	if(e.key === ' '){
		bird.jump();
	}
	if(e.key === 'Enter'){
		//按下回车键后，有三种状态（游戏运行中，游戏暂停中，游戏结束后）
		if(game.isGameOver){
			location.reload();
		}
		if(game.paused){
			game.start();
			game.paused = !game.paused
		}else{
			game.stop();
			game.paused = !game.paused
		}
	}
}