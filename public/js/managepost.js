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

var datacontent = []

function searchsong(paging_num){
    var searchpost = $("#searchpost").val()
    $.ajax({
        url: '/getallposts',
        type: 'POST',
        data: {searchpost: searchpost}
    })
        .then(res => {
            allsongs = res.data
            datacontent = []
            let date
            let pageCount = res.pageCount
            let currentPage = res.currentPage
            var string = ``
            for(var i=0; i<allsongs.length; i++){
                datacontent.push(allsongs[i].content)
                date = new Date(allsongs[i].datecreated);
                date = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear()
                allsongs[i].content = allsongs[i].content.toString()
                string += `<tr>
                      <th>${i+1}</th>
                      <td>${allsongs[i].title}</td>
                      <td>${date}</td>
                      <td>` +
                    '<button type="button" class="btn btn-success" onclick="editpost(`' + allsongs[i]._id + '`,`' + allsongs[i].title + '`, `' + i + '`, `' + allsongs[i].thumbnail + '`, `' + allsongs[i].showpost + '`)">Sửa</button>'
                    + `</td>
                    </tr>`
            }
            $("#datatable").html(string)

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

function editpost(id, title, contentposition, thumbnail, showpost){
    if(showpost == 1){
        $("#showpost").prop('checked', true);
    }
    $("#modaledit").modal('toggle');

    $("#postid").val(id)
    $("#title").val(title)
    CKEDITOR.replace( 'editor1' );
    CKEDITOR.instances.editor1.setData(datacontent[contentposition])
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
    var showpost = $('#showpost').is(":checked")

    var data = {
        postid: postid,
        title: title,
        showpost: showpost,
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