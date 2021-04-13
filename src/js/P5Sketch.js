import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import ShuffleArray from "./functions/ShuffleArray.js";

const P5Sketch = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.setup = () => {
            p.colorMode(p.HSB, 255);
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight); 
            p.background(0);
            p.noFill();
            p.rectMode(p.CENTER);
            
        };


         //https://www.openprocessing.org/sketch/988880
        p.draw = () => {
            p.travelTunnel();     
        };

        p.C = 0;

        p.m = 0;

        p.travelTunnel = () => {
            p.background(0);
            p.C += .5;
            let x = p.width / 2;
            let y = p.height / 2;
            let W = p.width;
            for (let i = 0; i < 100; i++) {
                let r = p.noise((i + p.C) * .03) * p.TAU * 3
                x += p.cos(r) * 9
                y += p.sin(r) * 9
                let pow = p.pow(.95, i)
                p.stroke((p.m + i * 2.5) % 255, y, x)
                p.strokeWeight(pow * 10)
                p.rect(x, y, pow * W * 1.4, pow * W, 30, 30);
                //p.equilateral(x, y, pow * W * 2.8);
                p.m += .01
            }
        }

       p.equilateral = (x, y, width, inverted = false) => {
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
