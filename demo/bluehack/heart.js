var nats = require('nats').connect();

nats.publish("humix.sense.eye.command",'{"heartrate":100}');

//process.exit();
