$( document ).ready(function() {
    searchsong()
    document.addEventListener('play', function(e){
        audios = document.getElementsByTagName('audio');
        for(var i = 0, len = audios.length; i < len;i++){
            if(audios[i] != e.target){
                audios[i].pause();
            }
        }
    }, true);

    $("#searchsong").on('keypress',function(e) {
        if(e.which == 13) {
            searchsong()
        }
    });
    $("#searchsinger").on('keypress',function(e) {
        if(e.which == 13) {
            searchsong()
        }
    });

    $("#soundeffect").change(function() {
        if($("#soundeffect").val() == effectchoose){
            $("#buttoneffect").prop("disabled",true);
            $("#buttoneffect").html('Đang Chọn');
        }else{
            $("#buttoneffect").prop("disabled",false);
            $("#buttoneffect").html('Chọn');
        }
    });

    /*  document.onkeydown = function(e) {
        if(event.keyCode == 123) {
          console.log('You cannot inspect Element');
           return false;
        }
        if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
          console.log('You cannot inspect Element');
          return false;
        }
        if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
          console.log('You cannot inspect Element');
          return false;
        }
        if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
          console.log('You cannot inspect Element');
          return false;
        }
        if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
          console.log('You cannot inspect Element');
          return false;
        }
      }
    // prevents right clicking
    document.addEventListener('contextmenu', e => e.preventDefault());*/
/*    navigator.mediaDevices.enumerateDevices()
        .then(function(devices) {
                devices.forEach(function(device) {
                  if (device.kind == 'audioinput') {
                    console.log(device)
                  }
                });
        })
        .catch(function(err) {
            console.log(err.name + ": " + err.message);
        });*/
/*    var types = ["video/webm",
        "audio/webm",
        "video/webm\;codecs=vp8",
        "video/webm\;codecs=daala",
        "video/webm\;codecs=h264",
        "audio/webm\;codecs=opus",
        "video/mpeg"];

    for (var i in types) {
        console.log( "Is " + types[i] + " supported? " + (MediaRecorder.isTypeSupported(types[i]) ? "Maybe!" : "Nope :("));
    }*/
    //connection.addEventListener('change', updateConnectionStatus)
});

var explainarr = ["",
        {title: "Hiệu ứng âm vang", text: "&bull; Giúp bài thu có thêm tiếng vang như trong phòng thu âm<br>&bull; Giúp giọng hát hòa chung với nền nhạc<br>&bull; Dùng cho giọng chưa đủ khỏe<br>&bull; Không khuyến khích dùng khi muốn phô diễn giọng hát"}

    ]

function explainEffect(){
    var effect = $("#soundeffect").val()
    if(effect == 0){
        $("#explaineffecttext").html(explainarr[effect])
    }
    if(effect == 1){
        $("#explaineffecttext").html(`<center><span style="color: white; font-weight: bold">${explainarr[effect].title}</span></center><p style="color: #c1c1c1;margin-left: 5%;line-height: 150%">${explainarr[effect].text}</p><br>`)
    }
}

function blurloading(done){
    if(done == "done"){
        $("#voicerecord").css("pointer-events", "")
        $("#boxnewsong").css("pointer-events", "")
        $("#loadingsvg").css("display", "none")
        var filterVal = 'blur(0px)';
        $('#voicerecord')
            .css('filter',filterVal)
            .css('webkitFilter',filterVal)
            .css('mozFilter',filterVal)
            .css('oFilter',filterVal)
            .css('msFilter',filterVal);
    }else{
        $("#voicerecord").css("pointer-events", "none")
        $("#boxnewsong").css("pointer-events", "none")
        $("#loadingsvg").css("display", "")
        var filterVal = 'blur(100px)';
        $('#voicerecord')
            .css('filter',filterVal)
            .css('webkitFilter',filterVal)
            .css('mozFilter',filterVal)
            .css('oFilter',filterVal)
            .css('msFilter',filterVal);
    }

}



