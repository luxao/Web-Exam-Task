document.addEventListener("DOMContentLoaded",()=>{
    const newDrower = document.createElement('web-component');


    // Get current time
    var date = new Date();
    var expiresDays = 1;
    // Set date to a time in 1 day
    date.setTime(date.getTime() + expiresDays*24*3600*1000);

    // write cookies
    function addCookie(name,value,expiresDays) {
        var cookieString = name + " = " + escape(value);
        cookieString = cookieString + "; expires = " + date.toGMTString();
        document.cookie = cookieString;
    }

    //Read cookies
    function getCookie(name) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split(";");
        for(var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (arr[0] === name) return arr[1];
        }
        return "";
    }

    var counter = getCookie('counter');
    if (!counter) counter = 1;
    else counter = parseInt(counter) + 1;
    addCookie('counter', counter, date);
    document.getElementById('counter').innerHTML =  counter ;

    window.onload=DisplayInfo

    //web component
    class Webcomponent extends HTMLElement {
        constructor() {
            super();
        }
    }

    window.customElements.define('web-component', Webcomponent);
})