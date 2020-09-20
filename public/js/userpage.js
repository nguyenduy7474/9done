$( document ).ready(function() {
	getInfoUser()
})

function getInfoUser(){
	var pathname = window.location.pathname;
	pathname = pathname.split("/")
	console.log(pathname)
	$.ajax({
		url: '/getuserinfo',
		type: 'POST',
		data: {userid: pathname[2]}
	})
	.then(res => {
		let userinfo = res.userinfo
		let infor = ``
		infor += `<img style="border-radius: 20%;" src="${userinfo.avatar}" class="rounded"><h2>${userinfo.full_name}</h2>`
		$("#info").html(infor)
	})
}
