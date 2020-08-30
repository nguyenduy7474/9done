$( document ).ready(function() {
  getAllSongsReview()

});
var checkmobile = false
window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

if(window.mobilecheck()){
  checkmobile = true
}else{

}

function getAllSongsReview(){
    console.log("dd")
  $.ajax({
      url: '/getallsongsreview',
      type: 'POST',
  })
  .then(res => {
    allsongs = res
    var date
    var listsong = ``
    var phong
    for(var i=0; i<allsongs.length; i++){
      console.log(checkmobile)
      phong = ""
      date = dateToString(allsongs[i].datecreated)
      if(checkmobile){
        phong +=`<hr style="width:99%;border: 1px solid white;">`
        phong +=`<div class="row"><div class="col"><img style="width: 100%; height: auto" class="img-fluid img-thumbnail" src="/thumbnails/${allsongs[i].songid}.jpg"><h4>${allsongs[i].songname}<p style="color: #989797; font-size: 90%;">${allsongs[i].singger}</p><a target="_blank" href="https://www.youtube.com/watch?v=${allsongs[i].songid}">Link Youtube</a></h4><p>Ngày yêu cầu: ${date}</p></div></div>`
      }else{
        phong +=`<hr style="width:100%;border: 1px solid white;">`
        phong +=`<div class="row">
                  <div class="col">
                    <img style="width: 70%; height: auto" class="img-fluid img-thumbnail" src="/thumbnails/${allsongs[i].songid}.jpg">
                  </div>
                  <div class="col">
                    <h4>${allsongs[i].songname}
                      <p style="color: #989797; font-size: 90%;">${allsongs[i].singger}</p>
                      <a target="_blank" href="https://www.youtube.com/watch?v=${allsongs[i].songid}">Link Youtube</a>
                    </h4>
                    <p>Ngày yêu cầu: ${date}</p>
                  </div>
                </div>`
      }
      listsong += phong
    }
    $("#listreview").html(listsong)
  })
  .catch(err => console.log(err));
}


function uploadSong(){

    if(!$("#namesong").val() || !$("#singgername").val()|| !$("#linkyoutube").val()){
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
          linkyoutube: $("#linkyoutube").val().trim(), 
        }
    $("#namesong").val("")
    $("#singgername").val("")
    $("#linkyoutube").val("")
    $("#done").html("Đang xử lý...")
    $.ajax({
        url: '/addnewsongreview',
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

