var nats = require('nats').connect();
var should = require('should');

describe("Scenario3-1: Testing humix sensors. ", function(){
    
    describe("After Humix boot up, ", function(){

        it("should continuously receive temp sensor events", function(done){

            nats.publish('humix-sense-temp-event','20');
        });

    })
})
