var nats = require('nats').connect();
var should = require('should');

describe("Sentiment comment ", function(){
    
    describe("After received a possitive comment", function(){

        it("should turn eye to green", function(done){

            nats.publish("humix.sense.eye.event",'{"feel":30}');
            
        });
    })
})
