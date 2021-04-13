import { baseHttpURL } from '../../common/baseRequestInfo.js';
import { displayTipPane_success, displayTipPane_warn } from '../../components/content/tipPane.js';
import request from '../../util/request.js';
import template from '../../util/template.js';

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

    }, err => {
        console.log(err);
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
        displayTipPane_success('内容加载完成~')
    })

    //#region 内容中视频的播放暂停
    // $('.trendsMuted').on({
    //     click: function(e) {
    //         e.stopPropagation();
    //         $(this).siblings('video').attr('autoplay', 'autoplay');
    //         $(this).siblings('video')[0].play();
    //         $(this).hide();

    //         $(this).siblings('video').on({
    //             click: function() {
    //                 $(this)[0].pause();
    //                 $(this).siblings('.trendsMuted').show();
    //             }
    //         })
    //     }
    // });
    //#endregion

}

// 时间转换为时间戳
const totime = function(time) {
    //直接用 new Date(时间戳) 格式转化获得当前时间
    const timestamp = new Date(time);
    //再利用拼接正则等手段转化为yyyy-MM-dd hh:mm:ss 格式
    return timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8);
}

// 校区互通的加载更多
export function loadingNextPART1() {
    if (LoadNextPage1) {
        displayTipPane_warn('正在加载问题...');
        request(baseHttpURL + '/Servlet/ScrollSearchServlet', {
            method: "get",
            body: {
                requestType: 'get',
                scrollId: mainScrollid1,
                pojoType: 'question'
            }
        }).then(res => {
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

                    }
                }
                if (res.dataList[i].contents.length != 1) {
                    for (let j = 1; j < res.dataList[i].contents.length; j++) {
                        if (res.dataList[i].contents[j].contentMain != null) {
                            let src = res.dataList[i].contents[j].contentMain;
                            $('.queY').eq($('.queY').length - 1).find('.queImgY').prepend('<img src="' + src + '" alt="">');
                        }

                    }
                }
            }
            $('.maincontent').css('height', $('.studyPartY').outerHeight(true) + 'px');

        }, 'json')
    } else {
        displayTipPane_warn('没有更多问题了哦~');
    }
}

// 失物招领的加载更多
export function loadingNextPART2() {
    if (LoadNextPage2) {
        displayTipPane_warn('正在加载动态...~')
        request(baseHttpURL + '/Servlet/ScrollSearchServlet', {
            method: "get",
            body: {
                requestType: 'get',
                scrollId: mainScrollid2,
                pojoType: 'question'
            }
        }).then(res => {
            console.log(res);
            mainScrollid2 = res.scrollId;
            LoadNextPage2 = res.next;
            for (let i = 0; i < res.dataList.length; i++) {
                // const time = res.dataList[i].time.toLocaleDateString().replace(/\//g, "-") + " " + res.dataList[i].time.toTimeString().substr(0, 8)
                const json = {
                    divkind: "trendsY-person",
                    content: res.dataList[i].title,
                    trendsTime: totime(res.dataList[i].time),
                    userface: res.dataList[i].student.face,
                    username: res.dataList[i].student.userName,
                    major: res.dataList[i].student.major,
                    grade: res.dataList[i].student.level,
                }

                const trend = template("schoolDevelopmentTrendsY-template", json);
                $('.dynamicsY').append(trend);

                if (res.dataList[i].contents != null) {
                    if (res.dataList[i].contents.length == 1 && res.dataList[i].contents[0].contentType === "video") {
                        const video = $('<div class="videoFather"><video src="' + res.dataList[i].contents[0].contentMain + '" loop muted></video><i class="iconfont iconset trendsMuted"></i></div>');
                        $(".trendsY-person").eq($(".trendsY-person").length - 1).find('.trendsContent').append(video);
                    } else {
                        for (let j = 0; j < res.dataList[i].contents.length; j++) {
                            if (res.dataList[i].contents[j].contentMain != null) {
                                console.log(1);
                                let img = $('<img src="' + res.dataList[i].contents[j].contentMain + '">')

                                $(".trendsY-person").eq($(".trendsY-person").length - 1).find('.trendsContent').append(img);
                            }
                        }
                    }
                }
            }

            $('.hb').css('height', $('.allD-div').outerHeight(true) + 'px');
            $('.maincontent').css('height', $('.schoolDevelopmentY').css('height'));

            //#region 内容中视频的播放暂停

            $('.trendsMuted').on({
                click: function(e) {
                    e.stopPropagation();
                    $(this).siblings('video').attr('autoplay', 'autoplay');
                    $(this).siblings('video')[0].play();
                    $(this).hide();

                    $(this).siblings('video').on({
                        click: function() {
                            $(this)[0].pause();
                            $(this).siblings('.trendsMuted').show();
                        }
                    })
                }
            })
        })
    } else {
        displayTipPane_warn('没有更多动态了哦~');
    }
}