// https://youtu.be/dLp10CFIvxI?t=1044

import LinearRegress from "../components/LinearRegress";

export default LinearRegress (s) {

let xs = [];
let ys = [];

let m, b;

function setup() {
  createCnavas(400, 400)

  m = tf.variable(tf.scalar(random(1)));
  b = tf.variable(tf.scalar(random(1)));
}

function mousePressed() {
  let x = map(mouseX, 0, width, 0, 1);
  let y = map(mouseY, 0, height, 1, 0);

  xs.push(x);
  ys.push(y);
}

// creates points for linear regression
function draw() {

  background(0);
  stroke(255);
  strokeWeight(8);

  for (let i = 0; i< xs.length; i++) {
    let px = map(xs[i], 0, 1, 0, width);
    let py = map(ys[i], 0, 1, height, 0);
  }

  let x1 = map(lineX[0], 0, 1, 0, width);
  let x2 = map(lineX[1], 0, 1, 0, width);

  let y1 = map(lineY[0], 0, 1, height, 0);
  let y2 = map(lineY[1], 0, 1, height, 0);

  strokeWeight(2);
  line(x1, y1, x2, y2);

  console.log(tf.memory().numTensors);
}

// predict the ys
function predict(xs) {
  const tfxs = tf.tensor1d(xs);
  // y = mx + b;
  const ys = tfxs.mul(m).add(b)
  return ys;
}


// root mean squared error


// loss function


// minimizer




// learning rate
const learningRate = 0.01;

// optimizer w/ stochastic gradient descent
const optimizer = tf.train.sgd(learningRate);






