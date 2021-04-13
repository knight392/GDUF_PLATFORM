import { baseHttpURL } from '../../common/baseRequestInfo.js'
import request from '../../util/request.js'
import {tipInfo, displayTipPane,displayTipPane_warn} from '../../components/content/tipPane.js'
import { loadAllItem, loadItem } from './masonry/myMasonry.js'
import { isLogin } from '../../common/user/index.js'
import template from '../../util/template.js'
// 主要是筛选物品，主要访问的是LostAndFoundServlet,
// 请求的参数，根据筛选的类型不同而动态改变
// 初始打开是失物招领
let display_modal = "found";
//根据这个id进行加载下一页，第一次加载时不需要
let scrollId = null;
// 筛选大类
let objectType;
// 筛选二类
let objectDetailType;
// 丢失时间
let lostTime;
// 找到时间
let foundTime;
// 丢失地点
let lostLocation;
// 找到地点
let foundLocation;
// 获取物品数据的请求方式, all 表示加载全部，没有筛选, explore 表示有筛选条件加载
let getInfWay = "all";
// 是否还有更多物品
let haveMore = true;
// 是否可加载，避免网络原因发出多次请求
let canLoading = true;
// 如果模式正式切换就导航栏滚动不起作用
let modechanging = false;
// 展示物品的实际宽度+边框+外边距
let itemOuterWidth = 320;
// 物品间的间隔
let itemGap = 30;
//用于显示不同的颜色
let itemIndex = 0;
// 展示平台的当前宽度
let platformWidth = $(".platform").css("width");  //flag的作用就是如果实现宽度不变不重新排版

//初始化失物招领物品
loadAllItem($(".item_containner"), itemOuterWidth, itemGap);

// 首次加载，失物招领和寻物启事都是这个函数, 没有筛选
//只用在首次加载，和模式切换
loadGoods(display_modal);


// 请求筛选物品数据
function requestGoods(data) {
  return request(baseHttpURL + '/Servlet/LostAndFoundServlet', {
    method: 'get',
    body: data
  })
}

// 首次加载物品调用
function loadGoods(type) {
  canLoading = false;
  haveMore = true;
  //清空
  scrollId = null;
  objectType = null;
  objectDetailType = null;
  lostTime = null;
  foundTime = null;
  lostLocation = null;
  foundLocation = null;
  modechanging = true;

  request(baseHttpURL + '/Servlet/LostAndFoundServlet', {
    method: 'get',
    body: {
      type,
      getInfWay: "all",
      requestType: "get"
    }
  }).then(res => {
    haveMore = res.next;
    canLoading = true;
    scrollId = res.scrollId;
    modechanging = false;
    let dataList = null;
    if (type == "lost") {//寻物启事
      transfromTime(res.dataList, "lostTime");
      dataList = res.dataList;
      //把键名进行统一,时间已经在被转换的时间改名了
      // time location describe name objectDetailType
      for (let i = 0; i < dataList.length; i++) {

        if (dataList[i]["lostLocation"] != null && dataList[i]["lostLocation"] != undefined) {
          dataList[i]["location"] = dataList[i]["lostLocation"];
        } else {
          dataList[i]["location"] = "未填写"
        }
        dataList[i]["describe"] = dataList[i]["lostDescribe"];
        dataList[i]["name"] = dataList[i]["lostObjectName"];
        dataList[i]["href"] = "lostAndFound-lost.html?id=" + dataList[i]["id"];
      }

      displayTipPane("已切换为寻物启事！")

    } else {
      //失物招领
      transfromTime(res.dataList, "foundTime");
      dataList = res.dataList;
      for (let i = 0; i < dataList.length; i++) {

        if (dataList[i]["foundLocation"] != null && dataList[i]["foundLocation"] != undefined) {
          dataList[i]["location"] = dataList[i]["foundLocation"];
        } else {
          dataList[i]["location"] = "未填写"
        }
        dataList[i]["describe"] = dataList[i]["foundDescribe"];
        dataList[i]["name"] = dataList[i]["foundObjectName"];
        dataList[i]["href"] = "lostAndFound-found.html?id=" + dataList[i]["id"];
      }
      displayTipPane("已切换为失物招领！")
    }
    //展示返回的数据
    displayGoods_first(dataList);
  }, err => {
    displayTipPane_warn("加载物品失败了~")
  })

}

