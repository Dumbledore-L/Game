//将queryselectorall封装成函数
function query(elm){
	return document.querySelectorAll(elm);
}

//对象
var initGame={
	//创建和获取元素************************************************
	StartBgPage:query(".Start-bg-page")[0],//初始化界面
	GamePage:query(".game-page")[0],//游戏界面
	gameBgBox:query(".game-bg-box")[0],//游戏背景盒子
	MyPlan:query(".MyPlan")[0],//己方飞机
	StartGame:query(".StartGame")[0],//开始按钮
	//游戏界面分数
	scoreElm:query(".score")[0],
	//初始化为零
	score:0,
	//分值
	points:{
		xiao:10,
		zhong:50,
		da:100
	},
	//飞机生命值
	life:{
		my:3,
		xiao:1,
		zhong:3,
		da:5
	},
	//计时器对象容器，用于控制游戏内的计时器工作状态
	timeBox:{
		bgTB:null,//背景
		enemyTB: null,//小敌机
		mEnemyTB:null,//移动敌机
		mBulletTB:null//移动子弹
	},
	//速度
	speed:{
		bg:1,//背景移动距离
		bgtime:20,//背景移动速度（计时器）
		enemy:3,//敌机移动距离
		enemytime:30,//敌机移动速度（计时器）
		bullet:6,//子弹移动距离
		bullettime:20,//子弹移动速度（计时器）
	},
	//己方飞机位置
	MyPlanObj:{
		x:0,
		y:0
	},





	//游戏难度******************************************************
	gameDifficulty(){
		var _this=this;
		//计数变量，用于判断敌机数量
		var i=0;
		this.timeBox.enemyTB=setInterval(function(){
			//每次创建一架小敌机加一
			_this.createEnemy1(_this);
			i+=1;
			//判断每4架小敌机执行创建一架中敌机
			if(i%4==0){
				//每次创建一架中敌机加一
				_this.createEnemy2(_this);
			};
			//判断每4架中敌机执行创建一架大敌机
			if(i%16==0){
				//每次创建一架大敌机加一
				_this.createEnemy3(_this);
			}
		},1000);
	},




	//开始按钮的方法*******************************************
	StartGameBtn(){
		var myplanposi=document.getElementsByClassName("MyPlan")[0];
		//将指向对象的this保存，因为在事件中this的指向会发生改变，
		//事件 this指向==> 谁调用我，我就指向谁
		var _this=this;
		//开始按钮点击事件
		this.StartGame.onclick=function(){
			myplanposi.style.top="460px";
			myplanposi.style.left="calc(50% - 33px)";
			//将重新开始初的清空敌机和子弹移到这里就可以解决游戏结束时同步击杀的敌机无法移除bug
			var Enemy01=query(".Enemy01");
			//移除依然存在游戏界面的敌机和子弹
			for(let i=0;i<Enemy01.length;i++){
				_this.GamePage.removeChild(Enemy01[i]);
			}
			var Enemy02=query(".Enemy02");
			//移除依然存在游戏界面的敌机和子弹
			for(let i=0;i<Enemy02.length;i++){
				_this.GamePage.removeChild(Enemy02[i]);
			}
			var Enemy03=query(".Enemy03");
			//移除依然存在游戏界面的敌机和子弹
			for(let i=0;i<Enemy03.length;i++){
				_this.GamePage.removeChild(Enemy03[i]);
			}
			var bullet = query(".bullet");
			for(let l=0;l<bullet.length;l++){
				_this.GamePage.removeChild(bullet[l]);
			}
			//开始页面隐藏
			_this.StartBgPage.style.display="none";
			//游戏背景显示
			_this.GamePage.style.display="block";
			//执行初始化
			_this.init()
			//清除鼠标样式
			_this.GamePage.style.cursor="none";
		}
	},




	//移动背景图片********************************************
	MoveBg(){
		var _this=this;
		//默认位置
		var gameBgDef=0;
		//定时器实现移动
		this.timeBox.bgTB=setInterval(function(){
			gameBgDef += _this.speed.bg;
			if(_this.gameBgBox.offsetTop <= -_this.GamePage.offsetHeight){
				gameBgDef=0;
			}
			_this.gameBgBox.style.top = -gameBgDef+"px";
		}, _this.speed.bgtime)
	},




	//移动己方飞机***********************************************
	MoveMyPlan(){
		var _this=this;
		this.GamePage.onmousemove=function(e){
			// e.clientX e.clientY
			// 获取到得是鼠标在页面上的位置
			// 自身的飞机相对于游戏页面进行定位的
			//飞机x轴位置等于鼠标当前位置减去游戏页面距离body的left值
			_this.MyPlanObj.x=e.clientX-_this.GamePage.offsetLeft;
			//鼠标居中定位飞机
			//飞机y轴位置等于鼠标当前位置减去游戏页面距离body的heigh值
			_this.MyPlanObj.y=e.clientY-_this.MyPlan.offsetHeight/2;
			//鼠标居中定位飞机
			//将飞机坐标轴赋值给飞机
			_this.MyPlan.style.left=_this.MyPlanObj.x-_this.MyPlan.offsetWidth/2+"px";
			_this.MyPlan.style.top=_this.MyPlanObj.y+"px";
		}
	},




	//封装子弹，将子弹添加到页面***************************************
	SendBullet(_this){
		//创建元素span
		var elm=document.createElement("span");
		//设置元素的类名
		elm.className="bullet";
		//将封装好的子弹添加到游戏页面
		_this.GamePage.appendChild(elm);
		//设置子弹的缺省坐标
		elm.style.top=_this.MyPlanObj.y-elm.offsetHeight+"px";
		elm.style.left=_this.MyPlanObj.x-elm.offsetWidth/2+1+"px";
	},
	//点击发射子弹
	clickBullet(){
		var _this = this;
		this.GamePage.onmousedown=function(){
			//调用封装子弹,因为此对象在发射函数里面所以需将this传入
			_this.SendBullet(_this)
		}
	},
	//键盘发射子弹
	keySendBullet(){
		var _this = this;
		document.onkeydown=function(e){
		    //e.keyCode是键盘事件其中的对象
			//判断键码条件是否为真
		    if(e.keyCode===74){
				//调用封装子弹
			    _this.SendBullet(_this);
		    }
		}
	},




	//移动子弹**************************************************
	MoveBullet(){
		var _this=this;
		//定时器实现移动
		this.timeBox.mBulletTB=setInterval(function(){
			//获取所有小敌机生命值
			var enemylifeXiao=query(".life-xiao");
			//获取所有中敌机生命值
			var enemylifeZhong=query(".life-zhong");
			//获取所有大敌机生命值
			var enemylifeDa=query(".life-da");
			//获取到所有的子弹
			var bullet=document.querySelectorAll(".bullet");
			//获取到所有的小敌机
			var Enemy01=document.querySelectorAll(".Enemy01");
			//获取到所有的中敌机
			var Enemy02=document.querySelectorAll(".Enemy02");
			//获取到所有的大敌机
			var Enemy03=document.querySelectorAll(".Enemy03");
			//遍历子弹
			for(var i=0;i<bullet.length;i++){
				//获取每一颗子弹的Y轴坐标
				var bulletTop=bullet[i].offsetTop;
				//判断子弹是否超出界限
				if(bulletTop<-bullet[0].offsetHeight){
					//游戏页面移除子弹
					_this.GamePage.removeChild(bullet[i]);
				}
				//移动子弹
				bullet[i].style.top=bulletTop-_this.speed.bullet+"px";
				//遍历所有小敌机
				for(var j=0;j<Enemy01.length;j++){
					//进行碰撞判断
					if(_this.IsCrash(bullet[i],Enemy01[j])){
						//如果处于爆炸阶段，子弹不接触敌机
						if(Enemy01[j].className==="Enemy01 active"){ break; }
						//获取当前敌机的血量
						var enLife=Enemy01[j].getAttribute("data-hp")-1;
						//生命值减一
						Enemy01[j].setAttribute("data-hp",enLife);
						//更新当前敌机的血量
						enemylifeXiao[j].style.width=(enLife/_this.life.xiao)*100+"%";
						//移除子弹
						_this.GamePage.removeChild(bullet[i]);
						//判断敌机血量是否为零
						if(enLife<=0){
							Enemy01[j].className="Enemy01 active";
							//击杀计分
							_this.scoreElm.innerText=_this.score+=_this.points.xiao;
							//延时后移除敌机
							setTimeout(function(){
								//移除敌机
								_this.GamePage.removeChild(Enemy01[j]);
								
							},500)
						}
						return;
					}
				}


				for(var k=0;k<Enemy02.length;k++){
					if(_this.IsCrash(bullet[i],Enemy02[k])){
						//如果处于爆炸阶段，子弹不接触敌机
						if(Enemy02[k].className==="Enemy02 active"){ break; }
						//获取当前敌机的血量
						var enLife=Enemy02[k].getAttribute("data-hp")-1;
						//生命值减一
						Enemy02[k].setAttribute("data-hp",enLife);
						//更新当前敌机的血量
						enemylifeZhong[k].style.width=(enLife/_this.life.zhong)*100+"%";
						_this.GamePage.removeChild(bullet[i]);
						//判断敌机血量是否为零
						if(enLife<=0){
							Enemy02[k].className="Enemy02 active";
							//击杀计分
							_this.scoreElm.innerText=_this.score+=_this.points.zhong;
							//延时后移除敌机
							setTimeout(function(){
								//移除敌机
								_this.GamePage.removeChild(Enemy02[k]);
							},500)
						}
						return;
					}
				}


				for(var l=0;l<Enemy03.length;l++){
					if(_this.IsCrash(bullet[i],Enemy03[l])){
						//如果处于爆炸阶段，子弹不接触敌机
						if(Enemy03[l].className==="Enemy03 active"){ break; }
						//获取当前敌机的血量
						var enLife=Enemy03[l].getAttribute("data-hp")-1;
						//生命值减一
						Enemy03[l].setAttribute("data-hp",enLife);
						//更新当前敌机的血量
						enemylifeDa[l].style.width=(enLife/_this.life.da)*100+"%";
						_this.GamePage.removeChild(bullet[i]);
						//判断敌机血量是否为零
						if(enLife<=0){
							Enemy03[l].className="Enemy03 active";
							//击杀计分
							_this.scoreElm.innerText=_this.score+=_this.points.da;
							//延时后移除敌机
							setTimeout(function(){
								//移除敌机
								_this.GamePage.removeChild(Enemy03[l]);
							},500)
						}
						return;
					}
				}
			}
		},this.speed.bullettime);
	},




	//碰撞检测(子弹与敌机，敌机与本机)
	IsCrash(blt,ey1){
		//获取子弹当前距离游戏界面上下左右的各个位置，产生子弹有效碰撞范围用以判断
			//获取子弹距离游戏页面top,left的距离
		var bltTop=blt.offsetTop,
			bltLeft=blt.offsetLeft,
			//获取子弹距离游戏页面bottom,right的距离
			bltBottom=blt.offsetTop+blt.offsetHeight,
			bltRight=blt.offsetLeft+blt.offsetWidth;
		//获取小敌机当前距离游戏界面上下左右的各个位置，产生小敌机有效碰撞范围用以判断
			//获取小敌机距离游戏页面top,left的距离
		var ey1Top=ey1.offsetTop,
			ey1Left=ey1.offsetLeft,
			//获取小敌机距离游戏页面bottom,right的距离
			ey1Bottom=ey1.offsetTop+ey1.offsetHeight,
			ey1Right=ey1.offsetLeft+ey1.offsetWidth;
		//因为子弹和敌机的坐标都是基于距离游戏页面的top，left产生，即判断他们是否重叠即可
			//例如：子弹的顶部是300，敌机的底部是200，只有子弹<=敌机才会产生重叠
		//判断子弹的顶部有效范围是否和敌机底部有效范围产生重叠(碰撞)
		//判断子弹的左侧有效范围是否和敌机右侧有效范围产生重叠(碰撞)
		//判断子弹的右侧有效范围是否和敌机左侧有效范围产生重叠(碰撞)
		//最后一个判断保证了子弹在敌机后方(并未发生碰撞的情况下)不会影响前面的敌机
		//判断子弹的底部有效范围是否和敌机顶有效范围产生重叠(碰撞)
		if(bltTop <= ey1Bottom && bltLeft <= ey1Right && bltRight >= ey1Left && bltBottom >= ey1Top){
			return true;
		}
	},






	//获取某个范围内的随机数****************************************
	Random(min,max){
		return Math.floor(Math.random()*(max-min)+min);//随机生成敌机出现位置x轴
	},





	//生成小敌机***************************************************
	createEnemy1(_this){
			var elm=document.createElement("div");
			elm.className="Enemy01";
			elm.setAttribute("data-hp",this.life.xiao);
			elm.innerHTML=`<div class="life-box-xiao"><span class="life-xiao"></span></div>`
			this.GamePage.appendChild(elm);
			//获取随机的x轴坐标范围
			//范围是0到游戏页面宽度减去敌机宽度(为了不让敌机超出游戏页面)
			var randomX=this.Random(0,this.GamePage.offsetWidth-elm.offsetWidth);
			//敌机一开始的坐标
			elm.style.top=-elm.offsetHeight+"px";
			elm.style.left=randomX+"px";
	},





	//生成中敌机******************************************************
	createEnemy2(_this){
			var elm=document.createElement("div");
			elm.className="Enemy02";
			elm.setAttribute("data-hp",this.life.zhong);
			elm.innerHTML=`<div class="life-box-zhong"><span class="life-zhong"></span></div>`
			_this.GamePage.appendChild(elm);
			//获取随机的x轴坐标范围
			//范围是0到游戏页面宽度减去敌机宽度(为了不让敌机超出游戏页面)
			var randomX=_this.Random(0,_this.GamePage.offsetWidth-elm.offsetWidth);
			//敌机一开始的坐标
			elm.style.top=-elm.offsetHeight+"px";
			elm.style.left=randomX+"px";
	},





	//生成大敌机*******************************************************
	createEnemy3(_this){
			var elm=document.createElement("div");
			elm.className="Enemy03";
			elm.setAttribute("data-hp",this.life.da);
			elm.innerHTML=`<div class="life-box-da"><span class="life-da"></span></div>`
			_this.GamePage.appendChild(elm);
			//获取随机的x轴坐标范围
			//范围是0到游戏页面宽度减去敌机宽度(为了不让敌机超出游戏页面)
			var randomX=_this.Random(0,_this.GamePage.offsetWidth-elm.offsetWidth);
			//敌机一开始的坐标
			elm.style.top=-elm.offsetHeight+"px";
			elm.style.left=randomX+"px";
	},





	//移动敌机**********************************************************
	MoveEnemy(){
		var _this=this;
		var mylife=this.life.my;
		//定时器实现移动
		this.timeBox.mEnemyTB=setInterval(function(){
			//获取到所有的小敌机
			var Enemy01=document.querySelectorAll(".Enemy01");
			//遍历小敌机
			for(var i=0;i<Enemy01.length;i++){

				//获取每一个敌机的Y轴坐标
				var Enemy01Top=Enemy01[i].offsetTop;
				//将超出界限敌机移除
				if(Enemy01Top>Enemy01[0].offsetHeight+_this.GamePage.offsetHeight){
					_this.GamePage.removeChild(Enemy01[i]);
				}
				//如果敌机处于爆炸阶段，敌机停止移动
				if(Enemy01[i].className==="Enemy01 active"){ continue; }
				//如果与敌机发生碰撞
				if(_this.IsCrash(_this.MyPlan,Enemy01[i])){
					//扣血并移除敌机
					mylife--;
					_this.GamePage.removeChild(Enemy01[i]);
					//判断己方血量是否为零
					if(mylife<=0){
						//游戏结束
						_this.GamePage.style.cursor="auto";
						_this.GameOver();
					}
				}
				Enemy01[i].style.top=Enemy01Top+_this.speed.enemy+"px";
			};


			//中敌机
			var Enemy02=document.querySelectorAll(".Enemy02");
			for(var i=0;i<Enemy02.length;i++){
				var Enemy02Top=Enemy02[i].offsetTop;
				if(Enemy02Top>Enemy02[0].offsetHeight+_this.GamePage.offsetHeight){
					_this.GamePage.removeChild(Enemy02[i]);
				}

				//如果敌机处于爆炸阶段，敌机停止移动
				if(Enemy02[i].className==="Enemy02 active"){ continue; }
				//如果与敌机发生碰撞
				if(_this.IsCrash(_this.MyPlan,Enemy02[i])){
					//扣血并移除敌机
					mylife--;
					_this.GamePage.removeChild(Enemy02[i]);
					//判断己方血量是否为零
					if(mylife<=0){
						//游戏结束
						_this.GamePage.style.cursor="auto";
						_this.GameOver();
					}
				}

				Enemy02[i].style.top=Enemy02Top+3+"px";
			};


			//大敌机
			var Enemy03=document.querySelectorAll(".Enemy03");
			for(var i=0;i<Enemy03.length;i++){
				var Enemy03Top=Enemy03[i].offsetTop;
				if(Enemy03Top>Enemy03[0].offsetHeight+_this.GamePage.offsetHeight){
					_this.GamePage.removeChild(Enemy03[i]);
				}
				//如果敌机处于爆炸阶段，敌机停止移动
				if(Enemy03[i].className==="Enemy03 active"){ continue; }
				//如果与敌机发生碰撞
				if(_this.IsCrash(_this.MyPlan,Enemy03[i])){
					//扣血并移除敌机
					mylife--;
					_this.GamePage.removeChild(Enemy03[i]);
					//判断己方血量是否为零
					if(mylife<=0){
						//游戏结束
						_this.GamePage.style.cursor="auto";
						_this.GameOver();
					}
				}
				Enemy03[i].style.top=Enemy03Top+3+"px";
			}
		},this.speed.enemytime);
	},




	//游戏结束
	GameOver(){
		//本机停止移动，停止发射子弹，停止键盘发射子弹
		this.GamePage.onmousemove=this.GamePage.onmousedown=document.onkeydown=null;
		clearInterval(this.timeBox.bgTB);// 清除移动背景图片的定时器
		clearInterval(this.timeBox.enemyTB);// 清除生成敌机的定时器
		clearInterval(this.timeBox.mEnemyTB);// 清除移动敌机的定时器
		clearInterval(this.timeBox.mBulletTB);// 清除移动子弹的定时器
		this.life.my=3;//重置生命值
		// 游戏结束框
		var div = document.createElement("div");
		div.className = "over";
		// "<div>"+i+"</div>" + "<div>"+i+"</div>"
		// ES6 模板语法
		div.innerHTML = `
		<h4>历史最高：<span>${this.score}</span><br/>分数：<span class="score">${this.score}</span></h4>
		<button class="AgainGame">重新开始游戏</button>
		`;
		this.GamePage.appendChild(div);
		this.NewGame();// 重新开始游戏按钮
	},




	// 重新开始游戏按钮
	NewGame(){
		var AgainGame=query(".AgainGame")[0];// 获取开始游戏按钮
		var _this=this;
		AgainGame.onclick=function(){
			_this.score=0;// 清空分数
			_this.scoreElm.innerText=0;
			_this.GamePage.style.display="none";// 隐藏游戏界面，显示开始界面
			_this.StartBgPage.style.display="block";
			_this.GamePage.removeChild(AgainGame.parentNode);// 移除结算框
		}
	},





	// 检查用户是否离开页面
	isPage(){
		var _this = this;
		document.addEventListener('visibilitychange', function () {
			if(_this.life.my <= 0){ return; };// 检测游戏是否已经结束
			document.hidden ? clearInterval(_this.timeBox.enemyTB) : _this.gameDifficulty();// 检测用户如果离开页面，停止生成敌机，如果用户重新进入页面，继续生成敌机
		})
	},





	//初始化****************************************************
	//调用需运行的对象
	init(){
		//移动背景图片
		this.MoveBg();
		//移动己方飞机
		this.MoveMyPlan();
		//点击发射子弹
		this.clickBullet();
		//键盘发射子弹
		this.keySendBullet();
		//移动子弹
		this.MoveBullet();
		//游戏难度
		this.gameDifficulty();
		//移动敌机
		this.MoveEnemy();
		//检测用户是否离开页面
		this.isPage()
	}
}
//调用initGame对象的开始按钮函数************************************
initGame.StartGameBtn();