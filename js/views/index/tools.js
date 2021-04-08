import { baseHttpURL } from '../../common/baseRequestInfo.js';

import request from '../../util/request.js';
import template from '../../util/template.js';
import displayTipPane from '../../components/content/tipPane.js'

import { mainScrollid1, LoadNextPage1, mainScrollid2, LoadNextPage2 } from './info.js'
import { sendingImg, sendingVideo } from './index.js'
// 时间转换为时间戳
export const totime = function(time) {
    //直接用 new Date(时间戳) 格式转化获得当前时间
    const timestamp = new Date(time);
    //再利用拼接正则等手段转化为yyyy-MM-dd hh:mm:ss 格式
    return timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8);
}

// 校区互通的加载更多
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

// 失物招领的加载更多
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

// 发送图片 视频
function sendImgVideo(formdata, obj, sendingImgVideo) { //imgObj是jq对象
    sendingImgVideo = true;
    $.ajax({
        url: baseHttpURL + '/Servlet/ReceiveFileServlet',
        type: 'post',
        data: formdata,
        dataType: 'json',
        processData: false, //用FormData传fd时需有这两项
        contentType: false,
        success: function(data) {
            // console.log(data);
            // console.log(formdata);
            obj.attr("remoteURL", data.message);
            sendingImgVideo = false;
        },
        error: function() {
            obj.remove();
            sendingImgVideo = false;
            displayTipPane("上传失败！已自动删除原资源！");
        },
        timeout: function() {
            obj.remove();
            sendingImgVideo = false;
            displayTipPane("上传超时！已自动删除原资源！");
        }
    })
}

// 添加视频/img  删除
export function insertImgVideo(type) {
    let formdata = new FormData();
    let div = $("<div class='develimgY'><b class='removeimg removeImgVideo' title='删除'>&times;</b></div>");
    let url = window.URL || window.webkitURL || window.mozURL;
    let obj = e.currentTarget.files[0]; //图片资源对象
    // console.log(obj);
    // console.log(e.currentTarget);
    formdata.append(0, obj);
    // console.log(formdata);
    let src = url.createObjectURL(obj);
    if (type === 'img') {
        let img = $('<img>');
        $(div).prepend(img);
        $(img).attr("src", src);

        $(this).parents(".addfileY").before(div);
        sendImgVideo(formdata, $(img), sendingImg); //发送图片
        if ($(".develimgY").length > 8) {
            $(this).parent().hide();
        }

    } else {
        let video = $('<video muted autoplay loop></video>');
        $(div).prepend(video);
        $(this).find(".addfileY").hide();
        $(video).attr("src", src);
        $(this).parents(".addfileY").before(div);
        $(video).css({
            'width': $(this).find('video').css('width') + 'px',
            'margin': '0 auto'
        });
        sendImgVideo(formdata, $(video), sendingVideo); //发送视频

    }

    //×出现与消失
    $(".removeImgVideo").on({
        mouseover: function() {
            $(this).find(".removeImgVideo").stop().show(200);
        },
        mouseout: function() {
            $(this).find(".removeImgVideo").stop().hide(200);
        }
    })

    //删除图片 
    $(".removeimg").on({
        click: function() {
            if ($(".develimgY").length <= 9) {
                $('.addpicY').find(".addfileY").show();
            }
            $(this).parent().remove();
        }
    })

    //删除视频
    $(".removevideo").on({
        click: function() {
            $(this).parents('.addvideo').find(".addfileY").show();

            $(this).parent().remove();
        }
    })
}

// 发布信息
export function sendDevel() {
    if (sendingImg) {
        displayTipPane("有图片正在上传中！");
        return;
    }
    if (sendingVideo) {
        displayTipPane("有视频正在上传中！");
        return;
    }
    const title = $(".issuePersonalDY textarea").val();

    //判空
    if (title == "" || title == null || title == undefined) {
        displayTipPane("文章内容不能为空!");
        return;
    }

    let contents = [];
    let contents_order = 0;

    function addContentItem1(order, type, content) {
        return {
            "contentOrder": order,
            "contentType": type,
            "contentMain": content
        }
    }

    if ($('.develimgY').length > 0) {
        const imgArr = $(".issuePersonalDY .addpicY .addpicSon .develimgY img");

        for (let i = 0; i < imgArr.length; i++) {

            const url = $(imgArr[i]).attr("remoteurl");
            // console.log("url=" + url);
            contents[i] = addContentItem1(++contents_order, "img", url);
        }
    } else if ($('.develvideoY').length > 0) {
        const videoArr = $(".issuePersonalDY .addvideoY .addvideoSon .develvideoY video");
        for (let i = 0; i < videoArr.length; i++) {
            let url = $(videoArr[i]).attr("remoteurl");
            contents[0] = addContentItem1(++contents_order, "video", url);
        }
    }

    //判断敏感词
    request(baseHttpURL + '/Servlet/SensitiveWordServlet', {
        method: "post",
        body: {
            textArr: [title]
        }
    }).then(res => {
        if (res.statusCode == 500) {
            displayTipPane("内容" + res.message + "请修改后再发送！");
        } else {
            // console.log(res);
            sendD();
        }
    });

    //获取内容 发送内容
    function sendD() {
        if (isLogin()) {
            request(baseHttpURL + '/Servlet/QuestionServlet', {
                method: "post",
                body: {
                    requestType: "post",
                    title,
                    questionType: "Dynamic",
                    authorMarkNumber: user.markNumber,
                    contents,
                }
            }).then(res => {
                displayTipPane("发布成功！");
                //清空title,detail
                $(".issuePersonalDY textarea").val("");

                //清空图片
                $(".addpicY .develimgY").remove();
                $(".addpicY .addfileY").show();
                $(".addvideoY .develvideoY").remove();
                $(".addvideoY .addfileY").show();
                // console.log(res);
            })
        } else {
            displayTipPane('您还没有登录哦~');
        }
    }
}