/*var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
var type = connection.effectiveType;

function updateConnectionStatus() {
    type = connection.effectiveType;
}*/






$(".pagination").on('click', function (e){
    e.preventDefault();
    goToByScroll(this.id);
});
var haschangeimage = false
var checkvp8 = false
var changesongandrecord = true
var typerecord = "withvideo"
var chunks = []
var mediaRecorder
var volumevalue = 85
var audios
var width
var height
var duration = 0
var interVal
window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

if(!window.mobilecheck()){

    widthusercamera = window.screen.width/3
    heightusercamera = window.screen.height/3
    width = window.screen.width - 200
    height = width * 9 / 16
}else{

    width = window.screen.width
    height = window.screen.width * 9 / 16
}

var effectchoose = 0


var recording = false
var allsongs
var pause = false;
var singed = false
URL = window.URL || window.webkitURL;
var gumStream;
//stream from getUserMedia()
var rec;
//Recorder.js object
var input;
var countrec = 0
//MediaStreamAudioSourceNode we'll be recording
// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext;
//new audio context to help us record
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
//add events to those 3 buttons
recordButton.addEventListener("click", GrantPermission);
stopButton.addEventListener("click", stopRecording);

/* Disable the record button until we get a success or fail from getUserMedia() */

recordButton.disabled = false;
stopButton.disabled = true;
var player = null;
var tag = document.createElement('script');
var songchooseid = ""
var loaddone = false
var songName


var player
var player2
player = videojs('my-player', {
    controls: true,
    preload: 'auto',
    width: width,
    height: height,
    plugins: {
        videoJsResolutionSwitcher: {
            default: 'high',
        }
    },
    controlBar: {
        volumePanel: {"inline": false}
    }
});

$("#my-player").hide()

function chooseSong(idsong){

    stopAudio()
    $("#remindChooseSong").css("display", "none");
    $("#containerplayer").css("display", "")
    $("#countdown").css("display", "none");
    goToByScroll("divbocngoai");
    stopRecording("change")
    if(rec != null){
        pause = false
        stopButton.disabled = true;
        recordButton.disabled = false;
        rec.stop();
    }
    // 2. This code loads the IFrame Player API code asynchronously.
    songchooseid = idsong
//
    $("#my-player").show()
    console.log(width)
    $.ajax({
        url: '/checktogettypevideo/',
        type: 'POST',
        data: {idsong: idsong}
    }).then(res => {
        console.log(res)
        if(res.check480){
                if(!window.mobilecheck()){
                    player.updateSrc([
                        {
                            src: '/videos/'+res.link,
                            type: 'video/mp4',
                            label: 'full hd 1080',
                            res: '1080'
                        },
                        {
                            src: '/videos/'+res.link480,
                            type: 'video/mp4',
                            label: 'sd 480',
                            res: '480'
                        }
                    ]);
                }else{
                    player.src({type: 'video/mp4', src: '/videos/'+res.link480});
                }

        }else{
            player.updateSrc([{type: 'video/mp4', src: '/videos/'+res.link, label: 'default'}]);
        }
        player.poster('/thumbnails/'+idsong+'.jpg');
        player.autoplay(true)
        player.controls(true)
        $("#thongtinbaihat").width(width)
        $("#thongtinbaihat").html(`${res.songname} - ${res.counttimesing} lượt hát <br>
          Link bài hát gốc: <a href="${res.linkoriginsong}" target="_blank" onclick="listensong()">${res.linkoriginsong}</a>`)
    })


}

function listensong(){
    player.pause()
}


