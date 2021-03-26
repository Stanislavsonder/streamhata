function startRoll() {
	if (rollOrReroll!=0) {
    	startNewGameFn();
        finishGameButton();
        rerolGameFn();
    }
    playMusic();
    UIGameInfoOnBackgroundClose();
    UIButtonStatus(0); 
    storage.buttonsStatus = 1;
	rollOrReroll++;
	storage.setItem('rollOrReroll',rollOrReroll);
	totalUpdate();
	UIAsideMenu(games)
	stopwatch.textContent = '00:00:00'
	currentRolledGame = games[Math.floor((roll()+sections.length-2)%sections.length)];
    rollWheel.setAttribute("disabled","disabled");

    for (let i = 0; i < players.length; i++) {
        players[i].totalTime.push(new TIME());
    } 
   	storageIventStepsChange();
    setTimeout(function() { 
    	stopMusic();
		UIGameInfoOnBackground(currentRolledGame);
		UIButtonStatus(2);
        rollWheel.removeAttribute("disabled");
       	storage.setItem('currentRolledGame',JSON.stringify(currentRolledGame));
           }, rollConfig.rollDuration);
	return gameNum;
}

// Интерфейс старта игры
function startTimerButton() {
	startTIME();
	UIButtonStatus(3);
}

// Нажатие кнопки СТАРТ НОВОЙ ИГРЫ
function startNewGameFn() {
	swTimeStart = new TIME();
	gameStartDate = new Date();
	currentGame++;
	clearTimeout(clocktimer);
	startTIME();
	UIButtonStatus(3);
	storageIventStepsChange();
}

// Интерфейс окончания игры
function finishGameButton() {
	swTimeFinish = parseTime(stopwatch.textContent);
	players[currentPlayer].totalTime[currentGame] = players[currentPlayer].totalTime[currentGame].add(swTimeFinish.sub(swTimeStart));
	swTimeStart = swTimeFinish;
	stopALL();
	rollOrReroll = 0;
	UIButtonStatus(4);
	storageIventStepsChange();
}

// Интерфейс завершения игры кнопки ROLL
function completeGameFn () {
	gameRolled = true;
	addPeriod('complete', step, currentPeriod);
	step++;
	currentPeriod++;
	changeRollSettings(currentPeriod);
	if (currentPeriod>periodStartYear.length) {
		let totalTimeFinal = iventSteps[0].totalTime.add(new TIME());
		for (let i = 1; i < iventSteps.length; i++){
			let tmp = iventSteps[i].totalTime;
			totalTimeFinal.add(tmp);
		}

		stopwatch.textContent =  totalTimeFinal.toStr();

	}
	UIButtonStatus(1);
	storageIventStepsChange();
}

// Функция дропа игры
function dropGameFn () {
	addPeriod('drop', step, currentPeriod);
	step++;
	currentPeriod--;
	changeRollSettings(currentPeriod);
	UISmoothClose(null,startNew);
	UIButtonStatus(1);
	storageIventStepsChange();
}

// Функция рерола игры
function rerolGameFn () {
	addPeriod('reroll', step, currentPeriod);
	step++;
	UISmoothClose(null,startNew);
	UIButtonStatus(1);
	storageIventStepsChange();
}

//------------------------------------------------------------------------------
// Смена игрока
function setPlayer(i) {
	pastPlayer = currentPlayer;
	currentPlayer = i;
	switchPl.setAttribute('style', "background: url("+players[i].img+"); background-size: cover;");
	if (gameRolled) startNew.removeAttribute("disabled");
	if (pastPlayer!=undefined && gameName.textContent!=" "){
		swTimeFinish = parseTime(stopwatch.textContent);
		players[pastPlayer].totalTime[currentGame] = players[pastPlayer].totalTime[currentGame].add(swTimeFinish.sub(swTimeStart));
		swTimeStart = swTimeFinish;
	}
	storageIventStepsChange();
}

