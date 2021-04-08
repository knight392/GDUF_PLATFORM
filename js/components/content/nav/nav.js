import debounce from '../../../util/debounce.js'
import { baseHttpURL } from '../../../common/baseRequestInfo.js';
import displayTipPane from '../tipPane.js'

import { setCookie, isHaveCookie, clearCookie, getSearchMessageY, logon, messageInf, goRightY, messageChat, goLeftY, attentionMajor, attentionPass, QAcue, QAanswer } from './tools.js'
import { doLogOff, isLogin, user } from '../../../common/user/index.js';

window.onload = function() {
    //#region 清空搜索框内的内容 √
    $(".search .searchBar").val("");
    //#endregion

    //#region 远安增加代码，实现加载判断是否最近登录过
    // console.log("加载用户信息");
    if (isLogin()) {         // displayTipPane("加载用户信息")
                
        $('.modal_bg').fadeOut();  // 其实就是css 的过渡+ display
                
        $('.modal').css({
            transform: 'translate(-50%,-50%) scale(0.7)'
        });        
        $('.personal').hide(100);
        $('.logonHeadPortrait').show(100);         // console.log(res);
                
        $('.ResUserName').text(user.userName);
        $('.ResUserName').prop(user.userName);
        $('.ResMarkNumber').text(user.userNumber);
        $('.ResMarkNumber').prop("title", user.userNumber);         // console.log(res.markNumber);
                
        // USERID = user.userNumber;
        $('.ResMessagePojoMajor').text(user.major);
        $('.ResMessagePojoMajor').prop(user.major);         // if (res.messagePojo.face != null) {
                
        let ResMessageFaceScr = '../' + user.userFace.substring(2);
        $('.ResMessageFace').prop("src", ResMessageFaceScr);
        $('.navHPY').prop('src', ResMessageFaceScr);
        initialWebSocket();
    } else {
        $('.personal').show(100);    
    }    
    //#endregion
}

let USERID;
let USERIMG;

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

//#region 节流
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

        //#region
        // $.get(baseHttpURL + 'Servlet/MainPageServlet', {
        //         requestType: 'get',
        //         getType: "explore",
        //         exploreContent: $(this).val(),
        //     }, function(res) {
        //         // console.log(res);  
        //         $('.search .searchContent li').remove();
        //         let indexli = 0;
        //         let url;
        //         let icon;
        //         for (let i = 0; i < res.dataList.length && i < 5; i++) {
        //             //判断是哪个篇 的 然后获取 创建iconfont
        //             if (res.dataList[i].questionType === "学习篇") {
        //                 icon = "iconxuexi";
        //             } else if (res.dataList[i].questionType === "期末篇") {
        //                 icon = "iconkaoshi3";
        //             } else if (res.dataList[i].questionType === "宿舍篇") {
        //                 icon = "iconsushe";
        //             } else if (res.dataList[i].questionType === "食堂篇") {
        //                 icon = "iconshitang";
        //             } else if (res.dataList[i].questionType === "考证篇") {
        //                 icon = "iconziyuan";
        //             } else {
        //                 icon = "iconqita";
        //             }
        //             url = 'questionPage.html?id=' + res.dataList[i].id;

        //             if (indexli < 5) {
        //                 const li = $('<li><span><i class="iconfont ' + icon + ' "></i></span><a target="_blank" href=" ' + url + ' ">' + res.dataList[i].title + '</a></li>');
        //                 $(".search .searchContent").prepend(li);
        //                 $(".search .searchContent").find("li").eq(i).html(res.dataList[i].title);
        //                 indexli++;
        //             }
        //         }
        //     }, 'json')
        //#endregion
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
    $('.modal_bg_logon').fadeOut(); // 其实就是css 的过渡+ display
    $('.logonBody .logonYmadal').css({
        transform: 'translate(-50%,-50%) scale(0.7)'
    })
})

//#endregion

//#region 用户名/密码 与后端交互 √

let option = 1;

$(".logOn h2").on("click", function() {
    //点击 学生/老师 相应模块 显示
    $(this).parent().addClass("logOnDisplay");
    $(this).parent().siblings().removeClass("logOnDisplay");

    //设置option 1/2 当前登录状态 1 学生 2 老师
    if ($(this).text() === "学生") {
        option = 1;
    } else if ($(this).text() === "教师") {
        option = 2;
    }
})