//展示物品
//动态添加的方法就是先把新生成的元素添加到容器中
//然后再使用isImgLoad(function(){
// console.log("图片加载完")
//     loadItem(items,itemWidth,gap);
// },".item_containner .item img")

//无论是第一加载还是筛选都是用这个函数，
//因为我们在开头的时候已经初始化过列数组
function displayGoods_first(arr) {
  //清空
  $(".platform .item_containner").html("");
  let items = [];//是dom对象, width itemOuterWidth
  for (let i = 0; i < arr.length; i++) {
    let oItem = $(template("templateGoodsItem", arr[i]));
    if (arr[i]["imgs"] != null && arr[i]["imgs"].length != 0) {
      //有图片就添加第一张图片
      // let reg = /(..\/)/
      let src = arr[i]["imgs"][0];
      // src = src.replace(reg.exec(src)[0],"http:192.168.137.105:8080//");

      oItem.find(".imgBox").append(' <img src="' + src + '" style="height:' + arr[i]["imgHeight"] + 'px">');
      let prevHeight = arr[i]["imgHeight"];
      //瀑布流更明显
      if (prevHeight > 400) {
        oItem.find(".imgBox").css("max-height", "250px");
      } else if (prevHeight > 380) {
        oItem.find(".imgBox").css("max-height", "230px");
      } else if (prevHeight > 360) {
        oItem.find(".imgBox").css("max-height", "220px");
      } else if (prevHeight > 330) {
        oItem.find(".imgBox").css("max-height", "210px");
      } else {
        oItem.find(".imgBox").css("max-height", "190px");
      }
    }
    //先添加到容器中
    //然后再保存到items中
    $(".item_containner").append(oItem);
    addBgColor(oItem);
    items[i] = oItem;
  }
  loadAllItem($(".item_containner"), itemOuterWidth, itemGap);
}

// 加载更多使用
function displayGoods(arr) {
  // console.log(arr);
  let items = [];//是dom对象, width itemOuterWidth
  for (let i = 0; i < arr.length; i++) {
    let oItem = $(template("templateGoodsItem", arr[i]));
    if (arr[i]["imgs"] != null && arr[i]["imgs"].length != 0) {
      //有图片就添加第一张图片
      let src = arr[i]["imgs"][0];
      oItem.find(".imgBox").append(' <img src="' + src + '" style="height:' + arr[i]["imgHeight"] + 'px">');
      //瀑布流更明显
      let prevHeight = arr[i]["imgHeight"];
      if (prevHeight > 400) {
        oItem.find(".imgBox").css("max-height", "250px");
      } else if (prevHeight > 380) {
        oItem.find(".imgBox").css("max-height", "240px");
      } else if (prevHeight > 360) {
        oItem.find(".imgBox").css("max-height", "230px");
      } else if (prevHeight > 300) {
        oItem.find(".imgBox").css("max-height", "220px");
      } else {
        oItem.find(".imgBox").css("max-height", "210px");
      }
    }
    oItem.css("display", "none");
    //先添加到容器中
    //然后再保存到items中
    addBgColor(oItem);
    $(".item_containner").append(oItem);
    items[i] = oItem;
  }
  // isImgLoad(function () {
  //     // console.log("图片加载完");
  //     setTimeout(function () {
  loadItem(items, itemOuterWidth, itemGap);
  //     }, 300);
  // }, ".item_containner .item img")
}
//item添加背景色
function addBgColor(oItem) {
  switch (itemIndex) {
    case 0: {
      oItem.css("backgroundColor", "#94abea");
      break;
    }
    case 1: {
      oItem.css("backgroundColor", "#ffd16f");
      break;
    }
    case 2: {
      oItem.css("backgroundColor", "#88dee6");
      break;
    }
    case 3: {
      oItem.css("backgroundColor", "#ffc5c5");
      break;
    }
    case 4: {
      oItem.css("backgroundColor", "#ffb36f");
      break;
    }
  }
  itemIndex = (itemIndex + 1) % 5//5中背景色
}
//把时间戳转换成具体时间
function transfromTime(arr, timeType) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][timeType] != null && arr[i][timeType] != undefined) {
      let date = new Date(arr[i][timeType]);
      arr[i]["time"] = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()//都统一为time
    } else {
      arr[i]["time"] = "未填写"
    }
  }
}

