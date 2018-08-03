var phidget22 = require('phidget22');

var SERVER_PORT = 5661;

function main() {

	if (process.argv.length != 3) {
		console.log('usage: node LCD.js <server address>');
		process.exit(1);
	}
	var hostname = process.argv[2];

	console.log('connecting to:' + hostname);
	var conn = new phidget22.Connection(SERVER_PORT, hostname, { name: 'Server Connection', passwd: '' });
	conn.connect()
		.then(runExample)
		.catch(function (err) {
			console.error('Error running example:', err.message);
			process.exit(1);
		});
}

function runExample() {

	console.log('connected to server');
	var lcdDisplay = new phidget22.LCD();
    var digitalOutput = new phidget22.DigitalOutput(0);



    var exTimer;

	function updateState() {
		var newState = !digitalOutput.getState();
		console.log('\nSetting state to ' + newState + ' for 5 seconds...');
        digitalOutput.setState(newState);
        let message = `output is ${!newState}`;
        lcdDisplay.clear();
        lcdDisplay.writeText(phidget22.LCDFont.DIMENSIONS_5X8, 0, 0, message);
        lcdDisplay.flush();
	}

	/* Uncomment the following lines to open a hub port */
	//	ch.setHubPort(<port number>);
	//	ch.setIsHubPortDevice(true);	/* open the VINT hub port */

	digitalOutput.onAttach = function (digitalOutput) {
		console.log(digitalOutput + ' attached');
		console.log('\nSetting state to true for 5 seconds...');
		digitalOutput.setState(true);
		exTimer = setInterval(function () { updateState() }, 5000);
	};

	digitalOutput.onDetach = function (digitalOutput) {
		console.log(digitalOutput + ' detached');
		clearInterval(exTimer);
	};

	lcdDisplay.onAttach = function (lcdDisplay) {
		console.log(lcdDisplay + ' attached');
		if (lcdDisplay.getDeviceID() === phidget22.DeviceID.PN_1204)
			lcdDisplay.setScreenSize(phidget22.LCDScreenSize.DIMENSIONS_2X40);
        lcdDisplay.setBacklight(1);
        lcdDisplay.writeText(phidget22.LCDFont.DIMENSIONS_5X8, 0, 0, "Two Lines!");
		lcdDisplay.writeText(phidget22.LCDFont.DIMENSIONS_5X8, 0, 1, "Phidgets");
		lcdDisplay.flush();
	};

	lcdDisplay.onDetach = function (lcdDisplay) {
		console.log(lcdDisplay + ' detached');
    };

    digitalOutput.open().then(function (digitalOutput) {
		console.log('channel open');
	}).catch(function (err) {
		console.log('failed to open the channel:' + err);
	});

	lcdDisplay.open().then(function (lcdDisplay) {
		console.log('channel open');
	}).catch(function (err) {
		console.log('failed to open the channel:' + err);
	});
}

if (require.main === module)
	main();