//登录
$('.btnLogon').click(function() {
    let pwd, account, type;
    if (option == 1) {
        pwd = $('#stu_pwd').val();
        account = $('#stu_account').val();
        type = "student"
    } else {
        pwd = $('#teacher_pwd').val();
        account = $('#teacher_account').val();
        type = "teacher"
    }

    if (pwd === "" || account === "") {
        displayTipPane('用户名/密码不能为空');
    } else {
        logon();
        //#region 
        // $.get(baseHttpURL + 'Servlet/UserServlet', {
        //     password: pwd,
        //     loginValue: account,
        //     requestType: 'get',
        //     userType: type
        // }, function(res) {
        //     if (res.statusCode == 200) {
        //         setCookie(res.messagePojo, 10); //保存30天

        //         //if登录成功 退出登录框 登录+注册 -> 消息+头像

        //         $('.modal_bg').fadeOut(); // 其实就是css 的过渡+ display
        //         $('.modal').css({
        //             transform: 'translate(-50%,-50%) scale(0.7)'
        //         })

        //         //#region 动态创建 头像下部分的内容

        //         $('.personal').hide(100);
        //         $('.logonHeadPortrait').show(100);
        //         $('.ResUserName').text(res.userName);
        //         $('.ResUserName').prop("title", res.userName);
        //         $('.ResMarkNumber').text(res.markNumber);
        //         $('.ResMarkNumber').prop("title", res.markNumber);
        //         USERID = res.markNumber;
        //         $('.ResMessagePojoMajor').text(res.messagePojo.major);
        //         $('.ResMessagePojoMajor').prop("title", res.messagePojo.major);
        //         let ResMessageFaceScr = '../' + res.messagePojo.face.substring(2);
        //         $('.ResMessageFace').prop("src", ResMessageFaceScr);
        //         $('.navHPY').prop('src', ResMessageFaceScr);

        //         //#endregion
        //         //#region 生成websocket对象
        //         initialWebSocket();

        //         //#endregion

        //     } else {
        //         displayTipPane('账号或密码有误，登录失败！');
        //     }
        // }, 'json')
        //#endregion
    }
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
                //#region 
                // $.get('../Servlet/InfServlet', {
                //         currentPage: "1",
                //         receiverMarkNumber: USERID,
                //         order: "sendTime",
                //         direction: "desc",
                //         requestType: 'get',
                //         type: "inf",
                //     }, function(res) {
                //         $(".system").html("");
                //         //#region 动态创建  消息通知
                //         for (let i = res.dataList.length - 1; i > 0; i--) {

                //             const item = $("<li class='item'></li>");
                //             const src = '../' + res.dataList[i].senderFace.substring(2);
                //             const img = $("<img src='" + src + "'>");
                //             const svg = $("<svg class='info_point' class='icon' height='10' p-id='12380' t='1602330426902' version='1.1' viewBox='0 0 1024 1024' width='10' xmlns='https://www.w3.org/2000/svg'><path d='M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z' fill='#E6A23C' p-id='12381'></svg>");
                //             const username = $("<span class='userName itemTitle' title='" + res.dataList[i].senderName + "'>" + res.dataList[i].senderName + "</span>");
                //             const information = $("<span class='item_info' title='" + res.dataList[i].content + "'>" + res.dataList[i].content + "</span>");
                //             const time = $("<span class='time'>" + res.dataList[i].timeUpToNow + "</span>");

                //             $(".message .contentBox_information").find(".system").prepend(item);
                //             $(".message .contentBox_information").find(".system").find(".item").eq(0).append(img);
                //             $(".message .contentBox_information").find(".system").find(".item").eq(0).append(svg);
                //             $(".message .contentBox_information").find(".system").find(".item").eq(0).append(username);
                //             $(".message .contentBox_information").find(".system").find(".item").eq(0).append(information);
                //             $(".message .contentBox_information").find(".system").find(".item").eq(0).append(time);

                //         }
                //         //#endregion
                //         // console.log(res);

                //     }, 'json')
                //#endregion
                messageInf();
            }
        } else {
            displayTipPane("你还没登录噢~");
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
        //#region goRightY() 
        // $(this).siblings(".activeLine").addClass("toRight");
        // $(this).siblings(".activeLine").removeClass("toLeft");
        // $(this).css('fontWeight', '700');
        // $(this).siblings('span').css("fontWeight", '400');
        // $(".system").fadeOut();
        // $(".private").fadeIn();
        //#endregion
        goRightY(".system", ".private");
        //#region 获取私信通知
        // let send = new Array();
        // let pindex;
        // let isRead = true;
        // $.get('../Servlet/InfServlet', {
        //     currentPage: "1",
        //     receiverMarkNumber: USERID,
        //     order: "sendTime",
        //     direction: "desc",
        //     requestType: 'get',
        //     type: "chat",
        // }, function(res) {
        //     $(".private").html("");
        //     // console.log(res);
        //     //#region 动态创建  消息私信
        //     pindex = 0;
        //     for (let i = res.dataList.length - 1; i > 0; i--) {
        //         const item = $("<li class='item chatBtn' target='" + res.dataList[i].senderMarkNumber + "' targetName='" + res.dataList[i].senderName + "' data-pindex='" + pindex + "'></li>");
        //         const src = '../' + res.dataList[i].senderFace.substring(2);
        //         const img = $("<img src='" + src + "'>");
        //         const svg = $("<svg class='info_point' class='icon' height='10' p-id='12380' t='1602330426902' version='1.1' viewBox='0 0 1024 1024' width='10' xmlns='https://www.w3.org/2000/svg'><path d='M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z' fill='#E6A23C' p-id='12381'></svg>");
        //         const username = $("<span class='userName itemTitle' title='" + res.dataList[i].senderName + "'>" + res.dataList[i].senderName + "</span>");
        //         const information = $("<span class='item_info' title='" + res.dataList[i].content + "'>" + res.dataList[i].content + "</span>");
        //         const time = $("<span class='time'>" + res.dataList[i].timeUpToNow + "</span>");
        //         $(".message .contentBox_information").find(".private").prepend(item);
        //         $(".message .contentBox_information").find(".private").find(".item").eq(0).append(img);
        //         $(".message .contentBox_information").find(".private").find(".item").eq(0).append(svg);
        //         $(".message .contentBox_information").find(".private").find(".item").eq(0).append(username);
        //         $(".message .contentBox_information").find(".private").find(".item").eq(0).append(information);
        //         $(".message .contentBox_information").find(".private").find(".item").eq(0).append(time);

        //         send[pindex] = {
        //             'senderMarkNumber': res.dataList[i].senderMarkNumber,
        //             'senderFace': '../' + res.dataList[i].senderFace.substring(2),
        //             'senderName': res.dataList[i].senderName,
        //         }
        //         pindex++;
        //     }
        //     //#endregion
        //     $(".chatBtn").off("click");
        //     $(".chatBtn").on("click", function() {
        //         wantToSendMarkNumber = $(this).attr("target");
        //         wsUrl = url + '/' + myMarkNumber + '/' + wantToSendMarkNumber;
        //         //重新连接WebSocket

        //         //用户名
        //         $(".platform_chat .targetName").text($(this).attr("targetName"));
        //         if (lastTarget != null && lastTarget != $(this).attr("target")) {
        //             ulNode.innerHTML = "";
        //         }
        //         lastTarget = $(this).attr("targetName");

        //         $(".platform_chat").fadeIn();

        //         //这次的webSocket是有发送目标的
        //         createWebSocket1();
        //     });
        //     // console.log(send);

        // }, 'json')

        //#endregion
        messageChat();
    }
})

