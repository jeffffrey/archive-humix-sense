var nats = require('nats').connect();
var should = require('should');

describe("Scenario1: Wake up via FB. ", function(){
    
    describe("After received a FB hello message event", function(){

        it("should  wake up ", function(done){

            nats.publish("humix.sense.eye.event",'{"action":"wakeup"}');
            nats.publish("humix.sense.eyelid.event",'{"action":"open"}');

            
        });
    })
})