// 模式切换, 原理是根据nextAction这个属性来判断下一次加载什么类型的数据
function changeMode() {
  $(".item_containner").html("");
  //导航栏恢复
  $(".nav .displayRow").fadeIn(100);
  $(".nav").css("background-color", "#028e9b")
  $(".nav .toolRow").css("margin-top", "10px");
  $(".nav .toolRow .tool").removeClass("tool_slideDown");
  $(".modalDisplayPane").css("top", "151px");
  $(".lostFoundBtn").css("top", "151px");
  $(".refreshBtn").css("top", "263px")
  if ($(this).attr("nextAction") == "seeFoundGoods") {
    //先清空，再加载
    // console.log("查看失物招领");
    $(this).find(".name").html("招");
    $(this).attr("title", "点击查看寻物启事");
    display_modal = "found";
    getInfWay = "all";
    // scrollId = null;loadGoods有写
    // modechanging = true;
    loadGoods("found");
    $(this).attr("nextAction", "seeLostGoods");
  } else {
    //先清空，再加载
    // console.log("查看寻物启事");
    display_modal = "lost";
    getInfWay = "all";
    $(this).find(".name").html("寻");
    $(this).attr("title", "点击查看失物招领")
    // scrollId = null;
    // modechanging = true; //loadGoods也有写
    $(this).attr("nextAction", "seeFoundGoods");
    loadGoods("lost");
  }
}

function getLostRequestData() {
  const data = {
    "requestType": "get",
    "type": "lost",
    "getInfWay": getInfWay,
  };
  //动态添加筛选条件
  if (objectType != null && objectType != undefined && objectType != "") {
    data["objectType"] = objectType;
  }
  if (objectDetailType != null && objectDetailType != undefined && objectDetailType != "") {
    data["objectDetailType"] = objectDetailType;
  }
  if (lostTime != null && lostTime != undefined && lostTime != "") {
    data["lostTime"] = lostTime;
  }
  if (lostLocation != null && lostLocation != undefined && lostLocation != "") {
    data["lostLocation"] = lostLocation;
  }
  if (scrollId != null) {
    data["scrollId"] = scrollId;
  }
  return data
}

function getFoundRequestData() {
  const data = {
    "requestType": "get",
    "type": "found",
    "getInfWay": getInfWay,
  };
  //动态添加筛选条件
  if (objectType != null && objectType != undefined && objectType != "") {
    data["objectType"] = objectType;
  }
  if (objectDetailType != null && objectDetailType != undefined && objectDetailType != "") {
    data["objectDetailType"] = objectDetailType;
  }
  if (foundTime != null && foundTime != undefined && foundTime != "") {
    data["foundTime"] = foundTime;
  }
  if (foundLocation != null && foundLocation != undefined && foundLocation != "") {
    data["foundLocation"] = foundLocation;
  }
  if (scrollId != null) {
    data["scrollId"] = scrollId;
  }
  return data;
}

