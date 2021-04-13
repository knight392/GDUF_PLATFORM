import { baseHttpURL } from '../../../common/baseRequestInfo.js';
import { user } from '../../../common/user/index.js'
import request from '../../../util/request.js'
import template from '../../../util/template.js'


/**
 * 
 * 输入搜索框 搜索数据
 * @param {*} val 搜索框的内容
 */
export function getSearchMessageY(val) {
    request(baseHttpURL + '/Servlet/MainPageServlet', {
        method: "get",
        body: {
            requestType: 'get',
            getType: "explore",
            exploreContent: val,
        }
    }).then(res => {
        // console.log(res);  
        $('.search .searchContent li').remove();
        let indexli = 0;
        let url;
        let icon;
        for (let i = 0; i < res.dataList.length && i < 5; i++) {
            //判断是哪个篇 的 然后获取 创建iconfont
            if (res.dataList[i].questionType === "学习篇") {
                icon = "iconxuexi";
            } else if (res.dataList[i].questionType === "期末篇") {
                icon = "iconkaoshi3";
            } else if (res.dataList[i].questionType === "宿舍篇") {
                icon = "iconsushe";
            } else if (res.dataList[i].questionType === "食堂篇") {
                icon = "iconshitang";
            } else if (res.dataList[i].questionType === "考证篇") {
                icon = "iconziyuan";
            } else {
                icon = "iconqita";
            }
            url = 'questionPage.html?id=' + res.dataList[i].id;

            if (indexli < 5) {
                const li = $('<li><span><i class="iconfont ' + icon + ' "></i></span><a target="_blank" href=" ' + url + ' ">' + res.dataList[i].title + '</a></li>');
                $(".search .searchContent").prepend(li);
                $(".search .searchContent").find("li").eq(i).html(res.dataList[i].title);
                indexli++;
            }
        }
    })

}

// 动态通知
export function messageInf() {
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
export function messageChat() {
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
            createWebSocket1();
        });
    })
}