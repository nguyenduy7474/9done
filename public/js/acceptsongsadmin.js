$( document ).ready(function() {
  getAllSongsReview()

});

function getAllSongsReview(){
  $.ajax({
      url: '/getallsongsreview',
      type: 'POST',
  })
  .then(res => {
    allsongs = res
    var date
    var listsong = ``
    for(var i=0; i<allsongs.length; i++){
      console.log(allsongs[i].datecreated)
      date = dateToString(allsongs[i].datecreated)
      listsong +=`<hr style="width:100%;border: 2px solid white;"><div class="row">`
      listsong +=`<div class="col"><img style="width: 70%; height: auto" class="img-fluid img-thumbnail" src="/thumbnails/${allsongs[i].songid}.jpg"></div><div class="col"><h3>${allsongs[i].songname}<p style="color: #989797; font-size: 90%;">${allsongs[i].singger}</p><a target="_blank" href="https://www.youtube.com/watch?v=${allsongs[i].songid}">Link Youtube</a><p>Ngày yêu cầu: ${date}</p</h3></div></div>`
    }
    $("#listreview").html(listsong)
  })
  .catch(err => console.log(err));
}

function dateToString(isostring){
   const monthNames = ["01", "02", "03", "04", "05", "06",
      "07", "08", "09", "10", "11", "12"];
  var dateObj = new Date(isostring)
  let month = monthNames[dateObj.getMonth()];
  let day = String(dateObj.getDate()).padStart(2, '0');
  let year = dateObj.getFullYear();
  let output = day + "/"+ month+"/"+year;
  return output
}

function acceptSongsAdmin(){

    if(!$("#namesong").val() || !$("#singgername").val() || !$("#linkyoutube").val() || !$("#songtags").val()){
      $("#alert").html("Hãy nhập đầy đủ các trường bên dưới")
      return
    }
    if(validateYouTubeUrl($("#linkyoutube").val().trim()) == false){
      $("#alert").html("Link Youtube không chính xác")
      return
    }
    var data = {
          namesong: $("#namesong").val().trim(), 
          singgername: $("#singgername").val().trim(), 
          songtags: $("#songtags").val(),
          linkyoutube: $("#linkyoutube").val().trim(),
          linkyoutubeoriginal: $("#linkyoutubeoriginal").val().trim(),
        }
/*    $("#namesong").val("")
    $("#singgername").val("")
    $("#linkyoutube").val("")
    $("#songtags").val("")
    $("#linkyoutubeoriginal").val("")*/
    $("#done").html("Đang xử lý...")
    $.ajax({
        url: '/adminadnewsong',
        type: 'POST',
        data: data
    })
    .then(res => {
        console.log(res)
        $("#done").html(res)
        getAllSongsReview()
    })
    .catch(err => console.log(err));
  }

function validateYouTubeUrl(url){
  if (url != undefined || url != '') {
    var p = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm;
    return (url.match(p)) ? true : false;
  }
}