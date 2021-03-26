//===========================================
// Главная структура \ константы.

let canvas = document.getElementById("whell");
let times = [];
let timer;
let img = [];
let sections = [];
// Функции:
async function setImagesForRoll() {
    let imload = []; // массив обещаний
    for (let i = 0; i < rollConfig.sections; i++){
    sections[i] = games[i].name;
    img[i] = new Image();
    img[i].src = games[i].imagesrc +'?rand=' + Math.random();
    img[i].width = '100';
    img[i].height = '200';
    imload.push(img[i].decode())
    }
    await Promise.all(imload)  
}


function drawWhell() {
    let csz = null;
    wheels = frame = null;
    setInterval(function() {
        let sz = innerWidth + "/" + innerHeight;
        if (csz !== sz) {
            csz = sz;
            wheels = frame = null;
            repaint(angle);
            }
        }, 10);
    wheels = frame = null;
}
totalUpdate();
async function totalUpdate() {
    setGamesForRoll();
    await setImagesForRoll();
    drawWhell()
}
//==================================================
// Размер Canvas
innerWidth = 600;
innerHeight = 600;

let wheels = null;
let frame = null;
//==================================================

// Функция перерисовки колеса Canvas. Try-catch ловит ошибки ссылок на паттерны, пока непонятно, работает ли.
try{
function repaint(angle) {

    let r = Math.min(innerWidth, innerHeight) / 2.5 | 0;
    if (wheels === null) {
        wheels = [];
        for (let selected=0; selected<sections.length; selected++) {
            let c = document.createElement("canvas");
            c.width = c.height = 2*r + 10;
            let ctx = c.getContext("2d"), cx = 5 + r, cy = 5 + r;
            let g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            g.addColorStop(0, "rgba(0,0,0,0)");
            g.addColorStop(1, "rgba(0,0,0,0.5)");
            for (let i=0; i<sections.length; i++) {
                let a0 = 2*Math.PI*i/sections.length;
                let a1 = a0 + 2*Math.PI/(i == 0 ? 1 : sections.length);
                let a = 2*Math.PI*(i+0.5)/sections.length;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, r, a0, a1, false);
                var pat = ctx.createPattern(img[i],'repeat');
                ctx.fillStyle = pat;
                ctx.fill();
                ctx.strokeStyle="#fff";
                ctx.lineWidth="3";

                ctx.stroke();
                ctx.fillStyle = g;
                ctx.fillStyle = "#FFF";
                ctx.save();
                // Надписи. Заменить.
                if (i == selected) {
                    ctx.fillStyle = "#FFF";
                    ctx.shadowColor = "#FFF";
                    ctx.shadowBlur = r/20;
                } else {
                    ctx.fillStyle = "#AAA";
                    ctx.shadowColor = "#000";
                    ctx.shadowBlur = r/100;
                }
                ctx.font = "bold " + r/sections.length*1.6 + "px arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.translate(cx, cy);
                ctx.rotate(a);
                //ctx.fillText(sections[i], r*0.62, 0);
                ctx.restore();  
            }
            wheels.push(c);

        }
    }
    if (frame === null) {
        frame = document.createElement("canvas");
        frame.width = frame.height = 10 + 2*r*1.25 | 0;
        let ctx = frame.getContext("2d"), cx = frame.width/2, cy = frame.height/2;
        ctx.beginPath();
        ctx.arc(cx, cy, r*1.025, 0, 2*Math.PI, true);
        ctx.arc(cx, cy, r, 0, 2*Math.PI, false);


        var gradient = ctx.createLinearGradient(20,0, 220,0);
        gradient.addColorStop(0, '#ee7752');
        gradient.addColorStop(.5, '#FFA6D5');
        gradient.addColorStop(1, '#0998AB');
        ctx.fillStyle = gradient; // Цвет обводки.
        ctx.fill();
        g = ctx.createRadialGradient(cx-r/7, cy-r/7, 0, cx, cy, r/3);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r/3.5, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.translate(cx, cy);
        ctx.rotate(Math.PI/2);
        ctx.beginPath();
        ctx.moveTo(- r*1.1, - r*0.1);
        ctx.lineTo(- r*0.9, 0);
        ctx.lineTo(- r*1.1, r*0.1);
        ctx.lineTo(- r*1.1, -r*0.1);
        ctx.fillStyle = "#FFF";
        ctx.fill();
        ctx.strokeStyle = "#e73c7e";
        ctx.lineWidth="2";
        ctx.stroke();

    }
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    let cx = innerWidth/2, cy = innerHeight/2;
    let ctx = canvas.getContext("2d");
    let selected = (Math.floor((Math.PI*3.4999999999999997 - angle) * sections.length / (2*Math.PI))% sections.length);
    if (selected < 0) selected += sections.length;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.translate(-wheels[selected].width/2, -wheels[selected].height/2);
    ctx.drawImage(wheels[selected], 0, 0);
    ctx.restore();
    ctx.drawImage(frame, cx - frame.width/2, cy - frame.height/2);
    return selected;
}
}
catch {};

//==================================================

let angle = 0, running = false;

function spinTo(winner, duration) {
    let final_angle = (-0.2) - (0.5 + winner)*2*Math.PI/sections.length;
    let start_angle = angle - Math.floor(angle/(2*Math.PI))*2*Math.PI - 5*2*Math.PI;
    let start = performance.now();
    //==================================================
    function frame() {
        let now = performance.now();
        let t = Math.min(1, (now - start) / duration);
        t = 3*t*t - 2*t*t*t; // ease in out
        angle = start_angle + t * (final_angle - start_angle);
        repaint(angle);
        if (t < 1) requestAnimationFrame(frame); else running = false;
    }
    //==================================================
    requestAnimationFrame(frame);
    running = true;
}

//==================================================

function roll() {
    if (!running) {
        //let answer = Math.random()*sections.length+ Math.random();
        let answer = Math.random()*sections.length;
        spinTo(answer, rollConfig.rollDuration);
    return answer;
    }
    return null;
};

//==================================================
