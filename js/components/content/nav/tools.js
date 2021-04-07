import { baseHttpURL } from '../../../common/baseRequestInfo.js';
import { user } from '../../../common/user/index.js'
import request from '../../../util/request.js'
import template from '../../../util/template.js'

export function setCookie(json, time) {
    for (const key in json) {
        $.cookie(key, json[key], { expires: time });
    }
}

export function isHaveCookie() {
    if (navigator.onLine && $.cookie("markNumber") != null && $.cookie("markNumber") != undefined &&
        $.cookie("userName") != null && $.cookie("userName") != undefined &&
        $.cookie("face") != undefined && $.cookie("face") != null) {
        return true;
    }
    return false;
}

export function clearCookie() {
    $.removeCookie("area");
    $.removeCookie("college");
    $.removeCookie("email");
    $.removeCookie("face");
    $.removeCookie("id");
    $.removeCookie("level");
    $.removeCookie("major");
    $.removeCookie("password");
    $.removeCookie("markNumber");
    $.removeCookie("sex");
    $.removeCookie("userName");
}

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

// 登录
export function logon() {
    request(baseHttpURL + 'Servlet/UserServlet', {
        method: "get",
        body: {
            password: pwd,
            loginValue: account,
            requestType: 'get',
            userType: type
        }
    }), then(res => {
        if (res.statusCode == 200) {
            setCookie(res.messagePojo, 10); //保存30天

            //if登录成功 退出登录框 登录+注册 -> 消息+头像
            $('.modal_bg').fadeOut(); // 其实就是css 的过渡+ display
            $('.modal').css({
                transform: 'translate(-50%,-50%) scale(0.7)'
            })

            $('.personal').hide(100);
            $('.logonHeadPortrait').show(100);
            $('.ResUserName').text(res.userName);
            $('.ResUserName').prop("title", res.userName);
            $('.ResMarkNumber').text(res.markNumber);
            $('.ResMarkNumber').prop("title", res.markNumber);
            // USERID = res.markNumber;
            $('.ResMessagePojoMajor').text(res.messagePojo.major);
            $('.ResMessagePojoMajor').prop("title", res.messagePojo.major);
            let ResMessageFaceScr = '../' + res.messagePojo.face.substring(2);
            $('.ResMessageFace').prop("src", ResMessageFaceScr);
            $('.navHPY').prop('src', ResMessageFaceScr);

        } else {
            displayTipPane('登录失败！账号或密码有误！');
        }
    })
}

/**
 *  窗口的走向 去右边
 * @param {*} outElement fadeOut的元素
 * @param {*} inElement  fadeIn的元素
 */
export function goRightY(outElement, inElement) {
    $(this).siblings(".activeLine").addClass("toRight");
    $(this).siblings(".activeLine").removeClass("toLeft");
    $(this).css('fontWeight', '700');
    $(this).siblings('span').css("fontWeight", '400');
    $(outElement).fadeOut();
    $(inElement).fadeIn();
}

