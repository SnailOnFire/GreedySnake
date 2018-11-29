var originHeadLeft = '40px',
	originHeadTop = '340px',
	originFirstBodyLeft = '20px',
	originFirstBodyTop = '340px',
	originTailLeft = '0px',
	originTailTop = '340px';
var head = document.getElementsByClassName('head')[0];
var firstBody = document.getElementsByClassName('first-body')[0];
var tail = document.getElementsByClassName('tail')[0];

var gameStart = document.getElementsByClassName('start')[0];
var gamePause = document.getElementsByClassName('pause')[0];
var gameOver = document.getElementsByClassName('game-over')[0];
var gameRestart = document.getElementsByClassName('restart')[0];
var gameSuccess = document.getElementsByClassName('success')[0];

var snake = document.getElementsByClassName('snake')[0];
var food = document.getElementsByClassName('food')[0];

var tempLeft,
	tempTop,
	tempHeadLeft,
	tempHeadTop,
	direction,
	tempDirection,
	lastDirection,
	speed,
 	timer,
 	firstTimeStart = true,
 	over,
 	pause,
 	firstTime,
 	lastTime,
 	time,
 	positionX = [parseInt(originHeadLeft),parseInt(originFirstBodyLeft),parseInt(originTailLeft)],
 	positionY = [parseInt(originHeadTop),parseInt(originFirstBodyTop),parseInt(originTailTop)];
 	// positionX = [originHeadLeft,originFirstBodyLeft,originTailLeft],
 	// positionY = [originHeadTop,originFirstBodyTop,originTailTop];

programStart();
// positionX = positionX.map((value)=>{   //将字符数组转换为数字数组
//     return  parseInt(value);
// })
// positionY = positionY.map((value)=>{
//     return  parseInt(value);
// })
// console.log(positionX);
// console.log(positionY);

function programStart() {  //程序开始执行
	gameStart.style.display = 'inline-block';
	food.style.display = 'none'; 
	snake.style.display = 'none';
}

function init() {
	head = document.getElementsByClassName('head')[0];
	firstBody = document.getElementsByClassName('first-body')[0];
	tail = document.getElementsByClassName('tail')[0];
	head.style.left = originHeadLeft;
	head.style.top = originHeadTop;
	tempHeadTop = originHeadTop;
	firstBody.style.left = originFirstBodyLeft;
	firstBody.style.top = originFirstBodyTop;
	tail.style.left = originTailLeft;
	tail.style.top = originTailTop;
	tempDirection = 3;
	direction = 3; // 1：左移动，2：上移动，3：右移动，4：下移动
	speed = 200;
 	over = false;
 	pause = false;
 	firstTime = 0;
 	lastTime = 0;
 	time = 0;
 	positionX.length = 0; //清空数组
 	positionY.length = 0; //清空数组
 	positionX = [parseInt(originHeadLeft),parseInt(originFirstBodyLeft),parseInt(originTailLeft)];
 	positionY = [parseInt(originHeadTop),parseInt(originFirstBodyTop),parseInt(originTailTop)];
 	produceFood();
	move();
}

function produceFood() { //随机产生一颗食物,并且不会出现在蛇身上
	var produce = false;
	var i,
		len = positionX.length;
	while(!produce) {
		i = 0;
		food.style.left = 20 * Math.floor(Math.random() * 50) + 'px';
		food.style.top = 20 * Math.floor(Math.random() * 35) + 'px';
		for(; i < len; i ++) {
			if(parseInt(food.style.left) != positionX[i]) {
				continue;				
			}
			else{
				if(parseInt(food.style.top) == positionY[i]) {
					break;
				}
			}
		}
		if(i == len) {
			produce = true;
		}
	}
}

function move() {   //蛇移动（主要根据头部移动设置其他部位移动）
	timer = setInterval(moveHow,speed);
}

function moveHow() {
	if((head.offsetLeft == 0 && 1 == direction) || (head.offsetLeft == 980 && 3 == direction) || (head.offsetTop == 0 && 2 == direction) || (head.offsetTop == 680 && 4 == direction)) {
			gameIsOver(); //判断是否撞墙导致游戏是否结束
		}
	if(!over) {
		var body = document.getElementsByClassName('body'),
			len = body.length;
		tempLeft = parseInt(head.offsetLeft);  //蛇头上一次的位置
		tempTop = parseInt(head.offsetTop);
		switch(direction) {  //蛇头移动
			case 1:
				tempHeadLeft = tempLeft - 20;  //蛇头这一次的位置
				break;
			case 2:
				tempHeadTop = tempTop - 20;
				break;
			case 3:
				tempHeadLeft = tempLeft + 20;
				break;
			case 4:
				tempHeadTop = tempTop + 20;
				break;
			default:
				break;
		}
		
		positionX.unshift(parseInt(tempHeadLeft));  //将蛇头位置插入坐标数组，吃到东西就将食物坐标（新蛇头位置）传入数组0位，没吃到就把新蛇头位置放入数组0位然后把之前蛇尾的位置删除即可
		positionY.unshift(parseInt(tempHeadTop));
		//对蛇头进行判断，看是否吃到食物
		if(parseInt(tempHeadLeft) == food.offsetLeft && parseInt(tempHeadTop) == food.offsetTop) {
			//吃到食物蛇身加长1，简单来说就是食物位置变为蛇头，原来的蛇头变为蛇身
			head.style.left = tempHeadLeft + 'px';
			head.style.top = tempHeadTop + 'px';
			var newBody = document.createElement('li');
			firstBody = document.getElementsByClassName('first-body')[0];
			newBody.setAttribute('class','body first-body');
			newBody.style.left = tempLeft + 'px';
			newBody.style.top = tempTop + 'px';
			snake.insertBefore(newBody,firstBody);
			isSuccess(len);
		}
		else {
			positionX.pop();  //没吃到食物，删除原蛇尾坐标
			positionY.pop();
			head.style.left = tempHeadLeft + 'px'; //蛇头移动
			head.style.top = tempHeadTop + 'px';
			
			for(var i = 1; i < len; i ++) {   //蛇身移动
				var tempBodyLeft = parseInt(body[i].offsetLeft),
					tempBodyTop = parseInt(body[i].offsetTop);
				body[i].style.left = tempLeft + 'px';
				body[i].style.top = tempTop + 'px';
				tempLeft = tempBodyLeft;
				tempTop = tempBodyTop;
			}
			var ifIn = false;  //每次移动之后（没吃到食物）都判断蛇头是否和其他部位重合，如果重合则说明咬到自己，游戏结束
			for(var i = 1, len = positionX.length; i < len; i ++) {
				if(parseInt(tempHeadLeft) == positionX[i]) {
					if(parseInt(tempHeadTop) == positionY[i]) {
						ifIn = true;
						break;
					}
				}
			}
			if(ifIn) { //咬到自己
				gameIsOver();
			}
		}
		lastDirection = direction;
	}
}

