let musicSources = [
'Dr. Disrespect - Gillette.mp3', 
'LarMoV - Пароль ТЕТРИАНДОХ.mp3',
'Lone Digger – Caravan Palace.mp3', 
'Marmok - One more time.mp3',
'Shanguy - King Of The Jungle.mp3', 
'Toby Fox - MEGALOVANIA.mp3', 
'Пророк Санбой - Остров.mp3',
'Tongo - Pumped Up Kick.mp3',
'Clown Pepe.mp3'];
function getRandomInt(min, max) {
 	min = Math.ceil(min);
 	max = Math.floor(max);
 	return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}
let music = new Audio();
let musicMode = 1;
let masterVolume = 0;
let volumeMultiplayer = 1;

function playMusic() {
	try{
		music.volume = 0;
		masterVolume = 0;
		music.src = 'music/'+musicSources[getRandomInt(0,musicSources.length)];
		music.play();
		let t = setInterval(()=> {
			masterVolume+=0.05; 
			music.volume=masterVolume*volumeMultiplayer;
		},100)
		setTimeout(()=>{
			clearTimeout(t);
			t = setInterval(()=> {music.volume=volumeMultiplayer; masterVolume = 1;},100);
		},2000);
		setTimeout(()=>{
			clearTimeout(t);
			t = setInterval(()=> {
				masterVolume-=0.05; 
				music.volume=masterVolume*volumeMultiplayer; 
			},100);

		},rollConfig.rollDuration-2000);
		setTimeout(()=>{clearTimeout(t);},rollConfig.rollDuration+5);
	}catch{}
}

function stopMusic() {
	music.pause();
}

function soundOff() {
	volumeMultiplayer = volumeMultiplayer!=0?0:1;
	storage.musicMode = volumeMultiplayer;
	soundButton.classList.toggle('offMusic');
}