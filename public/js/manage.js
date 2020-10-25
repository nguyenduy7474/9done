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



function searchsong(paging_num){
    var namesong = $("#searchsong").val()
    var singer = $("#searchsinger").val()
    $.ajax({
        url: '/searchsongs',
        type: 'POST',
        data: {namesong: namesong, singer: singer, paging_num: paging_num, pagesize: 10}
    })
    .then(res => {
        allsongs = res.data
        let pageCount = res.pageCount
        let currentPage = res.currentPage
        var string = ``
        let songtags
        for(var i=0; i<allsongs.length; i++){
            songtags = allsongs[i].songtags.join(", ")
            string += `<tr>
                      <th>${i+1}</th>
                      <td>${allsongs[i].songname}</td>
                      <td>${allsongs[i].singger}</td>
                      <td>${allsongs[i].songid}</td>
                      <td>` +
                        '<button type="button" class="btn btn-success" onclick="editsong(`' + allsongs[i].songid + '`, `' + allsongs[i].songname + '`, `' + allsongs[i].singger + '`, `' + songtags + '`, `' + allsongs[i].linkoriginsong + '`)">Sửa</button>'
                        + '<button type="button" class="btn btn-danger" onclick="deletesong(`' + allsongs[i].songid + '`)">Xóa</button>'
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

function editsong(songid, songname, singger, songtags, linkoriginsong){
    $("#modaledit").modal('toggle');

    $("#songname").val(songname)
    $("#singger").val(singger)
    $("#songid").val(songid)
    $("#songtags").val(songtags)
    $("#linkoriginsong").val(linkoriginsong)
}

function imagein() {
    var urlthumbnail = $("#urlthumbnail").val()
    $("#checkthubmnail").attr("src", urlthumbnail)
}

function editsave() {
    $("#modaledit").modal('toggle');
    var songid = $("#songid").val()
    var songname = $("#songname").val()
    var singger = $("#singger").val()
    var songtags = $("#songtags").val()
    var urlthumbnail = $("#urlthumbnail").val()
    var linkoriginsong = $("#linkoriginsong").val()

    var data = {
        songid: songid,
        songname: songname,
        singger: singger,
        songtags: songtags,
        urlthumbnail: urlthumbnail,
        linkoriginsong: linkoriginsong
    }

    $.ajax({
        url: '/editsong',
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

function deletesong(songid) {
    var check = confirm("Bạn chắc chắn 100% muốn xóa bài hát này hả!");
    if(check){
        $.ajax({
            url: '/deletesong',
            type: 'POST',
            data: {songid: songid}
        })
            .then(res => {
                if(res == "success"){
                    alert("Đã xóa!")
                    searchsong()
                }
            })
    }
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