//左边:动态
$('.message #hoverBox_dynamicMessage').on({
    click: function() {
        //#region goLeftY()
        // $(this).siblings(".activeLine").addClass("toLeft");
        // $(this).siblings(".activeLine").removeClass("toRight");
        // $(this).css('fontWeight', '700');
        // $(this).siblings('span').css("fontWeight", '400');
        // $(".private").fadeOut();
        // $(".system").fadeIn();
        //#endregion
        goLeftY(".private", ".system");
        //#region 
        // $.get('../Servlet/InfServlet', {
        //     currentPage: "1",
        //     receiverMarkNumber: USERID,
        //     order: "sendTime",
        //     direction: "desc",
        //     requestType: 'get',
        //     type: "inf",
        // }, function(res) {
        //     $(".system").html("");
        //     // console.log(res);

        //     // 动态创建  消息通知
        //     for (let i = res.dataList.length - 1; i > 0; i--) {

        //         const item = $("<li class='item'></li>");
        //         const src = '../' + res.dataList[i].senderFace.substring(2);
        //         const img = $("<img src='" + src + "'>");
        //         const svg = $("<svg class='info_point' class='icon' height='10' p-id='12380' t='1602330426902' version='1.1' viewBox='0 0 1024 1024' width='10' xmlns='https://www.w3.org/2000/svg'><path d='M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z' fill='#E6A23C' p-id='12381'></svg>");
        //         const username = $("<span class='userName itemTitle' title='" + res.dataList[i].senderName + "'>" + res.dataList[i].senderName + "</span>");
        //         const information = $("<span class='item_info' title='" + res.dataList[i].content + "'>" + res.dataList[i].content + "</span>");
        //         const time = $("<span class='time'>" + res.dataList[i].timeUpToNow + "</span>");

        //         $(".message .contentBox_information").find(".system").prepend(item);
        //         $(".message .contentBox_information").find(".system").find(".item").eq(0).append(img);
        //         $(".message .contentBox_information").find(".system").find(".item").eq(0).append(svg);
        //         $(".message .contentBox_information").find(".system").find(".item").eq(0).append(username);
        //         $(".message .contentBox_information").find(".system").find(".item").eq(0).append(information);
        //         $(".message .contentBox_information").find(".system").find(".item").eq(0).append(time);
        //     }
        // })
        //#endregion
        messageInf();
    }
});
//#endregion

