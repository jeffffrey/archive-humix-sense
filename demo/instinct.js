var nats = require('nats').connect();
var should = require('should');

describe(" Testing humix instinct. ", function(){
    
    describe("When light is too strong, ", function(){

        
        
        it("should turn down the brightness level ", function(done){

            this.timeout(3000);

            var sid = nats.subscribe("humix.sense.eyelid.command", function (dataStr){

                var data = JSON.parse(dataStr);
                data.should.have.property('action','close');
                done();
                nats.unsubscribe(sid);
            });

            nats.publish('humix.sense.brightness.event','{"brightness": 200}');
        });
        
        
    });
    
})
