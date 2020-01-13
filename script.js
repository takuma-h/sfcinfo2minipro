//各種定義
var hero = new Image();
hero.src = "hero.png";
var heropara = { x : 0 , y : 0 , hp : 300 , mp : 20 , pdamage : 20 , mdamage : 30 , healpoint : 30};
var battlecheck = false;
var battleenemy;
var enemycheck = 5;
document.onkeydown = keydown;

//--------------------------------------------------------------------------------------------モンスター初期設定ここから
class monster {
	constructor(x, y, hp, mp, pdamage, mdamage, healpoint, image, name) {
		this.x = x;
		this.y = y;
		this.hp = hp;
		this.mp = mp;
		this.pdamage = pdamage;
		this.mdamage = mdamage;
		this.healpoint = healpoint;
		this.image = new Image();
		this.image.src = image;
		this.name = name;
		this.life = true;
	}
}

var enemypara = new monster(300, 300, 100, 0, 20, 30, 30, 'monster.png', 'スライム');
var enemypara2 = new monster(500, 500, 200, 20, 20, 30, 30, 'monster2.png', 'ドラゴン');
var enemypara3 = new monster(400, 200, 100, 0, 20, 30, 30, 'monster.png', 'スライム');
var enemyarray = [enemypara, enemypara2, enemypara3];
//--------------------------------------------------------------------------------------------モンスター初期設定ここまで

//------------------------------------------------------canvas設定ここから
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
//------------------------------------------------------canvas設定ここまで

$(document).ready( function(){ //サイト起動時の処理
	var canvas = document.getElementById('main');
	var ctx = canvas.getContext('2d');
	$('body').css('background-image', 'url(map.png)');
	for (let i = 0; i < enemyarray.length; i++) {
		ctx.drawImage(enemyarray[i].image, enemyarray[i].x, enemyarray[i].y, 50, 50);
	}
	ctx.drawImage(hero, heropara.x, heropara.y, 50, 50);
	});


function keydown() { //キーイベント関数
	if (battlecheck) {
		return;
	}
	messagereset();
	var keyname = event.keyCode;
	$("#battlemessage").html("");
	$("#heroparameters").html("");
	$("#enemyparameters").html("");
	var canvas = document.getElementById('main');
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, $("#wrapper").width(), $("#wrapper").height());
	$('body').css('background-image', 'url(map.png)');
	for (let i = 0; i < enemyarray.length; i++) {
		if (enemyarray[i].life) {
			ctx.drawImage(enemyarray[i].image, enemyarray[i].x, enemyarray[i].y, 50, 50);
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
	$('body').css('background-image', 'url(battleback.jpeg)');
	ctx.drawImage(hero, 100, 250, 200, 200);
	ctx.drawImage(battleenemy.image, $("#wrapper").width() - 300, 100, 200, 200);
	$("#battlemessage").html(battleenemy.name + "が現れた！");
	$("#heroparameters").html("勇者<br>HP:" + heropara.hp + "MP:" + heropara.mp);
	$("#enemyparameters").html(battleenemy.name + "<br>HP:" + battleenemy.hp + "MP:" + battleenemy.mp);
	$("#attack").html("こうげき");
	$("#attackmagic").html("こうげきまほう");
	$("#recoverymagic").html("かいふくまほう");
	$('#command').css({
		'border':'5px solid white',
		'background-color':'black',
	});
	$('#battlemessage').css({
		'border':'5px solid white',
		'background-color':'black',
	});
	$('#parameters').css({
		'border':'5px solid white',
		'background-color':'black',
	});
}

function commandfun(command) { //コマンド実行関数
	var ecommand = Math.floor(Math.random() * 3);
	var battlearray = damagecalc(command, heropara, battleenemy);
	$("#heroparameters").html("勇者<br>HP:" + heropara.hp + "MP:" + heropara.mp);
	$("#enemyparameters").html(battleenemy.name + "<br>HP:" + battleenemy.hp + "MP:" + battleenemy.mp);
	heromessage(battlearray[0], battlearray[1], command, battleenemy.name);
	if (battlearray[0] === 3) {
		$("#battlemessage").append(battleenemy.name + "は倒れた！<br>矢印キーでマップに戻る");
		$("#attack").html("");
		$("#attackmagic").html("");
		$("#recoverymagic").html("");
		battlecheck = false;
		battleenemy.life = false;
		enemyarray[enemycheck] = battleenemy;
		return;
	}
	battlearray = damagecalc(ecommand, battleenemy, heropara, battleenemy.name);
	enemymessage(battlearray[0], battlearray[1], ecommand, battleenemy.name);
	$("#heroparameters").html("勇者<br>HP:" + heropara.hp + "MP:" + heropara.mp);
	$("#enemyparameters").html(battleenemy.name + "<br>HP:" + battleenemy.hp + "MP:" + battleenemy.mp);
	if (battlearray[0] === 3) {
		$("#battlemessage").append("勇者は倒れた！<br>GAMEOVER");
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
		damage = mypara.pdamage + random;
		yourpara.hp -= damage;
	}
	else if (command === 1) {
		if (mypara.mp < 2) {
			hitcheck = 1;
		} else {
			damage = mypara.mdamage + random;
			yourpara.hp -= damage;
			mypara.mp -= 2;
		}
	}
	else if (command === 2) {
		if (mypara.mp < 2) {
			hitcheck = 2;
		} else {
			damage = mypara.healpoint + random;
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

function heromessage(hitcheck, damage, command, name) {
	if (hitcheck === 1) {
		$("#battlemessage").html("勇者はメラを唱えた！しかしMPが足りなかった。<br>");
	}
	else if (hitcheck === 2) {
		$("#battlemessage").html("勇者はホイミを唱えた！しかしMPが足りなかった。<br>");
	}
	else if (command === 0) {
		$("#battlemessage").html("勇者のこうげき！" + name + "に" + damage + "のダメージ<br>");
	}
	else if (command === 1) {
		$("#battlemessage").html("勇者はメラを唱えた" + name + "に" + damage + "のダメージ<br>");
	}
	else if (command === 2) {
		$("#battlemessage").html("勇者はホイミを唱えた！勇者は" + damage + "回復した！<br>");
	}
}

function enemymessage(hitcheck, damage, command, name) {
	if (hitcheck === 1) {
		$("#battlemessage").append(name + "はメラを唱えた！しかしMPが足りなかった。");
	}
	else if (hitcheck === 2) {
		$("#battlemessage").append(name + "はホイミを唱えた！しかしMPが足りなかった。");
	}
	else if (command === 0) {
		$("#battlemessage").append(name + "のこうげき！勇者に" + damage + "のダメージ");
	}
	else if (command === 1) {
		$("#battlemessage").append(name + "はメラを唱えた！勇者に" + damage + "のダメージ");
	}
	else if (command === 2) {
		$("#battlemessage").append(name + "はホイミを唱えた！" + name + "は" + damage + "回復した！");
	}
}

function messagereset() {
	$('#command').css({
		'border':'initial',
		'background-color':'initial',
	});
	$('#battlemessage').css({
		'border':'initial',
		'background-color':'initial',
	});
	$('#parameters').css({
		'border':'initial',
		'background-color':'initial',
	});
}