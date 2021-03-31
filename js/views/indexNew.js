import { chart, rcnextp } from '../commponents/content/chart3bgimgY.js';

window.onload = function() {

    //#region 设置高度
    $(".rotationChartY .rc-picturesY").css("height", window.innerHeight + 'px'); //轮播图的背景父元素
    $(".rotationChartY .rc-picturesY>li").css("height", window.innerHeight + 'px'); //轮播图背景元素
    $(".functionPartY .fp-pictureY>li").css("height", window.innerHeight + 'px'); //功能介绍
    $(".beforeFooter").css("height", window.innerHeight - 60 + 'px'); //页脚前part
    //#endregion

    //#region 导航栏的更多 出现
    if ($(document).scrollTop() > 80) {
        $('.showNavY .navmore').slideDown(200);
    } else {
        $('.showNavY .navmore').slideUp(200);
    }
    //#endregion    

    //#region 轮播图
    rcnextp('.rc-picturesY li', 0, 1, 2);
    //#endregion

}

$(function() {;

    //#region 悬停导航栏更多 出现导航栏 + 导航栏

    $('.showNavY').on({
        mouseover: function() {
            $('.indexNavY').stop().animate({
                top: $(document).scrollTop(),
            }, 500);

            $('.indexNavY').on({
                mouseleave: function() {
                    $('.indexNavY').stop().animate({
                        top: 0,
                    }, 500);
                }
            })
        },
    })

    $('.schoolA').on({ //点击 滚动到学校通知
        click: function() {
            $("body, html").stop().animate({
                scrollTop: $('.inschoolNewsY').offset().top + 'px',
            }, 500);
        }
    })

    $(window).scroll(function(e) {
        if ($(document).scrollTop() > 80) {
            $('.showNavY .navmore').slideDown(400);
        } else {
            $('.showNavY .navmore').slideUp(400);
        }
    })

    //#endregion

    //#region 滚轮事件 

    let index = parseInt($(document).scrollTop() / window.innerHeight);
    window.addEventListener("wheel", function(e) {
        let evt = e || window.event;
        evt.preventDefault();
        if (evt.deltaY > 0 || evt.wheelDelta > 0) {
            if (index >= 4) {
                index = 4;
            } else {
                index++;
            }
        } else if (evt.deltaY < 0 || evt.wheelDelta < 0) {
            if (index <= 0) {
                index = 0;
            } else {
                index--;
            }
        }
        $('body, html').stop().animate({
            scrollTop: window.innerHeight * index + 'px',
        }, 500)
    }, { passive: false });

    //#endregion

    //#region 轮播图 
    chart('.rc-picturesY li', '.rc-back', '.rc-next', '.rotationChartY');
    //#endregion

    //#region 失物招领
    const lostfoundYOpacityPosition = function(opacityY, positionY) {
        $('.inlaf').css({
            opacity: opacityY,
            bottom: positionY
        });
        $('.lf-img').css({
            opacity: opacityY,
            bottom: positionY
        });
        $('.lf-h2').css({
            opacity: opacityY,
            top: positionY,
        });
        $('.lf-p').css({
            opacity: opacityY,
            top: positionY
        })
    };
    $('.lostFoundY').on({
        mouseenter: function() {
            lostfoundYOpacityPosition(1, 0);
            $(window).scroll(function() {
                lostfoundYOpacityPosition(0, '-20%');
            })
        },
        mouseover: function() {
            lostfoundYOpacityPosition(1, 0);
            $(window).scroll(function() {
                lostfoundYOpacityPosition(0, '-20%');
            })
        },
    });

    //#endregion

    //#region 校内通知
    const inschoolNewsYCssPosition = function(positionY) {
        $('.deansOffice').css('top', positionY);
        $('.youthLeagueCommittee').css('bottom', positionY);
        $('.studentAffairsOffice').css('top', positionY);
        $('.other').css('bottom', positionY);
    };
    $('.inschoolNewsY').on({
        mouseenter: function() {
            inschoolNewsYCssPosition(0);
            $(window).scroll(function() {
                inschoolNewsYCssPosition('-150%');
            })
        },
        mouseover: function() {
            inschoolNewsYCssPosition(0);
            $(window).scroll(function() {
                inschoolNewsYCssPosition('-150%');
            })
        },
    });
    //#endregion

    //#region 页脚前面

    $('.beforeFooter').on({
        mouseenter: function() {
            $('.footerImg').animate({
                'left': 0,
            }, 500);
            $('.footerDl').animate({
                'right': 0
            }, 500);
        },
        mouseover: function() {
            $('.footerImg').animate({
                'right': 0,
            }, 500);
            $('.footerDl').animate({
                'left': 0
            }, 500);

        },
    })

    //#endregion

    //#region 学校新闻 √

    //#region 点击换一批 新闻页面 换一批
    $(".changeTheBatchNews").on({
        click: function() {
            let indexCur = parseInt($(this).siblings("ul").find(".displayNewsDiv").attr("data-part"));
            if (indexCur < $(this).siblings("ul").find(".NewsDiv").length - 1) {
                indexCur++;
                $(this).siblings("ul").find(".NewsDiv").eq(indexCur).addClass("displayNewsDiv");
                $(this).siblings("ul").find(".NewsDiv").eq(indexCur).siblings().removeClass("displayNewsDiv");
            } else {
                indexCur = 0;
                $(this).siblings("ul").find(".NewsDiv").eq(0).addClass("displayNewsDiv");
                $(this).siblings("ul").find(".NewsDiv").eq(0).siblings().removeClass("displayNewsDiv");
            }
        }
    });
    //#endregion

    //#region 添加title
    let Anews = document.querySelector(".schoolNews").querySelectorAll("a");
    let sourceNews = document.querySelector(".schoolNews").querySelectorAll("i");
    for (let i = 0; i < Anews.length; i++) {
        Anews[i].title = Anews[i].innerText;
    }
    for (let i = 0; i < sourceNews.length; i++) {
        sourceNews[i].title = sourceNews[i].innerText;
    };
    //#endregion

    //#endregion


    //#region 微信的二维码
    $('.wechat').on({
        mouseenter: function() {
            $('.ewm').stop().show();
        },
        mouseover: function() {
            $('.ewm').stop().show();
        },
        mouseleave: function() {
            $('.ewm').stop().hide();
        },
    });
    //#endregion


})