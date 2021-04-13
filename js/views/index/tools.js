import { baseHttpURL } from '../../common/baseRequestInfo.js';

import request from '../../util/request.js';
import template from '../../util/template.js';
import { displayTipPane, displayTipPane_err, displayTipPane_success, displayTipPane_warn, tipInfo } from '../../components/content/tipPane.js'

import { mainScrollid1, LoadNextPage1, mainScrollid2, LoadNextPage2 } from './info.js'
import { isLogin } from '../../common/user/index.js';
import inputTextFilter from '../../components/content/inputTextFilter.js';
import sendFile from '../../components/content/fileHandler.js';
import { getContentItem } from '../../components/content/questionPane/tool.js'
import { getImgBase64, isImage, isVideo } from '../../util/imgHandler.js';
let sendingImgVideo = false;
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

// 发送图片 视频
function sendImgVideo(formdata, obj) { //imgObj是jq对象
    sendingImgVideo = true;
    console.log(formdata);
    sendFile(formdata).then(res => {
        obj.attr("remoteURL", res);
        sendingImgVideo = false;
    }, err => {
        console.log(err);
        obj.remove();
        sendingImgVideo = false;
        displayTipPane_err("文件上传失败了哦~");
    })
}

// 添加视频/img  删除
export function insertImgVideo(type) {
    if (sendingImgVideo) {
        displayTipPane_warn("有图片/视频正在上传哦~");
        return;
    }
    if (type == 'img' && !isImage(this.files[0].name)) {
        displayTipPane_warn(tipInfo.img.format_warn);
        return;
    }
    if (type == 'video' && !isVideo(this.files[0].name)) {
        displayTipPane_warn(tipInfo.video.format_warn);
        return;
    }
    console.log(this.files[0]);
    const formdata = new FormData();
    formdata.append(0, this.files[0]);
    console.log(formdata);
    let div = $("<div class='develimgY'><b class='removeimg removeImgVideo' title='删除'>&times;</b></div>");
    const reader = getImgBase64(this.files[0]);
    reader.onload = function() {
        let src = this.result;
        if (type === 'img') {
            let img = $('<img>');
            $(div).prepend(img);
            $(img).attr("src", src);
            $(this).parents(".addfileY").before(div);
            if ($(".develimgY").length > 8) {
                $(this).parent().hide();
            }
            console.log(formdata);
            sendImgVideo(formdata, $(img)); //发送图片
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
            console.log(formdata);
            sendImgVideo(formdata, $(video)); //发送视频
        }
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
    if (!isLogin()) {
        displayTipPane_warn(tipInfo.login.no_login);
        return;
    }
    if (sendingImg) {
        displayTipPane_warn(tipInfo.img.upLoading);
        return;
    }
    if (sendingVideo) {
        displayTipPane_warn(tipInfo.video.upLoading);
        return;
    }
    const title = $(".issuePersonalDY textarea").val();

    //判空
    if (title == "" || title == null || title == undefined) {
        displayTipPane_warn('文章内容不能为空哦~');
        return;
    }

    let contents = [];
    let contents_order = 0;


    if ($('.develimgY').length > 0) {
        const imgArr = $(".issuePersonalDY .addpicY .addpicSon .develimgY img");
        for (let i = 0; i < imgArr.length; i++) {
            const url = $(imgArr[i]).attr("remoteurl");
            contents[i] = getContentItem(++contents_order, "img", url);
        }
    } else if ($('.develvideoY').length > 0) {
        const videoArr = $(".issuePersonalDY .addvideoY .addvideoSon .develvideoY video");
        for (let i = 0; i < videoArr.length; i++) {
            let url = $(videoArr[i]).attr("remoteurl");
            contents[0] = getContentItem(++contents_order, "video", url);
        }
    }

    //判断敏感词
    inputTextFilter(title).then(res => {
        title = res;
        sendD();
    }, err => {
        if (err.isErr) {
            displayTipPane_err(tipInfo.submit.err);
        } else {
            displayTipPane_err(`内容：${err.message}，请修改后再重新提交！`);
        }
    })

    //获取内容 发送内容
    function sendD() {

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
            displayTipPane_success(tipInfo.submit.succees);
            //清空title,detail
            $(".issuePersonalDY textarea").val("");

            //清空图片
            $(".addpicY .develimgY").remove();
            $(".addpicY .addfileY").show();
            $(".addvideoY .develvideoY").remove();
            $(".addvideoY .addfileY").show();
        }, err => {
            displayTipPane_err(tipInfo.submit.err);
            console.log(err);
        })
    }

}