import React from "react";
import Sketch from "react-p5";

let x = 50;
let y = 50;

let xs = [];
let ys = [];

let m, b;

// access tensorflow functions
import * as tf from "@tensorflow/tfjs";

export default function SketchWrapper() {

	const setup = (p5, canvasParentRef) => {

    // Our coefficient variables
    m = tf.variable(tf.scalar(Math.random())) // slope
    b = tf.variable(tf.scalar(Math.random())) // y intercept
		
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of your component)
		p5.createCanvas(500, 500).parent(canvasParentRef);
	}

	const draw = (p5) => {
		p5.background(0);
		p5.ellipse(x, y, 70, 70);
		// NOTE: Do not use setState in the draw function or in functions that are executed
		// in the draw function...
		// please use normal variables or class properties for these purposes
		x++;
	};

	const predict = (x) =>
  tf.tidy(() => {
    // Create a vector of x values
    const xVector = tf.tensor1d(x)
    // y = mx + b
    const yPred = xVector.mul(this.m).add(this.b)
    return yPred
  });

	// loss function: mean squared error
	const loss = (yPred, y) => yPred.sub(y).square().mean();

	// optimiser: stochastic gradient descent
	const learningRate = 0.5;
	const optimizer = tf.train.sgd(learningRate);

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