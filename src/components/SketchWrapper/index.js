import React, { useState } from "react";
import Sketch from "react-p5";


// access tensorflow functions
import * as tf from "@tensorflow/tfjs";

export default function SketchWrapper() {

	// y = mx + b
	const [mSlope, setMslope] = useState(0);
	const [bYintercept, setBintercept] = useState(0);

	const [x_vals, setX_vals] = useState([]);
	const [y_vals, setY_vals] = useState([]);

	const learningRate = 0.5;

	// optimiser: stochastic gradient descent
	// function will implement an algorithm 
	// that will adjust our coefficient values 
	// based on the output of the loss function.
	const optimizer = tf.train.sgd(learningRate);

	// loss function: mean squared error
	// the loss function will measure how well 
	// our linear equation fits the data. 
	// A lower loss value = closer fit.
	const loss = (yPred, yLabels) => {
		return yPred.sub(yLabels).square().mean();
	}

	const predict = (x) =>
  tf.tidy(() => {
    // Create a vector of x values
    const xVector = tf.tensor1d(x)
    // y = mx + b
    const yPred = xVector.mul(mSlope).add(bYintercept)
    return yPred
  });

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

	const setup = (p5, canvasParentRef) => {

    // coefficient variables
    setM(tf.variable(tf.scalar(Math.random()))) // slope
    setB(tf.variable(tf.scalar(Math.random()))) // y intercept
		
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of your component)
		p5.createCanvas(500, 500).parent(canvasParentRef);
	}

	// handle click
	function mousePressed() {
		let x = map(mouseX, 0, width, 0, 1);
		let y = map(mouseY, 0, height, 1, 0);
	
		setXvector( arr => [...arr]);
		setYPredict( arr => [...arr]);
		//xVector.push(x);
		//yPredict.push(y);
	};

	handleClick = e => this.addpoint(e.offsetX, e.offsetY);



	const draw = (p5) => {

		p5.background(0);
		p5.stroke(255);
		p5.strokeWeight(8);

		tf.tidy(() => {
			if (x_vals.length > 0) {
				const ys = tf.tensor1d(y_vals);
				optimizer.minimize(() => loss(predict(x_vals), ys));
			}
		});

		for (let i = 0; i< x_vals.length; i++) {
			let px = map(x_vals[i], 0, 1, 0, width);
			let py = map(y_vals[i], 0, 1, height, 0);
			point(px, py);
		}

		const lineX = [0, 1];

		const ys = tf.tidy(() => predict(lineX));
		let lineY = ys.dataSync();
		ys.dispose();

		// create to points on the line
		let x1 = map(lineX[0], 0, 1, 0, width);
		let x2 = map(lineX[1], 0, 1, 0, width);
	
		let y1 = map(lineY[0], 0, 1, height, 0);
		let y2 = map(lineY[1], 0, 1, height, 0);
	
		// draw the line between the points
		strokeWeight(2);
		line(x1, y1, x2, y2);
	
		console.log(tf.memory().numTensors);

		// getting values from tensors is async
		// predict([-1, 1])
		// .data()
		// .then((yVals) => {
		// 	// plot the Two.js line on the canvas
		// 	two.makeLine(
		// 		-1 * width, // x1
		// 		height * yVals[0] // y1
		// 	),
		// 		1 * width, // x2
		// 		height * yVals[1] // y2
		})

		// NOTE: Do not use setState in the draw function or in functions that are executed
		// in the draw function...
		// please use normal variables or class properties for these purposes
		// x++;

		// const xVector = [0, 1];
		// const yPredict = predict(xVector);
	};

	return (
		<Sketch setup={setup} draw={draw} />
	);
};

// https://github.com/atorov/react-hooks-p5js/blob/master/src/components/P5Wrapper/index.jsx
// https://ericjinks.com/blog/2018/linear-regression-with-tensorflow-js/
// https://github.com/Jinksi/ericjinks.com/blob/master/src/components/ml/TFLinearRegression.js