var nats = require('nats').connect();





// Simple Subscriber
nats.subscribe('foo', function(msg) {
    console.log('Received a message: ' + msg);
    
});

/*
// Close connection
nats.close();

*/
