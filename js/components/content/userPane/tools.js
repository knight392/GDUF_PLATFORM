import { baseHttpURL } from "../../../common/baseRequestInfo.js";
import { user } from "../../../common/user/index.js";
import request from "../../../util/request.js";
import template from "../../../util/template.js";

/**
 *  窗口的走向 去右边
 * @param {*} outElement fadeOut的元素
 * @param {*} inElement  fadeIn的元素
 * @param {*} thisElement 调用这个函数的元素 $(this)
 */
export function goRightY(thisElement, outElement, inElement) {
    thisElement.siblings(".activeLine").removeClass("toLeft");
    thisElement.siblings(".activeLine").addClass("toRight");

    thisElement.css('fontWeight', '700');
    thisElement.siblings('span').css("fontWeight", '400');
    $(outElement).fadeOut();
    $(inElement).fadeIn();
}

// 窗口的走向 去左边
export function goLeftY(thisElement, outElement, inElement) {
    thisElement.siblings(".activeLine").removeClass("toRight");
    thisElement.siblings(".activeLine").addClass("toLeft");
    thisElement.css('fontWeight', '700');
    thisElement.siblings('span').css("fontWeight", '400');
    $(outElement).fadeOut();
    $(inElement).fadeIn();
}

//获取数据函数
export function getData() {
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
        console.log(res);
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

// 我的提问
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

// 我的回答
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