// 加载更多的物品
function loadMoreGoods() {
  canLoading = false;
  if (display_modal == "lost") {
    const data = getLostRequestData();
    requestGoods(data).then(res => {
      canLoading = true;
      scrollId = res.scrollId;
      haveMore = res.next;
      transfromTime(res.dataList, "lostTime");
      let dataList = res.dataList;
      //把键名进行统一,时间已经在被转换的时间改名了
      // time location describe name objectDetailType
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i]["lostLocation"] != null && dataList[i]["lostLocation"] != undefined) {
          dataList[i]["location"] = dataList[i]["lostLocation"];
        } else {
          dataList[i]["location"] = "未填写"
        }
        dataList[i]["describe"] = dataList[i]["lostDescribe"];
        dataList[i]["name"] = dataList[i]["lostObjectName"];
        dataList[i]["href"] = "lostAndFound-lost.html?id=" + dataList[i]["id"];
      }
      // 添加物品数据
      displayGoods(dataList);
    })
  } else {
    const data = getFoundRequestData();
    requestGoods(data).then(res => {
      canLoading = true;
      scrollId = res.scrollId;
      haveMore = res.next;
      transfromTime(res.dataList, "foundTime");
      let dataList = res.dataList;
      //把键名进行统一,时间已经在被转换的时间改名了
      // time location describe name objectDetailType
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i]["foundLocation"] != null && dataList[i]["foundLocation"] != undefined) {
          dataList[i]["location"] = dataList[i]["foundLocation"];
        } else {
          dataList[i]["location"] = "未填写"
        }
        dataList[i]["describe"] = dataList[i]["foundDescribe"];
        dataList[i]["name"] = dataList[i]["foundObjectName"];
        dataList[i]["href"] = "lostAndFound-found.html?id=" + dataList[i]["id"];
      }
      // 添加物品数据
      displayGoods(dataList);
    })
  }
}

// 处理滚动事件，加载更多物品数据
function scrollHandler() {
  //滚动条到顶部的高度
  if (modechanging) return;
  let scrollTop = Math.ceil($(this).scrollTop());
  //窗口高度
  let curHeight = $(this).height();
  //整个文档高度
  let totalHeight = $(document).height();
  //滚动条到底
  if (scrollTop + curHeight >= (totalHeight - 80)) {
    if (haveMore) {
      if (canLoading) {
        loadMoreGoods();
      }
    } else {
      displayTipPane_warn("没有跟多物品了哦~")
    }
  }
}

// 处理屏幕缩放
function resizeHandler() {
  if ($(".platform").css("width") == "1618px" && $(".platform").css("width") != platformWidth) {
    //展示5列
    loadAllItem($(".item_containner"), itemOuterWidth, itemGap);
    platformWidth = $(".platform").css("width");
  } else if ($(".platform").css("width") == "1100px" && $(".platform").css("width") != platformWidth) {
    //展示4列
    loadAllItem($(".item_containner"), itemOuterWidth, itemGap);
    platformWidth = $(".platform").css("width");
  } else if ($(".platform").css("width") == "1300px" && $(".platform").css("width") != platformWidth) {
    //展示4列
    loadAllItem($(".item_containner"), itemOuterWidth, itemGap);
    platformWidth = $(".platform").css("width");
  }
}




//条件筛选函数
function selectGoods() {
  canLoading = false;
  getInfWay = "explore";
  scrollId = null;
  //清空容器
  //加一个缓冲动态图
  if (display_modal == "lost") {
    const data = getLostRequestData();
    requestGoods(data).then(res => {
      haveMore = res.next;
      scrollId = res.scrollId;
      transfromTime(res.dataList, "lostTime");
      let dataList = res.dataList;
      //把键名进行统一,时间已经在被转换的时间改名了
      // time location describe name objectDetailType
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i]["lostLocation"] != null && dataList[i]["lostLocation"] != undefined) {
          dataList[i]["location"] = dataList[i]["lostLocation"];
        } else {
          dataList[i]["location"] = "未填写"
        }
        dataList[i]["describe"] = dataList[i]["lostDescribe"];
        dataList[i]["name"] = dataList[i]["lostObjectName"];
        dataList[i]["href"] = "lostAndFound-lost.html?id=" + dataList[i]["id"];
      }
      canLoading = true;
      displayGoods_first(dataList);
    })
  } else {
    const data = getFoundRequestData();
    requestGoods(data).then(res => {
      scrollId = res.scrollId;
      haveMore = res.next;
      canLoading = true;
      transfromTime(res.dataList, "foundTime");
      let dataList = res.dataList;
      //把键名进行统一,时间已经在被转换的时间改名了
      // time location describe name objectDetailType
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i]["foundLocation"] != null && dataList[i]["foundLocation"] != undefined) {
          dataList[i]["location"] = dataList[i]["foundLocation"];
        } else {
          dataList[i]["location"] = "未填写"
        }
        dataList[i]["describe"] = dataList[i]["foundDescribe"];
        dataList[i]["name"] = dataList[i]["foundObjectName"];
        dataList[i]["href"] = "lostAndFound-found.html?id=" + dataList[i]["id"];
      }
      displayGoods_first(dataList);
    })
  }
}



