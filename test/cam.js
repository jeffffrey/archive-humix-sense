var nats = require('nats').connect();
var should = require('should');

describe("Scenario 5 : How old am I.  ", function(){

    describe("After received a cam command from Humix Think", function(){

        it("should received a corresponding cam event from cam controller", function(done){


            this.timeout(10000);


            var sid = nats.subscribe('humix.sense.cam.event', function(dataStr){

                var data = JSON.parse(dataStr);
                data.should.have.property('image');
                console.log(dataStr);
                nats.unsubscribe(sid);
                done();
            })

            nats.publish('humix.sense.cam.command', '{"action":"takePic"}');
        });
        
    });

    
    describe("After send a picture to Humix Think", function(){

        it("should receieve a speech command from Humix Think", function(done){

            this.timeout(10000);

            var sid = nats.subscribe("humix.sense.speech.command", function (dataStr){

                var data = JSON.parse(dataStr);
                data.should.have.property('age');
                data.age.should.above(0).and.below(100);
                nats.unsubscribe(sid);
                done();
            });

            nats.publish("humix.sense.cam.event","somedata");

        });
    })
})