//#region 我的关注 √
$(".attention").on({
    click: function() {
        // 获取我的关注 √ 
        if (isLogin()) {
            //#region 
            // $.get('../Servlet/AttentionServlet', {
            //     requestType: 'get',
            //     majorMarkNumber: USERID,
            //     attentionType: "major",
            //     currentPage: "1",
            //     direction: "asc",
            //     order: "id",
            // }, function(res) {
            //     $(".myAttention").html("");
            //     // console.log(res);

            //     //#region 动态创建 我的关注
            //     for (let i = 0; i < res.dataList.length; i++) {
            //         const json = {
            //             userFace: res.dataList[i].userFace,
            //             userName: res.dataList[i].userName,
            //             action: "turnOff",
            //             isSubscribe: "subscribe_on"
            //         }
            //         if (res.dataList[i].userType == "student") {
            //             json["status"] = "学生";
            //             json["school_info"] = res.dataList[i].major;
            //         } else {
            //             json["status"] = "老师";
            //             json["school_info"] = res.dataList[i].collage;
            //         }
            //         const item = template("attentionItem_template", json);
            //         $(".myAttention").append(item);
            //     }
            //     //#endregion

            //     //还没关注之前，点击后发送关注请求，并且成功后把状态变成关注，点亮
            //     //如果当前是已关注，title为取消关注

            //     // 点击关注按钮，并且是当前状态为turnON ，就发送请求发送关注，如果为turnOff就发送取消关注请求

            //     $('.hoverBox .contentBox_subscribe .item .subscribe').click(function() {
            //         if ($(this).attr("nextAction") === 'turnOn') {
            //             //发送关注请求
            //             $(this).find('svg path').css("fill", "#ff7800");
            //             $(this).attr({
            //                 "nextAction": "turnOff",
            //                 "title": "取消关注"
            //             });
            //         } else {
            //             $(this).find('svg path').css("fill", "#bfbfbf");
            //             $(this).attr({
            //                 "nextAction": "turnOn",
            //                 "title": "关注"
            //             });
            //         }
            //     })

            // }, 'json');
            //#endregion
            attentionMajor();
        } else {
            displayTipPane("您还未登录！");
        }
    }
})

