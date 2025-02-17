// BREATHING
let startSize = 0;              // Current value
let easingFactorIn = 0.060;     // Easing factor when expanding (inhaling)
let easingFactorOut = 0.020;    // Easing factor when contracting (exhaling)
let speedMultiplierIn = 0.40;    // Speed multiplier for inhale
let speedMultiplierOut = 1.50;  // Speed multiplier for exhale (set higher to speed up the return)
let targetSize = 500/1.5;       // Maximum size for expansion
let direction = 1;              // 1 for inhale (expanding), -1 for exhale (contracting)
let numLayers = 100; 
let peakReached = false;  

// Global variables for the text fade animation
let texts = [
  "Woah, kid... let's pause for a moment shall we?\nLet's slow down and be good to ourselves...",
  "Let's soften our focus, hold both palms to our chest, and breath...",
  "• • •",
  "• •",
  "•",
  "Evenly and deeply and with purpose, focus on each inhale, focus on each exhale...",
  "The resistance that you're feeling...\nThat moment of weakness...",
  "It's because you're on the edge of a breakthrough...",
  "• • •",
  "• •",
  "•",
  "Now, close this window and lean into this dip.\nDance with your fear...",
  "Allign with that ideal you.\nYou know better than anyone who that is...",
  "Become."]
  
let currentTextIndex = 0;
let textAlpha = 0;
let fadeDirection = 1;  // 1 = fade in, -1 = fade out
let fadeSpeed = 2;      // Change in alpha per frame
let holdTime = 80;      // Frames to hold at full opacity
let holdCounter = 0;

let quoteText = [
  "“Are you paralyzed with fear? That’s a good sign. Fear is good. Like self-doubt, fear is an indicator. Fear tells us what we have to do.”",
  "“The more important a call or action is to our soul’s evolution, the more Resistance we will feel toward pursuing it.”",
  "“The artist committing themself to their calling has volunteered for hell.”", 
  "“It’s not the writing part that’s hard. What’s hard is sitting down to write. What keeps us from sitting down is Resistance.”",
  "“We must do our work for its own sake, not for fortune or attention or applause.”"
  ];
let finalQuoteActive = false; // becomes true when the story text is done
let quoteAlpha = 0;
let finalQuoteIndex = -1; // will store a randomly chosen quote index

let particles = [];
let starAmount = 6.5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSL);
  rectMode(CENTER);

  textAlign(CENTER, CENTER);
  textFont('Adobe Garamond','Adobe Jenson','serif');
  textLeading(34); 
  textSize(18);

  particles = []
    for(let i = 0; i< int(width/starAmount); i++){
      particles.push(new Particle());
}
}

function draw() {
  background(0,0,5,1);

  for(let i = 0;i<int(width/starAmount);i++) {
    particles[i].createParticle();
    particles[i].moveParticle();
    particles[i].joinParticles(particles.slice(i));
  }
  
  easyEase();
  drawBreathingEllipses();
  
  if (!finalQuoteActive) {
    updateTextFade();
    drawFadingText();
  } else {
    updateQuoteFade();
    drawFinalQuote();
  }
}

class Particle {
  constructor(){
    this.x = random(-20,width+20);
    this.y = random(-20,height+20);
    this.r = random(1,1);
    this.xSpeed = random(-25,25);
    this.ySpeed = random(-1.5,1.5);
  }

  createParticle() {
    noStroke();
    fill('rgba(255,255,255,0)');
    circle(this.x,this.y,this.r);
  }

  moveParticle() {
    // Bounce off the edges:
    if (this.x < -10 || this.x > width + 10)
      this.xSpeed *= -1;
    if (this.y < -10 || this.y > height + 10)
      this.ySpeed *= -1;
  
    // Update the position:
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  
    // Apply friction/damping so the speeds gradually reduce:
    let friction = 0.997;  // Adjust this value: closer to 1 = slower deceleration, lower = faster deceleration
    this.xSpeed *= friction;
    this.ySpeed *= friction;
  }

  joinParticles(particles) {
    let distance = 100;
    let starStroke = 65
    particles.forEach(element =>{
      let dis = dist(this.x,this.y,element.x,element.y);
      if(dis<distance) {
        strokeWeight(starStroke)
        stroke(200,30,6);
        line(this.x,this.y,element.x,element.y);
      }
    });
  }
}

