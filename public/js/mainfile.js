$( document ).ready(function() {
  searchsong()
  var nghedanh = document.cookie;
  if(nghedanh.indexOf("nghedanh") != -1){
    nghedanh = nghedanh.split(";")
    nghedanh = nghedanh[1].split("=")
    nghedanh = nghedanh[1]
    $("#namesingerplace").html("<p id='showname' onclick='editName()'><b>"+ nghedanh +"</b></p>")
  }
  //document.cookie = "nghedanh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
});
var audios

var width
var height
window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

if(!window.mobilecheck()){
  width = window.screen.width - 200
  height = width * 9 / 16
}else{
  width = window.screen.width
  height = window.screen.width * 9 / 16
}
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
function chooseSong(idsong){
  stopAudio()
  $("#remindChooseSong").css("display", "none");
  $("#countdown").css("display", "none");
  if(rec != null){
    pause = false
    stopButton.disabled = true;
    recordButton.disabled = false;
    rec.stop();
  }
  // 2. This code loads the IFrame Player API code asynchronously.
  songchooseid = idsong
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  if(loaddone == true){
    $("#containerplayer").empty();
    let playernew = document.createElement("div");
    playernew.setAttribute("id", "player");
    $("#containerplayer").append(playernew)
    onYouTubeIframeAPIReady(idsong)
  }
  loaddone = true
}
function onYouTubeIframeAPIReady(idsong, record) {
  if(idsong){
    songchooseid = idsong
  }
  if(record){
    player = new YT.Player('player', {
      height: height,
      width: width,
      videoId: songchooseid,
      playerVars: {modestbranding: 1, disablekb: 1, rel: 0, controls: 0, start: 0, rel: 0, iv_load_policy: 3},
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }else{
    player = new YT.Player('player', {
      height: height,
      width: width,
      videoId: songchooseid,
      playerVars: {modestbranding: 1, disablekb: 0, rel: 0, controls: 1, start: 0, rel: 0, iv_load_policy: 3},
      events: {
        'onReady': onPlayerReady,
        /*'onStateChange': onPlayerStateChange*/
      }
    });
  }

}

function searchsong(paging_num){
  var namesong = $("#searchsong").val()
  $.ajax({
    url: '/searchsongs',
    type: 'POST',
    data: {namesong: namesong, paging_num: paging_num}
  })
  .then(res => {
    console.log(res)
    allsongs = res.data
    let pageCount = res.pageCount
    let currentPage = res.currentPage
    var listsong = ""
    for(var i=0; i<allsongs.length; i++){
      var lengthsong = secondToMinutes(allsongs[i].lengthsong)
      listsong +=`<a href="#" onclick="chooseSong('${allsongs[i].songid}')" style="color: white; font-size: 110%; text-decoration: none"><img src="/thumbnails/${allsongs[i].songid}.jpg">${allsongs[i].songname}<p style="color: #989797; font-size: 90%;">${allsongs[i].singger}</p></a>`
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


function GrantPermission(idvideo) {
  stopAudio()
  if(document.cookie.indexOf("nghedanh") == -1){
    $("#remindName").css("display", "inline");
    return
  }
  if(!songchooseid){
    $("#remindChooseSong").css("display", "inline");
    return
  }
  var constraints = {
    audio: true,
    video: false
  } 
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    $("#containerplayer").empty();
    let playernew = document.createElement("div");
    playernew.setAttribute("id", "player");
    $("#containerplayer").append(playernew)

    recordButton.disabled = true;
    stopButton.disabled = true;
    onYouTubeIframeAPIReady(songchooseid, "karaluon")
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

  gumStream = stream;
  input = audioContext.createMediaStreamSource(stream);
  rec = new Recorder(input, {
      numChannels: 1
  }) 
  //start the recording process 
  rec.record()
}

function stopRecording() {
    $("#loading").html("<img src='/imgs/loading.gif'>")
    $("#countdown").css("display", "none");
    pause = false
    player.stopVideo()
    //disable the stop button, enable the record too allow for new recordings 
    stopButton.disabled = true;
    recordButton.disabled = false;

    rec.stop(); //stop microphone access 
    gumStream.getAudioTracks()[0].stop();
    //create the wav blob and pass it on to createDownloadLink 
    rec.exportWAV(uploadToServer);
    countrec++
}

function uploadToServer(blob){
  var filename = new Date().toISOString();
  var xhr = new XMLHttpRequest();
  xhr.onload = function(e) {
      if (this.readyState === 4) {
          $("#loading").html("")
          let namesong
          let singer
          let filenamesave
          let path = JSON.parse(e.target.responseText).despath
          var audio = `<center><div style="float: left;margin-bottom: 10px;width: 100%"><audio id="player" controls preload style="width: 100%">
              <source src="${path}" type="audio/mpeg">
             </audio></br>`
          
          for(var i=0;i<allsongs.length;i++){
            
            if(path.indexOf(allsongs[i].songid) != -1){
              singer = path.split("/")
              singer = singer[2].replace(allsongs[i].songid, "")
              singer = singer.split("_")
              singer.shift()
              singer.pop()
              namesong = allsongs[i].songname + " - " + singer.join(" ")
              break;
            }
          }

          audio += namesong
          filenamesave = path.split("/")[path.split("/").length-1]
          audio += `</br><a class="btn btn-primary" href='${path}' download='${namesong}.wav' style="color: white;">Tải về</a>
                    <button class="btn btn-success" id="uploadrank" onclick="Uploadmusic('${filenamesave}')">Upload để tăng danh vọng</button>
                   </div></center>
                   `
          $("#listrecords").append(audio)
      }
  };
  var fd = new FormData();
  fd.append("songid", songchooseid);
  fd.append(nghedanh, blob, filename);
  xhr.open("POST", "/uploadsing");
  xhr.send(fd);
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

function onPlayerStateChange(event) {
  if(pause == true){
    if(event.data == YT.PlayerState.PAUSED){
      $("#countdown").html("Bản đã ngừng video, bản thu đã bị hủy bỏ")
        pause = false
        player.stopVideo()
        //disable the stop button, enable the record too allow for new recordings 
        stopButton.disabled = true;
        recordButton.disabled = false;

        rec.stop(); //stop microphone access 
        gumStream.getAudioTracks()[0].stop();
    }
  }
  if(event.data == YT.PlayerState.PLAYING){
    if(pause == false){
      pauseVideo()
    }
  }

  if(event.data == YT.PlayerState.ENDED){
    stopRecording()
  }
}
// 4. The API will call this function when the video player is ready.
function countDown(stream) {
  fiveSecondsForSing(5)
  setTimeout(()=>{
    singNow(stream)
    player.playVideo()
    pause = true
  }, 5000)
}

function pauseVideo() {
  player.pauseVideo();
}

function onPlayerReady(event){
  event.target.playVideo();
}

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

function chooseName(){
  nghedanh = $("#namesinger").val()
  if(nghedanh == ""){
    return
  }
  document.cookie = "nghedanh=" + nghedanh + ";expires=Thu, 18 Dec 2021 12:00:00 UTC";
  $("#namesingerplace").html("<p id='showname' onclick='editName()'><b>"+ nghedanh +"</b></p>")
}

function editName(){
  $("#namesingerplace").css("display", "inline");
  $("#namesingerplace").html(`<span><b>Xin cái nghệ danh</b></span>&nbsp;<input type="text" id="namesinger" class="form-control" style="width: 10%;" />
      <button class="btn btn-success" onclick="chooseName()">OK</button>`)
}

function stopAudio(){
  //stop audio khi nghe bài hát
  if(audios){
    for(var i = 0, len = audios.length; i < len;i++){
            audios[i].pause();
    }
  }
}