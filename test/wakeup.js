var nats = require('nats').connect();
var should = require('should');

describe("Scenario1: Wake up by NFC. ", function(){
    
    describe("After received a NFC event", function(){

        it("should receieve a wake up event from Humix Think", function(done){

            nats.subscribe("humix.sense.eye.command", function (dataStr){

                var data = JSON.parse(dataStr);
                data.should.have.property('action','wakeup');
                done();
            });

            nats.publish("humix.sense.detect.event",'{"id":"showgirl"}');

        });


        it("should send a wake up command", function(){
            this.timeout(10000);
            nats.publish("humix.sense.eye.command", '{"action":"wakeup"}');
        })

     /* 
        it("should send excited command", function(){

            nats.publish("humix.sense.eye.command", '{"feel":-100}');
        })
*/

    })

    
})
