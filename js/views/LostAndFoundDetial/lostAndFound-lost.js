import { infoLostHTML, infoFoundHTML } from './info.js'

$(function() {

    //#region 渲染拾/失主页面  失主lostAndFound-lost 得主lostAndFound-found

    if (window.location.href.indexOf('lostAndFound-lost') != -1) {
        infoLostHTML();
        //#region
        // $.get(baseHttpURL + 'Servlet/LostAndFoundServlet', {
        //     type: "lost",
        //     getInfWay: "term",
        //     requestType: 'get',
        //     id: id,
        // }, function(res) {
        //     // console.log(res);
        //     //物品详情
        //     $(".YitemName").find("em").eq(1).text(res.lostObjectName);
        //     $(".YitemCategory").find("em").eq(1).text(res.objectType);
        //     $(".YitemLocationLost").find("em").eq(1).text(res.lostLocation);
        //     $(".YitemTimeLost").find("em").eq(1).text(totime(res.lostTime));
        //     $(".YitemNotes").find("em").eq(1).text(res.lostDescribe);

        //     //用户详情
        //     let identity; //身份：老师/学生
        //     if (res.student != null) {
        //         identity = res.student;
        //         $(".YuserIdentity").find("em").eq(1).text("学生");
        //         $(".Ymajor").find("em").eq(0).text("专业");
        //     } else {
        //         identity = res.teacher;
        //         $(".YuserIdentity").find("em").eq(1).text("老师");
        //         $(".Ymajor").find("em").eq(0).text("学院");
        //     }
        //     $(".YuserPhotos").attr("src", identity.face);
        //     $(".YuserName").find("em").eq(1).text(identity.userName);
        //     $(".YuserName").find("em").eq(1).attr("title", identity.userName);

        //     //图片
        //     $(".Ymajor").find("em").eq(1).text(identity.major);
        //     $(".Ymajor").find("em").eq(1).attr("title", identity.major);
        //     for (let imgi = 0; imgi < res.imgs.length; imgi++) {
        //         if (res.imgs[imgi] != null) {
        //             $(".YitemPictureLost").find("img").eq(imgi).attr("src", res.imgs[imgi])
        //         }
        //     }
        // }, 'json')
        //#endregion

    } else if (window.location.href.indexOf('lostAndFound-found') != -1) {
        infoFoundHTML();
        //#region
        // $.get(baseHttpURL + 'Servlet/LostAndFoundServlet', {
        //     type: "found",
        //     getInfWay: "term",
        //     requestType: 'get',
        //     id: id,
        // }, function(res) {
        //     // console.log(res);
        //     //物品详情
        //     $(".YitemName").find("em").eq(1).text(res.foundObjectName);
        //     $(".YitemCategory").find("em").eq(1).text(res.objectType);
        //     $(".YitemLocationFound").find("em").eq(1).text(res.foundLocation);
        //     // $(".YitemStatusFound").find("em").eq(1).text(totime(res.foundTime));
        //     $(".YitemNotes").find("em").eq(1).text(res.foundDescribe);

        //     // 用户详情
        //     let identity; //身份：老师/学生
        //     if (res.student != null) {
        //         identity = res.student;
        //         $(".YuserIdentity").find("em").eq(1).text("学生");
        //         $(".Ymajor").find("em").eq(0).text("专业");
        //     } else {
        //         identity = res.teacher;
        //         $(".YuserIdentity").find("em").eq(1).text("老师");
        //         $(".Ymajor").find("em").eq(0).text("学院");
        //     }
        //     $(".YuserPhotos").attr("src", identity.face);
        //     $(".YuserName").find("em").eq(1).text(identity.userName);
        //     $(".YuserName").find("em").eq(1).attr("title", identity.userName);

        //     //图片
        //     $(".Ymajor").find("em").eq(1).text(identity.major);
        //     $(".Ymajor").find("em").eq(1).attr("title", identity.major);

        //     for (let imgi = 0; imgi < res.imgs.length; imgi++) {
        //         if (res.imgs[imgi] != null) {
        //             $(".YitemPictureFound .w").append("<img src=" + res.imgs[imgi] + ">")
        //         }
        //     }
        // }, 'json')
        //#endregion
    }
})