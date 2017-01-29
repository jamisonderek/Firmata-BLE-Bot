/*
Martin Kronberg
October 2016

npm install johnny-five
npm install ble-serial
npm install keypress
*/

var five = require("johnny-five"),
  board, motor, led;
var BLESerialPort = require('ble-serial').SerialPort;

var keypress = require('keypress');

//use the virtual serial port to send a command to a firmata device
var bleSerial = new BLESerialPort({localName: 'FIRMATA'});
var board = new five.Board({port: bleSerial, repl: false});

var currentSpeed = 255;

board.on("ready", function() {

  //load atafruit motor shield configs
  var configs = five.Motor.SHIELD_CONFIGS.ADAFRUIT_V2;
  //create each motor
  var motor1 = new five.Motor(configs.M1);
  var motor2 = new five.Motor(configs.M2);
  var motor3 = new five.Motor(configs.M3);
  var motor4 = new five.Motor(configs.M4);

  //set high level drive functions
  function forward(speed){
    motor1.reverse(speed);
    motor2.forward(speed);
    motor3.forward(speed);
    motor4.reverse(speed);
    }

  function reverse(speed){
    motor1.forward(speed);
    motor2.reverse(speed);
    motor3.reverse(speed);
    motor4.forward(speed);
    }

  function left(speed){
    motor1.forward(speed);
    motor2.forward(speed);
    motor3.forward(speed);
    motor4.forward(speed);
    }

  function right(speed){
    motor1.reverse(speed);
    motor2.reverse(speed);
    motor3.reverse(speed);
    motor4.reverse(speed);
    }

    function stop(){
      motor1.stop();
      motor2.stop();
      motor3.stop();
      motor4.stop();
      }

  // make `process.stdin` begin emitting "keypress" events
    keypress(process.stdin);

    // listen for the "keypress" event
  process.stdin.on('keypress', function (ch, key) {
    console.log('got "keypress"', key);

    //make it so you can close the process with ctrl-c...
    if (key && key.ctrl && key.name == 'c') {
          process.exit();
        }

    if (key && key.name == 'w') {
      forward(currentSpeed);
      console.log('forward command');

    }

    if (key && key.name == 's') {
      reverse(currentSpeed);
      console.log('reverse command');

    }

    if (key && key.name == 'a') {
      left(currentSpeed);
      console.log('left command');

    }

    if (key && key.name == 'd') {
      right(currentSpeed);
      console.log('right command');

    }

    if (key && key.name == 'q') {
      stop();
      console.log('stop');

    }

    if (key && key.name == 'z') {
      if (currentSpeed>1) 
      { 
         currentSpeed--; 
      }
      console.log('speed:'+currentSpeed);

    }

    if (key && key.name == 'x') {
      if (currentSpeed<255) 
      { 
         currentSpeed++; 
      }
      console.log('speed:'+currentSpeed);

    }
  });

  process.stdin.setRawMode(true);

});
