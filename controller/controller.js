var mqtt = require('mqtt');
var nats = require('nats').connect();
var log = require('logule').init(module, 'controller');

var iot_client;


var health_check_interval = 5; // 5 second


function init(){

    log.info("Starting up..");
        
    // init mqtt-based IoT client
    setupClient();

    setupClientEvents();

    nats.publish("humix.sense.controller.status","start");


    // start health check process
}

function setupClient(){

    log.info("setup iot client");

    // load IoT Foundation config

    var config = require('./config.js');

    log.info("config:"+JSON.stringify(config));

    var clientId = ['d', config.org, config.type, config.id].join(':');
    
    
    iot_client = mqtt.connect("mqtts://" + config.org + '.messaging.internetofthings.ibmcloud.com:8883',
                          {
                              "clientId" : clientId,
                              "keepalive" : 30,
                              "username" : "use-token-auth",
                              "password" : config.authToken
                          });


    iot_client.on('connect', function() {
        
       log.info('Humix client connected to IBM IoT Cloud.');

    }
    )
    
};

function setupClientEvents(){

    nats.subscribe('humix.sense.controller.command', function(msg) {

        switch(msg){

        case 'stop':
            stop();
            break;

        default:
            break;
        }        
    });

    nats.subscribe('humix.sense.controller.status', function(msg) {

        if(msg === 'ping')
            nats.publish('humix.sense.controller.status','pong');
        
    });


    // temperature


    nats.subscribe('humix.sense.temp.event', function(msg){

        log.info('[EVENT][TEMP]:'+ JSON.stringify(msg));
        
        iot_client.publish('iot-2/evt/humix-sense-temp-event/fmt/json', JSON.stringify(msg), function() {
            console.log('published temp event data to IoT foundation');
        });
        
    });
    
    // humix

    
    nats.subscribe('humix.sense.humix.event', function(msg){

        log.info('[EVENT][HUMID]:'+ JSON.stringify(msg));
        
        
        iot_client.publish('iot-2/evt/humix-sense-humid-event/fmt/json', JSON.stringify(msg), function() {
            console.log('published humid event data to IoT foundation');
        });
        
    });
    
    // voice

    nats.subscribe('humix.sense.voice.event', function(msg){

        log.info('[EVENT][VOICE]:'+ JSON.stringify(msg));
        
        
        iot_client.publish('iot-2/evt/humix-sense-voice-event/fmt/json', JSON.stringify(msg), function() {
            console.log('published voice event data to IoT foundation');
        });
        
    });

}
                  
function stop(){

    log.info("Stopping");
    // TODO : clean up resource
    
}


init();

