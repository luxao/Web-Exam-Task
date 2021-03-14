
let modal = document.getElementById("myModalVideo");
// button ktory otvori modal
let btn = document.getElementById("Demo");

// span ktory zatvori modal
let span = document.getElementsByClassName("close")[0];

// po kliknuti na button sa otvori modal
btn.onclick = function() {
    modal.style.display = "block";
}

// po kliknuti na span sa zatvori modal
span.onclick = function() {
    modal.style.display = "none";
}
// ked uživatel klikne mimo modalu zatvori sa okno
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

document.getElementById('again').addEventListener('click',()=>{
    window.location.reload();
})


let text = 'Poukladaj časti Homera !';

let sources = {
    homerImg: 'finalyObrys.png',
    homerBody: 'homerBODY.png',
    rightLeg: 'rightLeg.png',
    leftLeg: 'leftLeg.png',
    trenky: 'trencle.png',
    vankus: 'vankusik.png',
    vnutroVankusa: 'vnutroVank.png',
    donutArm: 'donutArm.png',
    donuty: 'donuty.png',

};

//nacitanie obrazkov
function loadImages(sources,callback){
    let assetDir = 'img/';
    let images = {};
    let loadedImages = 0;
    let numImages = 0;
    for(let src in sources){
        numImages++;
        images[src] = new Image();
        images[src].onload = function () {
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = assetDir + sources[src];
    }
}

//vykreslenie pozadia a textu
function setBackgroundforGame(background, homerImg, text) {
    let context = background.getContext();
    context.drawImage(homerImg, 0, 0);
    context.setAttr('font', '22pt Cambria');
    context.setAttr('textAlign', 'center');
    context.setAttr('fillStyle', 'red');
    context.fillText(text, 800, 55);
}

//kontrola ci je cast obrazku blizko svojho obrysu
function checkFinalPosition(partsOfHomer,outline){
    let part = partsOfHomer;
    let outL = outline;
    let px = part.x();
    let py = part.y();

    return px > outL.x - 30 && px < outL.x + 30 && py > outL.y - 30 && py < outL.y + 30;
}


//inicializacia celej hry
function initGame(images){
    let background = new Konva.Layer();
    let partOfHomerLayer = new Konva.Layer();
    let partShapes = [];
    let score = 0;


    let stage = new Konva.Stage({
        container: 'container',
        width: 1400,
        height: 600,
    });


    // nastavenie pozicii obrazkom

    let partsOfBody = {
        homerBody: {
            x: 900,
            y: 100,
        },
        leftLeg: {
            x: 50,
            y: 400,
        },
        rightLeg: {
            x:220,
            y:400,
        },
        trenky: {
            x: 520,
            y:400,
        },
        vankus: {
            x:650,
            y: 420,
        },
        vnutroVankusa: {
            x:750,
            y:400,
        },
        donutArm: {
            x:900,
            y:400,
        },
        donuty: {
            x:900,y:470,
        },
    };

    let outlines = {
        homerBody_black: {
            x: 85,
            y: 3,
        },
        leftLeg_black: {
            x: 562,
            y: 115,
        },
        rightLeg_black: {
            x: 528,
            y: 118,
        },
        trenky_black: {
            x: 476,
            y: 80,
        },
        donuty_black: {
            x:402,y:26,
        },
        vankus_black: {
            x:3,y:75,
        },
        vnutroVankusa_black: {
            x:36,y:135,
        },
        donutArm_black: {
            x:190,y:333,
        },
    };


    for (let key in partsOfBody) {
        (function () {
            let privateKey = key;
            let parts = partsOfBody[key];

            let partsBody = new Konva.Image({
                image: images[key],
                x: parts.x,
                y: parts.y,
                draggable: true,
            });
            partsBody.on('dragstart', function () {
                this.moveToTop();
                partOfHomerLayer.draw();
            });

            let h1 = document.getElementsByTagName('h1')[0];
            let seconds = 0, minutes = 0, hours = 0, t;
            let start = document.getElementById('Play');

            function add() {
                seconds++;
                if (seconds >= 60) {
                    seconds = 0;
                    minutes++;
                    if (minutes >= 60) {
                        minutes = 0;
                        hours++;
                    }
                }

                h1.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

                timer();
            }
            function timer() {
                t = setTimeout(add, 1000);
            }


            /* Start button */
            start.onclick = timer;



            partsBody.on('dragend', function () {
                let outline = outlines[privateKey + '_black'];
                if (!partsBody.inRightPlace && checkFinalPosition(partsBody, outline)) {
                    partsBody.position({
                        x: outline.x,
                        y: outline.y,
                    });
                    partOfHomerLayer.draw();
                    partsBody.inRightPlace = true;

                    if (++score >= 8) {
                        document.getElementById('forWin').innerText = 'Vyhral si';
                        document.getElementById('PlayTime').innerText = 'Čas:' +  h1.textContent;
                        clearTimeout(t);
                        h1.textContent = "00:00:00";
                        seconds = 0; minutes = 0; hours = 0;

                    }

                    // disable drag and drop
                    setTimeout(function () {
                        partsBody.draggable(false);
                    }, 50);
                }
            });

            partsBody.on('mouseenter',function (){
                document.body.style.cursor = 'grab';
            })
            // return animal on mouseout
            partsBody.on('mouseout', function () {
                partsBody.image(images[privateKey]);
                partOfHomerLayer.draw();
                document.body.style.cursor = 'default';
            });

            partsBody.on('dragmove', function () {
                document.body.style.cursor = 'grab';
            });

            partOfHomerLayer.add(partsBody);
            partShapes.push(partsBody);
        })();
    }

    for (let key in outlines) {
        (function () {
            let imageObj = images[key];
            let out = outlines[key];

            let outline = new Konva.Image({
                image: imageObj,
                x: out.x,
                y: out.y,
            });

            partOfHomerLayer.add(outline);
        })();
    }

    stage.add(background);
    stage.add(partOfHomerLayer);

    setBackgroundforGame(
        background,
        images.homerImg,
        text
    );

}

document.body.style.backgroundImage = 'url(https://i.pinimg.com/originals/7d/a6/96/7da696f1987d39249d42946f331ccc1b.jpg)'
document.body.style.backgroundRepeat = 'no-repeat';


loadImages(sources, initGame);




