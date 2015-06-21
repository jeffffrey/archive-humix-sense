var nats = require('nats').connect();
nats.publish("humix.sense.eye.command",'{"action":"sleep"}');
nats.publish("humix.sense.eyelid.command",'{"action":"close"}');

//process.exit();
