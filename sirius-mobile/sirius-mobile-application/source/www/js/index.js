/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

var image, audio;
var storage = window.localStorage;
var mediaTimer = null;
var media = null;

function onload() {
    // var xmlDoc = loadXMLDoc("config.xml");
    // ip = xmlDoc.getElementsByTagName("ip")[0].childNodes[0].nodeValue;
    // asr_port = xmlDoc.getElementsByTagName("asr")[0].childNodes[0].nodeValue;
    // imm_port = xmlDoc.getElementsByTagName("imm")[0].childNodes[0].nodeValue;
    // qa_port = xmlDoc.getElementsByTagName("qa")[0].childNodes[0].nodeValue;

    document.getElementById("ip").value = storage.getItem("ip");
    document.getElementById("asr").value = storage.getItem("asr");
    document.getElementById("imm").value = storage.getItem("imm");
    document.getElementById("qa").value = storage.getItem("qa");

}

window.addEventListener("load", onload);

function updateDefaults(key, value) {
    storage.setItem(key, value);
}

// Called when capture operation is finished
function captureImageSuccess(mediaFiles) {
    var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        //uploadFile(mediaFiles[i]);
        image = mediaFiles[i];
        $('#image_file').empty();
        $('#image_file').append(image.name);
    }
}

function captureAudioSuccess(mediaFiles) {
    var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        //uploadFile(mediaFiles[i]);
        audio = mediaFiles[i];
        console.log(audio.type);
        $('#question').value = "";
        $('#audio_file').empty();
        $('#audio_file').append(audio.name);
        // "<button id='playAudio'>Play</button>"
        $('#audio_file').append("<button class='btn2' id='playAudio' style='margin-left:3px'>Play</button>");
        // $('#audio_file').append("<button class='btn2' id='pauseAudio'>Pause</button>");
        // $('#audio_file').append("<button class='btn2' id='stopAudio'>Stop</button>");
        // <p id='audio_position'></p>
        // $('#audio_file').append("<p id='audio_position'></p>");
        document.getElementById("playAudio").addEventListener("click",playAudio);
        // document.getElementById("pauseAudio").addEventListener("click",pauseAudio);
        // document.getElementById("stopAudio").addEventListener("click",stopAudio);
    }
}

// Called if something bad happens.
function captureError(error) {
    var msg = 'An error occurred during capture: ' + error.code;
    navigator.notification.alert(msg, null, 'Uh oh!');
}

// A button will call this function
function captureAudio() {
    // Launch device audio recording application,
    // allowing user to capture up to 2 audio clips
    navigator.device.capture.captureAudio(captureAudioSuccess, captureError, { limit: 1 });
}
document.getElementById("captureAudio").addEventListener("click",captureAudio);

 // A button will call this function            
function captureImage() {
    // Launch device camera application,
    // allowing user to capture up to 2 images
    navigator.device.capture.captureImage(captureImageSuccess, captureError, { limit: 1 });
}
document.getElementById("captureImage").addEventListener("click",captureImage);

function playAudio() {
    if (audio == null) {
        // Nothing to play
        return;
    } 
    media = new Media(audio.fullPath, onSuccess, onError);
    // Play audio
    media.play();

    // Update my_media position every second
    // if (mediaTimer == null) {
    //     mediaTimer = setInterval(function() {
    //         // get my_media position
    //         media.getCurrentPosition(
    //             // success callback
    //             function(position) {
    //                 if (position > -1) {
    //                     setAudioPosition((position) + " sec");
    //                 }
    //             },
    //             // error callback
    //             function(e) {
    //                 console.log("Error getting pos=" + e);
    //                 setAudioPosition("Error: " + e);
    //             }
    //         );
    //     }, 1000);
    // }
}

// Pause audio
//
function pauseAudio() {
    if (media) {
        media.pause();
    }
}

// Stop audio
//
function stopAudio() {
    if (media) {
        media.stop();
    }
    clearInterval(mediaTimer);
    mediaTimer = null;
}

// onSuccess Callback
//
function onSuccess() {
    console.log("playAudio():Audio Success");
}

// onError Callback
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

// Set audio position
//
function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
}

// function getPhoto() {
//     // Retrieve image file location from specified source
//     navigator.camera.getPicture(captureImageSuccess, captureError, {
//         quality: 30,
//         targetWidth: 600,
//         targetHeight: 600,
//         destinationType: destinationType.FILE_URI,
//         sourceType: pictureSource.PHOTOLIBRARY
//     });
// }
// document.getElementById("getImage").addEventListener("click",getPhoto());


function sendToServer() {
    
    if(image){
        // uploadFile(image);
        $('#response').empty();
        $('#response').append("<p>Sending...</p>");
        type = "image/jpeg";
        headers = {
            Connection: "Close",
            'Content-Type': String(type)
        };
        uploadFile(image, getAddress(getItem('imm')), type, headers);
    } else {
        if(audio){
            $('#response').empty();
            $('#response').append("<p>Sending...</p>");
            type = "audio/wav";
            headers = {
                Connection: "Close",
                'Content-Type': String(type + '; rate=16000')
                // 'Content-Type': String(type)
            };
            uploadFile(audio, getAddress(getItem('asr')), type, headers);
        } else {
            //send text to server
            q = document.getElementById("question").value
            if(q) {
                $('#response').empty();
                $('#response').append("<p>Sending...</p>");
                queryServer(q);
            } else {
                $('#response').empty();
                $('#response').append("<p>Nothing to send</p>");
            }
        }
    }
}
document.getElementById("sendToServer").addEventListener("click",sendToServer);

function getItem(key) {
    return document.getElementById(key).value;
}

function getAddress(port) {
    return 'http://' + getItem('ip') + ':' + port;
}

function queryServer(query) {
    q = getAddress(getItem('qa')) + '?query=' + query;
    $.get(q).done(function( data ) {
        processResponse(data);
    });
}

// Upload files to server
function uploadFile(mediaFile, addr, type, headers) {
    var ft = new FileTransfer(),
        path = mediaFile.fullPath,
        name = mediaFile.name;

    var options = new FileUploadOptions();
    options.fileKey = 'file';
    // options.fileName = name.replace(name.substr(0, name.lastIndexOf('/')+1), '/tmp/');
    options.fileName = name;
    options.mimeType = type;
    options.chunkedMode = false;
    options.headers = headers;

    ft.upload(
        encodeURI(path),
        encodeURI(addr),
        function(result) {
            console.log('Upload success: ' + result.responseCode);
            console.log("Response: " + result.response);
            console.log(result.bytesSent + ' bytes sent');
            processResponse(result.response);
        },
        function(error) {
            $('#response').empty();
            $('#response').append("<p>Error uploading file</p>");
            console.log('Error uploading file ' + path + ': ' + error.code);
        },
        options);
}

function processResponse(data) {
    $('#response').empty();
    if(data) {
        $('#response').append("<p>" + data + "</p>");
        TTS.speak({
            text: String(data),
            locale: 'en-GB',
            rate: 0.75
        }, function () {
            //do nothing
        }, function (reason) {
            navigator.notification.alert(reason, null, 'Uh oh!');
        });
    } else {
        $('#response').append("<p>Response is empty</p>");
    }
}
