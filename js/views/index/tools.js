import { baseHttpURL } from '../../common/baseRequestInfo.js';
import request from '../../util/request.js';
import template from '../../util/template.js';
import { totime } from './tools.js'
import { infoIndexPART1, infoIndexPART2, mainScrollid1, LoadNextPage1, mainScrollid2, LoadNextPage2, PART } from './info.js'

export const totime = function(time) {
    //直接用 new Date(时间戳) 格式转化获得当前时间
    const timestamp = new Date(time);

    //再利用拼接正则等手段转化为yyyy-MM-dd hh:mm:ss 格式
    return timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8);
}

export function copyUrl(url) {
    const input = $("<input  value='" + url + "'>");
    $(this).parent().prepend(input);
    $(this).parent().find("input").select();
    document.execCommand("copy");
    $(this).parent().find('input').remove();
}

export function loadingNextPART1() {
    if (LoadNextPage1) {
        displayTipPane("加载问题ing~");
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
        displayTipPane("没有更多问题了哦~");
    }
}

export function loadingNextPART2() {
    if (LoadNextPage2) {
        displayTipPane("加载动态ing~");
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
        displayTipPane("没有更多动态了哦~");
    }
}