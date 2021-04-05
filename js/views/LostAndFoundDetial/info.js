import { baseHttpURL } from '../../common/baseRequestInfo.js';
import { totime } from './tools.js';
import request from '../../util/request.js';

//获取键和获取值
function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}


//失物id=xEb3e3UB32gOD-0jRg7H  得物id=KEZefHUB32gOD-0jLBpg

// export const id = 'nkaufHUB32gOD-0jLCIE';
export const id = getQueryVariable("id");


export function infoLostHTML() {
    request(baseHttpURL + 'Servlet/LostAndFoundServlet', {
        method: "get",
        body: {
            type: "lost",
            getInfWay: "term",
            requestType: 'get',
            id
        }
    }).then(res => {
        // console.log(res);
        //物品详情
        $(".YitemName").find("em").eq(1).text(res.lostObjectName);
        $(".YitemCategory").find("em").eq(1).text(res.objectType);
        $(".YitemLocationLost").find("em").eq(1).text(res.lostLocation);
        $(".YitemTimeLost").find("em").eq(1).text(totime(res.lostTime));
        $(".YitemNotes").find("em").eq(1).text(res.lostDescribe);

        //用户详情
        let identity; //身份：老师/学生
        if (res.student != null) {
            identity = res.student;
            $(".YuserIdentity").find("em").eq(1).text("学生");
            $(".Ymajor").find("em").eq(0).text("专业");
        } else {
            identity = res.teacher;
            $(".YuserIdentity").find("em").eq(1).text("老师");
            $(".Ymajor").find("em").eq(0).text("学院");
        }
        $(".YuserPhotos").attr("src", identity.face);
        $(".YuserName").find("em").eq(1).text(identity.userName);
        $(".YuserName").find("em").eq(1).attr("title", identity.userName);

        //图片
        $(".Ymajor").find("em").eq(1).text(identity.major);
        $(".Ymajor").find("em").eq(1).attr("title", identity.major);
        for (let imgi = 0; imgi < res.imgs.length; imgi++) {
            if (res.imgs[imgi] != null) {
                $(".YitemPictureLost").find("img").eq(imgi).attr("src", res.imgs[imgi])
            }
        }
    })
}

export function infoFoundHTML() {

    request(baseHttpURL + 'Servlet/LostAndFoundServlet', {
        method: "get",
        body: {
            type: "found",
            getInfWay: "term",
            requestType: 'get',
            id
        }
    }).then(res => {
        // console.log(res);
        //物品详情
        $(".YitemName").find("em").eq(1).text(res.foundObjectName);
        $(".YitemCategory").find("em").eq(1).text(res.objectType);
        $(".YitemLocationFound").find("em").eq(1).text(res.foundLocation);
        // $(".YitemStatusFound").find("em").eq(1).text(totime(res.foundTime));
        $(".YitemNotes").find("em").eq(1).text(res.foundDescribe);

        // 用户详情
        let identity; //身份：老师/学生
        if (res.student != null) {
            identity = res.student;
            $(".YuserIdentity").find("em").eq(1).text("学生");
            $(".Ymajor").find("em").eq(0).text("专业");
        } else {
            identity = res.teacher;
            $(".YuserIdentity").find("em").eq(1).text("老师");
            $(".Ymajor").find("em").eq(0).text("学院");
        }
        $(".YuserPhotos").attr("src", identity.face);
        $(".YuserName").find("em").eq(1).text(identity.userName);
        $(".YuserName").find("em").eq(1).attr("title", identity.userName);

        //图片
        $(".Ymajor").find("em").eq(1).text(identity.major);
        $(".Ymajor").find("em").eq(1).attr("title", identity.major);

        for (let imgi = 0; imgi < res.imgs.length; imgi++) {
            if (res.imgs[imgi] != null) {
                $(".YitemPictureFound .w").append("<img src=" + res.imgs[imgi] + ">")
            }
        }
    })
}