function searchsong(paging_num){
    var namesong = $("#searchsong").val()
    var singer = $("#searchsinger").val()
    $.ajax({
        url: '/searchsongs',
        type: 'POST',
        data: {namesong: namesong, singer: singer, paging_num: paging_num}
    })
        .then(res => {
            allsongs = res.data
            let pageCount = res.pageCount
            let currentPage = res.currentPage
            var listsong = ``
            for(var i=0; i<allsongs.length; i++){
                var lengthsong = secondToMinutes(allsongs[i].lengthsong)
                listsong +=`<div class="jumplentren" onclick="chooseSong('${allsongs[i].songid}')" style="color: white; font-size: 110%; text-decoration: none"><img  class="pb-2" style="width:100%" src="/thumbnails/${allsongs[i].songid}.jpg"></br>${allsongs[i].songname}<p style="color: #989797; font-size: 90%;">${allsongs[i].singger} • ${allsongs[i].counttimesing} lượt hát</p></div>`
            }
            $("#boxnewsong").html(listsong)

            let pageination = ''
            if (pageCount > 1) {
                let i = Number(currentPage) > 4 ? (Number(currentPage) - 2) : 1
                pageination += `<ul class="pagination flex-wrap">`
/*                if (currentPage != 1){
                    pageination += `<li class="page-item"><a class="page-link" onclick="searchsong('1')">1</a></li>`
                }*/
                if (i != 1) {
                    pageination += `<li class="page-item" style="margin-right: 10px;"><a class="page-link" onclick="searchsong('1')">1</a></li>`
                    pageination += `<li class="page-item disabled" style="margin-right: 5px;"><a class="page-link">...</a></li>`
                }
                for (; i<= (Number(currentPage) + 2) && i <= pageCount; i++) {

                    if (currentPage == i) {
                        pageination += `<li class="page-item active" style="margin-left: 5px; margin-right: 5px"><a class="page-link">${i}</a></li>`
                    } else {
                        pageination += `<li class="page-item" style="margin-left: 5px; margin-right: 5px"><a class="page-link" onclick="searchsong('${i}')">${i}</a></li>`
                    }
                    if (i == Number(currentPage) + 2 && i < pageCount) {
                        pageination += `<li class="page-item disabled" style="margin-left: 5px;"><a class="page-link">...</a></li>`
                        pageination += `<li class="page-item" style="margin-left: 10px;"><a class="page-link" onclick="searchsong('${pageCount}')">${pageCount}</a></li>`
                        break
                    }
                }
/*                if (currentPage != pageCount){
                    pageination += `<li class="page-item"><a xclass="page-link" onclick="searchsong('${pageCount}')">${pageCount}</a></li>`
                }*/
                pageination += `</ul>`
            }


            $(".pagination").html(pageination)
        });
}