// 右边:关注我的 √
$('#hoverBox_fans').click(function() {
    //#region 
    // $(this).siblings(".activeLine").addClass("toRight");
    // $(this).siblings(".activeLine").removeClass("toLeft");
    // $(this).css('fontWeight', '700');
    // $(this).siblings('span').css("fontWeight", '400');
    // $(".myAttention").fadeOut();
    // $(".attentionMe").fadeIn();
    //#endregion
    goRightY(".myAttention", ".attentionMe");
    // 发送请求 获取关注我的
    if (isLogin()) {
        //#region 
        // $.get('../Servlet/AttentionServlet', {
        //     requestType: 'get',
        //     attentionType: "pass",
        //     passMarkNumber: USERID,
        //     currentPage: "1",
        //     direction: "asc",
        //     order: "id",
        // }, function(res) {
        //     $(".attention .contentBox_subscribe").find("ul.attentionMe").html("");

        //     // console.log(res);

        //     //#region 动态创建 关注我的
        //     for (let i = 0; i < res.dataList.length; i++) {
        //         // console.log(res.dataList[i]);
        //         const json = {
        //             userFace: res.dataList[i].userFace,
        //             userName: res.dataList[i].userName,
        //             action: "turnOn",
        //             isSubscribe: "subscribe_off"
        //         }
        //         if (res.dataList[i].userType == "student") {
        //             json["status"] = "学生";
        //             json["school_info"] = res.dataList[i].major;
        //         } else {
        //             json["status"] = "老师";
        //             json["school_info"] = res.dataList[i].collage;
        //         }
        //         const item = template("attentionItem_template", json);
        //         $("ul.attentionMe").append(item);
        //     }
        //     //#endregion
        // }, 'json');
        //#endregion
        attentionPass();
    } else {
        displayTipPane("您还未登录！");
    }

})

//左边:我的关注
$('#hoverBox_interest').click(function() {
    //#region 
    // $(this).siblings(".activeLine").addClass("toLeft");
    // $(this).siblings(".activeLine").removeClass("toRight");
    // $(this).css('fontWeight', '700');
    // $(this).siblings('span').css("fontWeight", '400');
    // $(".myAttention").fadeIn();
    // $(".attentionMe").fadeOut();
    //#endregion
    goLeftY(".attentionMe", ".myAttention");
    // 获取我的关注 √ 
    if (isLogin()) {
        attentionMajor();
    } else {
        displayTipPane("您还未登录！");
    }
});
//#endregion

//#region 节流

let page = 1; //可以写在list的属性中
let num = 6;
//用到节流防抖，先不做
$('.itemList_box').scroll(debounce(getData, 300));

//获取数据函数
function getData() {
    const scrollTop = Math.ceil($(this).scrollTop()); //滚动条到顶部的高度
    const curHeight = $(this).height(); //窗口高度
    const totalHeight = $('.itemList').height(); //整个文档高度
    // console.log("拖拽滚动条");
    if (scrollTop + curHeight > totalHeight) { //滚动条到底
        page++;
        // console.log(page)
        // console.log("到达了底部")
        // getData();//获取数据的方法
    }
}
//#endregion

//#region 我的收藏 × 

$(".myCollY").on({
    click: function() {
        //先清空上次请求创建的信息
        $(".myCollY .contentBox_collection").find("ul.mycollection").html("");

        if (isLogin()) {

        } else {
            displayTipPane("您还未登录！");
        }

    }
})

//#endregion