function stopMove() {  //蛇停止移动
	clearInterval(timer);
}

function gameIsOver() {   
	stopMove();
	over = true;
	gameOver.style.display = 'inline-block';
	setTimeout(function () {
		if(over) {
			gameOver.style.display = 'none';
			gameRestart.style.display = 'inline-block';
		}
	},1500);
}

function isSuccess(successCase) {
	successCase ++ ;
	if(1750 == successCase) { //蛇身满屏！！！！！游戏通关！！！！！
		stopMove();
		over = true;
		gameSuccess.style.display = 'inline-block';
		setTimeout(function () {
			if(over) {
				gameSuccess.style.display = 'none';
				gameRestart.style.display = 'inline-block';
			}
		},1500);
	}
	else {  //没结束就产生新的食物
		produceFood();
	}
}

function dealSpeed(dir) {
	tempDirection = dir - 36;
	if(tempDirection == direction) {  //快速连续按两个不同的按键也会导致firstTime<40,快速切换按键后执行该段程序会因为没有改变direction的值而导致无法转向，为了避免程序出错，应该每次都对其进行判断
		if(firstTime < 50) {
			time ++;
			if(8 == time) {
				stopMove();
				speed = 80;
				move();
			}
		}
	}
	else{
		//if(firstTime > 100) {  //防止快速按下按键导致蛇回头，如原来向右走，在等待speed这么长的时间内快速按下下键和左键，此时tempDirection=1,若直接把1赋值给direction，由于上一次direction=3，等待时间结束后蛇将倒退走，游戏会直接结束。为了避免这种情况，由于在此等待过程speed时间内最少按两个键，因此每个键至少需要间隔speed/2的时间才会被识别
		switch(lastDirection) {
			case 1:
				if(3 != tempDirection) {  //左  不为右
					direction = tempDirection;
				}
				break;
			case 2:		
				if(4 != tempDirection) {  //上  不为下
					direction = tempDirection;
				}
				break;
			case 3:
				if(1 != tempDirection) { //右  不为左
					direction = tempDirection;
				}
				break;
			case 4:
				if(2 != tempDirection) {  //下  不为上
					direction = tempDirection;
				}
				break;
			default:
				break;
		}
	}
	lastTime = new Date().getTime();
}

document.onkeyup = function(e) {
	if(!over && !pause) {
		switch(e.which){  //蛇运动方向判断
			case 37:
			case 38:
			case 39:
			case 40:
				if(80 == speed) {
					time = 0;
					stopMove();
					speed = 200;
					move();	
				}					
				break;
			default:
				break;
		}
	}
}

document.onkeydown = function(e) {
	firstTime = new Date().getTime();
	firstTime -= lastTime;
	if(!over && !pause) {
		switch(e.which){  //蛇运动方向判断
			case 37:
				if(3 != direction) {  //左  不为右
					dealSpeed(e.which);
				}
				break;
			case 38:		
				if(4 != direction) {  //上  不为下
					dealSpeed(e.which);
				}
				break;
			case 39:
				if(1 != direction) { //右  不为左
					dealSpeed(e.which);
				}
				break;
			case 40:
				if(2 != direction) {  //下  不为上
					dealSpeed(e.which);
				}
				break;
			default:
				break;
		}
	}
	if(32 == e.which) {  //space键检测
		if(firstTimeStart) {
			init();
			gameStart.style.display = 'none';
			food.style.display = 'inline-block';
			snake.style.display = 'inline-block';
			firstTimeStart = false;
		}
		else {
			pause = ~ pause;
			if(!over) {
				if(pause) {
					time = 0;
					speed = 200;
					stopMove();
					gamePause.style.display = 'inline-block';
				}
				else {
					gamePause.style.display = 'none';
					move();
				}
			}
			else {
				gameOver.style.display = 'none';
				gameRestart.style.display = 'none';
				gameSuccess.style.display = 'none'; //两种重新开始条件，一共3种提示框，清除其弹窗
				var firstBodys = document.getElementsByClassName('first-body'),
					len = firstBodys.length - 1; //删除添加的first-body元素节点
				for(var i = 0; i < len; i ++) {
					firstBodys[0].remove();
				}
				init();
			}
		}
	}
}