// Глобальные переменные

let buttonsStatus;
let currentPlayer = 0; // Номер текущего игрока
let gameRolled = false; // Выбрана ли игра (можно ли крутить колесо)
let pastPlayer; // Номер прошлого игрока
let gameNum;
let step=0; // Порядковый номер текущей игры (без учета периодов)
let currentPeriod = 1; // Временной отрезок текущей игры
let currentGame = -1; // Номер игры для учета статистики
let currentRolledGame;
let gameStartDate; // Время начала
let gameFinishDate; // Время конца
let iventSteps = []; // Статистика периодов 
let periodXCord = 1; // Координата Х отрезка для интерфейса
let rollOrReroll = 0;
let currentTimer = '';
let timerOn = false;
let storage = window.localStorage;
let currentShownStep = 0;
let nightMode = false;

// Эллементы интерфейса из DOM
let finish 				= document.getElementById('finishButton');
let stopwatch   		= document.getElementById("stopwatch");
let progressBarPlayers 	= document.getElementById('progressBarPlayers');
let whell 				= document.getElementById('whell');
let rollWheel 			= document.getElementById('rollWheel');
let startNew 			= document.getElementById('startNewGame');
let startPause 			= document.getElementById('startGame');
let switchPl 			= document.getElementById('switchPlayer');
let switchMenu 			= document.getElementById('switchPlayerMenu');
let completeGame 		= document.getElementById('completeGame');
let dropGame 			= document.getElementById('dropGame');
let rerollGame 			= document.getElementById('rerollGame');
let gameName 			= document.getElementById("gameNameLabel");
let gameReleaseYear 	= document.getElementById("gameYearLabel");
let periodBarSvg 		= document.getElementById("periodBarSvg");
let gameInfoModalWindow = document.getElementById("modalInfo");
let modalGameInfoInsert = document.getElementById('modalGameInfo');
let modalImageSrc  		= document.getElementById('modalGameImage');
let modalGameFooter 	= document.getElementById('modalFooter');
let headerScore			= document.getElementById('headerScore');
let metaScore 			= document.getElementById('metaScore');
let userScore 			= document.getElementById('userScore');
let hltbButton 			= document.getElementById('hltbButton');
let steamButton 		= document.getElementById('steamSearchButton');
let startButton 		= document.getElementById('startGame');
let soundButton			= document.getElementById('soundButton');
let steamLink			= document.getElementById('steamLink');
let HLTBLink			= document.getElementById('HLTBLink');
let headerButtons		= document.getElementById('headerButtons');
let modalGameInfoInsert2= document.getElementById('modalGameDesc');
let modalGameInfoInsert3= document.getElementById('modalGameHeader');
let aside				= document.getElementById('asideMenu');





// Объект информации о периоде
function stepData (game, status, period, iventStep, players, startDate, finishDate){
	this.game = game;
	this.gameStatus = status;
	this.gamePeriod = period;
	this.step = iventStep;
	this.players = players;
	this.startDate = startDate;
	this.finishDate = finishDate!=undefined?finishDate:'Unfinished';

	let time = new TIME();
	for (let i = 0; i<players.length; i++) time.add(players[i].totalTime[this.step]);
	this.totalTime = time;
}

// Объект времени
function TIME(h = 0, m = 0, s = 0, ms = 0) {
	let S = Math.trunc(ms/100);
	this.miliseconds = ms%100;
	s+=S;

	let M = Math.trunc(s/60);
	this.seconds = s%60;
	m+=M;

	let H = Math.trunc(m/60);
	this.minutes = m%60;
	h+=H;

	this.hours = h;

  this.toStr = function (){
	let timeStr = "";
	timeStr+= this.hours>=10?this.hours:"0"+this.hours;
	timeStr+=":";
	timeStr+= this.minutes>=10?this.minutes:"0"+this.minutes;
	timeStr+=":";
	timeStr+= this.seconds>=10?this.seconds:"0"+this.seconds;
	return timeStr;
	}

 	this.add = function (t){
	let S = Math.trunc((this.miliseconds+t.miliseconds)/100);
	this.miliseconds = (this.miliseconds+t.miliseconds)%100;
	this.seconds+=S;

	let M = Math.trunc((this.seconds+t.seconds)/60);
	this.seconds = (this.seconds+t.seconds)%60;
	this.minutes+=M;

	let H = Math.trunc((this.minutes+t.minutes)/60);
	this.minutes = (this.minutes+t.minutes)%60;
	this.hours+=H;

	this.hours = this.hours+t.hours;
	return new TIME(this.hours, this.minutes, this.seconds, this.miliseconds);
	}

	this.sub = function (t) {
		let thisT = this.hours*360000 + this.minutes* 6000 + this.seconds*100 + this.miliseconds;
		let tT = t.hours*360000 + t.minutes* 6000 + t.seconds*100 + t.miliseconds;
		let newT = thisT-tT;

		let h,m,s,ms;
		h = Math.trunc(newT/360000);
		newT-= h*360000;

		m = Math.trunc(newT/6000);
		newT-= m*6000;

		s = Math.trunc(newT/100);
		newT-= s*100;

		ms = newT;

		return (new TIME(h,m,s,ms));
	}
	this.deepCopy = function(h = 0, m = 0, s = 0, ms = 0) {
		this.hours = h; this.minutes = m; this.seconds = s; this.miliseconds = ms;
	}

	this.toArray = function() {
		return [this.hours,this.minutes,this.seconds,this.miliseconds];
	}
	this.toInt = function() {
		return 1000000 * this.hours +  10000 * this.minutes  + 100 * this.seconds + this.miliseconds;
	}
}
// Переменные времени
let swTimeStart  = new TIME();
let swTimeFinish = new TIME();

// Парсер строки в объект времени
function parseTime (timeStr){
	let h,m,s,ms;
	h  = parseInt(timeStr.substring(0, 2));
	m  = parseInt(timeStr.substring(3, 5));
	s  = parseInt(timeStr.substring(6, 8));
	return new TIME (h,m,s,0);
}


function upFirst(str) {
	let f = str.charAt(0).toUpperCase();
    return f + str.substr(1, str.length-1);
}

function removeSpace(str) {
	let len = str.length;
	let result = '';
	for (let i = 0; i < len; i++) {
		if (str.charAt(i)!=' ') result+=str.charAt(i);
	}
	return result;
}