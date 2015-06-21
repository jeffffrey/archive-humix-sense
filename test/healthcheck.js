var nats = require('nats').connect();
var should = require('should');

describe("Checking health status of each component ", function(){

    
    describe("Checking core controller", function(){

        it("should return pong message", function(done){

            nats.publish('humix.sense.speech.command','{"text": "testing controller"}');
            
            this.timeout(5000)
            nats.request('humix.sense.controller.ping', function(response){

                
                response.should.be.equal('humix.sense.controller.pong');
                nats.publish('humix.sense.speech.command','{"text": "controller is alive"}');

                done();
            })
   
        });


    });

    describe("Checking eye module", function(){

        it("should return pong message", function(done){

            nats.publish('humix.sense.speech.command','{"text": "testing eye module"}');
            
            this.timeout(5000)
            nats.request('humix.sense.eye.status.ping', function(response){

                response.should.be.equal('humix.sense.eye.status.pong');
                nats.publish('humix.sense.speech.command','{"text": "eye module is alive"}');
                done();
            })
   
        });


    });


    describe("Checking eyelid module", function(){

        it("should return pong message", function(done){

            nats.publish('humix.sense.speech.command','{"text": "testing eyelid module"}');
            
            this.timeout(5000)
            nats.request('humix.sense.eyelid.status.ping', function(response){

                response.should.be.equal('humix.sense.eyelid.status.pong');
                nats.publish('humix.sense.speech.command','{"text": "eyelid module is alive"}');
                done();
            })
   
        });

    });

    describe("Checking nfc module", function(){

        it("should return pong message", function(done){

            nats.publish('humix.sense.speech.command','{"text": "testing nfc module"}');
            
            this.timeout(10000)

            nats.request('humix.sense.nfc.status.ping', function(response){

                response.should.be.equal('humix.sense.nfc.status.pong');
                nats.publish('humix.sense.speech.command','{"text": "nfc module is alive"}');
                done();
            })
   
        });

    });

    

    
    describe("Checking light module", function(){

        it("should return pong message", function(done){

            nats.publish('humix.sense.speech.command','{"text": "testing light module"}');
            
            this.timeout(5000)

            nats.request('humix.sense.bright.status.ping', function(response){

                response.should.be.equal('humix.sense.bright.status.pong');
                nats.publish('humix.sense.speech.command','{"text": "light module is alive"}');
                done();
            })
   
        });

    });

    
    
    describe("Checking temperature module", function(){

        it("should return pong message", function(done){

            nats.publish('humix.sense.speech.command','{"text": "testing temperature module"}');
            
            this.timeout(5000)

            nats.request('humix.sense.temp.status.ping', function(response){

                response.should.be.equal('humix.sense.temp.status.pong');
                nats.publish('humix.sense.speech.command','{"text": "Temperature module is alive"}');
                done();
            })
   
        });

    });

    
    describe("Checking TTS module", function(){

        it("should return pong message", function(done){

            nats.publish('humix.sense.speech.command','{"text": "testing text to speech module"}');
            
            this.timeout(30000)

            nats.request('humix.sense.speech.status.ping', function(response){

                response.should.be.equal('humix.sense.speech.status.pong');
                nats.publish('humix.sense.speech.command','{"text": "Text to speech module is alive"}');
                done();
            })
   
        });

    });


})
