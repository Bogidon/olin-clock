var white, black;
var x = 1430; // total width
var y = 690; // total height
var h = 930; // long edge of one big trapezoid
var boldFont; // font
var fontSize = 130;
var fontPadding = 40;
//var hours = 0; //tmp
var amColor, pmColor;
var starsImg, confettiImg, holloweenImg, glitterImg;

function preload() {
  boldFont = loadFont('./assets/fonts/dinot-bold.otf');
}

function setup(){
	olinWhite =  color('#eee');
	olinBlack = color('#000');
	olinBlue = color('#009bdf');
	olinDeepBlue = color('#00458c');
	olinSilver = color('#a7a9ac');
	olinLightGreen = color('#8ebe3f')
	olinGreen = color('#349e49');
	olinDarkGreen = color('#00653e');
	olinYellow = color('#ffc20e');
	olinRed = color('#e31d3c');
	olinPink = color('#ed037c');
	olinOrange = color('#f47920');
	olinDarkOrange = color('#cf1d39');
	olinPurple = color('#511c74');
	olinCyan = color('#6bc1d3');

  	createCanvas(x, y);
  	frameRate(3);
}

function draw() {
	// reset default colors
	amColor = olinWhite;
	pmColor = olinBlue;

	var {
		am,
		aLeft, bLeft, aLeftText, leftText, bLeftText, leftTextTop,
		aRight, bRight, aRightText, rightText, bRightText, rightTextTop
	} = update();

	noStroke();

	// LEFT
	// Top
	fill(am ? pmColor : amColor);
	quad(
		0, 0,
		h, 0,
		aLeft, bLeft,
		0, bLeft
	);

	// Bottom
	fill(am ? amColor : pmColor);
	quad(
		0, bLeft,
		aLeft, bLeft,
		x - h, y,
		0, y
	);

	// Text
	fill(colorWithAlpha(computeColor(amColor, pmColor, am, leftTextTop), 230));
	textFont(boldFont, fontSize);
	textAlign(CENTER);
	text(leftText, aLeftText, bLeftText);

	// RIGHT
	// Top
	fill(amColor, 50);
	quad(
		h, 0,
		x, 0,
		x, bRight,
		aRight, bRight
	)

	// Bottom
	fill(pmColor, 50);
	quad(
		aRight, bRight,
		x, bRight,
		x, y,
		x - h, y
	)

	// Text
	fill(colorWithAlpha(computeColor(amColor, pmColor, false, rightTextTop), 230));
	textFont(boldFont, fontSize);
	textAlign(CENTER);
	text(rightText, aRightText, bRightText);
}

// milisecond precision hours and minutes
// b: current y position for split on each large trapezoid
function update() {
	var date = new Date();
	var seconds = date.getSeconds() + date.getMilliseconds()/1000;
	var minutes = date.getMinutes() + seconds/60;
	var hours = date.getHours() + minutes/60;
	// hours = hours > 23 ? 0 : hours + 1;
	var hours12 = ((hours + 11) % 12 + 1);
	console.log(hours);

	var bLeft = y * (12 - (hours12 - 1))/12;
	var bRight = y * (60 - minutes)/60;
	var aLeft = computeA(bLeft);
	var aRight = computeA(bRight);

	var leftTextPosition = computeTextPosition(bLeft);
	var rightTextPosition = computeTextPosition(bRight);

	var state = {
		am: hours < 12,
		aLeft,
		aRight,
		bLeft,
		bRight,
		aLeftText: aLeft / 2,
		bLeftText: leftTextPosition.b,
		leftTextTop: leftTextPosition.top,
		leftText: Math.floor(hours12).toString(),
		aRightText: (x + aRight)/2,
		bRightText: rightTextPosition.b,
		rightTextTop: rightTextPosition.top,
		rightText: pad(Math.floor(minutes), 2),
	}

	return computeEasterEggs(date, state);
}

function computeColor(amColor, pmColor, am, textTop) {
	if (am && textTop) {
		return pmColor;
	} else if (am && !textTop) {
		return amColor;
	} else if (!am && textTop) {
		return amColor;
	} else if (!am && !textTop) {
		return pmColor;
	}
}

function computeTextPosition(b) {
	var bText, textTop;
	if (y/b > 2) {
		bText = (b + fontSize*0.8 + fontPadding);
		textTop = true;
	} else {
		bText = (b - fontPadding);
		textTop = false;
	}
	return {
		b: bText,
		top: textTop,
	}
}

function computeEasterEggs(date, state) {
	var day = date.getDate();
	var month = date.getMonth() + 1;

	// 4/20
	if (day == 20 && month == 4) {
		amColor = olinDarkGreen;
		pmColor = olinLightGreen;
	}

	// 5/4: star wars
	if (day == 4 && month == 5) {
		amColor = colorWithAlpha(olinBlue, 140);
		pmColor = colorWithAlpha(olinBlack, 120);
		starsImg = starsImg || loadImage('assets/images/stars.jpg');
		background(starsImg);
	}

	// 4/16: lee's birthday
	if (day == 16 && month == 4) {
		amColor = colorWithAlpha(olinBlue, 20);
		pmColor = colorWithAlpha(olinCyan, 100);
		confettiImg = confettiImg || loadImage('assets/images/confetti.jpg');
		background(confettiImg);
		state.leftText = 'Happy';
		state.rightText = 'BDay!';
	}

	// 10/31: holloween
	if (day == 31 && month == 10) {
		amColor = colorWithAlpha(olinOrange, 150);
		pmColor = colorWithAlpha(olinDarkOrange	, 150);
		holloweenImg = holloweenImg || loadImage('assets/images/holloween.jpg');
		background(holloweenImg);
	}

	// 1/1: new year's
	if (day == 1 && month == 1)  {
		amColor = colorWithAlpha(olinYellow, 20);
		pmColor = colorWithAlpha(olinWhite, 60);
		glitterImg = glitterImg || loadImage('assets/images/glitter.jpg');
		background(glitterImg);
		state.leftText = 'Happy';
		state.rightText = date.getFullYear() + '!';
	}

	return state;
}

function colorWithAlpha(baseColor, alpha) {
	return color(red(baseColor), green(baseColor), blue(baseColor), alpha);
}

// a: point on the x axis where the two vertical trapezoids meet
function computeA(b) {
	return (x - h) + ((y - b) * (2 * h - x) / y);
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
