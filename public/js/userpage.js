$( document ).ready(function() {
	getInfoUser()
	$('.like-button').click(function(){
		$(this).toggleClass('is-active');
	})
})

var checklike = false
var checkdislike = false


window.mobilecheck = function() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

var width
var height
if(!window.mobilecheck()){
	width = window.screen.width - 400
	height = width * 9 / 16
}else{
	width = window.screen.width - 50
	height = window.screen.width * 9 / 16
}

player = videojs('my-player', {
	controls: true,
	preload: 'auto',
	width: width,
	height: height,
	controlBar: {
		volumePanel: {"inline": false}
	}
});
$("#containerplayer").hide()


function getInfoUser(){
	var pathname = window.location.pathname;
	pathname = pathname.split("/")
	$.ajax({
		url: '/getuserinfo',
		type: 'POST',
		data: {userid: pathname[2]}
	})
	.then(res => {
		if(res == "Not Found User"){
			location.href = "/"
		}else{
			var allsongs = res.allsonguser
			let listsong = ``
			let userinfo = res.userinfo
			let infor = ``
			infor += `<img style="border-radius: 20%;" src="${userinfo.avatar}" class="rounded"><h2>${userinfo.full_name}</h2>`
			$("#info").html(infor)
			for(var i=0; i<allsongs.length; i++){
				date = new Date(allsongs[i].timeupload);
				date = date.getDate()+'-' + (date.getMonth()+1) + '-'+date.getFullYear()
				listsong +=`<div class="jumplentren" onclick="chooseSong('${allsongs[i].handledname}','${userinfo.id}', '${allsongs[i]._id}')" style="color: white; font-size: 110%; text-decoration: none"><video playsinline style="width: 100%; height: 52.25%" src="/users/${userinfo.id}/songhandled/${allsongs[i].handledname}"></video></br>${allsongs[i].songname}<p style="color: #989797; font-size: 90%;">${allsongs[i].view} lượt nghe • ${date}</p></div>`
			}
			$("#boxnewsong").html(listsong)
			$("#userid").val(res.checklogined)
		}
	})
}

function chooseSong(handledname, userid, songid){

	goToByScroll("containerplayer");
	// 2. This code loads the IFrame Player API code asynchronously.//
	$.ajax({
		url: '/infovideosongusersing',
		type: 'POST',
		data: {songid: songid}
	})
	.then(res => {

		player.src({type: 'video/mp4', src: '/users/'+userid+"/songhandled/"+handledname})
		player.autoplay(true)
		player.controls(true)
		$("#containervideoandinfo").css("float", "left")
		if(window.mobilecheck()){
			$("#reactionplace").css("float", "")
			$("#reactionplace").css("padding-right", "25px")

			$("#reactionplace").html(`<center><table>
				<tr>
				  <td id="likenumber" style="text-align: center; color: #23d160; font-weight: bold; font-size: 120%">${res.likecount}</td>
				  <td id="dislikenumber" style="text-align: center; color: #e74c3c; font-weight: bold; font-size: 120%">${res.dislikecount}</td>
				</tr>
				<tr>
				  <td style="margin-right: 10px"><button class="like first" onclick="reactvideo('like', '${songid}')" id="likebut">Hay á</button></td>
				  <td><button class="like third" onclick="reactvideo('dislike', '${songid}')" id="disklikebut">Cà chua</button></td>
				</tr>
			</table></center>`)
		}else{
			$("#reactionplace").html(`<table style="margin-left: 15px;">
			<tr>
			  <td id="likenumber" style="text-align: center; color: #23d160; font-weight: bold; font-size: 120%">${res.likecount}</td>
			  <td id="dislikenumber" style="text-align: center; color: #e74c3c; font-weight: bold; font-size: 120%">${res.dislikecount}</td>
			</tr>
			<tr>
			  <td style="margin-right: 10px"><button class="like first" onclick="reactvideo('like', '${songid}')" id="likebut">Hay á</button></td>
			  <td><button class="like third" onclick="reactvideo('dislike', '${songid}')" id="disklikebut">Cà chua</button></td>
			</tr>
      	</table>`)
		}


		if(res.userreact && res.userreact == "like"){
			checklike = true
			checkdislike = false
			$("#likebut").css("color", "white")
			$("#likebut").css("box-shadow", "0 0 40px 40px #23d160 inset")
			$("#disklikebut").css("color", "")
			$("#disklikebut").css("box-shadow", "")
		}
		if(res.userreact && res.userreact == "dislike"){
			checkdislike = true
			checklike = false
			$("#disklikebut").css("color", "white")
			$("#disklikebut").css("box-shadow", "0 0 40px 40px #e74c3c inset")
			$("#likebut").css("color", "")
			$("#likebut").css("box-shadow", "")
		}
		$("#containerplayer").show()
	})
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

function reactvideo(react, songid) {
	var userid = $("#userid").val()
	let likenumber
	let dislikenumber
	if(userid == "false"){
		alert("đăng nhâp trước đi")
		return
	}
	if(react == "like" && checklike == false){
		checklike = true
		checkdislike = false
		$("#likebut").css("color", "white")
		$("#likebut").css("box-shadow", "0 0 40px 40px #23d160 inset")
		$("#disklikebut").css("color", "")
		$("#disklikebut").css("box-shadow", "")
		likenumber = parseInt($("#likenumber").html())
		dislikenumber = parseInt($("#dislikenumber").html())
		likenumber = likenumber + 1
		$("#likenumber").html(likenumber)
		if(dislikenumber > 0){
			dislikenumber = dislikenumber - 1
			$("#dislikenumber").html(dislikenumber)
		}


	}
	if(react == "dislike" && checkdislike == false){
		checklike = false
		checkdislike = true
		$("#disklikebut").css("color", "white")
		$("#disklikebut").css("box-shadow", "0 0 40px 40px #e74c3c inset")
		$("#likebut").css("color", "")
		$("#likebut").css("box-shadow", "")
		likenumber = parseInt($("#likenumber").html())
		dislikenumber = parseInt($("#dislikenumber").html())

		dislikenumber = dislikenumber + 1
		$("#dislikenumber").html(dislikenumber)
		if(likenumber > 0){
			likenumber = likenumber - 1
			$("#likenumber").html(likenumber)
		}
	}

	$.ajax({
		url: '/reactvideo',
		type: 'POST',
		data: {songid: songid, react: react}
	})
	.then(res => {
	})
}
