var mqtt = require('mqtt');
var nats = require('nats').connect();
var log = require('logule').init(module, 'controller');

var request = require('request');

var iot_client;


var health_check_interval = 5; // 5 second
var BRIGHTNESS_THRESHOLD = 300;

var HUMIX_STATE = {
    SLEEP   : 1,
    NORMAL  : 2,
    EXCITED : 3,
    HAPPY   : 4,
    SAD     : 5
} 

var HUMIX_EYELID_STATE = {

    CLOSED : 1,
    OPEN   : 2
    
}

// TODO
var HUMIX_EYE_STATE;


var state = HUMIX_STATE.SLEEP;

function init(){

    log.info("Starting up..");
        
    // init mqtt-based IoT client
    setupClient();

    setupControlEvents();

    setupControlCommands();
    
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

function setupControlCommands(){

    iot_client.subscribe('iot-2/cmd/+/fmt/+', function(err, granted){

        log.info('subscribed command, granted: '+ JSON.stringify(granted));
        
    });

    iot_client.on("message", function(topic,payload){

        log.info('received topic'+topic+', payload:'+payload);

        var command = JSON.parse(payload);
        if(topic.indexOf('humix-sense-eye-command') != -1){

            if(command.feel){
               // log.info('adjust eye with feel:'+feel);
                nats.publish('humix.sense.eye.command', JSON.stringify(command));
            }
            
        }else if(topic.indexOf('humix-sense-speech-command') != -1 ){

            log.debug('say:'+payload);
            nats.publish('humix.sense.speech.command', JSON.stringify(command));

        }else if(topic.indexOf('humix-sense-cam-command') != -1){
            log.info("taking picture");
            nats.publish('humix.sense.cam.command', JSON.stringify(command));

        }else if(topic.indexOf('humix-sense-eyelid-command') != -1){
            log.info("eyelid command");
            nats.publish('humix.sense.eyelid.command',JSON.stringify(command));            
        }

        
    });
    
    
}

function setupControlEvents(){


    /*
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

    */


    
    
    // temperature


    nats.subscribe('humix.sense.temp.event', function(msg){

        log.info('[EVENT][TEMP]:'+ msg);
        
        iot_client.publish('iot-2/evt/humix-sense-temp-event/fmt/json', JSON.stringify(msg), function() {
            log.debug('published temp event data to IoT foundation');
            
        });
        
    });
    
    // humid

    
    nats.subscribe('humix.sense.humid.event', function(msg){

        log.info('[EVENT][HUMID]:'+ msg);
        
        
        iot_client.publish('iot-2/evt/humix-sense-humid-event/fmt/json', msg, function() {
            log.debug('published humid event data to IoT foundation');
        });
        
    });

    // brightness events

    nats.subscribe('humix.sense.brightness.event', function(msg){


        log.info('[EVENT][BRIGHTNESS]:'+ msg);


        var data = JSON.parse(msg);
        log.info("brightness level :"+data.brightness);

        if(data.brightness < BRIGHTNESS_THRESHOLD ){

            nats.publish('humix.sense.eyelid.command', '{"action":"close"}');

        }

        
        iot_client.publish('iot-2/evt/humix-sense-brightness-event/fmt/json', msg, function() {
            log.info('published brightness event data to IoT foundation');
        });

        
    });

    
    // voice
/*
    nats.subscribe('humix.sense.voice.event', function(msg){

        log.info('[EVENT][VOICE]:'+ JSON.stringify(msg));
        
        
        iot_client.publish('iot-2/evt/humix-sense-voice-event/fmt/json', JSON.stringify(msg), function() {
            console.log('published voice event data to IoT foundation');
        });
        
    });
*/

    // nfc events

    nats.subscribe('humix.sense.detect.event', function(msg){


        log.info('[EVENT][NFC]:' + msg);

        var data = JSON.parse(msg);
        
        // TODO publish to nodered

        if(state === HUMIX_STATE.SLEEP){

            if(data.id === "showgirl"){
                log.info("WAKING UP");
                state = HUMIX_STATE.NORMAL;

                nats.publish('humix.sense.eye.command', '{"action":"wakeup"}');
                nats.publish('humix.sense.eyelid.command','{"action":"open"}');
            }
        }else if (state === HUMIX_STATE.NORMAL){

            if(data.id === "showgirl"){
                log.info("GETTING Excited");

                nats.publish('humix.sense.eye.command', '{"feel":"excited"}');
            }
            
        }
        
    });



    // camera event

    nats.subscribe('humix.sense.cam.event', function(msg){

        log.info('[EVENT][CAM]');

        /*
        iot_client.publish('iot-2/evt/humix-sense-cam-event/fmt/json', msg, function() {      
//        iot_client.publish('iot-2/evt/humix-sense-cam-event/fmt/json', JSON.stringify(msg), function() {
            console.log('published voice event data to IoT foundation');
        });
        */

        //console.log('msg:'+msg);
        var url = "http://humix-think.mybluemix.net/face";

        request.post({
            url: url,
            body: msg,
            headers: {

                "Content-Type" : "application/json"
            }
                
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(body)
                        
            }
            else {

                console.log("error: " + error)
                console.log("response.statusCode: " + response.statusCode)
                console.log("response.statusText: " + response.statusText)
                        
            }
                
        })

        
        // TODO publish picture to nodered
        //nats.publish('humix.sense.speech.command','{"age":18}');
        
    })
    

    
}
                  
function stop(){

    log.info("Stopping");
    // TODO : clean up resource
    
}


init();

