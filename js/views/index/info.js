import { baseHttpURL } from '../../common/baseRequestInfo.js';
import request from '../../util/request.js';
import template from '../../util/template.js';
import { totime } from './tools.js'

export let mainScrollid1; //存scrollId 用来加载下一页
export let LoadNextPage1; //存next 用来判断是否有下一页
export let mainScrollid2; //存scrollId 用来加载下一页
export let LoadNextPage2; //存next 用来判断是否有下一页


// 初始化校区互通
export function infoIndexPART1() {
    request(baseHttpURL + '/Servlet/MainPageServlet', {
        method: "get",
        body: {
            requestType: 'get',
            getType: "init",
        }


    }).then(res => {
        // console.log(res);
        mainScrollid1 = res.scrollId;
        LoadNextPage1 = res.next;
        for (let i = 0; i < res.dataList.length; i++) {
            const json = {
                queYurl: 'questionPage.html?id=' + res.dataList[i].id,
                queYtitle: res.dataList[i].title,
                queYkind: res.dataList[i].questionType,
                queYremarks: res.dataList[i].contents[0].contentMain,
            }

            const queY = template("campusIntercommunicationQueY_template", json);
            $('.studyPartY').append(queY);
            if (res.dataList[i].tag != null) {
                for (let j = 0; j < res.dataList[i].tag.length; j++) {
                    if (res.dataList[i].tag[j] != null) {
                        $('.queY').eq($('.queY').length - 1).find('h3').append('<span># ' + res.dataList[i].tag[j] + '</span>')
                    }
                    // json["queYtag" + j] = res.dataList[i].tag[j];
                }
            }
            if (res.dataList[i].contents.length != 1) {
                for (let j = 1; j < res.dataList[i].contents.length; j++) {
                    if (res.dataList[i].contents[j].contentMain != null) {
                        const src = res.dataList[i].contents[j].contentMain;
                        $('.queY').eq($('.queY').length - 1).find('.queImgY').prepend('<img src="' + src + '" alt="">');
                    }
                    // json["queYimgsrc" + j] = 'http://192.168.137.105:8080/' + res.dataList[i].contents[j].contentMain.substring(2);
                }
            }
        }
        $('.maincontent').css('height', $('.indexQuizList').outerHeight(true) + 'px');
        // console.log("$('.indexQuizList').outerHeight(true)" + $('.indexQuizList').outerHeight(true));
        // console.log("$('.maincontent').outerHeight(true)" + $('.maincontent').outerHeight(true));

    })
}

// 初始化校园动态
export function infoIndexPART2() {
    request(baseHttpURL + '/Servlet/DynamicCommunicateCircleServlet', {
        method: "get",
        body: {
            requestType: "get",
            type: "all",
        }
    }).then(res => {
        // console.log(res);
        mainScrollid2 = res.scrollId;
        LoadNextPage2 = res.next;
        for (let i = 0; i < res.dataList.length; i++) {
            // let time = res.dataList[i].time.toLocaleDateString().replace(/\//g, "-") + " " + res.dataList[i].time.toTimeString().substr(0, 8)
            const json = {
                divkind: "trendsY-person",
                content: res.dataList[i].title,
                trendsTime: totime(res.dataList[i].time),
            }
            if (res.dataList[i].userType === "student") {
                json["userface"] = res.dataList[i].student.face;
                json["username"] = res.dataList[i].student.userName;
                json["major"] = res.dataList[i].student.major;
                json["grade"] = res.dataList[i].student.level;
            } else {
                json["userface"] = res.dataList[i].teacher.face;
                json["username"] = res.dataList[i].teacher.username;
                json["major"] = res.dataList[i].teacher.major;
                json["grade"] = res.dataList[i].teacher.level;
            }
            const trend = template("schoolDevelopmentTrendsY-template", json);
            $('.dynamicsY').prepend(trend);

            if (res.dataList[i].contents != null) {
                if (res.dataList[i].contents.length == 1 && res.dataList[i].contents[0].contentType === "video") {
                    const video = $('<div class="videoFather"><video src="' + res.dataList[i].contents[0].contentMain + '" loop muted></video><i class="iconfont iconset trendsMuted"></i></div>');
                    $(".trendsY-person").eq(0).find('.trendsContent').append(video);
                } else {
                    for (let j = 0; j < res.dataList[i].contents.length; j++) {
                        if (res.dataList[i].contents[j].contentMain != null) {

                            const img = $('<img src="' + res.dataList[i].contents[j].contentMain + '">')

                            $(".trendsY-person").eq(0).find('.trendsContent').append(img);
                        }
                    }
                }
            }
        }
    })

}