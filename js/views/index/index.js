import { baseHttpURL } from '../../common/baseRequestInfo.js'
import { isLogin, user } from '../../common/user/index.js'
import displayTipPane from '../../components/content/tipPane.js'
import getLink from '../../util/copyLink.js'
import { infoIndexPART1, infoIndexPART2 } from './info.js'
import { loadingNextPART1, loadingNextPART2, totime, insertImgVideo, sendDevel } from './tools.js'
let PART = 1; //校区互通 1 校园动态 2

window.onload = function() {
    infoIndexPART1();

    infoIndexPART2();

    //#region 清空搜索框内的内容 √

    $(".search .searchBar").val("");

    //#endregion

    //#region  清空发表动态文本域的内容+图片+视频
    $('.issuePersonalDY textarea').val("");
    $('.addpicSon').find('.develimgY').remove();
    $('.addpicSon').find('.develvideoY').remove();
    //#endregion
}

//#region 内容中视频的播放暂停
$('.trendsMuted').on({
    click: function(e) {
        e.stopPropagation();
        $(this).siblings('video').attr('autoplay', 'autoplay');
        $(this).siblings('video')[0].play();
        $(this).hide();

        $(this).siblings('video').on({
            click: function() {
                $(this)[0].pause();
                $(this).siblings('.trendsMuted').show();
            }
        })
    }
});
//#endregion

$('.maincontent').css('min-height', window.innerHeight - 80 + 'px');
$('.maincontent .indexQuizList').css('min-height', window.innerHeight - 80 + 'px');
$('.schoolDevelopmentY').css('min-height', window.innerHeight - 80 + 'px');

$('body').on({
    click: function() {
        //#region 校园动态 点击表情/图片/视频 下拉二级导航
        $('.issWidgetSonY').slideUp(300);
        $('.issueWidgetY li>.iconfont').css('color', '#000');
        $('.issueWidgetY li>em').css('color', '#000');
        //#endregion

        //#region 动态的视频 暂停播放
        for (let vindex = 0; vindex < $('.trendsContent').find('video').length; vindex++) {
            $('.trendsContent').find('video')[vindex].pause();
            $('.trendsContent').find('.trendsMuted').show();
        }
        //#endregion
    }
})

//#region 卷去页面  返回顶部 √ + 滚到底部 加载更多(校区互通) √
$(window).scroll(function() {
    //#region  返回顶部
    if ($(document).scrollTop() >= 478) {
        $(".returnTop").show(200);
        $(".returnTop").on("click", function() {
            $("body, html").stop().animate({
                scrollTop: 0
            }, 1000);
        })
    } else {
        $(".returnTop").hide(400);
    }
    //#endregion

    //#region   加载更多
    if ($('html, body').scrollTop() + window.innerHeight >= Math.floor($('html').outerHeight(true))) {
        // console.log('底部');
        // console.log(PART);
        if (PART == 1) {
            loadingNextPART1();
        } else if (PART == 2) {
            loadingNextPART2();
        }
    }
    //#endregion
});
//#endregion

//#region 点击切换 校园动态/校区互通
$('.switchY .change').on({
    click: function() {
        console.log('click');
        $('.switchY').animate({
            'top': '-50px',
        }, 500)
        $(this).css({
            'backgroundColor': '#028e9b',
            'color': '#fff'
        })
        if (PART == 2) {
            $('.switchY .change').html('<i class = "iconfont iconqiehuan-"></i>校园动态');
            $('.schoolDevelopmentY').slideUp(1000);
            $('.indexQuizList').slideDown(2000);
            $('.change').attr('title', '切换校园动态');
            $('.maincontent').css('height', $('.indexQuizList').outerHeight(true) + 'px');

            PART = 1;
        } else {
            $('.switchY .change').html(' <i class="iconfont iconqiehuan-"></i>校区互通');
            $('.indexQuizList').slideUp(1000);
            $('.schoolDevelopmentY').slideDown(2000);
            $('.change').attr('title', '切换校区互通');

            $('.hb').css('height', $('.allD-div').outerHeight(true) + 'px');
            $('.maincontent').css('height', $('.schoolDevelopmentY').css('height'));

            PART = 2;
        }
        $("body, html").stop().animate({
            scrollTop: 0
        }, 500);
        $('.switchY').animate({
            'top': '-100px',
        }, 500)
        $(this).css({
            'backgroundColor': '#fff',
            'color': '#028e9b'
        })
    }
});
//#endregion

//#region 复制链接 √

$(".copyurlY").on({
    click: function() {
        let url;
        // console.log(window.location.href);
        if (window.location.href.indexOf('?') == -1) {
            url = window.location.href.substring(0, window.location.href.length - 10) + $(this).parents(".queY").find("a").attr("href");
        } else {
            url = window.location.href;
        }
        // console.log(url);
        getLink(url);
    }
})

//#endregion

//#region 发动态

//#region 点击表情/图片/视频 下拉二级导航
$('.issueWidgetY li').on({
    click: function(e) {
        e.stopPropagation();
        $(this).find('.issWidgetSonY').slideDown(300);
        $(this).find('.iconfont').css('color', '#028e9b');
        $(this).find('em').css('color', '#028e9b');
        $(this).siblings('li').find('.issWidgetSonY').slideUp(300);
        $(this).siblings('li').find('.iconfont').css('color', '#000');
        $(this).siblings('li').find('em').css('color', '#000');
        //#region 点击关闭 二级导航上拉
        $(this).find('.sonout').on({
            click: function(e) {
                e.stopPropagation();
                $(this).parent('.issWidgetSonY').slideUp(300);
                $(this).parent('.issWidgetSonY').siblings('.iconfont').css('color', '#000');
                $(this).parent('.issWidgetSonY').siblings('em').css('color', '#000');
            }
        });
        //#endregion
    }
});
//#endregion

//#region 图片
export var sendingImg = false;
$(".addimgsY").on({
    change: function(e) {
        if (sendingImg) {
            displayTipPane("有图片还在上传中...");
            return;
        }
        insertImgVideo(e, 'img');
    }
});
//#endregion  

//#region 视频
export var sendingVideo = false;
$(".addvideoY").on({
    change: function(e) {
        if (sendingVideo) {
            displayTipPane("有视频还在上传中...");
            return;
        }
        insertImgVideo(e, 'video');
    }
});

//#endregion


//#region 发布
$(".issuePersonalDY .issuebtnY").click(sendDevel);
//#endregion

//#region 点击动态分类的类别 背景+文字√ 板块切换√

$('.dclassifyY li').on({
    click: function() {

        //#region 背景+文字
        $(this).css({
            'backgroundColor': '#f5f6f7',
            'color': '#028e9b',
        });
        $(this).siblings('li').css({
            'backgroundColor': '#028e9b',
            'color': '#fff',
        });
        //#endregion

        //#region 板块切换
        const partindex = $(this).attr('data-part-index');
        $('.dynamicsY').eq(partindex).siblings('.dynamicsY').fadeOut(300);
        $('.dynamicsY').eq(partindex).fadeIn(300);
        //#endregion
    }

})

//#endregion