import React, { useState, useEffect } from 'react';
import '../css/gravity.css'
import pip from '../images/pip.png'
const Gravity: React.FC<{}> = () => {
    // Define an array to store all game pieces
    let gamePieces: Component[] = [];
    let isDragging = false;
    let selectedPieceIndex = -1; // Index of the currently selected piece

    useEffect(() => {
        startGame();
    }, []);

    function startGame() {
        if (gamePieces.length === 0) {
            const imageT1 = new Image();
            imageT1.src = pip;
            const imageT2 = new Image();
            imageT2.src = pip;

            gamePieces.push(new Component(80, 80, "red", 80, 75, imageT1));
            gamePieces.push(new Component(80, 80, "blue", 200, 150, imageT2));

            myGameArea.start();
        }
    }

    const myGameArea = {
        canvas: document.createElement("canvas"),
        start: function () {
            this.canvas.width = 1000;
            this.canvas.height = 500;
            this.context = this.canvas.getContext("2d")!;
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
            this.interval = setInterval(updateGameArea, 20) as any;

            // Mouse event listeners
            this.canvas.addEventListener('mousedown', function (e) {
                const mouseX = e.offsetX;
                const mouseY = e.offsetY;

                // Check if any piece is clicked
                for (let i = 0; i < gamePieces.length; i++) {
                    if (mouseX >= gamePieces[i].x && mouseX <= gamePieces[i].x + gamePieces[i].width &&
                        mouseY >= gamePieces[i].y && mouseY <= gamePieces[i].y + gamePieces[i].height) {
                        isDragging = true;
                        selectedPieceIndex = i;
                        gamePieces[i].offsetX = mouseX - gamePieces[i].x;
                        gamePieces[i].offsetY = mouseY - gamePieces[i].y;
                        break;
                    }
                }
            });

            this.canvas.addEventListener('mousemove', function (e) {
                if (isDragging && selectedPieceIndex !== -1) {
                    gamePieces[selectedPieceIndex].x = e.offsetX - gamePieces[selectedPieceIndex].offsetX;
                    gamePieces[selectedPieceIndex].y = e.offsetY - gamePieces[selectedPieceIndex].offsetY;
                }
            });

            window.addEventListener('mouseup', function () {
                isDragging = false;
                selectedPieceIndex = -1; // Reset selected piece index
            });
        },
        stop: function () {
            clearInterval(this.interval);
        },
        clear: function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        context: {} as CanvasRenderingContext2D,
        interval: 0 as number,
        x: 0,
        y: 0
    };

    class Component {
        type: string;
        image: CanvasImageSource;
        width: number;
        height: number;
        x: number;
        y: number;
        speedX: number;
        speedY: number;
        gravity: number;
        gravitySpeed: number;
        offsetX: number;
        offsetY: number;
        originalX: number;
        originalY: number;

        constructor(width: number, height: number, color: string, x: number, y: number, image: CanvasImageSource, type?: string) {
            this.type = type || "";
            this.width = width;
            this.height = height;
            this.image = image;
            this.x = x;
            this.y = y;
            this.originalX = x;
            this.originalY = y;
            this.speedX = 0;
            this.speedY = 0;
            this.gravity = 0.05;
            this.gravitySpeed = 0;
            this.offsetX = 0;
            this.offsetY = 0;
        }

        update() {
            const ctx = myGameArea.context;
            const playerImage = this.image;
            const scaledWidth = 80;
            const scaledHeight = 80;
            ctx.drawImage(playerImage, this.x, this.y, scaledWidth, scaledHeight);
        }

        newPos() {
            this.gravitySpeed += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY + this.gravitySpeed;
            this.hitBottom();
        }

        hitBottom() {
            const rockbottom = myGameArea.canvas.height - this.height;
            if (this.y > rockbottom) {
                this.y = rockbottom;
                this.gravitySpeed = 0;
            }
        }
    }


    function updateGameArea() {
        myGameArea.clear();
        for (let i = 0; i < gamePieces.length; i++) {
            gamePieces[i].newPos();
            gamePieces[i].update();
        }
    }


    function handleAddImage() {
        const ima = new Image();
        ima.src = pip;
        gamePieces.push(new Component(80, 80, "red", 80, 75, ima));
    }

    function shakeCanvas() {
        const shakeIntensity = 100; // Adjust the intensity of the shake as needed
        const shakeDuration = 1000; // Duration of the shake in milliseconds
        const shakeIntervalTime = 30; // Interval time for shake updates
    
        const startTime = Date.now();
        let shakeInterval: NodeJS.Timeout;;
    
        // Function to gradually decrease the shake intensity over time
        function updateShake() {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(shakeDuration - elapsedTime, 0);
            const intensityMultiplier = remainingTime / shakeDuration;
    
            if (remainingTime === 0) {
                clearInterval(shakeInterval);
                return;
            }
    
            for (let i = 0; i < gamePieces.length; i++) {
                const deltaX = Math.random() * shakeIntensity * intensityMultiplier - (shakeIntensity / 2) * intensityMultiplier;
                const deltaY = Math.random() * shakeIntensity * intensityMultiplier - (shakeIntensity / 2) * intensityMultiplier;
                gamePieces[i].x += deltaX;
                gamePieces[i].y += deltaY;
            }
        }
    
        shakeInterval = setInterval(updateShake, shakeIntervalTime);
    }
    

    function resetPositions() {
        for (let i = 0; i < gamePieces.length; i++) {
            // Reset the positions of the game pieces to their original positions
            gamePieces[i].x = gamePieces[i].originalX;
            gamePieces[i].y = gamePieces[i].originalY;
        }
    }
    
    


    return (
        <div>
            <button onClick={handleAddImage}>Add Image</button>
            <button onClick={shakeCanvas}>Shake Canvas</button>

        </div>
    );
};

export default Gravity;
