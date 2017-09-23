document.addEventListener('DOMContentLoaded', ready);

function ready() {
};

var white, black;
var x = 600; // total width
var y = 400; // total height
var h = 380; // long edge of one big trapezoid
var hours = 0;

function setup(){
	white =  color('#ddd');
	black = color('#000');
	blue = color('#009bdf');
	deepBlue = color('#00458c');
	silver = color('#a7a9ac');
	green = color('#349e49');
	yellow = color('#ffc20e');

  	createCanvas(x, y);
  	frameRate(50);
}

function draw() {
	var updatedValues = update();
	var am = updatedValues.am;
	var bLeft = updatedValues.bLeft;
	var bRight = updatedValues.bRight;
	var aLeft = computeA(bLeft);
	var aRight = computeA(bRight);

	noStroke();

	// LEFT
	// Top
	fill(am ? deepBlue : yellow);
	quad(
		0, 0,
		h, 0,
		aLeft, bLeft,
		0, bLeft
	);

	// Bottom
	fill(am ? yellow : deepBlue);
	quad(
		0, bLeft,
		aLeft, bLeft,
		x - h, y,
		0, y
	);

	// Text
	fill(50);
	textFont('serif', 40);
	textAlign(CENTER);
	text('10', aLeft/2, bLeft + 40); // Text wraps within text bo;

	// RIGHT
	// Top
	fill(white, 50);
	quad(
		h, 0,
		x, 0,
		x, bRight,
		aRight, bRight
	)

	// Bottom
	fill(black, 50);
	quad(
		aRight, bRight,
		x, bRight,
		x, y,
		x - h, y
	)
}

// milisecond precision hours and minutes
// b: current y position for split on each large trapezoid
function update() {
	var date = new Date();
	var seconds = date.getSeconds() + date.getMilliseconds()/1000;
	// var hours = date.getHours() + date.getMinutes()/60 + seconds/3600;
	hours = hours > 24 ? 0 : hours + 0.01;
	var hours12 = hours > 12 ? hours - 12 : hours;

	return {
		am: hours < 12,
		bLeft: y * (12 - hours12)/12,
		bRight: y * (60 - seconds)/60,
	}
}

// a: point on the x axis where the two vertical trapezoids meet
function computeA(b) {
	return (x - h) + ((y - b) * (2 * h - x) / y);
}
