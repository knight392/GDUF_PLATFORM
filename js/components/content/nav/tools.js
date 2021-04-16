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