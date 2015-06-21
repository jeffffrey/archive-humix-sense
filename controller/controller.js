// Event delivery with MQTT
var mqtt = require('mqtt');

// NATS for local message bus
var nats = require('nats').connect();


var request = require('request');
var log = require('logule').init(module, 'controller');


var config = require('./config.js');


var iot_client;

// CONSTANTS
var HEALTH_CHECK_INTERVAL = 5000; // 5 second
var BRIGHTNESS_THRESHOLD = 100;


// HUMIX SENSE STATES

var HUMIX_STATE = {
    SLEEP   : 1,
    NORMAL  : 2,
    EXCITED : 3,
    HAPPY   : 4,
    SAD     : 5,
    HRM_MODE: 6
} 

var HUMIX_EYELID_STATE = {

    CLOSED : 1,
    OPEN   : 2
    
}

var eyelid_state = HUMIX_EYELID_STATE.CLOSED;
var state = HUMIX_STATE.SLEEP;



function init(){

    log.info("Initialize Humix Sense");

    // setup communitcation channel with IoT Foundation
    setupClient();

    // process out going events
    setupControlEvents();

    // process incoming commands
    setupControlCommands();


    
    nats.publish("humix.sense.controller.status","start");


    setInterval(function(){

        log.info("Publish Humix Module Status");


        var sensor_status = {

            'humix.sense.controller.status' : state === HUMIX_STATE.SLEEP ? "sleep" : "wakeup",
            'humix.sense.cam.status'     : 'on',
            'humix.sense.temp.status'    : 'on',
            'humix.sense.humix.status'   : 'on',
            'humix.sense.light.status'   : 'on',
            'humix.sense.nfc.status'     : 'on',
            'humix.sense.speech.status'   : 'on',
            'humix.sense.eye.status'   : 'on',
            'humix.sense.hrm.status'   : 'on'
            
        }


        if(iot_client){
                    
            iot_client.publish('iot-2/evt/humix-sense-controller-status/fmt/json', JSON.stringify(sensor_status) , function() {
                log.info('published control data to IoT foundation');
            });

        }        
    },HEALTH_CHECK_INTERVAL);
    // start health check process
}

function setupClient(){

    log.info("setup iot client");

    // load IoT Foundation config


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

            if(command.feel || command.action){
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

        }else if(topic.indexOf('humix-sense-controller-status') != -1){

            log.info("Query for Humix sense status");

            queryHealthStatus(function(err, data){

                
            });
            
        }

        
    });
    
    
}

function queryHealthStatus(callback){

    

    
}

function setupControlEvents(){

        
    // temperature


    nats.subscribe('humix.sense.temp.event', function(msg){

        log.info('[EVENT][TEMP]:'+ msg);
        
        iot_client.publish('iot-2/evt/humix-sense-temp-event/fmt/json', msg, function() {
            log.info('published temp event data to IoT foundation');            
        });
        
    });



    // humid

    
    nats.subscribe('humix.sense.humid.event', function(msg){

        log.info('[EVENT][HUMID]:'+ msg);
        
        
        iot_client.publish('iot-2/evt/humix-sense-humid-event/fmt/json', msg, function() {
            log.info('published humid event data to IoT foundation');
        });
        
    });

    // brightness events

    nats.subscribe('humix.sense.brightness.event', function(msg){


        log.info('[EVENT][BRIGHTNESS]:'+ msg);


        var data = JSON.parse(msg);
        log.info("brightness level :"+data.brightness);

        if(data.brightness < BRIGHTNESS_THRESHOLD ){

            if(eyelid_state ==  HUMIX_EYELID_STATE.OPEN){
              log.info("close eye");
              nats.publish('humix.sense.eyelid.command', '{"action":"close"}');
              eyelid_state =  HUMIX_EYELID_STATE.CLOSED;
            }         
        
        }else{

           if(eyelid_state ==  HUMIX_EYELID_STATE.CLOSED && state != HUMIX_STATE.SLEEP){
              log.info("open eye");
              nats.publish('humix.sense.eyelid.command', '{"action":"open"}');
              eyelid_state =  HUMIX_EYELID_STATE.OPEN;
           }
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
        nats.publish('humix.sense.eye.command', '{"heartrate":75}');
        
        // TODO publish to nodered
/*
        if(state === HUMIX_STATE.SLEEP){

          //  if(data.id === "showgirl"){
            log.info("NFC TRIGGER WAKING UP");
            state = HUMIX_STATE.NORMAL;

            nats.publish('humix.sense.eye.command', '{"action":"wakeup"}');
            nats.publish('humix.sense.eyelid.command','{"action":"open"}');
            eyelid_state  =  HUMIX_EYELID_STATE.OPEN;
           // }
        }else if (state === HUMIX_STATE.NORMAL){


            log.info("NFC TRIGGER HRM MODE");
            state = HUMIX_STATE.HRM_MODE;
            //nats.publish('humix.sense.eye.command', '{"action":"sleep"}');
            //nats.publish('humix.sense.eyelid.command','{"action":"close"}');
            //eyelid_state =  HUMIX_EYELID_STATE.CLOSED;           
            
        }else if ( state === HUMIX_STATE.HRM_MODE ){
           
            log.info("NFC TRIGGER STATE BACK TO NORMAL");
            state = HUMIX_STATE.NORMAL;
        }
  */      
    });


    // hrm event

    nats.subscribe('humix.sense.hrm.event', function(msg){


        if(state == HUMIX_STATE.HRM_MODE){
            var data = JSON.parse(msg);

            log.info('[EVENT][HRM], rate:'+data.value);
            
            nats.publish('humix.sense.eye.command', '{"heartrate":'+data.value+'}');
        }
    });


    // speech event

    nats.subscribe('humix.sense.speech.event', function(msg){

        log.info('[EVENT][SPEECH]');

        var command = {'command': msg};

        console.log("command :"+ JSON.stringify(command));
        iot_client.publish('iot-2/evt/humix-sense-speech-event/fmt/json', JSON.stringify(command), function() {
            log.info('published speech event data to IoT foundation');
        });
        
    });
    
    // camera event

    nats.subscribe('humix.sense.cam.event', function(msg){

        log.info('[EVENT][CAM]');

        var url = config.cam_url;
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