function GrantPermission() {
    stopAudio()
    if(!songchooseid){
        $("#remindChooseSong").css("display", "inline");
        return
    }
    var constraints = {
        audio: {
            googAutoGainControl: false,
            noiseSuppression: false,
            autoGainControl: false,
            echoCancellation: {exact: false},
            advanced: [
                {echoCancellation: {exact: false}},
                {googEchoCancellation: {exact: false}},
                {googExperimentalEchoCancellation: {exact: false}},
                {googDAEchoCancellation: {exact: false}},
                {googAutoGainControl: {exact: false}},
                {googExperimentalAutoGainControl: {exact: false}},
                {googNoiseSuppression: {exact: false}},
                {googExperimentalNoiseSuppression: {exact: false}},
                {googHighpassFilter: {exact: false}},
                {googTypingNoiseDetection: {exact: false}},
                {googAudioMirroring: {exact: false}},
                {googNoiseReduction: {exact: false}}
                ]
        },
        video: { 
            facingMode: "user",
            frameRate: { ideal: 30, max: 40 },
            aspectRatio: 16/9
/*            width: { ideal: 1280 },
            height: { ideal: 720 }*/
        }
    }
/*    if(!window.mobilecheck()){
        constraints.video.aspectRatio = 16/9
        constraints.video.width = { ideal: 1280 }
        constraints.video.height = { ideal: 720 }
    }else{
        constraints.video.width = { ideal: 640 }
        constraints.video.height = { ideal: 720 }
    }*/
    if(window.mobilecheck()){
        constraints.video.width = 360
        constraints.video.height = 202.5
    }
    typerecord = $("#selecttyperecord").val()
    if(typerecord == "novideo"){
        constraints.video = false
    }
    /*  constraints: {
     "audio": {
      "deviceId": "xkcTfaf1uUJ/q1po904WtoZqV1P/rsUjp889EOO0j6Q="
     },
     "video": false
    }*/
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {

        recordButton.disabled = true;
        stopButton.disabled = true;
        $("#my-player").show()
/*        if(window.mobilecheck()){
            player.src({type: 'video/mp4', src: '/videos/'+songchooseid+'.mp4'});
        }else{
            if(player.currentResolution()){
                var currentResolution = player.currentResolution()
                player.src({type: 'video/mp4', src: currentResolution.sources[0].src});
            }else{
                player.src({type: 'video/mp4', src: '/videos/'+songchooseid+'.mp4'});
            }
        }*/
        player.src({type: 'video/mp4', src: player.currentSrc()});
        //player.poster('/thumbnails/'+songchooseid+'.jpg');
        player.controls(false)
        player.autoplay(false)
        var video = document.getElementById('uservideo');
        if(typerecord == "withvideo"){
            video.style.display = ""
            video.width = width
            if(!window.mobilecheck()) {
                video.width = widthusercamera
            }

            video.srcObject = stream;
            video.muted = true;
            video.play()
/*            if(!window.mobilecheck()){
                console.log("maytinh")
            }*/
        }


        //onYouTubeIframeAPIReady(songchooseid, "karaluon")
        countDown(stream)
    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        recordButton.disabled = false;
        stopButton.disabled = true;
    });
}



function singNow(stream){
    recordButton.style.display = "none"
    stopButton.style.display = ""
    stopButton.disabled = false;
    //document.getElementById("jumpto").scrollIntoView({behavior: "smooth"});
    goToByScroll("containerplayer");
    if(typerecord == "novideo"){
        mediaRecorder = new MediaRecorder(stream, {mimeType: "audio/webm"})
    }else{
        //mediaRecorder = new MediaRecorder(stream, {mimeType: "video/webm"})
        //mediaRecorder = new MediaRecorder(stream, {mimeType: "video/webm\; codecs=vp9"})
        if (MediaRecorder.isTypeSupported('video/webm\;codecs=vp9')) {
            mediaRecorder = new MediaRecorder(stream, {mimeType: "video/webm\; codecs=vp9"})
        }else if (MediaRecorder.isTypeSupported('video/webm\;codecs=opus,vp8')) {
            checkvp8 = true
            mediaRecorder = new MediaRecorder(stream, {mimeType: "video/webm\; codecs=opus,vp8"})
        }else if (MediaRecorder.isTypeSupported('video/webm\;codecs=h264')) {
            mediaRecorder = new MediaRecorder(stream, {mimeType: "video/webm\; codecs=h264"})
        }else if (MediaRecorder.isTypeSupported('video/webm\;codecs=daala')) {
            mediaRecorder = new MediaRecorder(stream, {mimeType: "video/webm\; codecs=daala"})
        }
    }

    mediaRecorder.start()

    interVal = setInterval(() => {duration++}, 1000)
    mediaRecorder.ondataavailable = function(e) {
        chunks.push(e.data);
    }

    mediaRecorder.onstop = function(e, change) {
        clearInterval(interVal)
        var blob
        blob = new Blob(chunks, {type:'video/mp4'});
/*        if(typerecord == "novideo"){
            blob = new Blob(chunks, {"type": "audio/webm; codecs=opus"});
        }else{
            blob = new Blob(chunks, {"type": "video/webm; codecs=opus"});
        }*/
        
        chunks = [];
        var length = duration
        duration = 0;
        stream.getTracks().forEach(function(track) {
          track.stop();
        });
        if(changesongandrecord){
            uploadToServer(blob, length);
        }

    }
}


