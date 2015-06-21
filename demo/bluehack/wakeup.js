var nats = require('nats').connect();
nats.publish("humix.sense.eye.command",'{"action":"wakeup"}');
nats.publish("humix.sense.eyelid.command",'{"action":"open"}');

//process.exit();
