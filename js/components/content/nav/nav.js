import debounce from '../../../util/debounce.js'
import { getSearchMessageY } from './tools.js'

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
$('.searchContent').css("width", $('.searchBar').innerWidth() + $('.searchBtn').innerWidth() + "px");
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

    }
})

//#region 搜索框内容
$(".nav").find(".searchBar").bind("keyup", debounce(function() {
    //键盘抬起事件 + val() 非空 发送请求 

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


// 打开提问模态框
$('.cueY').click(function() {
    if (isLogin()) {
        $('.quizModal_bg').fadeIn();
        $('.fadeinQuiz').find(".iconfont").css("top", "-10px");
        // $('.modal').fadeIn();
        $('.quizModal').css({
            transform: 'translate(-50%,-50%) scale(1)'
        })
    } else {
        displayTipPane_warn("只有登录了才能提问哦~");
    }
})

// $('.searchContent>li').on({
//   click: function () {
//     window.open($(this).);
//         }
//     })
//#endregion



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