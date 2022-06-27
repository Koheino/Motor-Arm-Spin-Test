/* //////////////// Ramp response measure ////////////////

The script will perform an up and down ramp function with values between "minVal" and "maxVal". Around each ramp the script will keep the output constant (plateau). The ramp will be of duration "t". Data will be continuously recorded during the test.

 ^ Motor Input
 |                    ___maxVal
 |                __/     \__
 |            __/            \ __<-> plateauDuration
 | minVal___/                    \___
 |_________ <t>___<t>________________> Time

///////////// User defined variables //////////// */

var minVal = [1000,1000];       // Min. input value [700us, 2300us]
var maxVal = [1400,1400];     // Max. input value [700us, 2300us]
var t = 5;                	// Time of the ramp input (seconds)
var plateauDuration = 30;   	// Time to wait at each UP plateau (seconds)
var downPlateauDuaration = 20;   // Time to wait at each DOWN plateau (seconds)
var samplesAvg = 20;      	// Number of samples to average at each reading (reduces noise and number of CSV rows)
var repeat = 2;       		// How many times to repeat the same sequence
var filePrefix = "MotorArmTest";
var rampGoDown = true;      	// If set to true, the ramp will go up and down.

///////////////// Beginning of the script //////////////////

//Reading sensors and writing to file continuously
rcb.files.newLogFile({prefix: filePrefix});
readSensor();   // Start the loop. After readSensor(), readDone() followed by readSensor(), etc.

function readSensor(){
    rcb.console.setVerbose(false);
    rcb.sensors.read(readDone, samplesAvg);
    rcb.console.setVerbose(true);
}

function readDone(result){
    rcb.console.setVerbose(false);
    rcb.files.newLogEntry(result,readSensor);
    rcb.console.setVerbose(true);
}

//ESC initialization
rcb.console.print("Initializing ESC...");
rcb.output.set(["escA","escB"],[minVal,minVal]);
rcb.console.warning('<strong>Warning:</strong> ALWAYS USE YOUR PPE DURING THIS TEST!');
rcb.wait(rampUpROTA, 5);

//Dir of Rotation A start
function rampUpROTA(){
    rcb.console.warning('<strong>Warning:</strong> ESC A DIRECTION OF ROTATION TEST!');
    rcb.console.print("Rotating at 1055 ESC A");
    rcb.console.warning('<strong>Warning:</strong> TAKE A NOTE OF THE DIRECTION OF ROTATION (TOP MOTOR), Check Box (..08)');
    rcb.output.ramp(["escA"],[minVal],[1055], 3, RotAPlateau);
   }
//Rotating A
function RotAPlateau() {
    rcb.console.print("Rotating A for 3 sec");
    rcb.wait(rampDownA,3);
}
//Dir of Rotation A stop
function rampDownA() {
    rcb.console.print("Ramping Down to STOP.");
    rcb.output.ramp(["escA"],[1055],[minVal], 7, rampUpROTB);
 }

//Dir of Rotation B start
function rampUpROTB(){
    rcb.console.warning('<strong>Warning:</strong> ESC B DIRECTION OF ROTATION TEST!');
    rcb.console.print("Rotating at 1055 ESC B");
    rcb.console.warning('<strong>Warning:</strong> TAKE A NOTE OF THE DIRECTION OF ROTATION (BOTTOM MOTOR), Check Box (..09)');
    rcb.output.ramp(["escB"],[minVal],[1055], 3, RotBPlateau);
   }
//Rotating B
function RotBPlateau() {
    rcb.console.print("Rotating B for 3 sec");
    rcb.wait(rampDownB,3);
}
//Dir of Rotation B stop
function rampDownB() {
    rcb.console.print("Ramping Down to STOP.");
    rcb.output.ramp(["escB"],[1055],[minVal], 3, endScript);
 }
 //Repeat loop
 function endScript() {
     if(--repeat > 0){
       if(repeat === 0){
         rcb.console.print("Repeating one last time...");
       }else{
         rcb.console.print("Repeating " + repeat + " more times...");
       }
       rampUpROTA();
     }else
     {
        start();
     }
 }
//Spin test starts 1055-1400-1000
function start() {
    rcb.console.warning('<strong>Warning:</strong> HIGH RPM RORATION TEST STARTS!');
    rcb.console.print("High RPM spin test is initiated in 10 sec");
    rcb.wait(startPlateau,10);
}

//Start plateau
function startPlateau(){
    rcb.console.print("STARTING MOTORS IDLE...");
    rcb.output.set(["escA","escB"],[1055,1055]);
    rcb.wait(rampUp,t);
}

//Ramp up to 1100
function rampUp(){
    rcb.console.print("Ramping Up. to 1100");
    rcb.output.ramp(["escA","escB"],[1055,1055],[1100,1100], t, upPlateau);
}

//1100 Plateau
function upPlateau() {
   rcb.console.print("Holding at 1100 for 30 sec");
   rcb.wait(rampUp1, plateauDuration);
}
//Ramp up to 1200
function rampUp1(){
    rcb.console.print("Ramping Up. to 1200");
    rcb.output.ramp(["escA","escB"],[1100,1100],[1200,1200], t, upPlateau1);
}
//1200 Plateau
function upPlateau1() {
    rcb.console.print("Holding at 1200 for 30 sec");
    rcb.wait(rampUp2, plateauDuration);
}
//Ramp up to 1300
function rampUp2(){
    rcb.console.print("Ramping Up. to 1300");
    rcb.output.ramp(["escA","escB"],[1200,1200],[1300,1300], t, upPlateau2);
}
//1300 Plateau
function upPlateau2() {
    rcb.console.print("Holding at 1300 for 30 sec");
    rcb.wait(rampUp1400, plateauDuration);
}
//Ramp up to 1400
function rampUp1400(){
    rcb.console.print("Ramping Up. to 1400");
    rcb.output.ramp(["escA","escB"],[1300,1300],[maxVal,maxVal], t, upPlateau1400);
}
//1400 Plateau
function upPlateau1400() {
    rcb.console.print("Holding at 1400 for 30 sec");
    rcb.wait(rampDown, plateauDuration);
}
//Ramp down to 1200
function rampDown() {
    if(rampGoDown){
    rcb.console.print("Ramping Down to 1200.");
    rcb.output.ramp(["escA","escB"],[maxVal,maxVal],[1200,1200], t, DownPlateau1200);
    }else
        endScript();
}
//1200 Plateau
function DownPlateau1200() {
    rcb.console.print("Holding at 1200 for 20 sec");
    rcb.wait(rampDown1055, downPlateauDuaration);
}
//Ramp down to 1055
function rampDown1055() {
    rcb.console.print("Ramping Down to IDLE.");
    rcb.output.ramp(["escA","escB"],[1200,1200],[1055,1055], t, DownPlateauIdle);
  }
//5 sec 1055 Plateau
function DownPlateauIdle() {
    rcb.console.print("Holding at 1055 for 5 sec");
    rcb.wait(endPlateau, 5);
}

//Motor stop and set to 1000
function endPlateau() {
    rcb.console.print("Settind ESC to 1000");
    rcb.output.set(["escA","escB"],[minVal,minVal]);
    rcb.console.warning('<strong>NOTE:</strong> CHECK BOX (..10) OF THE SIGNOFF SHEET');
    rcb.endScript();
}
