var nats = require('nats').connect();
var should = require('should');

describe("Scenario1: Wake up by NFC. ", function(){
    
    describe("After received a NFC event", function(){


        it("should send a wake up command", function(){
            nats.publish("humix.sense.eyelid", '{"action":"open"}');
        })

    })

    
})
