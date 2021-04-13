//通知内容

import { baseHttpURL } from "../../../common/baseRequestInfo.js";
import { isLogin, user } from "../../../common/user/index.js";
import request from "../../../util/request.js";
import { goLeftY, goRightY } from "../userPane/tools.js";
import { createWebSocket } from "./listner/index.js";


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


// 动态通知
function messageInf() {
    request(baseHttpURL + '/Servlet/InfServlet', {
        method: "get",
        body: {
            currentPage: "1",
            receiverMarkNumber: user.userNumber,
            order: "sendTime",
            direction: "desc",
            requestType: 'get',
            type: "inf",
        }
    }).then(res => {
        // console.log(res);
        $(".system").html("");
        for (let i = res.dataList.length - 1; i > 0; i--) {
            const item = $("<li class='item'></li>");
            const src = '../' + res.dataList[i].senderFace.substring(2);
            const img = $("<img src='" + src + "'>");
            const svg = $("<svg class='info_point' class='icon' height='10' p-id='12380' t='1602330426902' version='1.1' viewBox='0 0 1024 1024' width='10' xmlns='https://www.w3.org/2000/svg'><path d='M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z' fill='#E6A23C' p-id='12381'></svg>");
            const username = $("<span class='userName itemTitle' title='" + res.dataList[i].senderName + "'>" + res.dataList[i].senderName + "</span>");
            const information = $("<span class='item_info' title='" + res.dataList[i].content + "'>" + res.dataList[i].content + "</span>");
            const time = $("<span class='time'>" + res.dataList[i].timeUpToNow + "</span>");

            $(".message .contentBox_information").find(".system").prepend(item);
            $(".message .contentBox_information").find(".system").find(".item").eq(0).append(img);
            $(".message .contentBox_information").find(".system").find(".item").eq(0).append(svg);
            $(".message .contentBox_information").find(".system").find(".item").eq(0).append(username);
            $(".message .contentBox_information").find(".system").find(".item").eq(0).append(information);
            $(".message .contentBox_information").find(".system").find(".item").eq(0).append(time);
        }
    })
}

// 私信通知
function messageChat() {
    let send = new Array();
    let pindex;
    let isRead = true;
    request(baseHttpURL + '/Servlet/InfServlet', {
        method: "get",
        body: {
            currentPage: "1",
            receiverMarkNumber: user.userNumber,
            order: "sendTime",
            direction: "desc",
            requestType: 'get',
            type: "chat",
        }
    }).then(res => {
        $(".private").html("");
        // console.log(res);
        pindex = 0;
        for (let i = res.dataList.length - 1; i > 0; i--) {
            const item = $("<li class='item chatBtn' target='" + res.dataList[i].senderMarkNumber + "' targetName='" + res.dataList[i].senderName + "' data-pindex='" + pindex + "'></li>");
            const src = '../' + res.dataList[i].senderFace.substring(2);
            const img = $("<img src='" + src + "'>");
            const svg = $("<svg class='info_point' class='icon' height='10' p-id='12380' t='1602330426902' version='1.1' viewBox='0 0 1024 1024' width='10' xmlns='https://www.w3.org/2000/svg'><path d='M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z' fill='#E6A23C' p-id='12381'></svg>");
            const username = $("<span class='userName itemTitle' title='" + res.dataList[i].senderName + "'>" + res.dataList[i].senderName + "</span>");
            const information = $("<span class='item_info' title='" + res.dataList[i].content + "'>" + res.dataList[i].content + "</span>");
            const time = $("<span class='time'>" + res.dataList[i].timeUpToNow + "</span>");
            $(".message .contentBox_information").find(".private").prepend(item);
            $(".message .contentBox_information").find(".private").find(".item").eq(0).append(img);
            $(".message .contentBox_information").find(".private").find(".item").eq(0).append(svg);
            $(".message .contentBox_information").find(".private").find(".item").eq(0).append(username);
            $(".message .contentBox_information").find(".private").find(".item").eq(0).append(information);
            $(".message .contentBox_information").find(".private").find(".item").eq(0).append(time);

            send[pindex] = {
                'senderMarkNumber': res.dataList[i].senderMarkNumber,
                'senderFace': '../' + res.dataList[i].senderFace.substring(2),
                'senderName': res.dataList[i].senderName,
            }
            pindex++;
        }
        $(".chatBtn").off("click");
        $(".chatBtn").on("click", function() {
            wantToSendMarkNumber = $(this).attr("target");
            wsUrl = url + '/' + myMarkNumber + '/' + wantToSendMarkNumber;
            //重新连接WebSocket
            //用户名
            $(".platform_chat .targetName").text($(this).attr("targetName"));
            if (lastTarget != null && lastTarget != $(this).attr("target")) {
                ulNode.innerHTML = "";
            }
            lastTarget = $(this).attr("targetName");
            $(".platform_chat").fadeIn();
            //这次的webSocket是有发送目标的
            createWebSocket();
        });
    })
}