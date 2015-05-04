var nats = require('nats').connect();




// Simple Publisher
nats.publish('foo', 'Hello World!');

/*

// Close connection
nats.close();

*/
