var nats = require('nats').connect();

nats.publish("humix.sense.eye.commnad",'{"feel":100}');

process.exit();
