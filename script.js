//各種定義
var wall = new Image();
wall.src = "wall.png";
var hero = new Image();
hero.src = "hero.jpg";
var monster = new Image();
monster.src = "monster.png";
var heropara = { x : 0 , y : 0 , hp : 100 , mp : 0 };
var enemypara = { x : 300 , y : 300 , hp : 100 , mp : 0 , life : true};
var enemypara2 = { x : 500 , y : 500 , hp : 100 , mp : 0 , life : true};
var enemypara3 = { x : 700 , y : 700 , hp : 100 , mp : 0 , life : true};
var enemyarray = [enemypara, enemypara2, enemypara3];
var battlecheck = false;
var battleenemy;
var enemycheck = 5;
document.onkeydown = keydown;


//------------------------------------------------------canvas設定
$(function () {
	sizing();
	$(window).resize(function() {
		sizing();
	});
});

function sizing(){
	$("#main").attr({height:$("#wrapper").height()});
	$("#main").attr({width:$("#wrapper").width()});
}
//------------------------------------------------------canvas設定

$(document).ready( function(){ //サイト起動時の処理
	var canvas = document.getElementById('main');
	var ctx = canvas.getContext('2d');
	for (let i = 0; i < enemyarray.length; i++) {
		ctx.drawImage(monster, enemyarray[i].x, enemyarray[i].y, 50, 50);
	}
	ctx.drawImage(hero, heropara.x, heropara.y, 50, 50);
	});


function keydown() { //キーイベント関数
	if (battlecheck) {
		return;
	}
	var keyname = event.keyCode;
	$("#battlemessage").html("");
	$("#heroparameters").html("");
	$("#enemyparameters").html("");
	var canvas = document.getElementById('main');
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, $("#wrapper").width(), $("#wrapper").height());
	for (let i = 0; i < enemyarray.length; i++) {
		if (enemyarray[i].life) {
			ctx.drawImage(monster, enemyarray[i].x, enemyarray[i].y, 50, 50);
		}
	}
	switch (keyname) {
		case 37: //左矢印
			heropara.x -= 50;
			break;
		
		case 38: //上矢印
			heropara.y -= 50;
			break;

		case 39: //右矢印
			heropara.x += 50;
			break;

		case 40: //下矢印
			heropara.y += 50;
			break;

		default:
			break;
	}
	ctx.drawImage(hero, heropara.x, heropara.y, 50, 50);
	for (let i = 0; i < enemyarray.length; i++) {
		if (heropara.x === enemyarray[i].x && heropara.y === enemyarray[i].y && enemyarray[i].life) {
			ctx.clearRect(0, 0, $("#wrapper").width(), $("#wrapper").height());
			battleenemy = enemyarray[i];
			enemycheck = i;
			battlephase();
		}
	}
}

function battlephase() { //戦闘開始関数
	battlecheck = true;
	var canvas = document.getElementById('main');
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, $("#wrapper").width(), $("#wrapper").height());
	//$('body').css('background-image', 'url(wall.png)');
	$("#battlemessage").html("スライムが現れた！");
	$("#attack").html("こうげき");
	$("#attackmagic").html("こうげきまほう");
	$("#recoverymagic").html("かいふくまほう");
}

function commandfun(command) { //コマンド実行関数
	var ecommand = Math.floor(Math.random() * 3);
	var hero = damagecalc(command, heropara, battleenemy);
	heropara = hero[2];
	battleenemy = hero[3];
	$("#heroparameters").html("勇者HP:" + heropara.hp + "MP:" + heropara.mp);
	$("#enemyparameters").html("スライムHP:" + battleenemy.hp + "MP:" + battleenemy.mp);
	if (hero[0] === 3) {
		$("#battlemessage").html("スライムは倒れた！<br>矢印キーでマップに戻る");
		$("#attack").html("");
		$("#attackmagic").html("");
		$("#recoverymagic").html("");
		battlecheck = false;
		battleenemy.life = false;
		enemyarray[enemycheck] = battleenemy;
		return;
	}
	var enemy = damagecalc(ecommand, battleenemy, heropara);
	heropara = enemy[3];
	battleenemy = enemy[2];
	heromessage(hero[0], hero[1], command);
	enemymessage(enemy[0], enemy[1], ecommand);
	$("#heroparameters").html("勇者HP:" + heropara.hp + "MP:" + heropara.mp);
	$("#enemyparameters").html("スライムHP:" + battleenemy.hp + "MP:" + battleenemy.mp);
	if (enemy[0] === 3) {
		$("#battlemessage").html("勇者は倒れた！<br>GAMEOVER");
		$("#attack").html("");
		$("#attackmagic").html("");
		$("#recoverymagic").html("");
		return;
	}
}

function damagecalc(command, mypara, yourpara) { //ダメージ計算
	var hitcheck = 0;
	var damage = 0;
	var random = Math.floor(Math.random() * 11);
	if (command === 0) {
		damage = 20 + random;
		yourpara.hp -= damage;
	}
	else if (command === 1) {
		if (mypara.mp < 2) {
			hitcheck = 1;
		} else {
			damage = 30 + random;
			yourpara.hp -= damage;
			mypara.mp -= 2;
		}
	}
	else if (command === 2) {
		if (mypara.mp < 2) {
			hitcheck = 2;
		} else {
			damage = 30 + random;
			mypara.hp += damage;
			mypara.mp -= 2;
		}
	}
	if (yourpara.hp < 0) {
		yourpara.hp = 0;
		hitcheck = 3
	}
	return [hitcheck, damage, mypara, yourpara];
}

function heromessage(hitcheck, damage, command) {
	if (hitcheck === 1) {
		$("#battlemessage").html("勇者はメラを唱えた！しかしMPが足りなかった。<br>");
	}
	else if (hitcheck === 2) {
		$("#battlemessage").html("勇者はホイミを唱えた！しかしMPが足りなかった。<br>");
	}
	else if (command === 0) {
		$("#battlemessage").html("勇者のこうげき！スライムに" + damage + "のダメージ<br>");
	}
	else if (command === 1) {
		$("#battlemessage").html("勇者はメラを唱えた！スライムに" + damage + "のダメージ<br>");
	}
	else if (command === 2) {
		$("#battlemessage").html("勇者はホイミを唱えた！勇者は" + damage + "回復した！<br>");
	}
}

function enemymessage(hitcheck, damage, command) {
	if (hitcheck === 1) {
		$("#battlemessage").append("スライムはメラを唱えた！しかしMPが足りなかった。");
	}
	else if (hitcheck === 2) {
		$("#battlemessage").append("スライムはホイミを唱えた！しかしMPが足りなかった。");
	}
	else if (command === 0) {
		$("#battlemessage").append("スライムのこうげき！勇者に" + damage + "のダメージ");
	}
	else if (command === 1) {
		$("#battlemessage").append("スライムはメラを唱えた！勇者に" + damage + "のダメージ");
	}
	else if (command === 2) {
		$("#battlemessage").append("スライムはホイミを唱えた！スライムは" + damage + "回復した！");
	}
}