var nats = require('nats').connect();
var should = require('should');

describe("Scenario1: sleep via command. ", function(){
    
    describe("After received a sleep command", function(){

        it("should sleep ", function(done){

            nats.publish("humix.sense.eye.event",'{"action":"sleep"}');
            nats.publish("humix.sense.eyelid.event",'{"action":"close"}');
            
        });
    })
})
