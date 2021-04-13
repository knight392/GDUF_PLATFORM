// 用户信息面板放这里

import { isLogin } from "../../../common/user/index.js";
import { doLogOff } from "../../../common/user/index.js";
import debounce from "../../../util/debounce.js";
import { displayTipPane, displayTipPane_warn, tipInfo } from "../tipPane.js";
import { getData, attentionMajor, attentionPass, QAanswer, QAcue, goLeftY, goRightY } from "./tools.js";

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

//#region 我的关注 √
$(".attention").on({
    click: function() {
        console.log("at");
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
$('.itemList_box').scroll(debounce(getData, 300));
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
        displayTipPane("已退出登录~")
            //问题页面判断是否登录
    }
});
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