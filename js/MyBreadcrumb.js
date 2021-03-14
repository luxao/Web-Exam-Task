
var pageHistory;
var menu;

document.addEventListener('DOMContentLoaded', () => {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    $.getJSON('resources/menuInfo.json', function(json) {
        menu = json;
    });
    checkCookie();
    setPathBreadcrumb();
    document.getElementById("sectOne").addEventListener("mouseover", function(){changePathBreadcrumb("1",true)});
    document.getElementById("sectTwo").addEventListener("mouseover", function(){changePathBreadcrumb("2-0",true)});
    document.getElementById("sectThree").addEventListener("mouseover", function(){changePathBreadcrumb("2-1",true)});
});


function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
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

function checkCookie() {
    var cookiePageHistory = getCookie("pageHistory");
    if (cookiePageHistory != "") {
        pageHistory = JSON.parse(cookiePageHistory);
    } else {
        pageHistory = [];
        pageHistory[pageHistory.length] = {name : "Home", href : "index.html"};
        setCookie("pageHistory",  JSON.stringify([{name : "Home", href : "index.html"}]), 30);
    }
}

function getObjectFromMenuJson(value) {
    var idLevels = value.split("-");
    var objectToReturn = menu.menus;
    for(var level = 0; level <= idLevels.length; level++) {
        if(level + 1 == idLevels.length) {
            return objectToReturn[idLevels[level].toString()];
        } else {
            objectToReturn = objectToReturn[idLevels[level].toString()].children;
        }
    }
}

//if mouseOver is true, the two same object wil not be set at row
function changePathBreadcrumb(value, mouseOver) {
    var newPathObject = getObjectFromMenuJson(value);
    if(newPathObject.href != null && newPathObject.href != undefined) {
        if(pageHistory.length < 5) {
            if(!(newPathObject.name == pageHistory[pageHistory.length - 1].name && mouseOver == true)) {
                pageHistory[pageHistory.length] = newPathObject;
            }
        } else {
            if(!(newPathObject.name == pageHistory[pageHistory.length - 1].name && mouseOver == true)) {
                pageHistory.shift();
                pageHistory[pageHistory.length] = newPathObject;
            }
        }
        setCookie("pageHistory",  JSON.stringify(pageHistory), 30);
        setPathBreadcrumb();
    }
}

function setPathBreadcrumb() {
    var element = document.getElementById("my-breadcrumb");
    var template = "";
    for(let i = 0; i < pageHistory.length; i++) {
        template = template + "<p>" + "<a href=" +  pageHistory[i].href + ">" + pageHistory[i].name + "" + "</p>" + " / ";
    }
    element.innerHTML = template;
}