// Интерфейс смены игрока
function switchPlayer() {
	switchMenu.style.display = switchMenu.style.display == "none"? "flex":"none";
	for (let i = 0; i < players.length; i++){
	try{
		document.getElementById("player"+i+"Ico").remove();
		document.getElementById("addNewPlayer").remove();
	} catch{}
 		let div = document.createElement('button');
  		if (currentPlayer != i ) div.setAttribute('onclick', "setPlayer("+i+")"); 
  		div.setAttribute('style', "background: url("+players[i].img+"); background-size: cover;"); 
  		div.id = "player"+i+"Ico";
  		div.className = currentPlayer == i? "currentPlayer playerIco":"playerIco";

  		switchMenu.insertAdjacentElement("beforeend",div);
 	}
	}

// Закрыть список игроков при нажатии вне меню
window.onclick = function(event) {
    if (event.target != switchMenu && event.target !=switchPl) {
        switchMenu.style.display = "none";
    }
}

// Интерфейс добавления игры
function addPeriod (type, gameStep, period, redrawMode=false) {
	rollWheel.hidden = false;
	if (redrawMode == false){
		let plArray = new Array();
		for (let i = 0; i < players.length; i++){
			plArray.push(players[i]);
		}
		iventSteps.push(new stepData(currentRolledGame, type,currentPeriod,gameStep,plArray,gameStartDate, new Date()));
	}
	periodWidth = 5;
	let color = (type == 'complete'?"#80E56D":type == 'drop'?"#FF3A68":"#006DD5");
 	periodBarSvg.insertAdjacentHTML("beforeend",'<rect onclick="iventStepsShowInfo('+gameStep+');" x="'+periodXCord+'%" y="50" rx="0" ry="0" class="periodRect" width="'+periodWidth+'%" height="100" stroke="black" fill="'+color+'" stroke-width="0.3"/> <text id="text" x="'+((periodXCord+periodWidth/2)-0.4)+'%" fill="#fff" y="112">'+(period>1?period:1)+'</text>');

 
 	periodXCord+=periodWidth;
}

// Функция отображения информации об шаге и генерации модального окна
function iventStepsShowInfo(p) {
	currentShownStep = p;
	while (modalGameInfoInsert2.firstChild) {
    	modalGameInfoInsert2.removeChild(modalGameInfoInsert2.firstChild);
	}
	while (modalGameInfoInsert3.firstChild) {
    	modalGameInfoInsert3.removeChild(modalGameInfoInsert3.firstChild);
	}
	while (modalGameInfoInsert.firstChild) {
    	modalGameInfoInsert.removeChild(modalGameInfoInsert.firstChild);
	}

	let meta = iventSteps[p].game.metacore!=null?iventSteps[p].game.metacore+'/100':'Unrated';	
	let user = iventSteps[p].game.userscore!=null?iventSteps[p].game.userscore+'/10':'Unrated';
	modalGameInfoInsert3.insertAdjacentHTML("beforeend",`
		<h3 class="gameInfoName">${iventSteps[p].game.name} (${iventSteps[p].game.releaseYear})</h3>
		<p class="score"><img src="img/Metascore.png" class="scoreImg1"> <span class="scoreText1">${meta}</span>
		<img src="img/userscore.png" class="scoreImg2"> <span class="scoreText2">${user}</span></p>
		`);
	modalGameInfoInsert.insertAdjacentHTML("beforeend",
		`<h3 class="gameInfoStartFinish">Start<br>${iventSteps[p].startDate.getHours()}:${iventSteps[p].startDate.getMinutes()}:${iventSteps[p].startDate.getSeconds()} ${iventSteps[p].startDate.getDate()}.${iventSteps[p].startDate.getMonth()+1}.${iventSteps[p].startDate.getFullYear()}</h3>
		 <h3 class="gameInfoStartFinish">Finish<br>${iventSteps[p].finishDate.getHours()}:${iventSteps[p].finishDate.getMinutes()}:${iventSteps[p].finishDate.getSeconds()} ${iventSteps[p].finishDate.getDate()}.${iventSteps[p].finishDate.getMonth()+1}.${iventSteps[p].finishDate.getFullYear()}</h3>
		 <h3 class="gameInfoTotalTimeTitle">Total Time</h3>
		 <p class="gameInfoTotalTime">${iventSteps[p].totalTime.toStr()}</p>
		`);
	let desc = iventSteps[p].game.description;
	modalGameInfoInsert2.insertAdjacentHTML("beforeend",`
		<p class="description">&nbsp&nbsp&nbsp&nbsp&nbsp${desc}</p>
		`);
	for (let i = 0; i < players.length; i++) {
		modalGameInfoInsert.insertAdjacentHTML("beforeend",
		`<p class="playerModalInfo"><img class="playerModalIco" src ="${players[i].img}"><span class="playerModalTime">${players[i].totalTime[p].toStr()}</span></p>`);
	}
	modalImageSrc.setAttribute('src',iventSteps[p].game.imagesrc);

	modalGameFooter.className = iventSteps[p].gameStatus+'Color';
	modalGameFooter.innerHTML = upFirst(iventSteps[p].gameStatus);

    UISmoothOpen(null, gameInfoModalWindow);
}

