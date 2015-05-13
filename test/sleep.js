var nats = require('nats').connect();
var should = require('should');

describe("Scenario1: Wake up by NFC. ", function(){
    
        it("should send a wake up command", function(){
            this.timeout(10000);
            nats.publish("humix.sense.eye.command", '{"action":"sleep"}');
            nats.publish("humix.sense.eyelid.command", '{"action":"close"}');
        })

    
})