// 窗口的走向 去左边
export function goLeftY(outElement, inElement) {
    $(this).siblings(".activeLine").addClass("toLeft");
    $(this).siblings(".activeLine").removeClass("toRight");
    $(this).css('fontWeight', '700');
    $(this).siblings('span').css("fontWeight", '400');
    $(outElement).fadeOut();
    $(inElement).fadeIn();
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

// 我的关注
export function attentionMajor() {
    request(baseHttpURL + '/Servlet/AttentionServlet', {
        method: "get",
        body: {
            requestType: 'get',
            majorMarkNumber: user.userNumber,
            attentionType: "major",
            currentPage: "1",
            direction: "asc",
            order: "id",
        }
    }).then(res => {
        $(".myAttention").html("");
        // console.log(res);
        for (let i = 0; i < res.dataList.length; i++) {
            const json = {
                userFace: res.dataList[i].userFace,
                userName: res.dataList[i].userName,
                action: "turnOff",
                isSubscribe: "subscribe_on"
            }
            if (res.dataList[i].userType == "student") {
                json["status"] = "学生";
                json["school_info"] = res.dataList[i].major;
            } else {
                json["status"] = "老师";
                json["school_info"] = res.dataList[i].collage;
            }
            const item = template("attentionItem_template", json);
            $(".myAttention").append(item);
        }
        //还没关注之前，点击后发送关注请求，并且成功后把状态变成关注，点亮
        //如果当前是已关注，title为取消关注

        // 点击关注按钮，并且是当前状态为turnON ，就发送请求发送关注，如果为turnOff就发送取消关注请求
        $('.hoverBox .contentBox_subscribe .item .subscribe').click(function() {
            if ($(this).attr("nextAction") === 'turnOn') {
                //发送关注请求
                $(this).find('svg path').css("fill", "#ff7800");
                $(this).attr({
                    "nextAction": "turnOff",
                    "title": "取消关注"
                });
            } else {
                $(this).find('svg path').css("fill", "#bfbfbf");
                $(this).attr({
                    "nextAction": "turnOn",
                    "title": "关注"
                });
            }
        })

    })

}

// 关注我的
export function attentionPass() {
    request(baseHttpURL + '/Servlet/AttentionServlet', {
        method: "get",
        body: {
            requestType: 'get',
            attentionType: "pass",
            passMarkNumber: user.userNumber,
            currentPage: "1",
            direction: "asc",
            order: "id",
        }
    }).then(res => {
        $(".attention .contentBox_subscribe").find("ul.attentionMe").html("");
        // console.log(res);
        for (let i = 0; i < res.dataList.length; i++) {
            const json = {
                userFace: res.dataList[i].userFace,
                userName: res.dataList[i].userName,
                action: "turnOn",
                isSubscribe: "subscribe_off"
            }
            if (res.dataList[i].userType == "student") {
                json["status"] = "学生";
                json["school_info"] = res.dataList[i].major;
            } else {
                json["status"] = "老师";
                json["school_info"] = res.dataList[i].collage;
            }
            const item = template("attentionItem_template", json);
            $("ul.attentionMe").append(item);
        }
    })
}

// 我的收藏

//我的提问
export function QAcue() {
    request(baseHttpURL + '/Servlet/MainPageServlet', {
        method: "get",
        body: {
            requestType: 'get',
            getType: "special",
            authorMarkNumber: user.userNumber,
        }
    }).then(res => {
        $(".myCue").html("");
        for (let i = 0; i < res.dataList.length; i++) {
            const li = $('<li class="item"></li>');
            const a = $('<a href="questionPage.html?id="' + res.dataList[i].id + '></a>');
            const title = $("<div class='problem_title' title='" + res.dataList[i].title + "'>" + res.dataList[i].title + "</div>");
            const remark = $("<div class='problem_remark_answer' title='" + res.dataList[i].contents[0].contentMain + "'>" + res.dataList[i].contents[0].contentMain + "</div>");
            const time = $("<div class='time_box'><span class='time'>" + res.dataList[i].timeUpToNow + "</span></div>");

            $(".contentBox_request").find(".myCue").prepend(li);
            $(".contentBox_request").find(".myCue").find("li").eq(0).append(a);
            $(".contentBox_request").find(".myCue").find("li").eq(0).find("a").append(title);
            $(".contentBox_request").find(".myCue").find("li").eq(0).find("a").append(remark);
            $(".contentBox_request").find(".myCue").find("li").eq(0).find("a").append(time);

        }

    })
}

export function QAanswer() {
    request(baseHttpURL + '/Servlet/AnswerServlet', {
        method: "get",
        body: {
            requestType: 'get',
            getAnswerType: "individual",
            markNumber: user.userNumber,
            currentPage: "1",
        }
    }).then(res => {
        $(".myAns").html("");
        for (let i = 0; i < res.dataList.length; i++) {
            const li = $('<li class="item"></li>');
            const a = $('<a href="questionPage.html?id="' + res.dataList[i].questionId + '></a>');
            const title = $("<div class='problem_title'>" + res.dataList[i].title + "</div>");
            const remark = $("<div class='problem_remark_answer'></div>");
            const time = $("<div class='time_box'><span class='time'>" + res.dataList[i].timeUpToNow + "</span></div>");

            $(".contentBox_request").find(".myAns").prepend(li);
            $(".contentBox_request").find(".myAns").find("li").eq(0).append(a);
            $(".contentBox_request").find(".myAns").find("li").eq(0).find("a").append(title);
            $(".contentBox_request").find(".myAns").find("li").eq(0).find("a").append(remark);
            $(".contentBox_request").find(".myAns").find("li").eq(0).find(".problem_remark_answer").html(res.dataList[i].contents[0].contentMain);
            $(".contentBox_request").find(".myAns").find("li").eq(0).find(".problem_remark_answer").attr("title", $(".contentBox_request").find(".myAns").find("li").eq(0).find(".problem_remark_answer").text());
            $(".contentBox_request").find(".myAns").find("li").eq(0).find("a").append(time);

        }
    })
}