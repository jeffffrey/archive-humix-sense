var nats = require('nats').connect();
nats.publish("humix.sense.eyelid.command",'{"action":"close"}');
