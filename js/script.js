//Puzzle game using KonvaJs
function loadImages(sources, callback) {
    let assetDir = 'img/';
    let images = {};
    let loadedImages = 0, numImages = 0;
    for (let src in sources) {
        numImages++;
    }
    for (let src in sources) {
        images[src] = new Image();
        images[src].onload = function () {
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = assetDir + sources[src];
    }
}
function isNearOutline(bull, outline) {
    let b = bull;
    let o = outline;
    let bx = b.x();
    let by = b.y();
    if (bx > o.x - 25 && bx < o.x + 25 && by > o.y - 25 && by < o.y + 25) {
        return true;
    } else {
        return false;
    }
}

function drawBackground(background, bullImg, text) {
    let context = background.getContext();
    context.drawImage(bullImg, 0, 0);
    context.setAttr('font', '18pt Calibri');
    context.setAttr('textAlign', 'center');

    context.fillText(text, 800, 40);
}

function initStage(images) {
    let stage = new Konva.Stage({
        container: 'puzzle',
        width: 2000,
        height: 1500,
    });
    let background = new Konva.Layer();
    let bullLayer = new Konva.Layer();
    let bullShapes = [];
    let score = 0;

    // image positions
    let arrayOfParts = {
        chrbatik: {
            x: 80,
            y: 403,
        },
        chrbtisko: {
            x: 158,
            y: 412,
        },
        chvost: {
            x: 228,
            y: 307,
        },
        hlavicka: {
            x: 500,
            y: 197,
        },
        krk: {
            x: 600,
            y: 425,
        },
        lpNoha: {
            x: 430,
            y: 550,
        },
        nozka: {
            x: 398,
            y: 307,
        },
        zlNoha: {
            x: 405,
            y: 320,
        },
        zpNoha: {
            x: 510,
            y: 440,
        },
    };


    let outlines = {
        chrbatik_b: {
            x: 145,
            y: 97,
        },
        chrbtisko_b: {
            x: 172,
            y: 10,
        },
        chvost_b: {
            x: 4,
            y: 116,
        },
        hlavicka_b: {
            x: 383,
            y: 72,
        },
        krk_b: {
            x: 364,
            y: 6,
        },
        lpNoha_b: {
            x: 310,
            y: 190,
        },
        nozka_b: {
            x: 384,
            y: 226,
        },
        zlNoha_b: {
            x: 50,
            y: 149,
        },
        zpNoha_b: {
            x: 129,
            y: 232,
        },
    };

    for (let key in arrayOfParts) {
        (function () {
            let privKey = key;
            let anim = arrayOfParts[key];

            let bull = new Konva.Image({
                image: images[key],
                x: anim.x,
                y: anim.y,
                draggable: true,
            });

            bull.on('dragstart', function () {
                stopwatch.start();
                this.moveToTop();
                bullLayer.draw();
            });

            bull.on('dragend', function () {
                let outline = outlines[privKey + '_b'];
                if (!bull.inRightPlace && isNearOutline(bull, outline)) {
                    bull.position({
                        x: outline.x,
                        y: outline.y,
                    });
                    bullLayer.draw();
                    bull.inRightPlace = true;

                    if (++score >= 9) {
                        let text = 'Done!';
                        stopwatch.stop();
                        drawBackground(background, images.backgroundPhoto, text);
                    }

                    setTimeout(function () {
                        bull.draggable(false);
                    }, 50);
                }
            });
            bull.on('mouseenter', function () {
                document.body.style.cursor = 'grab';
            });
            bull.on('mouseout', function () {
                bull.image(images[privKey]);
                bullLayer.draw();
                document.body.style.cursor = 'default';
            });

            bull.on('dragmove', function () {
                document.body.style.cursor = 'pointer';
            });

            bullLayer.add(bull);
            bullShapes.push(bull);
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

            bullLayer.add(outline);
        })();
    }

    stage.add(background);
    stage.add(bullLayer);

    drawBackground(
        background,
        images.backgroundPhoto, ''
    );
}
let sources = {
    backgroundPhoto: 'puzzle-obrys.png',
    chrbatik: 'chrbatik.png',
    chrbtisko: 'chrbtisko.png',
    chvost: 'chvost.png',
    hlavicka: 'hlavicka.png',
    krk: 'krk.png',
    lpNoha: 'lpNoha.png',
    nozka: 'nozka.png',
    zlNoha: 'zlNoha.png',
    zpNoha: 'zpNoha.png'
};

loadImages(sources, initStage);


//Stop-watch
class Stopwatch {
    constructor(display) {
        this.running = false;
        this.display = display;
        this.reset();
        this.print(this.times);
    }

    reset() {   this.times = [ 0, 0, 0 ];}

    start() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }
    stop() {
        this.running = false;
        this.time = null;
    }


    step(timestamp) {
        if (!this.running) return;
        this.calculate(timestamp);
        this.time = timestamp;
        this.print();
        requestAnimationFrame(this.step.bind(this));
    }

    calculate(timestamp) {
        let diff = timestamp - this.time;
        this.times[2] += diff / 10;
        if (this.times[2] >= 100) {
            this.times[1] += 1;
            this.times[2] -= 100;
        }
        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }
    }

    print() {   this.display.innerText = this.format(this.times);}

    format(times) {
        return `\
        ${pad0(times[0], 2)}:\
        ${pad0(times[1], 2)}:\
        ${pad0(Math.floor(times[2]), 2)}`;
    }
}

function pad0(value, count) {
    let result = value.toString();
    for (; result.length < count; --count)
        result = '0' + result;
    return result;
}

let stopwatch = new Stopwatch(document.querySelector('.stopwatch'), document.querySelector('.results'));

document.getElementById("play-again").addEventListener("click", ()=>{window.location.reload();})