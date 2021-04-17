import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import audio from "../audio/hyperspace-no-1.ogg";
import cueSet1 from "./cueSet1.js";
import cueSet2 from "./cueSet2.js";

const P5Sketch = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.tunnelSize = 0;

        p.stepSize = 0;

        p.strokeWeightMultiplier = 1;

        p.strokeWeightMultiplierStepSize = 0;

        p.cueSet1Completed = [];

        p.cueSet2Completed = [];

        p.preload = () => {
          p.song = p.loadSound(audio);
        };

        p.setup = () => {
            p.colorMode(p.HSB, 255);
            p.frameRate(30);
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight); 
            p.background(0);
            p.noFill();
            p.rectMode(p.CENTER);
            p.stepSize = p.width / cueSet1.length;
            p.strokeWeightMultiplierStepSize = 9 / cueSet1.length;

            p.song.onended(p.logCredits);

            for (let i = 0; i < cueSet1.length; i++) {
              p.song.addCue(cueSet1[i].time, p.executeCueSet1, i + 1);
            }

            for (let i = 0; i < cueSet2.length; i++) {
              p.song.addCue(cueSet2[i].time, p.executeCueSet2, i + 1);
            }
        };

        p.draw = () => {
            if (p.song && p.song.isPlaying()) {
                p.travelTunnel();
            }
        };

        p.executeCueSet1 = (currentCue) => {
            if (!p.cueSet1Completed.includes(currentCue)) {
                p.cueSet1Completed.push(currentCue);
                const stepSizeReducer = currentCue <= 256 ? 2 : 0.9; 
                p.tunnelSize += p.stepSize / stepSizeReducer;
                p.strokeWeightMultiplier += p.strokeWeightMultiplierStepSize / stepSizeReducer;
            }
        };

        p.currentShape = 'ellipse';

        p.shapes = ['ellipse', 'octagon', 'rect', 'equilateral', 'hexagon', 'ellipse' ];

        p.executeCueSet2 = (currentCue) => {
            if (!p.cueSet2Completed.includes(currentCue)) {
                p.cueSet2Completed.push(currentCue);
                p.currentShape = p.shapes[currentCue];
            }
        };

        p.C = 0;

        p.m = 0;

        p.travelTunnel = () => {
            p.background(0);
            p.C += .5;
            let x = p.width / 2;
            let y = p.height / 2;
            for (let i = 0; i < 100; i++) {
                let r = p.noise((i + p.C) * .03) * p.TAU * 3
                x += p.cos(r) * 9
                y += p.sin(r) * 9
                let pow = p.pow(.95, i)
                p.stroke((p.m + i * 2.5) % 255, y, x)
                p.strokeWeight(pow * p.strokeWeightMultiplier)
                p[p.currentShape](x, y, pow * p.tunnelSize * 1.4, pow * p.tunnelSize, 30, 30);
                p.m += .01
            }
        }

       p.equilateral = (x, y, width, inverted = false) => {
            //for this sketch inverted is always false and the width is doubled
            inverted = false;
            width = width * 2;
            x = x - width / 2;
            y = inverted ? y - width / 2 : y + width / 2;
            const centerYHelper = inverted ? width / 2 : -width / 2;
            const x1 = x;
            const y1 = y;
            const x2 = x + width / 2;
            const y2 = y + centerYHelper * p.sqrt(3);
            const x3 = x + width;
            const y3 = y;
            p.triangle(x1, y1, x2, y2, x3, y3);
        };

        /*
       * function to draw a hexagon shape
       * adapted from: https://p5js.org/examples/form-regular-polygon.html
       * @param {Number} x        - x-coordinate of the hexagon
       * @param {Number} y      - y-coordinate of the hexagon
       * @param {Number} radius   - radius of the hexagon
       */
      p.hexagon = (x, y, radius) => {
        radius = radius / 2;
        p.angleMode(p.RADIANS);
        const angle = p.TWO_PI / 6;
        p.beginShape();
        for (var a = p.TWO_PI / 12; a < p.TWO_PI + p.TWO_PI / 12; a += angle) {
          let sx = x + p.cos(a) * radius;
          let sy = y + p.sin(a) * radius;
          p.vertex(sx, sy);
        }
        p.endShape(p.CLOSE);
      }

      /*
       * function to draw a octagon shape
       * adapted from: https://p5js.org/examples/form-regular-polygon.html
       * @param {Number} x        - x-coordinate of the octagon
       * @param {Number} y      - y-coordinate of the octagon
       * @param {Number} radius   - radius of the octagon
       */
      p.octagon = (x, y, radius) => {
        radius = radius / 2;
        p.angleMode(p.RADIANS);
        const angle = p.TWO_PI / 8;
        p.beginShape();
        for (var a = p.TWO_PI / 16; a < p.TWO_PI + p.TWO_PI / 16; a += angle) {
          let sx = x + p.cos(a) * radius;
          let sy = y + p.sin(a) * radius;
          p.vertex(sx, sy);
        }
        p.endShape(p.CLOSE);
      }

        p.mousePressed = () => {
          if (p.song.isPlaying()) {
            p.song.pause();
          } else {
            if (
              parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
            ) {
              p.reset();
            }
            //document.getElementById("play-icon").classList.add("fade-out");
            p.canvas.addClass("fade-in");
            p.song.play();
          }
        };

        p.creditsLogged = false;

        p.logCredits = () => {
          if (
            !p.creditsLogged &&
            parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
          ) {
            p.creditsLogged = true;
            console.log(
              "Music: http://labcat.nz/",
              "\n",
              "Animation: https://github.com/LABCAT/hyperspace-no-1",
              "\n",
              "Code Inspiration: https://www.openprocessing.org/sketch/988880"
            );
          }
        };

        p.reset = () => {
          p.clear();
        };

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.redraw();
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
        </div>
    );
};

export default P5Sketch;
