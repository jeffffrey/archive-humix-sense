var nats = require('nats').connect();


// publish sensor events
setInterval(function(){

    console.log('sending events, time:'+new Date())
    nats.publish('humix.sense.temp.event','{"temp":20}');
    nats.publish('humix.sense.humid.event','{"humid":50}');
    nats.publish('humix.sense.brightness.event','{"brightness":620}');
    
},3000);