//#region 我的问答 √
$(".myQAY").on({
    click: function() {
        if (isLogin()) {
            //#region 我的提问 √
            // $.get('../Servlet/MainPageServlet', {
            //     requestType: 'get',
            //     getType: "special",
            //     authorMarkNumber: USERID,
            // }, function(res) {
            //     $(".myCue").html("");

            //     //#region 动态创建 我的提问

            //     for (let i = 0; i < res.dataList.length; i++) {
            //         const li = $('<li class="item"></li>');
            //         // const contenturl = 'html/questionPage.html?id=' + data.id;
            //         const a = $('<a href="questionPage.html?id="' + res.dataList[i].id + '></a>');
            //         const title = $("<div class='problem_title' title='" + res.dataList[i].title + "'>" + res.dataList[i].title + "</div>");
            //         const remark = $("<div class='problem_remark_answer' title='" + res.dataList[i].contents[0].contentMain + "'>" + res.dataList[i].contents[0].contentMain + "</div>")

            //         const time = $("<div class='time_box'><span class='time'>" + res.dataList[i].timeUpToNow + "</span></div>")

            //         $(".contentBox_request").find(".myCue").prepend(li);
            //         $(".contentBox_request").find(".myCue").find("li").eq(0).append(a);
            //         $(".contentBox_request").find(".myCue").find("li").eq(0).find("a").append(title);
            //         $(".contentBox_request").find(".myCue").find("li").eq(0).find("a").append(remark);
            //         $(".contentBox_request").find(".myCue").find("li").eq(0).find("a").append(time);

            //     }

            //     //#endregion

            // }, 'json')

            // }
            //#endregion
            //#region 获取我的问题 √
            // $.get('../Servlet/AnswerServlet', {
            //     requestType: 'get',
            //     getAnswerType: "individual",
            //     markNumber: USERID,
            //     currentPage: "1",
            // }, function(res) {
            //     $(".myAns").html("");
            //     //#region 动态创建 我的回答

            //     for (let i = 0; i < res.dataList.length; i++) {
            //         const li = $('<li class="item"></li>');
            //         // const contenturl = 'html/questionPage.html?id=' + data.id;
            //         const a = $('<a href="questionPage.html?id="' + res.dataList[i].questionId + '></a>');
            //         const title = $("<div class='problem_title'>" + res.dataList[i].title + "</div>");
            //         const remark = $("<div class='problem_remark_answer'></div>");

            //         const time = $("<div class='time_box'><span class='time'>" + res.dataList[i].timeUpToNow + "</span></div>");
            //         $(".contentBox_request").find(".myAns").prepend(li);
            //         $(".contentBox_request").find(".myAns").find("li").eq(0).append(a);
            //         $(".contentBox_request").find(".myAns").find("li").eq(0).find("a").append(title);
            //         $(".contentBox_request").find(".myAns").find("li").eq(0).find("a").append(remark);
            //         $(".contentBox_request").find(".myAns").find("li").eq(0).find(".problem_remark_answer").html(res.dataList[i].contents[0].contentMain);
            //         $(".contentBox_request").find(".myAns").find("li").eq(0).find(".problem_remark_answer").attr("title", $(".contentBox_request").find(".myAns").find("li").eq(0).find(".problem_remark_answer").text());
            //         $(".contentBox_request").find(".myAns").find("li").eq(0).find("a").append(time);

            //     }
            //     //#endregion
            // }, 'json')

            //#endregion
            QAcue();
        } else {
            displayTipPane("您还未登录！");
        }
    }
})

// 右边:问答 
$('#hoverBox_answer').click(function() {
    //#region 
    // $(this).siblings(".activeLine").addClass("toRight");
    // $(this).siblings(".activeLine").removeClass("toLeft");
    // $(this).css('fontWeight', '600');
    // $(this).siblings('span').css("fontWeight", '400');
    // $(".myCue").fadeOut();
    // $(".myAns").fadeIn();
    //#endregion
    goRightY(".myCue", ".myAns");
    //发送请求
    if (isLogin()) {
        QAanswer();
    } else {
        displayTipPane("您还未登录！");
    }
})

// 左边:提问
$('#hoverBox_request').click(function() {
    //#region 
    // $(this).siblings(".activeLine").addClass("toLeft");
    // $(this).siblings(".activeLine").removeClass("toRight");
    // $(this).css('fontWeight', '700');
    // $(this).siblings('span').css("fontWeight", '400');
    // $(".myAns").fadeOut();
    // $(".myCue").fadeIn();
    //#endregion
    goLeftY(".myAns", ".myCue");
    //发送请求
    if (isLogin()) {
        QAcue();
    } else {
        displayTipPane("您还未登录！");
    }
})

//#endregion

//#region 退出登录 √
$(".exitLogonY").on({
    click: function() {
        //#region 
        // USERID = null;
        // $(".personal").show(100);
        // $(".logonHeadPortrait").hide(100);
        // $(".system").html("");
        // $(".private").html("");
        // $(".myAttention").html("");
        // $(".attentionMe").html("");
        // $(".myCue").html("");
        // $(".myAns").html("");
        // $(".mycollection").html("");
        //#endregion
        doLogOff();
        clearCookie();
        closeWebSocket();
        //问题页面判断是否登录
    }
});
//#endregion

//#endregion



// 二级面板的位置动态给变
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
            displayTipPane("您还未登录");
        }

    }
})

$(".hpSecondSecond").on({
    click: function(e) {
        e.stopPropagation();
        count = 0;
        $(this).css("display", "block");
    }
})

//#endregion 




let lockReconnect = false; //避免重复连接
let myMarkNumber = "191543214"; //要获取cookie
let wantToSendMarkNumber = "123456789"; //随便写一个，目的是与服务进行连接
let url = "ws://192.168.137.105:8080/WebSocket";
let wsUrl //点击某一个私信后重新修改
let ws;
let tt;
let ulNode = document.getElementById("ulNode");
let screen_inner = document.getElementById("screen_inner");