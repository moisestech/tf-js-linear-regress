import React, { useState } from "react";

// https://github.com/Gherciu/react-p5
import Sketch from "react-p5";
import { mapRange } from "../../utils";



// access tensorflow functions
import * as tf from "@tensorflow/tfjs";

export default function SketchWrapper() {

	const [canvWidth, setCanvWidth] = useState(500);
	const [canvHeight, setCanvHeight] = useState(500);

	// y = mx + b
	const [mSlope, setMslope] = useState(0);
	const [bYintercept, setBintercept] = useState(0);

	// _underscore vals is not a tensor
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
    const tensor_xVector = tf.tensor1d(x)
    // y = mx + b
    const tensor_yPred = tensor_xVector.mul(mSlope).add(bYintercept)

		// gives back a tensor
    return tensor_yPred
  });

	// handle click
	function mousePressed(mouseX, mouseY) {

		// map normalize clicked pixels between 0 to 1
		let new_mouseX = mapRange(mouseX, 0, canvWidth, 0, 1);
		let new_mouseY = mapRange(mouseY, 0, canvHeight, 1, 0);
	
		setX_vals( prevArr => [...prevArr, new_mouseX]);
		setY_vals( prevArr => [...prevArr, new_mouseY]);
	};
	

	// the train function will iteratively run our optimiser function.
	// train function: running in the Two.js animation loop ~60 times per second
	// optimiser.minimize() automatically adjusts our tf.variable coefficents
	const train = () => {
		tf.tidy(() => {
			if (x_vals.length > 0) {
				const y = tf.tensor1d(y_vals)

				// min the loss by pred from x, y vals
				optimiser.minimize(() => loss(predict(x_vals), y))
			}
		})
	};

	const setup = (p5, canvasParentRef) => {

    // coefficient variables
    setMslope(tf.variable(tf.scalar(Math.random()))) // slope
    setBintercept(tf.variable(tf.scalar(Math.random()))) // y intercept
		
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of your component)
		p5.createCanvas(canvWidth, canvHeight).parent(canvasParentRef);
	}

	const draw = (p5) => {

		p5.background(0);
		p5.stroke(255);
		p5.strokeWeight(8);

		// NOTE: Do not use setState in the draw function or in functions that are executed
		// in the draw function...
		// please use normal variables or class properties for these purposes

		tf.tidy(() => {
			if (x_vals.length > 0) {
				const ys = tf.tensor1d(y_vals);

				// minimize the loss by pred from x, y vals
				optimizer.minimize(() => loss(predict(x_vals), ys));
			}
		});
		
		// loop mouse coordinate and plot clicked points
		for (let i = 0; i< x_vals.length; i++) {
			let px = mapRange(x_vals[i], 0, 1, 0, canvWidth);
			let py = mapRange(y_vals[i], 0, 1, canvHeight, 0);
			p5.point(px, py)
		}

		const lineX = [0, 1];

		// clean tensors from predict func
		const ys = tf.tidy(() => predict(lineX));

		let lineY = ys.dataSync();
		// clean tensors to avoid meme leaks
		ys.dispose();

		// create to points on the line
		let x1 = mapRange(lineX[0], 0, 1, 0, canvWidth);
		let x2 = mapRange(lineX[1], 0, 1, 0, canvWidth);
	
		let y1 = mapRange(lineY[0], 0, 1, canvHeight, 0);
		let y2 = mapRange(lineY[1], 0, 1, canvHeight, 0);
	
		// draw the line between the points
		p5.strokeWeight(2);
		p5.line(x1, y1, x2, y2);
	
		console.log(tf.memory().numTensors);
		console.log({x_vals}, {y_vals});
	};

	return (
		<Sketch setup={setup} draw={draw} mouseClicked={e => {
			mousePressed(e.mouseX, e.mouseY);
		}}/>
	);
};

// https://github.com/atorov/react-hooks-p5js/blob/master/src/components/P5Wrapper/index.jsx
// https://ericjinks.com/blog/2018/linear-regression-with-tensorflow-js/
// https://github.com/Jinksi/ericjinks.com/blob/master/src/components/ml/TFLinearRegression.js