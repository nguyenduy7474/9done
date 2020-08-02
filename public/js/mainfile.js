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
    navigator.mediaDevices.enumerateDevices()
        .then(function(devices) {
            /*    devices.forEach(function(device) {
                  if (device.kind == 'audioinput') {
                    console.log(device)
                  }
                });*/
        })
        .catch(function(err) {
            console.log(err.name + ": " + err.message);
        });

});

$(".pagination").on('click', function (e){
    e.preventDefault();
    goToByScroll(this.id);
});
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
    width = window.screen.width - 200
    height = width * 9 / 16
}else{
    $("#searchsong").css("width", "100%")
    width = window.screen.width
    height = window.screen.width * 9 / 16
}
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
player = videojs('my-player', {
    controls: true,
    preload: 'auto',
    width: width,
    height: height
});
$("#my-player").hide()

function chooseSong(idsong){

    stopAudio()
    $("#remindChooseSong").css("display", "none");
    $("#countdown").css("display", "none");
    goToByScroll("jumpto");
    if(rec != null){
        pause = false
        stopButton.disabled = true;
        recordButton.disabled = false;
        rec.stop();
    }
    // 2. This code loads the IFrame Player API code asynchronously.
    songchooseid = idsong

    $("#my-player").show()
    player.src({type: 'video/webm', src: '/videos/'+idsong+'.webm'});
    player.poster('/thumbnails/'+idsong+'.jpg');
    player.autoplay(true)
    player.controls(true)


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
            var listsong = ""
            for(var i=0; i<allsongs.length; i++){
                var lengthsong = secondToMinutes(allsongs[i].lengthsong)
                listsong +=`<div class="jumplentren" onclick="chooseSong('${allsongs[i].songid}')" style="color: white; font-size: 110%; text-decoration: none"><img  class="pb-2" src="/thumbnails/${allsongs[i].songid}.jpg"></br>${allsongs[i].songname}<p style="color: #989797; font-size: 90%;">${allsongs[i].singger} • ${allsongs[i].counttimesing} lượt hát</p></div>`
            }
            $("#boxnewsong").html(listsong)



            let pageination = ''
            if (pageCount > 1) {
                let i = Number(currentPage) > 5 ? (Number(currentPage) - 4) : 1
                pageination += `<ul class="pagination pg-blue">`
                if (currentPage == 1){
                    pageination += `<li class="page-item disabled"><a class="page-link" href="#">First</a></li>`
                }else{
                    pageination += `<li class="page-item"><a class="page-link" onclick="searchsong('1')">First</a></li>`
                }
                if (i != 1) {
                    pageination += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`
                }
                for (; i<= (Number(currentPage) + 4) && i <= pageCount; i++) {

                    if (currentPage == i) {
                        pageination += `<li class="page-item active"><a class="page-link">${i}</a></li>`
                    } else {
                        pageination += `<li class="page-item"><a class="page-link" onclick="searchsong('${i}')">${i}</a></li>`
                    }
                    if (i == Number(currentPage) + 4 && i < pageCount) {
                        pageination += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`
                        break
                    }
                }
                if (currentPage == pageCount){
                    pageination += `<li class="page-item disabled"><a class="page-link"">Last</a></li>`
                }else{
                    pageination += `<li class="page-item"><a class="page-link" onclick="searchsong('${i-1}')">Last</a></li>`
                }

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
        audio: true,
        video: false
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
        player.src({type: 'video/webm', src: '/videos/'+songchooseid+'.webm'});
        player.poster('/thumbnails/'+songchooseid+'.jpg');
        player.controls(false)
        player.autoplay(false)

        //onYouTubeIframeAPIReady(songchooseid, "karaluon")
        countDown(stream)
    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        recordButton.disabled = false;
        stopButton.disabled = true;
    });
}



function singNow(stream){
    stopButton.disabled = false;
    document.getElementById("containerplayer").scrollIntoView({behavior: "smooth"});
    mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.start()
    interVal = setInterval(() => {duration++}, 1000)
    mediaRecorder.ondataavailable = function(e) {
        chunks.push(e.data);
    }

    mediaRecorder.onstop = function(e) {
        console.log("ww")

        clearInterval(interVal)
        var blob = new Blob(chunks, {"type": "audio/webm\;codecs=opus"});
        /*        var reader = new FileReader();
                reader.onload = function() {
                    uploadToServer(reader.result);
                };
                reader.readAsDataURL(blob);*/
        chunks = [];
        var length = duration
        duration = 0;
        stream.getTracks().forEach(function(track) {
          track.stop();
        });
        uploadToServer(blob, length);
    }
}


