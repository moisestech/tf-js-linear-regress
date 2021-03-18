import React from "react";
import Sketch from "react-p5";

let x = 50;
let y = 50;

let xVector = [];
let yPredict = [];

let m = null;
let b = null;

// access tensorflow functions
import * as tf from "@tensorflow/tfjs";

export default function SketchWrapper() {

	const setup = (p5, canvasParentRef) => {

    // coefficient variables
    m = tf.variable(tf.scalar(Math.random())) // slope
    b = tf.variable(tf.scalar(Math.random())) // y intercept
		
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of your component)
		p5.createCanvas(500, 500).parent(canvasParentRef);
	}

	// loss function: mean squared error
	// the loss function will measure how well 
	// our linear equation fits the data. 
	// A lower loss value = closer fit.
	const loss = (yPred, y) => {
		return yPred.sub(y).square().mean();
	}

	const predict = (x) =>
  tf.tidy(() => {
    // Create a vector of x values
    const xVector = tf.tensor1d(x)
    // y = mx + b
    const yPred = xVector.mul(this.m).add(this.b)
    return yPred
  });

	function mousePressed() {
		let x = map(mouseX, 0, width, 0, 1);
		let y = map(mouseY, 0, height, 1, 0);
	
		xVector.push(x);
		yPredict.push(y);
	};

	const draw = (p5) => {

		// getting values from tensors is async
		predict([-1, 1])
		.data()
		.then((yVals) => {
			// plot the Two.js line on the canvas
			two.makeLine(
				-1 * width, // x1
				height * yVals[0] // y1
			),
				1 * width, // x2
				height * yVals[1] // y2
		})

		p5.background(0);
		p5.ellipse(x, y, 70, 70);
		// NOTE: Do not use setState in the draw function or in functions that are executed
		// in the draw function...
		// please use normal variables or class properties for these purposes
		x++;

		stroke(255);
		strokeWeight(8);

		for (let i = 0; i< xVector.length; i++) {
			let px = map(xVector[i], 0, 1, 0, width);
			let py = map(yPredict[i], 0, 1, height, 0);
			point(px, py);
		}

		const xVector = [0, 1];
		const yPredict = predict(xVector);
	};

	// optimiser: stochastic gradient descent
	// the optimiser function will implement 
	// an algorithm that will adjust our coefficient values 
	// based on the output of the loss function.
	const learningRate = 0.5;
	const optimizer = tf.train.sgd(learningRate);

	// the train function will iteratively run our optimiser function.
	// train function: running in the Two.js animation loop ~60 times per second
	// optimiser.minimize() automatically adjusts our tf.variable coefficents
	const train = () => {
		tf.tidy(() => {
			if (x_vals.length > 0) {
				const y = tf.tensor1d(y_vals)
				optimiser.minimize(() => loss(predict(x_vals), y))
			}
		})
	};

	return (
		<Sketch setup={setup} draw={draw} />
	);
};

// https://github.com/atorov/react-hooks-p5js/blob/master/src/components/P5Wrapper/index.jsx
// https://ericjinks.com/blog/2018/linear-regression-with-tensorflow-js/
// https://github.com/Jinksi/ericjinks.com/blob/master/src/components/ml/TFLinearRegression.js