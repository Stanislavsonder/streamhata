let activate = false;
let sec = new TIME(0,0,1,0)

function trim(string) { return string.replace (/\s+/g, " ").replace(/(^\s*)|(\s*)$/g, ''); }

let startDate;

let clocktimer;

function executeTimer() {
  startDate.add(sec);
  stopwatch.textContent = startDate.toStr();
  currentTimer = stopwatch.textContent;
  timerOn = true;
  storageTimer();
  clocktimer = setTimeout("executeTimer()",1000);
}

function startTIME() {
  if(!activate){
    startButton.value = "Pause";
    activate = !activate;

    if (startDate == undefined) startDate =  parseTime(stopwatch.textContent);
    executeTimer();
    return;
  }
  else {
    tmpTimer = parseTime(stopwatch.textContent);
    timerOn = false;
    storageTimer();
    startButton.value = "Start";
    activate = !activate;
    clearTimeout(clocktimer);
    return;
  }
}

function stopALL(){
  clearTimeout(clocktimer);
  startDate = undefined;
  startButton.value = "Start";
  activate = false;
  timerOn = false;
  storageTimer();
}