import '../scss/main.scss';

$(document).ready(function () {
    let index = 0;

    $('.content-box').hover(function () {
        index = $(this).index() + 1;
        $('.content-box:nth-child('+index+') > .content-img-wrap').css({ 'position': 'relative' });
        $('.content-box:nth-child('+index+') > .content-img').css({
            'position': 'relative', 'transform': 'scale(1.05)',
            'transition-duration': '0.2s', 'box-shadow': '0 0 30px 7px lightgrey'
        });
        $('.content-box:nth-child('+index+') > .content-img-wrap').stop().animate({ bottom: 5 }, 200);
        $('.content-box:nth-child('+index+') > .content-info').stop().animate({ top: -60 }, 200);
    }, function () {
        $('.content-box:nth-child('+index+') > .content-img-wrap').stop().animate({ bottom: 0 }, 200);
        $('.content-box:nth-child('+index+') > .content-info').stop().animate({ top: -50 }, 200);
        $('.content-box:nth-child('+index+') > .content-img').css({ 'transform': 'scale(1.0)', 'box-shadow': '0 0 0 0 white' })
    });
})
