var nats = require('nats').connect();
var should = require('should');

describe("Scenario3-1: Testing humix sensors. ", function(){
    
    describe("After Humix boot up, ", function(){

        it("should continuously receive temp sensor events", function(done){

            this.timeout(10000);

            var sid = nats.subscribe("humix.sense.temp.event", function (dataStr){

                var data = JSON.parse(dataStr);
                data.should.have.property('temp');
                data.temp.should.above(0).and.below(50);
                done();
                nats.unsubscribe(sid);
                return;
            });
        });

        
        it("should continuously receive humid sensor events", function(done){

            this.timeout(10000);
            
            var sid = nats.subscribe("humix.sense.humid.event", function (dataStr){
                
                var data = JSON.parse(dataStr);
                data.should.have.property('humid');
                data.humid.should.above(0).and.below(100);
                done();
                nats.unsubscribe(sid);
                return;
            });
        });

        
        it("should continuously receive brightness sensor events", function(done){

            this.timeout(10000);

            var sid = nats.subscribe("humix.sense.brightness.event", function (dataStr){

                var data = JSON.parse(dataStr);
                data.should.have.property('brightness');
                data.brightness.should.above(0).and.below(1024);
                done();
                nats.unsubscribe(sid);
            });
        });


    })
})
