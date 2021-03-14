document.addEventListener("DOMContentLoaded",()=>{

    var width = window.innerWidth;
    var height = window.innerHeight;

    function loadImages(sources, callback) {
        var assetDir = 'img/';
        var images = {};
        var loadedImages = 0;
        var numImages = 0;
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
    function isNearOutline(tankPart, outline) {
        var tp = tankPart;
        var o = outline;
        var ax = tp.x();
        var ay = tp.y();

        if (ax > o.x - 20 && ax < o.x + 20 && ay > o.y - 20 && ay < o.y + 20) {
            return true;
        } else {
            return false;
        }
    }
    function allPartsRightPlace(allTankParts){

        for (var key in allTankParts) {

            if(!allTankParts[key].inRightPlace){
                console.log("Return FALSE")
                return false
            }
        }
        console.log("Return TRUE")
        return true
    }
    function reorderParts(allTankParts,tankParts){

        for (var key in allTankParts) {
            allTankParts[key].zIndex(tankParts[key].z)
        }
    }

    function drawBackground(background, backImg, text) {
        var context = background.getContext();
        context.drawImage(backImg, 0, 0);
        context.setAttr('font', '20pt Calibri');
        context.setAttr('textAlign', 'center');
        context.setAttr('fillStyle', 'white');
        context.fillText(text, background.getStage().width() / 2, 40);
    }

    function initStage(images) {
        var stage = new Konva.Stage({
            container: 'kanva_container',
            width: 1280,
            height: 720,
        });
        var background = new Konva.Layer();
        var tankLayer = new Konva.Layer();
        var tankShapes = [];
        var score = 0;

        // image positions
        var tankParts = {
            hlaven: {
                x: 50,
                y: 150,
                z: 8
            },
            predny_stit: {
                x: 50,
                y: 150,
                z:7
            },
            veza: {
                x: 50,
                y: 150,
                z:6
            },
            lavy_stit: {
                x: 50,
                y: 150,
                z:5
            },
            lavy_pas: {
                x: 50,
                y: 150,
                z:4
            },
            lavy_tank: {
                x: 50,
                y: 150,
                z:3
            },
            stred_tank: {
                x: 50,
                y: 150,
                z:2
            },
            pravy_pas: {
                x: 50,
                y: 150,
                z:1
            }
        };

        var outlines = {
            hlaven: {
                x: 647,
                y: 251
            },
            predny_stit: {
                x: 533,
                y: 281
            },
            veza: {
                x: 353,
                y: 209
            },
            lavy_stit: {
                x: 216,
                y: 408
            },
            lavy_pas: {
                x: 230,
                y: 461
            },
            lavy_tank: {
                x: 216,
                y: 349
            },
            stred_tank: {
                x: 536,
                y: 347
            },
            pravy_pas: {
                x: 554,
                y: 453
            },
        };
        var tankAllParts = {}
        // create draggable tankParts
        for (var key in tankParts) {
            // anonymous function to induce scope
            (function () {
                var privKey = key;
                var part = tankParts[key];

                var tank_part = new Konva.Image({
                    image: images[key],
                    x: part.x,
                    y: part.y,
                    draggable: true,
                });
                tankAllParts[key] = tank_part

                tank_part.on('dragstart', function () {
                    this.moveToTop();
                    tankLayer.draw();
                });
                /*
                 * check if tank_part is in the right spot and
                 * snap into place if it is
                 */
                tank_part.on('dragend', function () {
                    var outline = outlines[privKey];
                    if (!tank_part.inRightPlace && isNearOutline(tank_part, outline)) {
                        tank_part.position({
                            x: outline.x,
                            y: outline.y,
                        });
                        tankLayer.draw();
                        tank_part.inRightPlace = true;

                        // disable drag and drop
                        setTimeout(function () {
                            tank_part.draggable(false);
                        }, 50);
                        if (allPartsRightPlace(tankAllParts)){
                            pause();
                            reorderParts(tankAllParts,tankParts);
                        }
                    }

                });
                // make tank_part glow on mouseover
                tank_part.on('mouseover', function () {
                    if(!tank_part.inRightPlace) {
                        document.body.style.cursor = 'pointer';
                    }
                });
                // return tank_part on mouseout
                tank_part.on('mouseout', function () {
                    tank_part.image(images[privKey]);
                    tankLayer.draw();
                    document.body.style.cursor = 'default';
                });

                tank_part.on('dragmove', function () {
                    document.body.style.cursor = 'pointer';
                });

                tankLayer.add(tank_part);
                tankShapes.push(tank_part);
            })();
        }

        // create tank_part outlines

        var imageObj = images["tank_outline"];
        var out = outlines["tank_outline"];

        var outline = new Konva.Image({
            image: imageObj,
            x: 200,
            y: 200,
        });

        tankLayer.add(outline);



        stage.add(background);
        stage.add(tankLayer);

        drawBackground(
            background,
            images.background,
            ""
        );
    }

    var sources = {
        hlaven: '1.png',
        predny_stit: '2.png',
        veza: '3.png',
        lavy_stit: "4.png",
        lavy_pas: "5.png",
        lavy_tank: "6.png",
        stred_tank: "7.png",
        pravy_pas: "8.png",
        background: "background720.png",
        tank_outline: "tank_outline.png"
    };
    loadImages(sources, initStage);

    //stopwatch

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
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(function printTime() {
            elapsedTime = Date.now() - startTime;
            print(timeToString(elapsedTime));
        }, 10);
        // showButton("PAUSE");
    }

    function pause() {
        clearInterval(timerInterval);
        // showButton("PLAY");
    }

    function reset() {
        clearInterval(timerInterval);
        print("00:00:00");
        elapsedTime = 0;
        // showButton("PLAY");
    }

// Create function to display buttons

    function showButton(buttonKey) {
        const buttonToShow = buttonKey === "PLAY" ? playButton : pauseButton;
        const buttonToHide = buttonKey === "PLAY" ? pauseButton : playButton;
        buttonToShow.style.display = "block";
        buttonToHide.style.display = "none";
    }
// Create event listeners

    let playButton = document.getElementById("playButton");

    playButton.addEventListener("click", start);



//DEMO
    document.getElementById("idButton").addEventListener("click",buttonShow);
    document.getElementById("idClose").addEventListener("click",buttonClose);
    function buttonShow()
    {
        document.getElementById("fade1").style.display="flex";

    }
    function buttonClose()
    {
        document.getElementById("fade1").style.display="none";
    }




});