function stopRecording() {
    $("#loading").css("display", "");
    $("#countdown").css("display", "none");
    $("#dsthuam").css("display", "");

    pause = false
    recording = false
    player.pause()
    //disable the stop button, enable the record too allow for new recordings
    stopButton.disabled = true;
    recordButton.disabled = false;

    mediaRecorder.stop();
    countrec++
}


function uploadToServer(blob, length){

    // upload file to the server.
    var filename = new Date().toISOString();
    var xhr = new XMLHttpRequest();
    xhr.onload = function(e) {
        if (this.readyState === 4) {
            $("#loading").css("display", "none");

            let filenamesave
            let path = JSON.parse(e.target.responseText).despath
            let songid = JSON.parse(e.target.responseText).songid
            let singer = JSON.parse(e.target.responseText).filesinger
            let namesong = JSON.parse(e.target.responseText).namesong

            songid = songid + "_" + Date.now();
            var audio = `<center><div style="float: left;margin-bottom: 10px;width: 100%" id="${songid}"><audio id="player" controls preload style="width: 100%">
              <source src="${path}" type="audio/mpeg">
             </audio></br>`

            audio += namesong
            filenamesave = path.split("/")[path.split("/").length-1]
            audio += `</br><a class="btn btn-primary" href='${path}' download='${namesong}.wav' style="color: white;">Tải về</a>
                    <div style="  position: relative; overflow: hidden;" class="btn btn-success" id="uploadrank">Đăng ảnh cho audio<input type="file" id="chooseimage_${singer}" name="imageforaudi" onchange='UploadImage("${songid}", "${namesong}", "${singer}")' style="position: absolute; font-size: 50px;opacity: 0;right: 0;top: 0;"/></div>
                   </div></center>
                   `
            $("#listrecords").append(audio)
        }
    };
    var fd = new FormData();

    fd.append("lengthaudio", length);
    fd.append("songid", songchooseid);
    fd.append("songvolume", volumevalue);
    fd.append("duy", blob, filename);
    xhr.open("POST", "/uploadsing");
    xhr.send(fd);
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
    player.pause()
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
        $("#recordingsList").css("padding-bottom", `${height/2}px`)
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
    $("#loading").css("display", "")
    var blobFile = $(`#chooseimage_${singer}`)[0].files[0];
    var formData = new FormData();
    formData.append("imageforaudio", blobFile);
    formData.append("songid", songid);
    formData.append("singer", singer);

    $.ajax({
        url: "/imageforaudio",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            let player2
            $("#loading").css("display", "none");
            $("#"+response.divid).html()
            var htmlvideo = `<video id="my-player-${response.videoname}" class="video-js vjs-theme-city">
          </video>${namesong}</br><a class="btn btn-primary" href='/uploads/${response.videoname}.webm' download='${namesong}.webm' style="color: white;">Tải về</a>
          <div style="position: relative; overflow: hidden;" class="btn btn-success" id="uploadrank">Đổi ảnh khác<input type="file" name="imageforaudi" id="chooseimage_${singer}" onchange='UploadImage("${songid}", "${namesong}", "${singer}")' style="position: absolute; font-size: 50px;opacity: 0;right: 0;top: 0;"/></div>
          `
            $("#"+response.divid).html(htmlvideo)

            if(!window.mobilecheck()){
                player2 = videojs(`my-player-${response.videoname}`, {
                    controls: true,
                    preload: 'auto',
                    width: width/4,
                    height: height/4
                })
            }else{
                player2 = videojs(`my-player-${response.videoname}`, {
                    "controls": false,
                    "preload": 'auto',
                    "width": width,
                    "height": height,
/*                    "controlBar": {
                        fullscreenToggle: true,
                        progressControl: false,
                        remainingTimeDisplay: false,
                        playToggle: true,
                        pictureInPictureToggle: false
                    }*/
                })
            }
            //player2.controls(true)
            player2.src({type: 'video/webm', src: '/uploads/'+ response.videoname +'.webm'});
        },
        error: function(jqXHR, textStatus, errorMessage) {
            console.log(errorMessage); // Optional
        }
    });
}