// 重新筛选
function reSelect() {
  //样式去除类名
  $(".nav .toolRow .tool").removeClass("toolSelected");
  $(".objectSelect .toolText").html("分类筛选");
  $(".itemSelect .toolText").html("物品筛选");
  $(".timeSelect .toolText").html("日期筛选");
  $(".locationSelect .toolText").html("地点筛选");
  // 逻辑部分可以直接调用模式切换函数
  loadGoods(display_modal);
}

// 一级筛选
function selectObject() {
  objectType = $(this).find(".text").html();
  $(".objectSelect .toolText").html(objectType);
  $(".objectSelect").addClass("toolSelected");
  $(".objectSelectPane").stop().fadeOut(230);
  //二级筛选清空
  objectDetailType = null;
  $(".itemSelect").removeClass("toolSelected");
  $(".itemSelect .toolText").html("物品筛选");
  selectGoods();
}

// 二级筛选
function selectObjectDetail() {
  objectDetailType = $(this).html();
  $(".itemSelect .toolText").html(objectDetailType);
  $(".itemSelect").addClass("toolSelected");
  $(".itemSelectPane").stop().fadeOut(230);
  selectGoods();
}

// 地点筛选
function selectLocation() {
  $(".locationSelect .toolText").html($(this).html());
  $(".locationSelect").addClass("toolSelected");
  if (display_modal == "lost") {
    lostLocation = $(this).html();
  } else {
    foundLocation = $(this).html();
  }
  $(".locationSelectPane").stop().fadeOut(230);
  selectGoods();
}

//时间筛选
function selectTime(calendarId) {
  //nowMonth已经加1
  const nowYear = $(calendarId).data("year");
  const nowMonth = $(calendarId).data("month");
  let month = nowMonth.length > 1 ? nowMonth : "0" + nowMonth;
  // this是指向td
  let day = $(this).html().length > 1 ? $(this).html() : "0" + $(this).html();
  if (display_modal == "lost") {
    lostTime = `${nowYear}-${month}-${day}`;
  } else {
    foundTime = `${nowYear}-${month}-${day}`;
  }
  let displayTime = `${nowYear}-${month}-${day}`;//展示在筛选栏上的文字
  $(".timeSelect .toolText").html(displayTime);
  $(".timeSelect").addClass("toolSelected");
  $(".timeSelectPane").stop().fadeOut(230);
  selectGoods();
}

// 打开寻物启事面板
function openLostPane() {
  //  alert("打开面板")
  if (isLogin()) { //函数写在了nav上
    $(".modal_bg_lost").fadeIn();
  } else {
    displayTipPane_warn(tipInfo.login.no_login);
  }
}

// 打开失物招领面板

function openFoundPane() {
  // alert("打开面板")
  if (isLogin()) {
    $(".modal_bg_found").fadeIn();
  } else {
    displayTipPane_warn(tipInfo.login.no_login);
  }
}



export { changeMode, scrollHandler, resizeHandler, loadGoods, selectGoods, reSelect, selectObject, selectObjectDetail, selectTime, selectLocation, openFoundPane, openLostPane }