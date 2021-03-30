window.onload = function(e) {

    //#region 设置高度
    $(".rotationChartY .rc-picturesY>li").css("height", window.innerHeight + 'px'); //轮播图的父元素
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

    $('.rc-picturesY li').eq(0).animate({
        'left': '0',
        'transition': 'left 3s ease-in',
    });

    $('.rc-picturesY li').eq(0).css({
        'z-index': '11',
    });

    $('.rc-picturesY li').eq(1).css({
        'z-index': '10',
        'left': '-100%',
        'transition': 'none',
    });

    $('.rc-picturesY li').eq(2).css({
        'z-index': '10',
        'left': '0',
        'transition': 'none',
    });

    //#endregion

}

$(function() {
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

    //#region 轮播图 左右拖动

    let rcindex = 0;
    let rcleftindex = 1;
    let rcrightindex = 2;

    const rcnext = function() {
        rcnextp();
        var temp = rcindex;
        rcindex = rcleftindex;
        rcleftindex = rcrightindex;
        rcrightindex = temp;
        rcnextp();
    }

    const rcback = function() {
        rcbackp();
        const temp = rcindex;
        rcindex = rcrightindex;
        rcrightindex = rcleftindex;
        rcleftindex = temp;

        rcbackp();
    }

    const rcnextp = function() {

        $('.rc-picturesY li').eq(rcindex).animate({
            'left': '0',
            'transition': 'left 3s ease-in',
        });

        $('.rc-picturesY li').eq(rcindex).css({
            'z-index': '11',
        });

        $('.rc-picturesY li').eq(rcleftindex).css({
            'z-index': '10',
            'left': '-100%',
            'transition': 'none',
        });

        $('.rc-picturesY li').eq(rcrightindex).css({
            'z-index': '10',
            'left': '0',
            'transition': 'none',
        });
    }

    const rcbackp = function() {
        $('.rc-picturesY li').eq(rcindex).animate({
            'left': '0',
            'transition': 'right 3s ease-in',
        });

        $('.rc-picturesY li').eq(rcindex).css({
            'z-index': '11',
        });

        $('.rc-picturesY li').eq(rcleftindex).css({
            'left': '0',
            'z-index': '10',
            'transition': 'none',
        });

        $('.rc-picturesY li').eq(rcrightindex).css({
            'z-index': '10',
            'left': '100%',
            'transition': 'none',
        });
    }

    let time = 0;
    let rctimer;
    rctimer = setInterval(function() {
        time++;
        if (time == 50) {
            time = 0;
            rcnext();
        }
    }, 100)


    $('.rc-back').on({
        click: function() {
            time = 0;
            rcback();
        }
    });

    $('.rc-next').on({
        click: function() {
            time = 0;
            rcnext();
        }
    })

    $('.rotationChartY').on({
        mouseenter: function() {
            $('.rc-back').show(500);
            $('.rc-next').show(500);
            clearInterval(rctimer);
            time = 0;
        },
        mouseover: function() {
            $('.rc-back').show(500);
            $('.rc-next').show(500);
            clearInterval(rctimer);
            time = 0;
        },
        mouseleave: function() {
            clearInterval(rctimer);
            rctimer = setInterval(function() {
                time++;
                if (time == 50) {
                    time = 0;
                    rcnext();
                }
            }, 100)
            $('.rc-back').hide(500);
            $('.rc-next').hide(500);
        },

    })

    //#endregion

    //#region 功能介绍部分 进入页面出现动画效果


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

    //#endregion

    //#region 学校新闻 √

    //#region 点击换一批 新闻页面 换一批


    $(".changeTheBatchNews").on({

        click: function() {

            var indexCur = parseInt($(this).siblings("ul").find(".displayNewsDiv").attr("data-part"));
            console.log(indexCur);
            console.log(indexCur <= $(this).siblings("ul").find(".NewsDiv").length);
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
    })

    //#endregion

    //#region 添加title
    let Anews = document.querySelector(".schoolNews").querySelectorAll("a");
    let sourceNews = document.querySelector(".schoolNews").querySelectorAll("i");
    for (let i = 0; i < Anews.length; i++) {
        Anews[i].title = Anews[i].innerText;
    }
    for (let i = 0; i < sourceNews.length; i++) {
        sourceNews[i].title = sourceNews[i].innerText;
    }

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