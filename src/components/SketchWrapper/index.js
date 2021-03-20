import React, { useState } from "react";
import Sketch from "react-p5";


// access tensorflow functions
import * as tf from "@tensorflow/tfjs";

export default function SketchWrapper() {

	// y = mx + b
	const [mSlope, setMslope] = useState(0);
	const [bYintercept, setBintercept] = useState(0);

	const [xVector, setXvector] = useState([]);
	const [yVals, setYvals] = useState([]);

	const learningRate = 0.5;

	// optimiser: stochastic gradient descent
	// function will implement an algorithm 
	// that will adjust our coefficient values 
	// based on the output of the loss function.
	const optimizer = tf.train.sgd(learningRate);

	const setup = (p5, canvasParentRef) => {

    // coefficient variables
    setM(tf.variable(tf.scalar(Math.random()))) // slope
    setB(tf.variable(tf.scalar(Math.random()))) // y intercept
		
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of your component)
		p5.createCanvas(500, 500).parent(canvasParentRef);
	}

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

		tf.tidy(() => {
			train();

			if (this.x_vals.length > 0) {
				const lineXs = [-1, 1]
				const lineYPredict = this.predict(lineXs)
				lineYPredict.data().then(lineYs => {
					line.vertices[0].set(lineXs[0] * width, height * lineYs[0])
					line.vertices[1].set(lineXs[1] * width, height * lineYs[1])
					line.translation.set(0, 0)
				})
			}			
		});

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

	// the train function will iteratively run our optimiser function.
	// train function: running in the Two.js animation loop ~60 times per second
	// optimiser.minimize() automatically adjusts our tf.variable coefficents
	const train = () => {
		tf.tidy(() => {
			if (xVectors.length > 0) {
				const y = tf.tensor1d(yVals)
				optimiser.minimize(() => loss(predict(xVectors), y))
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