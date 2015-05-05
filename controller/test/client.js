
var nats = require('nats').connect();


nats.publish('humix.sense.temp.event','20');
