function severalRandom(min, max, num) {
    var i, arr = [], res = [];
    for (i = min; i <= max; i++ ) arr.push(i);
    for (i = 0; i < num; i++) res.push(arr.splice(Math.floor(Math.random() * (arr.length)), 1)[0])
    return res;
}

function rund(len, min) {
    //функция для перемешивания массива
    function shuffle(arr) {
        for (var i = len = arr.length, elem; elem = arr[--i];) {
            var num = Math.floor(Math.random() * len);
                arr[i] = arr[num];
                arr[num] = elem;
        }
        return arr
    } 
    var base = [], // основной массив
        temp = [], // запасной массив
        i ;
    for (i = 0; i < len; i++) base[i] = i + min; // формирование значений основного массива[1, 2, 3, 4, 5]
    shuffle(base); // первый раз перемешали основной массив [4, 3, 2, 1, 5]
    return function () {
        var elem = base.shift(); // берём первый элемент основного массива
        temp.push(elem); //добавляем в запасной
        1 == base.length && (shuffle(temp), base = base.concat(temp), temp = []);
        // если в основном остался 1 элемент, перемешиваем запасной и добавляем к основному, очищаем запасной 
        return elem 
    }    
}

function filter (game){
	let yearFlag = (!!rollConfig.maxYear && !!rollConfig.minYear)? game.releaseYear<=rollConfig.maxYear && game.releaseYear>=rollConfig.minYear : true;
	let metaScoreFlag = (!!rollConfig.maxMetaScore && !!rollConfig.minMetaScore)? game.metacore<=rollConfig.maxMetaScore && game.metacore>=rollConfig.minMetaScore : true;
	let userScoreFlag = (!!rollConfig.maxUserScore && !!rollConfig.minUserScore)? game.userscore<=rollConfig.maxUserScore && game.userscore>=rollConfig.minUserScore : true;
	return yearFlag && metaScoreFlag && userScoreFlag;
}
let filtredGames;
function setGamesForRoll() {
    filtredGames = gamesFullList.filter(game => filter(game));
    z = rund(filtredGames.length,0);

    games = new Array();

    randoms = severalRandom(0,filtredGames.length,rollConfig.sections);

    for (let i = 0; i <=rollConfig.sections; i++) {
        games[i] = filtredGames[z()];
    }
}