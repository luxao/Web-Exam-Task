var width = window.innerWidth;
var height = window.innerHeight;
var numImages = 0;
var running = 0;

//load images from folder pictures
function loadImages(sources, callback) {
    var assetDir = 'img/';
    var images = {};
    var loadedImages = 0;
    for (var src in sources) {
        numImages++;
    }
    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function () {
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = assetDir + sources[src];
    }
}

//if is image position near to his final position
function isNearFinalPosition(region, final_position) {
    var reg = region;
    var o = final_position;
    var regX = reg.x();
    var regY = reg.y();

    if (regX > o.x - 20 && regX < o.x + 20 && regY > o.y - 20 && regY < o.y + 20) {
        return true;
    } else {
        return false;
    }
}

//init canvas
function initCanvas(images) {
    var stage = new Konva.Stage({
        container: 'container',
        width: 2000,
        height: 600,
    });
    var background = new Konva.Layer();
    var regionLayer = new Konva.Layer();
    var mapLayer = [];  //background (can by more than only one map :D - but no thank, one is good)
    var score = 0;

    //set images start positions
    var regions_start_position = {
        PO: {
            x: 110,
            y: 350,
        },
        KE: {
            x: 370,
            y: 330,
        },
        BB: {
            x: 110,
            y: 450,
        },
        ZA: {
            x: 330,
            y: 430,
        },
        TR: {
            x: 550,
            y: 300,
        },
        NT: {
            x: 550,
            y: 400,
        },
        TN: {
            x: 480,
            y: 420,
        },
        BA: {
            x: 120,
            y: 350,
        },
    };

    //set images final position (end)
    var region_final_position = {
        PO_final_position: {
            x: 450,
            y: 100,
        },
        KE_final_position: {
            x: 480,
            y: 165,
        },
        BB_final_position: {
            x: 304,
            y: 169,
        },
        ZA_final_position: {
            x: 302,
            y: 67,
        },
        TR_final_position: {
            x: 193,
            y: 99,
        },
        NT_final_position: {
            x: 210,
            y: 191,
        },
        TN_final_position: {
            x: 150,
            y: 160,
        },
        BA_final_position: {
            x: 137,
            y: 193,
        },
        MAPA_blind_position: {
            x: 135,
            y: 66,
        },
    };

    // create draggable regions_start_position
    for (var key in regions_start_position) {
        // anonymous function to induce scope
        (function () {
            var privKey = key;
            var anim = regions_start_position[key];

            var region = new Konva.Image({
                image: images[key],
                x: anim.x,
                y: anim.y,
                draggable: true,
            });

            region.on('dragstart', function () {
                this.moveToTop();
                regionLayer.draw();
            });
            /*
             * check if region is in the right spot and
             * snap into place if it is
             */
            region.on('dragend', function () {
                var final_position = region_final_position[privKey + '_final_position'];
                if (!region.inRightPlace && isNearFinalPosition(region, final_position)) {
                    region.position({
                        x: final_position.x,
                        y: final_position.y,
                    });
                    regionLayer.draw();
                    region.inRightPlace = true;

                    if (++score == numImages - 1) {
                        var text = 'Vyhral si! Vynikajúci čas.';
                        document.getElementById("gameInfo").innerHTML = text;
                        pause();
                        document.getElementById("circle").style = "border : 5px solid lightgreen";
                    }

                    if(score == 1) {
                        start();
                    }

                    // disable drag and drop
                    setTimeout(function () {
                        region.draggable(false);
                    }, 50);
                }
            });

            // return region on mouseout
            region.on('mouseout', function () {
                region.image(images[privKey]);
                regionLayer.draw();
                document.body.style.cursor = 'default';
            });

            region.on('dragmove', function () {
                document.body.style.cursor = 'pointer';
            });

            regionLayer.add(region);
            mapLayer.push(region);
        })();
    }

    // create region region_final_position
    for (var key in region_final_position) {
        // anonymous function to induce scope
        (function () {
            var imageObj = images[key];
            var out = region_final_position[key];

            var final_position = new Konva.Image({
                image: imageObj,
                x: out.x,
                y: out.y,
            });

            regionLayer.add(final_position);
        })();
    }

    stage.add(background);
    stage.add(regionLayer);
}

//source of pictures to used
var sources = {
    MAPA_blind_position: 'MAPA-blind.png',

    PO: 'PO-black.png',
    KE: 'KE-black.png',
    BB: 'BB-black.png',
    ZA: 'ZA-black.png',
    TR: 'TR-black.png',
    NT: 'NT-black.png',
    TN: 'TN-black.png',
    BA: 'BA-black.png',
};
//load picture :D
loadImages(sources, initCanvas);


//Stop-watch
// Convert time to a format of hours, minutes, seconds, and milliseconds

function timeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);

    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    let diffInMs = (diffInSec - ss) * 100;
    let ms = Math.floor(diffInMs);

    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(2, "0");

    return `${formattedMM}:${formattedSS}:${formattedMS}`;
}

// Declare variables to use in our functions below

let startTime;
let elapsedTime = 0;
let timerInterval;

// Create function to modify innerHTML

function print(txt) {
    document.getElementById("display").innerHTML = txt;
}

// Create "start", "pause" and "reset" functions
function start() {
    if(!running) {
        running = 1;
        document.getElementById("circle").style = "border : 5px solid red";
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(function printTime() {
            elapsedTime = Date.now() - startTime;
            print(timeToString(elapsedTime));
        }, 10);
    }
}

function reset() {
    clearInterval(timerInterval);
    print("00:00:00");
    elapsedTime = 0;
}

function pause() {
    clearInterval(timerInterval);
}

//Create event listener

let playButton = document.getElementById("playButton");

playButton.addEventListener("click", start);


//DEMO - from left floating menu like
function showDemo() {
    document.getElementById("myNav").style.width = "100%";
}

function hideDemo() {
    document.getElementById("myNav").style.width = "0%";
}