//各種定義
var wall = new Image();
wall.src = "wall.png";
var hero = new Image();
hero.src = "hero.jpg";
var monster = new Image();
monster.src = "monster.png";
var coordinate = { x : 0 , y : 0 };
var enemycoo = { x1 : 300 , y1 : 300};
var heropara = { hp : 100 , mp : 0 };
var enemypara = { hp : 100 , mp : 0 , life : true};
var battlecheck = false;
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
	ctx.drawImage(monster, enemycoo.x1, enemycoo.y1, 50, 50);
	ctx.drawImage(hero, coordinate.x, coordinate.y, 50, 50);
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
	if (enemypara.life) {
		ctx.drawImage(monster, enemycoo.x1, enemycoo.y1, 50, 50);
	}
	switch (keyname) {
		case 37: //左矢印
			coordinate.x -= 50;
			break;
		
		case 38: //上矢印
			coordinate.y -= 50;
			break;

		case 39: //右矢印
			coordinate.x += 50;
			break;

		case 40: //下矢印
			coordinate.y += 50;
			break;

		default:
			break;
	}
	ctx.drawImage(hero, coordinate.x, coordinate.y, 50, 50);	
	if (coordinate.x === enemycoo.x1 && coordinate.y === enemycoo.y1 && enemypara.life) {
		ctx.clearRect(0, 0, $("#wrapper").width(), $("#wrapper").height());
		battlephase(enemypara.hp, enemypara.mp)
	}
}

function battlephase(HP, MP) { //戦闘開始関数
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
	var hero = damagecalc(command, heropara, enemypara);
	heropara = hero[2];
	enemypara = hero[3];
	$("#heroparameters").html("勇者HP:" + heropara.hp + "MP:" + heropara.mp);
	$("#enemyparameters").html("スライムHP:" + enemypara.hp + "MP:" + enemypara.mp);
	if (hero[0] === 3) {
		$("#battlemessage").html("スライムは倒れた！<br>矢印キーでマップに戻る");
		$("#attack").html("");
		$("#attackmagic").html("");
		$("#recoverymagic").html("");
		battlecheck = false;
		enemypara.life = false;
		return;
	}
	var enemy = damagecalc(ecommand, enemypara, heropara);
	heropara = enemy[3];
	enemypara = enemy[2];
	heromessage(hero[0], hero[1], command);
	enemymessage(enemy[0], enemy[1], ecommand);
	$("#heroparameters").html("勇者HP:" + heropara.hp + "MP:" + heropara.mp);
	$("#enemyparameters").html("スライムHP:" + enemypara.hp + "MP:" + enemypara.mp);
	if (enemy[0] === 3) {
		$("#battlemessage").html("勇者は倒れた！");
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