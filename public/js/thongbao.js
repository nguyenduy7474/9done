
setTimeout(function(){
    if(!getCookie("notify")){
        var now = new Date();
        var minutes = 30;
        now.setTime(now.getTime() + (5 * 60 * 1000));
        document.cookie = "notify=true; expires=" + now.toUTCString() + ";";
        $.notify("Mac/Iphone bị lỗi chưa hát được",
            {className: 'warn', globalPosition: 'bottom left',clickToHide: true,showDuration: 150
            });
        $.notify("Cần có tai nghe để thu âm",
            {className: 'warn', globalPosition: 'bottom left',showDuration: 150
            });
    }

}, 1000)

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