function stopRecording(change) {
    changesongandrecord = true
    if(change == "change"){
        changesongandrecord = false
    }else{
        $("#dsthuam").css("display", "");
    }
    $("#countdown").css("display", "none");

    document.getElementById('uservideo').style.display = "none"
    pause = false
    recording = false
    player.pause()
    //disable the stop button, enable the record too allow for new recordings
    stopButton.disabled = true;
    recordButton.disabled = false;
    recordButton.style.display = ""
    stopButton.style.display = "none"

    if(mediaRecorder){
        if(mediaRecorder.state != "inactive"){
            mediaRecorder.stop();
            countrec++
        }
    }
}


function uploadToServer(blob, length){

    // upload file to the server.
    var filename = new Date().toISOString();
    var xhr = new XMLHttpRequest();
    xhr.onload = function(e) {
        if (this.readyState === 4) {
            let filenamesave
            effectchoose = 0
            let path = JSON.parse(e.target.responseText).despath
            let songid = JSON.parse(e.target.responseText).songid
            let singer = JSON.parse(e.target.responseText).filesinger
            let namesong = JSON.parse(e.target.responseText).namesong
            let typerecord = JSON.parse(e.target.responseText).typerecord

            songid = songid + "_" + Date.now();
            var audio

            audio = `<center><div id="divusersing-${singer}"><video id="my-player-${singer}" class="video-js"></video>`
            audio += namesong
            filenamesave = path.split("/")[path.split("/").length-1]

            namesong = namesong.replace(/[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/gi, function (x) {
                var a = "\\" + x
                return a
            });
            audio += `</div></div></center>`
/*            if(typerecord == "novideo"){
                audio += `<br><div style="position: relative; overflow: hidden;margin-left: 5px" class="btn btn-success" id="uploadrank">Chọn ảnh cho video<input type="file" id="chooseimage_${singer}" name="imageforaudi" onchange="UploadImage('${songid}', '${namesong}','${singer}')" style="position: absolute; font-size: 50px;opacity: 0;right: 0;top: 0;"/></div></div>`
            }else{

            }*/
            $("#studiovideo").html(audio)
            if(!window.mobilecheck()){
                player2 = videojs(`my-player-${singer}`, {
                    controls: true,
                    width: width/3,
                    height: height/3,
                    controlBar: {
                        fullscreenToggle: false,
                        progressControl: true,
                        remainingTimeDisplay: true,
                        playToggle: true,
                        pictureInPictureToggle: false,
                        volumePanel: {"inline": false}
                    }
                })
            }else{
                player2 = videojs(`my-player-${singer}`, {
                    controls: true,
                    width: width-(width*15/100),
                    height: height-(height*10/100),
                    controlBar: {
                        fullscreenToggle: false,
                        progressControl: true,
                        remainingTimeDisplay: true,
                        playToggle: true,
                        pictureInPictureToggle: false,
                        volumePanel: {"inline": false}
                    }
                })
            }
            player2.src({type: 'video/mp4', src: path});
            $("#pathrecord").val(path)
            $("#songid").val(songid)
            $("#singer").val(singer)
            $("#namesong").val(namesong)
            //$("#modalbody").append(`<button type="button" class="btn btn-primary" onclick="effectChoose()" disabled>Đang Chọn</button>`)
            $( "#soundeffect" ).val(effectchoose).change();
            $("#dangtai").css("display", "none");
            $("#studiomodal").modal('toggle');
            if(!window.mobilecheck()){
                $(".modal-lg").css("max-width", width/2)
            }else{
                $(".modal-lg").css("max-width", width)
            }

            blurloading("done")


/*            audio = `<center><div id="divusersing-${singer}"><video id="my-player-${singer}" class="video-js"></video>`
            audio += namesong
            filenamesave = path.split("/")[path.split("/").length-1]

            namesong = namesong.replace(/[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/gi, function (x) {
                var a = "\\" + x
                return a
            });
            if(typerecord == "novideo"){
                audio += `<div style="position: relative; overflow: hidden;margin-left: 5px" class="btn btn-success" id="uploadrank">Chọn ảnh cho video<input type="file" id="chooseimage_${singer}" name="imageforaudi" onchange="UploadImage('${songid}', '${namesong}','${singer}')" style="position: absolute; font-size: 50px;opacity: 0;right: 0;top: 0;"/></div></div>`
            }else{
                audio += `</div></div></center>`
            }

            $("#listrecords").append(audio)
            if(!window.mobilecheck()){
                player2 = videojs(`my-player-${singer}`, {
                    controls: true,
                    width: width/4,
                    height: height/4,
                    controlBar: {
                        fullscreenToggle: true,
                        progressControl: true,
                        remainingTimeDisplay: true,
                        playToggle: true,
                        pictureInPictureToggle: false
                    }
                })
            }else{
                player2 = videojs(`my-player-${singer}`, {
                    controls: true,
                    width: width-(width*10/100),
                    height: height-(height*10/100),
                    controlBar: {
                        fullscreenToggle: true,
                        progressControl: true,
                        remainingTimeDisplay: true,
                        playToggle: true,
                        pictureInPictureToggle: false
                    }
                })
            }
            player2.src({type: 'video/mp4', src: path});*/
        }
    };
    var fd = new FormData();

    if(!window.mobilecheck()){
        fd.append("typedevice", "computer");
    }else{
        fd.append("typedevice", "mobile");
    }
    if(typerecord == "novideo"){
        fd.append("typerecord", "novideo");
    }else{
        fd.append("typerecord", typerecord);
    }

    fd.append("checkvp8", checkvp8);
    fd.append("lengthaudio", length);
    fd.append("songid", songchooseid);
    fd.append("songvolume", volumevalue);
    fd.append("duy", blob, filename);
    xhr.open("POST", "/uploadsing");
    xhr.send(fd);
    blurloading()

}

function effectdone(){
    $("#studiomodal").modal('toggle');

    $.ajax({
        url: '/effectdone',
        type: 'POST',
        data: {src: player2.currentSrc(), songid: $("#songid").val()}
    })
    .then(res => {
        var namesong = $("#namesong").val()
        var singer = $("#singer").val()
        var player4
        let audio

        audio = `<center><div id="divusersing-${singer}"><video id="my-player-${singer}1" class="video-js"></video>`
        audio += `<div>${namesong}<a href='${player2.currentSrc()}' download="${namesong}.mp4" ><img src="/imgs/cloud.png" width="40px"></a></div>`
/*
        audio += `<div><a class="btn btn-primary" href='${player2.currentSrc()}' download="${namesong}.mp4" style="color: white;margin-top: 5px; margin-bottom: 5px">Tải về</a>`
*/
        $("#listrecords").append(audio)
        if(!window.mobilecheck()){
            player4 = videojs(`my-player-${singer}1`, {
                controls: true,
                width: width/4,
                height: height/4,
                controlBar: {
                    fullscreenToggle: false,
                    progressControl: true,
                    remainingTimeDisplay: true,
                    playToggle: true,
                    pictureInPictureToggle: false,
                    volumePanel: {"inline": false}
                }
            })
        }else{
            player4 = videojs(`my-player-${singer}1`, {
                controls: true,
                width: width-(width*15/100),
                height: height-(height*10/100),
                controlBar: {
                    fullscreenToggle: false,
                    progressControl: true,
                    remainingTimeDisplay: true,
                    playToggle: true,
                    pictureInPictureToggle: false,
                    volumePanel: {"inline": false}
                }
            })
        }
        player4.src({type: 'video/mp4', src: player2.currentSrc()});
        player2.dispose()
    })

}

function effectChoose() {
    var effectnumber = $("#soundeffect").val()
    var pathrecord = $("#pathrecord").val()
    //var pathrecord = player2.currentSrc()
    if(effectnumber == 0) {
        effectchoose = 0
        $("#soundeffect").val(effectchoose).change();
    }
    if(effectnumber == 1) {
        effectchoose = 1
        $("#soundeffect").val(effectchoose).change()
    }
    player2.pause()
    $("#studiovideo").append(`<center><span id="chudangtai" style="color: #d81f26;font-weight: bold">Đang xử lý...</span></center>`)
    $.ajax({
        url: '/changeeffectrecord',
        type: 'POST',
        data: {effectnumber: effectnumber, pathrecord: pathrecord, checkvp8: checkvp8, typerecord: typerecord, haschangeimage: haschangeimage}
    })
    .then(res => {
        $("#chudangtai").remove()
        if(res == "success"){
            if(effectnumber == 0){
                player2.src({type: 'video/mp4', src: pathrecord});
            }

            if(effectnumber == 1){
                pathrecord = pathrecord.split(".")[0]
                if(checkvp8){
                    pathrecord = pathrecord + "_reverb.webm"
                }else{
                    pathrecord = pathrecord + "_reverb.mp4"
                }
                player2.src({type: 'video/mp4', src: pathrecord});
            }
        }
    });
}

function dataUrlToFile(dataUrl) {
    var binary = atob(dataUrl.split(',')[1]),
        data = [];

    for (var i = 0; i < binary.length; i++)
        data.push(binary.charCodeAt(i));

    return new File([new Uint8Array(data)], 'recorded-video.webm', {
        type: 'video/webm'
    });
}

function Uploadmusic(filenamesave){
    $("#uploadrank").html("Đang Upload hãy chờ tý...")
    $.ajax({
        url: '/uploadtorank',
        type: 'POST',
        data: {filenamesave: filenamesave}
    })
        .then(res => {
            if(res.status == "success"){
                $("#uploadrank").html("Đã Upload, check thử đi nè")
                $("#uploadrank").prop( "onclick", null);
            }
        });
}

function secondToMinutes(time){
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    return minutes + ":" + seconds
}

player.on('ended', function() {
    if(recording){
        stopRecording()
    }
});
// 4. The API will call this function when the video player is ready.
function countDown(stream) {
    recording = true
    if(!window.mobilecheck()){
        musicslider(0, height)
    }else{
        musicslider(width, height)
    }

    $("#volumebackgroundmusic").css("display", "")

    fiveSecondsForSing(5)
    setTimeout(()=>{
        singNow(stream)
        player.play()
        pause = true
    }, 5000)
}

/*function pauseVideo() {
  player.pauseVideo();
}*/

/*function onPlayerReady(event){
  event.target.playVideo();
}*/

function fiveSecondsForSing(seconds){
    var n = 5;
    setTimeout(countDown, 1000);

    function countDown(){
        document.getElementById("countdown").style.display = "inline"
        n--;
        if(n > 0){
            setTimeout(countDown,1000);
        }
        if(n <= 0){
            document.getElementById("countdown").innerHTML = "Đang Thu<img src='/imgs/rec.png' style='height: 2em'>";
        } else {
            document.getElementById("countdown").innerHTML = "Bắt đầu trong <b>"  + n + "</b>";
        }
    }
}

function stopAudio(){
    $("#volumebackgroundmusic").css("display", "none")
    if(player){
        player.pause()
    }
    //stop audio khi nghe bài hát
    if(audios){
        for(var i = 0, len = audios.length; i < len;i++){
            audios[i].pause();
        }
    }
}

function goToByScroll(id) {
    // Remove "link" from the ID
    id = id.replace("link", "");
    // Scroll
    if(id){
        $('html,body').animate({
            scrollTop: $("#"+id).offset().top
        }, 'slow');
    }else{
        $('html,body').animate({
            scrollTop: $("#boxnewsong").offset().top
        }, 'slow');
    }

}

$("#listensong").on("click", () => {
    if(!songchooseid){
        $("#remindChooseSong").css("display", "inline");
        return
    }
    chooseSong(songchooseid)
})

function musicslider(width, height) {
    if(width == 0){
        $("#slider-vertical").css("height", height/2)
        $("#volumebackgroundmusic").css("padding-top", height/4)
        $("#volumebackgroundmusic").css("padding-left", "10px")
    }else{
        $("#slider-vertical").css("width", width/2)
        $("#volumebackgroundmusic").css("padding-top", `${20+height}px`)
        //$("#recordingsList").css("padding-bottom", `${height/2}px`)
        $("#volumebackgroundmusic").css("width", `100%`)
    }
    var handle = $( "#custom-handle" );
    var sliderobject = {
        range: "min",
        min: 0,
        max: 100,
        value: volumevalue,
        create: function() {
            handle.text( $( this ).slider( "value"));
            player.volume(volumevalue/100)
        },
        slide: function( event, ui ) {
            handle.text( ui.value )
            volumevalue = ui.value
            player.volume(volumevalue/100)
        }
    }
    if(width == 0){
        sliderobject.orientation = "vertical"
    }
    $( "#slider-vertical" ).slider(sliderobject);
    $( "#amount" ).val( $( "#slider-vertical" ).slider( "value" ) );
}

function UploadImage(songid, namesong, singer) {

    var blobFile = $(`#chooseimage_${singer}`)[0].files[0];
    var formData = new FormData();
    formData.append("imageforaudio", blobFile);
    formData.append("songid", songid);
    formData.append("singer", singer);
    formData.append("checkvp8", checkvp8);
    formData.append("currentSrc", player2.currentSrc());
    namesong = namesong.replace(/[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/gi, function (x) {
        var a = "\\" + x
        return a
    });
    $.ajax({
        url: "/imageforaudio",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            haschangeimage = true
            player2.src({type: 'video/mp4', src: '/songhandled/'+ response.videoname +'.mp4'});
            /*let player3
            $("#loading").css("display", "none");
            $("#divusersing-"+singer).html()
            var htmlvideo = `<video id="my-player-${response.videoname}" class="video-js">
          </video>${namesong}<div><a class="btn btn-primary" href='/uploads/${response.videoname}.mp4' download="${namesong}.mp4" style="color: white;margin-bottom: 5px; margin-top: 5px">Tải về</a>
          <div style="position: relative; overflow: hidden;" class="btn btn-success" id="uploadrank">Chọn ảnh cho video<input type="file" name="imageforaudi" id="chooseimage_${singer}" onchange="UploadImage('${songid}', '${namesong}','${singer}')" style="position: absolute; font-size: 50px;opacity: 0;right: 0;top: 0;"/></div></div>`

            $("#divusersing-"+singer).html(htmlvideo)
            if(!window.mobilecheck()){
                player3 = videojs(`my-player-${response.videoname}`, {
                    controls: true,
                    preload: 'auto',
                    width: width/4,
                    height: height/4,
                    controlBar: {
                        fullscreenToggle: true,
                        progressControl: true,
                        remainingTimeDisplay: true,
                        playToggle: true,
                        pictureInPictureToggle: false,
                        volumePanel: {"inline": false}
                    }
                })
            }else{
                player3 = videojs(`my-player-${response.videoname}`, {
                    controls: true,
                    width: width-(width*10/100),
                    height: height-(height*10/100),
                    controlBar: {
                        fullscreenToggle: true,
                        progressControl: true,
                        remainingTimeDisplay: true,
                        playToggle: true,
                        pictureInPictureToggle: false,
                        volumePanel: {"inline": false}
                    }
                })
            }
            player3.src({type: 'video/mp4', src: '/uploads/'+ response.videoname +'.mp4'});*/
        },
        error: function(jqXHR, textStatus, errorMessage) {
            console.log(errorMessage); // Optional
        }
    });
}
