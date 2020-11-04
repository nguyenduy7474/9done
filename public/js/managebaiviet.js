$( document ).ready(function() {
    searchsong()
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

})

let width
let height

if(!window.mobilecheck()){

    width = window.screen.width * 50/100
    height = width * 9 / 16
}else{

    width = window.screen.width * 90/100
    height = width * 9 / 16
}
$("#searchpost").css("width", width)


function searchsong(paging_num){
    var searchpost = $("#searchpost").val()
    window.scrollTo(0, 0);
    $.ajax({
        url: '/getallposts',
        type: 'POST',
        data: {searchpost: searchpost, paging_num: paging_num, pagesize: 5}
    })
        .then(res => {
            console.log(res.data)
            allsongs = res.data
            let pageCount = res.pageCount
            let currentPage = res.currentPage
            var string = ``

            for(var i=0; i<allsongs.length; i++){
                date = new Date(allsongs[i].datecreated);
                date = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear()
                string += `<div  style="margin: auto; border-bottom: 1px solid white; width: ${width}px; padding-bottom: 30px; margin-top: 30px">
                      
                      <a class="titlepost" href="/post-detail/${allsongs[i].slug}" style="font-size: 40px; color: #d9d9d9; text-decoration: none;font-family: 'Nunito Sans,Roboto,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'"/>${allsongs[i].title}</a><br>
                      <p style="font-size: 20px; color: #8c8c8c;">Ngày đăng: ${date}<p>
                      <br>
                      <a href="/post-detail/${allsongs[i].slug}"/><img src="${allsongs[i].thumbnail}" width="${width}" height="${height}"/></a><br><br>
                      <center><a href="/post-detail/${allsongs[i].slug}" style="border-radius: 10px; padding: 15px;background-color: #d81f26; color: white; font-weight: 600; text-decoration: none; font-size: 20px ;font-family: "Arial Black", arial-black "/><span>ĐỌC THÊM</span></a></center>
                      </div>`
            }
            $("#datatable").html(string)
            $(".titlepost").hover(function(){
                $(this).css("color", "#ff4f56");
            }, function(){
                $(this).css("color", "#d9d9d9");
            });
            let pageination = ''
            if (pageCount > 1) {
                let i = Number(currentPage) > 4 ? (Number(currentPage) - 2) : 1
                pageination += `<ul class="pagination flex-wrap">`
                /*                if (currentPage != 1){
                                    pageination += `<li class="page-item"><a class="page-link" onclick="searchsong('1')">1</a></li>`
                                }*/
                if (i != 1) {
                    pageination += `<li class="page-item" style="margin-right: 10px;"><a class="page-link" onclick="searchsong('1')">1</a></li>`
                    pageination += `<li class="page-item disabled" style="margin-right: 5px;"><a class="page-link" style="border-color: #06121e; background-color: #06121e">...</a></li>`
                }
                for (; i<= (Number(currentPage) + 2) && i <= pageCount; i++) {

                    if (currentPage == i) {
                        pageination += `<li class="page-item active" style="margin-left: 5px; margin-right: 5px"><a class="page-link">${i}</a></li>`
                    } else {
                        pageination += `<li class="page-item" style="margin-left: 5px; margin-right: 5px"><a class="page-link" onclick="searchsong('${i}')">${i}</a></li>`
                    }
                    if (i == Number(currentPage) + 2 && i < pageCount) {
                        pageination += `<li class="page-item disabled" style="margin-left: 5px; "><a class="page-link" style="border-color: #06121e; background-color: #06121e">...</a></li>`
                        pageination += `<li class="page-item" style="margin-left: 10px;"><a class="page-link" onclick="searchsong('${pageCount}')">${pageCount}</a></li>`
                        break
                    }
                }
                /*                if (currentPage != pageCount){
                                    pageination += `<li class="page-item"><a class="page-link" onclick="searchsong('${pageCount}')">${pageCount}</a></li>`
                                }*/
                pageination += `</ul>`
            }


            $(".pagination").html(pageination)
        });
}

function deletepost(postid, thumbnail){
    $.ajax({
        url: '/deletepost',
        type: 'POST',
        data: {postid: postid, thumbnail: thumbnail}
    })
    .then(res => {
        if(res == "success"){
            alert("Xong!")
            searchsong()
        }
    })
}

function editpost(id, title, content, thumbnail){
    $("#modaledit").modal('toggle');

    $("#postid").val(id)
    $("#title").val(title)
    CKEDITOR.replace( 'editor1' );
    CKEDITOR.instances.editor1.setData(content)
    $("#urlthumbnail").val(thumbnail)
    $("#checkthubmnail").attr("src", thumbnail)
}

function imagein() {
    var urlthumbnail = $("#urlthumbnail").val()
    $("#checkthubmnail").attr("src", urlthumbnail)
}

function editsave() {
    $("#modaledit").modal('toggle');
    var postid = $("#postid").val()
    var title = $("#title").val()
    var urlthumbnail = $("#urlthumbnail").val()
    var content = CKEDITOR.instances.editor1.getData()

    var data = {
        postid: postid,
        title: title,
        content: content,
        urlthumbnail: urlthumbnail,
    }

    $.ajax({
        url: '/editpost',
        type: 'POST',
        data: data
    })
        .then(res => {
            if(res == "success"){
                alert("Xong!")
                searchsong()
            }
        })
}

function logout() {
    $.ajax({
        url: '/logout',
        type: 'POST'
    })
        .then(res => {
            if(res == "success"){
                location.href = "/"
            }
        })
}
