window.onload =()=> {
	buttonsStatus = storage.buttonsStatus;
	currentPlayer = 0;
	switchPl.setAttribute('style', "background: url("+players[0].img+"); background-size: cover;");
	try{
	loadFromStorageCurrentGameInfo();
	loadFromStorageTimerInfo();
	loadFromStorage();
	console.log("Game loaded from past data!");

	nightMode = storage.nightMode=='false'?false:true
	console.log(nightMode)
	UIApplyDayMode(nightMode)
	setTimeout(()=>document.getElementById('preloader').setAttribute('style','display: none'),500)
}
catch {console.log("Game started from new data!"); setTimeout(()=>document.getElementById('preloader').setAttribute('style','display: none'),500)}
	
}

function storageTimer() {
	storage.setItem('stopwatch',currentTimer);
	storage.setItem('timerOn',timerOn);
	storage.setItem('timerStatus',   activate);

}



function storageIventStepsChange() {
	storage.setItem('players',JSON.stringify(players));
	storage.setItem('iventSteps',JSON.stringify(iventSteps));
	storage.setItem('step',step);
	storage.setItem('currentPeriod',currentPeriod);
	storage.setItem('currentPlayer',currentPlayer);
	storage.setItem('currentGame',currentGame);
	storage.setItem('stopwatch',stopwatch.textContent);
	storage.setItem('currentRolledGame',JSON.stringify(currentRolledGame));
	storage.setItem('rollOrReroll',rollOrReroll);
	storage.setItem('UIButtonsStatus',buttonsStatus);
}


function loadFromStorageCurrentGameInfo () {
	currentRolledGame = JSON.parse(storage.currentRolledGame);
	UIGameInfoOnBackground(currentRolledGame);
}

function loadFromStorageTimerInfo () {
	stopwatch.textContent = storage.stopwatch
	activate = storage.timerStatus
	timerOn = storage.timerOn

	if (timerOn==true) {
		startTIME();
	}
	UISmoothOpen(null,stopwatch);
}

function loadFromStorageWhellInfo (){
	rollOrReroll = parseInt(storage.getItem('rollOrReroll'));
}


function loadFromStorage() {
	buttonsStatus = storage.UIButtonsStatus
	var playersTmp = JSON.parse(storage.getItem('players'));
	for (let i = 0; i < playersTmp.length; i++){
		players[i].name = playersTmp[i].name;
		players[i].img = playersTmp[i].img;
		for(let j = 0; j < playersTmp[i].totalTime.length; j++){
			players[i].totalTime[j] = new TIME(playersTmp[i].totalTime[j].hours, playersTmp[i].totalTime[j].minutes, playersTmp[i].totalTime[j].seconds, playersTmp[i].totalTime[j].miliseconds);	
		}
	}
	volumeMultiplayer = storage.musicMode;
	volumeMultiplayer==0?soundButton.classList.add('offMusic'):soundButton.classList.remove('offMusic');
	step = parseInt(storage.getItem('step'));
	currentPeriod = parseInt(storage.getItem('currentPeriod'));
	currentPlayer = parseInt(storage.getItem('currentPlayer'));
	currentGame = parseInt(storage.getItem('currentGame'));
	rollConfig.minYear = periodStartYear[currentPeriod<1?0:currentPeriod-1];
	rollConfig.maxYear = periodFinishYear[currentPeriod<1?0:currentPeriod-1];

	let iventStepsTmp = JSON.parse(storage.getItem('iventSteps'));
	let plArray = new Array();
	for (let j = 0; j < players.length; j++){
		plArray.push(players[j]);
	}
	for (let i = 0; i < step; i++) {
		iventSteps[i] = new stepData(iventStepsTmp[i].game, iventStepsTmp[i].gameStatus,parseInt(iventStepsTmp[i].gamePeriod),parseInt(iventStepsTmp[i].step),plArray, new Date(iventStepsTmp[i].startDate), new Date(iventStepsTmp[i].finishDate));
	}
	switchPl.setAttribute('style', "background: url("+players[currentPlayer].img+"); background-size: cover;");
	redrawProgressBar();
	loadFromStorageCurrentGameInfo();
	loadFromStorageWhellInfo();
	loadFromStorageTimerInfo ();
	UIButtonStatus(parseInt(storage.buttonsStatus));
}




function redrawProgressBar() {
	for (let i = 0; i < step; i++){
		addPeriod(iventSteps[i].gameStatus, i, iventSteps[i].gamePeriod, true);
	}
}

function clearStorage() {
	storage.clear();
	location.reload();
}