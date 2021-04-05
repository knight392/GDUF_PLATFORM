
import {initCalendar, bindSelectDayEvent} from './calendar/calendar.js'
import {loadAllItem} from './masonry/myMasonry.js'
import {changeMode, scrollHandler, loadGoods, selectGoods} from './tools.js'
// 创建一个日历
initCalendar('#calendar_main');
// 绑定选定日期事件
bindSelectDayEvent('#calendar_main', () => {
  
})


//模式切换
$(".modalDisplayPane").on("click", changeMode)

// 滚动加载更多
$(window).on("scroll", debounce(scrollHandler, 500));

//筛选
//点击一级导航栏,getInfWay = "explore"

//一级分类筛选
$(".objectList li").on("click", function () {
  objectType = $(this).find(".text").html();
  $(".objectSelect .toolText").html(objectType);
  $(".objectSelect").addClass("toolSelected");
  $(".objectSelectPane").stop().fadeOut(230);
  //二级筛选清空
  objectDetailType = null;
  $(".itemSelect").removeClass("toolSelected");
  $(".itemSelect .toolText").html("物品筛选");
  selectGoods();
})
// 二级物品分类
$(".itemSelect .itemList .item").on("click", function () {
  objectDetailType = $(this).html();
  $(".itemSelect .toolText").html(objectDetailType);
  $(".itemSelect").addClass("toolSelected");
  $(".itemSelectPane").stop().fadeOut(230);
  selectGoods();
})

//点击地点筛选
$(".locationSelectPane .locationList .item").on("click", function () {
  $(".locationSelect .toolText").html($(this).html());
  $(".locationSelect").addClass("toolSelected");
  if (display_modal == "lost") {
    lostLocation = $(this).html();
  } else {
    foundLocation = $(this).html();
  }
  $(".locationSelectPane").stop().fadeOut(230);
  selectGoods();
});

//时间筛选 ，在calendar中调用
function selectTime() {
  //nowMonth已经加1
  let month = ("" + nowMonth).length > 1 ? nowMonth : "0" + nowMonth;
  let day = $(this).html().length > 1 ? $(this).html() : "0" + $(this).html();
  if (display_modal == "lost") {
    lostTime = nowYear + '-' + month + '-' + day;
  } else {
    foundTime = nowYear + '-' + month + '-' + day;
  }
  let displayTime = nowYear + "-" + month + "-" + day;//展示在筛选栏上的文字
  $(".timeSelect .toolText").html(displayTime);
  $(".timeSelect").addClass("toolSelected");
  $(".timeSelectPane").stop().fadeOut(230);
  selectGoods();
}
// 重新筛选
$(".reSelect").on("click", function () {
  //样式去除类名
  $(".nav .toolRow .tool").removeClass("toolSelected");
  $(".objectSelect .toolText").html("分类筛选");
  $(".itemSelect .toolText").html("物品筛选");
  $(".timeSelect .toolText").html("日期筛选");
  $(".locationSelect .toolText").html("地点筛选");
  // 逻辑部分可以直接调用模式切换函数
  loadGoods(display_modal);
})


//刷新
$(".refreshBtn").on("click", selectGoods)


// 模式面板有提示字体改成切换按钮

// 头部导航栏样式变化
$(window).on("scroll", function () {
  if (modechanging) return;
  if ($(this).scrollTop() > 200) {
    $(".nav .displayRow").fadeOut(100);
    $(".nav .toolRow").css("margin-top", "0");
    $(".nav").css("background-color", "rgba(255,255,255,0.8)")
    $(".nav .toolRow .tool").addClass("tool_slideDown");
    $(".modalDisplayPane").css("top", "86px");
    $(".lostFoundBtn").css("top", "86px");
    $(".refreshBtn").css("top", "198px")
  } else {
    $(".nav .displayRow").fadeIn(100);
    $(".nav").css("background-color", "#028e9b")
    $(".nav .toolRow").css("margin-top", "10px");
    $(".nav .toolRow .tool").removeClass("tool_slideDown");
    $(".modalDisplayPane").css("top", "151px");
    $(".lostFoundBtn").css("top", "151px");
    $(".refreshBtn").css("top", "263px")
  }
})

// 展示item 4-5的切换
let platformWidth = $(".platform").css("width");  //flag的作用就是如果实现宽度不变不重新排版
$(window).on("resize", debounce(function () {
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
}, 100))

// 打开寻物启事的面板
$(".lostBtn").on("click", function () {
  //  alert("打开面板")
  if (isHaveCookie()) { //函数写在了nav上
    $(".modal_bg_lost").fadeIn();
  } else {
    displayTipPane("你还没登录噢~");
  }
});

//打开失物招领的面板
$(".foundBtn").on("click", function () {
  // alert("打开面板")
  if (isHaveCookie()) {
    $(".modal_bg_found").fadeIn();
  } else {
    displayTipPane("你还没登录噢~");
  }
});

// 筛选面板的打开
$(".nav .toolRow .toolBox .tool").on("mouseenter", function () {
  $(this).find(".selectPane").stop().fadeIn(230);
})
$(".nav .toolRow .toolBox .tool").on("mouseleave", function () {
  $(this).find(".selectPane").stop().fadeOut(230);
})




















