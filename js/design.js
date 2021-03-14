let backToTop = $('<a>',{
    href: '#home',
    class: 'back-to-top',
    html: '<i class="fa fa-caret-up fa-5x"></i>'
})

backToTop.hide().appendTo('body').on('click',function (){
    $('body').animate({scrollTop:0});
    window.location.hash = '';
});

let win = $(window);
win.on('scroll',function (){
    if(win.scrollTop() >= 500) {
        backToTop.fadeIn();
    }
    else {
        backToTop.hide();

    }
})

