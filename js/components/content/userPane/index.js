// 用户信息面板放这里

import { isLogin, doLogOff } from "../../../common/user/index.js";
import { displayTipPane_warn, tipInfo } from "../tipPane.js";
import { attentionMajor, attentionPass, QAanswer, QAcue, goLeftY, goRightY, readImg } from "./tools.js";

//#region 个人中心 提示正在开发
$('.IntoPersonCenter').on({
    click: function() {
        if (isLogin()) {
            displayTipPane_warn(tipInfo.dev.mes);
        } else {
            displayTipPane_warn(tipInfo.login.no_login);
        }
    }
});
//#endregion
// 上传头像
$('.ResMessageFace').on({
    mouseenter: function() {
        $(this).find('.cover').fadeIn(200)
    },
    mouseleave: function() {
        $(this).find('.cover').fadeOut(200)
    }
})
$('#uploadBtn').click(function() {
    $('#readFileBtn').click()
})
$('#readFileBtn').change(readImg)

//#region 我的关注 √
$(".attention").on({
    click: function() {
        if (isLogin()) {
            attentionMajor();
        } else {
            displayTipPane_warn(tipInfo.login.no_login);
        }
    }
});
// 右边:关注我的 √
$('#hoverBox_fans').click(function() {
    goRightY($(this), ".myAttention", ".attentionMe");
    // 发送请求 获取关注我的
    if (isLogin()) {
        attentionPass();
    } else {
        displayTipPane_warn(tipInfo.login.no_login);
    }
});

//左边:我的关注
$('#hoverBox_interest').click(function() {
    goLeftY($(this), ".attentionMe", ".myAttention");
    // 获取我的关注 √ 
    if (isLogin()) {
        attentionMajor();
    } else {
        displayTipPane_warn(tipInfo.login.no_login);
    }
});
//#endregion

//#region 我的收藏 提示正在开发
$(".myCollY").on({
    click: function() {
        if (isLogin()) {
            displayTipPane_warn(tipInfo.dev.mes);
        } else {
            displayTipPane_warn(tipInfo.login.no_login);
        }
    }
});
//#endregion

//#region 我的问答 √
$(".myQAY").on({
    click: function() {
        if (isLogin()) {
            QAcue();
        } else {
            displayTipPane_warn(tipInfo.login.no_login);
        }
    }
})

// 右边:问答 
$('#hoverBox_answer').click(function() {
    goRightY($(this), ".myCue", ".myAns");
    //发送请求
    if (isLogin()) {
        QAanswer();
    } else {
        displayTipPane_warn(tipInfo.login.no_login);
    }
})

// 左边:提问
$('#hoverBox_request').click(function() {
        goLeftY($(this), ".myAns", ".myCue");
        //发送请求
        if (isLogin()) {
            QAcue();
        } else {
            displayTipPane_warn(tipInfo.login.no_login);
        }
    })
    //#endregion

//#region 节流
//用到节流防抖，先不做
// $('.itemList_box').scroll(debounce(getData, 300));
//#endregion

//#region 退出登录 √
$(".exitLogonY").on({
    click: function() {
        // USERID = null;
        $(".personal").show(100);
        $(".logonHeadPortrait").hide(100);
        $(".system").html("");
        $(".private").html("");
        $(".myAttention").html("");
        $(".attentionMe").html("");
        $(".myCue").html("");
        $(".myAns").html("");
        $(".mycollection").html("");
        doLogOff();
        displayTipPane_warn("已退出登录~")
            //问题页面判断是否登录
    }
});
//#endregion

//#region 二级面板的位置动态变化
$(window).on("resize", function() {
    $(".hpSecondSecond").css("right", $(".hpSecond").css("width"))
})
$(document).on({
    click: function() {
        $(".hpSecond").stop().fadeOut(200);
        $('.hpSecondSecond').stop().fadeOut(200);
        $('.hpSecond_general').css("borderRadius", "22px");
        $('.secondPane_entrance').addClass("gohovercolor");
        $('.secondPane_entrance').find(".iconfont").css('color', '#666');
        $('.secondPane_entrance').find("em").css('color', '#666');
    }
})
$('.headPortrait').on({
    click: function(e) {
        e.stopPropagation();
        $(".hpSecond").stop().fadeIn(200);
    }
})

$(".hpSecond .secondPane_entrance").on({
    click: function(e) {
        e.stopPropagation();
        $(this).removeClass("gohovercolor");
        $(this).siblings().addClass("gohovercolor");
        $(this).siblings().find(".iconfont").css('color', '#666');
        $(this).find(".iconfont").css('color', '#028e9b');
        $(this).siblings().find("em").css('color', '#666');
        $(this).find('em').css('color', '#028e9b');
        //出现二二级导航：字体icon变蓝 + 二级导航的边框变

        //根据target自定义属性名再通过类名来获取对应的二级面板
        let secondPane = $("." + $(this).attr("target"));
        let generalPane = $(this).parents(".hpSecond_general");
        if (secondPane.length == 0) {
            $(".hpSecondSecond").animate({
                right: "0",
                borderRadius: "22px",
            }, 300);
            generalPane.css("borderRadius", "22px");
            // generalPane.css("borderRadius", "22px");
            return;
        }

        //原面板的右边圆角
        secondPane.css("borderRadius", "22px 0 0 22px");
        generalPane.css("borderRadius", "0 22px 22px 0");

        secondPane.css("display", "block");
        $(".hpSecondSecond").animate({
            right: "0",
            borderRadius: "22px ",
        }, 100);

        // 不能写死，应该获取个人中心面板的宽度
        let right = $(".hpSecond_general").outerWidth();
        secondPane.animate({
            right: right + "px",
            borderRadius: "22px 0 0 22px",
        }, 300);

        const that = $(this);
        $(this).siblings().on({
            click: function() {
                // that.find(".hpSecondSecond").fadeOut();
                secondPane.css("borderRadius", "22px")
            }
        })
    },
    mouseover: function() {
        $(this).siblings(".gohovercolor").find(".iconfont").css('color', '#666');
        $(this).siblings(".gohovercolor").find("em").css('color', '#666');
        if ($(this).hasClass("gohovercolor")) {
            $(this).find(".iconfont").css('color', '#4eb0b9');
            $(this).find('em').css('color', '#4eb0b9');
        }
    }
})

//#endregion