var nats = require('nats').connect();
nats.publish("humix.sense.cam.command",'{"action":"takePic"}');

//process.exit();