function changeRollSettings(period) {
	rollConfig.minYear = periodStartYear[(period<0?1:period)-1];
	rollConfig.maxYear = periodFinishYear[(period<0?1:period)-1];
}

window.onkeydown = (e) => {
	try{
		if 		(e.key == 'ArrowRight') {
			currentShownStep = currentShownStep>=iventSteps.length-1?currentShownStep:currentShownStep+1;
			iventStepsShowInfo(currentShownStep)
		}
		else if (e.key == 'ArrowLeft')  {
			currentShownStep = currentShownStep>0?currentShownStep-1:currentShownStep;
			iventStepsShowInfo(currentShownStep)
		}
	}catch{}
}

// Закрытие и открытие кнопок\окон плавное
function UISmoothClose(ID, element) {
	let win = ID!=null?document.getElementById(ID):element;
 	win.classList.remove('smoothOpening');
 	win.classList.add('smoothClosing');
}

function UISmoothOpen(ID, element) {
	let win = ID!=null?document.getElementById(ID):element;
 	win.classList.remove('smoothClosing');
 	win.classList.add('smoothOpening');
}

// Вывод инфы о играх на БГ (оценка)
function UIGameInfoOnBackground(game){
	if (game!=undefined&&game!=null){
		gameName.textContent = game.name; UISmoothOpen(null, gameName);
	    gameReleaseYear.textContent = game.release; UISmoothOpen(null, gameReleaseYear);
	 	metaScore.innerHTML = game.metacore!=null?game.metacore+'/100':'Unrated'; 
	    userScore.innerHTML =  game.userscore!=null?game.userscore+'/10':'Unrated'; 
	    UISmoothOpen(null, headerScore);
	    hltbLink.setAttribute("href", "https://howlongtobeat.com/?q="+currentRolledGame.name+"#search");
	    steamLink.setAttribute("href", "https://store.steampowered.com/search/?sort_by=_ASC&term="+currentRolledGame.name);
	    gogLink.setAttribute("href", "https://www.gog.com/games?page=1&sort=popularity&search="+currentRolledGame.name);
	    egsLink.setAttribute("href", "https://www.epicgames.com/store/ru/browse?pageSize=30&q="+currentRolledGame.name+"&sortBy=relevance&sortDir=DESC");
	    rutrackerLink.setAttribute("href", "https://rutracker.org/forum/tracker.php?nm="+currentRolledGame.name);
		rutorLink.setAttribute("href", "  http://rutor.info/search/"+currentRolledGame.name);

	    UISmoothOpen(null, headerButtons);
	}
	else UIGameInfoOnBackgroundClose();
}

function UIGameInfoOnBackgroundClose() {
		UISmoothClose(null, gameName);
		UISmoothClose(null, gameReleaseYear);
		UISmoothClose(null, headerScore);
		UISmoothClose(null, headerButtons);
}