function drawBreathingEllipses() {
  let startSizeBrightnessMap1 = map(startSize,0,targetSize,110,0)
  let startSizeBrightnessMap2 = map(startSize,0,targetSize,0,75)
  let startSizeBrightnessMap3 = map(startSize,100,10,0,75)
  let startSizeHueMap = map(startSize,0,targetSize,200,250)
  let startSizeSatchMap = map(startSize,targetSize-5,targetSize,0,100)
  let startSizeSatchMap2 = map(startSize,100,10,0,100)

    for (let i = 0; i < numLayers; i++) {
      let t = i / (numLayers - 1);             // t goes from 0 (innermost) to 1 (outermost)
      let ellipseSize = lerp(0, startSize, t); // Interpolate size between 0 and startSize
      // Now the inner ellipse (t=0) is more transparent, outer (t=1) fully opaque.
      let alpha = lerp(1, 0, t);         
      noStroke();
      if (!peakReached) {
        fill(startSizeHueMap, 100, startSizeBrightnessMap1, 1);
      } else {
        fill(startSizeHueMap, 100, startSizeBrightnessMap2, 1);
      }
      ellipse(width / 2, height / 2, ellipseSize);
    }

    fill(200, 100, 70, 0.15);
    ellipse(width / 2, height / 2, startSize);
    
    //CORE
    if (startSize < 20){
      fill(100, startSizeSatchMap2, startSizeBrightnessMap3 , 1);
      ellipse(width / 2, height / 2, 5);
    } else {
      fill(0, 0, 100, 1);
      ellipse(width / 2, height / 2, 5);
    }
    noStroke();
    ellipse(width / 2, height / 2, 5);
    
    //OUTER LIMITS
    if (startSize < targetSize-5){
      stroke(0,100,100);
    } else {
      stroke(100,startSizeSatchMap,75);
    }
    strokeWeight(1);
    noFill();
    ellipse(width / 2, height / 2, 400);
}

function easyEase() {
  // Choose the easing factor based on the direction.
  let currentEasing = direction === 1 ? easingFactorIn : easingFactorOut;
  // Determine the target based on the direction.
  let target = direction === 1 ? targetSize : 10;
  // Calculate the change (delta) and then apply the appropriate speed multiplier.
  let delta = (target - startSize) * currentEasing;
  let currentSpeedMultiplier = direction === 1 ? speedMultiplierIn : speedMultiplierOut;
  startSize += delta * currentSpeedMultiplier;
  // Reverse direction when close enough to the target.
  if (abs(target - startSize) < 1) {
    if (direction === 1) {
      peakReached = true;
    } else {
      peakReached = false;
    }
    direction *= -1;
  }
}

function updateTextFade() {
  // Only update story text fade if we haven't reached the final story text.
  if (currentTextIndex < texts.length - 1) {
    if (fadeDirection === 1) { // Fade in
      textAlpha += fadeSpeed;
      if (textAlpha >= 255) {
        textAlpha = 255;
        holdCounter++;
        if (holdCounter > holdTime) {
          fadeDirection = -1;
          holdCounter = 0;
        }
      }
    } else { // Fade out
      textAlpha -= fadeSpeed;
      if (textAlpha <= 0) {
        textAlpha = 0;
        // Move to next text and start fading in
        currentTextIndex = (currentTextIndex + 1) % texts.length;
        fadeDirection = 1;
      }
    }
  } else {
    // When the final story text is reached, and it fades out, trigger final quote mode.
    if (fadeDirection === -1 && textAlpha <= 0) {
      finalQuoteActive = true;
      // Choose a random quote index
      finalQuoteIndex = floor(random(quoteText.length));
      // Reset the quoteAlpha to 0 so we can fade it in.
      quoteAlpha = 0;
    } else if (!finalQuoteActive) {
      // Continue fading the final story text in/out if it's still active.
      if (fadeDirection === 1) { // Fade in
        textAlpha += fadeSpeed;
        if (textAlpha >= 255) {
          textAlpha = 255;
          holdCounter++;
          if (holdCounter > holdTime) {
            fadeDirection = -1;
            holdCounter = 0;
          }
        }
      } else { // Fade out
        textAlpha -= fadeSpeed;
        if (textAlpha < 0) {
          textAlpha = 0;
        }
      }
    }
  }
}

function drawFadingText() {
  push();
  colorMode(RGB, 255);
  fill(255, textAlpha);
  noStroke();
  text(texts[currentTextIndex], width / 2, height / 6);
  pop();
}

function updateQuoteFade() {
  // Increase the quoteAlpha until full opacity.
  if (quoteAlpha < 255) {
    quoteAlpha += fadeSpeed;
    if (quoteAlpha > 255) quoteAlpha = 255;
  }
}

function drawFinalQuote() {
  push();
  colorMode(RGB, 255);
  fill(0,quoteAlpha);
  noStroke();
  rect(width/2,height/2, width, height);
  fill(255, quoteAlpha);
  noStroke();
  text(quoteText[finalQuoteIndex], width / 2, height / 2);
  pop();
}