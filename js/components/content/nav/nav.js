import debounce from '../../../util/debounce.js'
// import { baseHttpURL } from '../../../common/baseRequestInfo.js';
import { displayTipPane_warn, tipInfo } from '../tipPane.js'

import { getSearchMessageY, messageInf, messageChat } from './tools.js'
import { doLogOff, isLogin, user } from '../../../common/user/index.js';
import { goLeftY, goRightY } from '../userPane/tools.js';

// 清空搜索栏
(function() {
    $(".search .searchBar").val("");
})()

//头像那边的二级导航 ：0 没显示  1 表示已经显示

$("body").on({
    click: function() {
        //#region 搜索框：searchContent不显示+ 清空里面的内容 +清空搜索框内容 
        $(this).parent().siblings(".searchContent").hide(200);
        $(".searchContent").find('li').remove();
        $(".search").find(".searchBar").val("");
        //#endregion

    }
})

//#region 搜索框 √ 点击 + 得失焦点 + 节流 √ 
$(".search").on({
    click: function(e) {
        e.stopPropagation();
    }
})

$(".nav").find(".searchBar").on({
    blur: function() {
        //搜索框失去焦点 bar/btn 的边框圆角 变会 + bar 的背景 变回半透明 + 联想内容 隐藏
        $(".searchBar").css("borderRadius", "40px 0 0 40px");
        $(".searchBtn").css("borderRadius", "0 40px 40px 0");
        $(this).css("backgroundColor", "rgba(255, 255, 255, 0.5)");
        $(this).parent().siblings(".searchContent").hide(200);

        //失去焦点 清空li的内容
        // $(this).parent().siblings(".searchContent").find("li").remove();

    }
})

//#region 搜索框内容
$(".nav").find(".searchBar").bind("keyup", debounce(function() {
    //键盘抬起事件 + val() 非空 发送请求 
    // console.log($(this).val());
    if ($(this).val() != null || $(this).val() != "") {
        //搜索框获得焦点 bar/btn 的边框圆角 变化 + bar 的背景 变白 + 联想内容 显示
        $(".searchBar").css("borderRadius", "16px 0 0 0");
        $(".searchBtn").css("borderRadius", "0 16px 0 0");
        $(this).css("backgroundColor", "#fff");
        $(this).parent().siblings(".searchContent").show(200);
    } else {
        $(".searchBar").css("borderRadius", "40px 0 0 40px");
        $(".searchBtn").css("borderRadius", "0 40px 40px 0");
        $(this).css("backgroundColor", "rgba(255, 255, 255, 0.5)");
        $(this).parent().siblings(".searchContent").hide(200);
    }

    if ($(this).val() != "") {
        getSearchMessageY($(this).val())
    } else {
        $(".searchContent").find('li').remove();
        $(".search").find(".searchBar").val("");
        $(".searchBar").css("borderRadius", "40px 0 0 40px");
        $(".searchBtn").css("borderRadius", "0 40px 40px 0");
        $(this).css("backgroundColor", "rgba(255, 255, 255, 0.5)");
        $(this).parent().siblings(".searchContent").hide(200);
    }
}, 250, true));


// $('.searchContent>li').on({
//   click: function () {
//     window.open($(this).);
//         }
//     })
//#endregion

//#endregion

//#region  登录 + 获取 消息 关注 问答 收藏 + 退出登录

//#region 点击登录button进入登录弹框 √

$('.fadein').click(function() {
    $(".logOn").siblings().fadeOut();
    $(".logOn").fadeIn();
    $(".modal_bg_logon").fadeIn(); //远安修改代码 解决类名冲突
    $('.modal').css({
        transform: 'translate(-50%,-50%) scale(1)'
    })
})

$('.fadeout').click(function() {
    $(this).parent().parent().parent().fadeOut(); // 其实就是css 的过渡+ display
    $(this).parent().parent().css({
        transform: 'translate(-50%,-50%) scale(0.7)'
    })
})

//#endregion


//#region 消息通知 √ 

// 逻辑上有混乱，应该是打开的时候只发送动态通知的请求，并且只有第一次会有请求，
//当切换到私信通知的时候才发送获取私信的请求，并且显示的item应该是一个用户不是显示发送过来的具体新消息

let message_openFirst = true;
$(".message").on({
    mouseenter: function(e) {
        e.stopPropagation();
        if (isLogin()) {
            $('.message').find(".messageNotification").stop().fadeIn();
            if (message_openFirst) {
                message_openFirst = false;
                messageInf();
            }
        } else {
            displayTipPane_warn(tipInfo.login.no_login);
        }
    },
    mouseleave: function(e) {
        e.stopPropagation();
        $('.message').find(".messageNotification").stop().fadeOut();
    }
})

//右边:私信
$('.message #hoverBox_privateMessage').on({
    click: function() {
        goRightY($(this), ".system", ".private");
        messageChat();
    }
})

//左边:动态
$('.message #hoverBox_dynamicMessage').on({
    click: function() {
        goLeftY($(this), ".private", ".system");
        messageInf();
    }
});
//#endregion


//#endregion

//#region 二级面板的位置动态变化
$(window).on("resize", function() {
    // console.log($(".hpSecond").css("width"));
    $(".hpSecondSecond").css("right", $(".hpSecond").css("width"))
})

$(".hpSecond .secondPane_entrance").on({
    click: function(e) {
        //出现二二级导航：字体icon变蓝 + 二级导航的边框变
        e.stopPropagation();
        $(this).siblings().find(".iconfont").css('color', '#666');
        $(this).find(".iconfont").css('color', '#028e9b');
        $(this).siblings().find("em").css('color', '#666');
        $(this).find('em').css('color', '#028e9b');
        //根据target自定义属性名再通过类名来获取对应的二级面板
        let secondPane = $("." + $(this).attr("target"));
        if (secondPane == null || secondPane == undefined) {
            return;
        }
        let generalPane = $(this).parents(".hpSecond_general");
        // $(".hpSecond").css("borderRadius", "0 22px 22px 0");
        //打开二级面板的左边圆角
        //每次打开之前恢复原来状态
        $(".hpSecondSecond").fadeOut();
        $(".hpSecondSecond").animate({
            right: "0"
        }, 100);
        secondPane.css("borderRadius", "22px");
        generalPane.css("borderRadius", "22px");

        if (isLogin()) {
            //count是实现点击一次按钮打开二级面板，再次点击就关闭
            // 原面板的右边圆角
            secondPane.css("borderRadius", "22px 0 0 22px");
            generalPane.css("borderRadius", "0 22px 22px 0");
            // 所有的二级面板消失
            // $(this).siblings().find(".hpSecondSecond").css("display", "none");
            secondPane.css("display", "block");
            // 不能写死，应该获取个人中心面板的宽度
            let right = $(".hpSecond_general").outerWidth();
            secondPane.animate({
                right: right + "px",
            }, 300);
        } else {
            displayTipPane_warn(tipInfo.login.no_login);
        }

    }
})

$(".hpSecondSecond").on({
    click: function(e) {
        e.stopPropagation();
        // count = 0;
        $(this).css("display", "block");
    }
})

//#endregion