// Отображение кнопок в зависимости от статуса ивента
// 0 - Колесо в момент ролла
// 1 - Игра не выбрана (схожа с 0);
// 2 - Игра выбрана, но не начата;
// 3 - Игра в процессе прохождения;
// 4 - Игра пройдена, ожидание присуждения ей статуса "пройдена", "дроп", "рерол".
function UIButtonStatus(status){
	switch(status) {
		case 0:
			rollWheel.hidden = true; 			UISmoothClose(null,rollWheel);
			startNew.hidden = true;   			UISmoothClose(null,startNew);
			completeGame.hidden = true; 		UISmoothClose(null,completeGame);
			dropGame.hidden = true; 			UISmoothClose(null,dropGame);
			rerollGame.hidden = true; 			UISmoothClose(null,rerollGame);
			startPause.hidden = true; 			UISmoothClose(null,startPause);
			finish.hidden = true;				UISmoothClose(null,finish);
		break;
		case 1:
			rollWheel.hidden = false;			UISmoothOpen(null,rollWheel);
			startNew.hidden = true;  			UISmoothClose(null,startNew);
			completeGame.hidden = true;			UISmoothClose(null,completeGame);
			dropGame.hidden = true;				UISmoothClose(null,dropGame);
			rerollGame.hidden = true;			UISmoothClose(null,rerollGame);
			startPause.hidden = true;			UISmoothClose(null,startPause);
			finish.hidden = true; 				UISmoothClose(null,finish);


			if (currentPeriod>periodStartYear.length) {
				startNew.hidden = false; 		UISmoothOpen(null,startNew);
				rollWheel.hidden = true; 		UISmoothClose(null,rollWheel);
				startNew.value = "SGG is complete!";
				startNew.setAttribute("disabled", "disabled");
			}
			break;
		case 2:
			rollWheel.hidden = false; 			UISmoothOpen(null,rollWheel);
			startNew.hidden = false; 			UISmoothOpen(null,startNew);
			completeGame.hidden = true; 		UISmoothClose(null,completeGame);
			dropGame.hidden = true; 			UISmoothClose(null,dropGame);
			rerollGame.hidden = true; 			UISmoothClose(null,rerollGame);
			startPause.hidden = true; 			UISmoothClose(null,startPause);
			finish.hidden = true; 				UISmoothClose(null,finish);
			break;
		case 3:
			rollWheel.hidden = true; 			UISmoothClose(null,startNew);
			startNew.hidden = true;				UISmoothClose(null,startNew);
			completeGame.hidden = true; 		UISmoothClose(null,completeGame);
			dropGame.hidden = true;				UISmoothClose(null,dropGame);
			rerollGame.hidden = true; 			UISmoothClose(null,rerollGame);
			startPause.hidden = false; 			UISmoothOpen(null,startPause);
			finish.hidden = false; 				UISmoothOpen(null,finish);
			break;
		case 4:
			rollWheel.hidden = true; UISmoothClose(null,rollWheel);
			startNew.hidden = true; UISmoothClose(null,startNew);
			completeGame.hidden = false; UISmoothOpen(null,completeGame);
			dropGame.hidden = false; UISmoothOpen(null,dropGame);
			rerollGame.hidden = false; UISmoothOpen(null,rerollGame);
			startPause.hidden = true; UISmoothClose(null,startPause);
			finish.hidden = true; UISmoothClose(null,finish);
			break;
	}
	buttonsStatus = status;
	storage.buttonsStatus = status;
}


function UIAsideMenu(gamesArray) {
	while (aside.firstChild) {
    	aside.removeChild(aside.firstChild);
	}
	for (let i = 0; i < gamesArray.length; i++){
		let m = gamesArray[i].metacore!=null?gamesArray[i].metacore:'—';
		let u = gamesArray[i].userscore!=null?gamesArray[i].userscore:'—';
	aside.insertAdjacentHTML("beforeend","<p><i class='meta'>"+m+"</i><i class='user'>"+u+"</i>"+gamesArray[i].name+', '+gamesArray[i].releaseYear+'</p>');	
	}

}

function UINightModeSwitch() {
	nightMode = !nightMode
	storage.nightMode = nightMode
	UIApplyDayMode(nightMode)
}

function UIApplyDayMode(mode) {
	if (mode==true) {
		document.getElementById('head').insertAdjacentHTML('beforeend','<link rel="stylesheet" id="nightTheme" href="css/night.css">')
	} 
	if (mode==false) {
		
		try{document.getElementById('nightTheme').remove()}
		catch{
			return
		}
	}
}

// https://github.com/IonDen/ion.rangeSlider