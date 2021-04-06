
import {initCalendar, bindSelectDayEvent} from './calendar/calendar.js'
import {changeMode, scrollHandler, resizeHandler, selectGoods, selectObject, selectObjectDetail, selectTime, selectLocation, reSelect, } from './tools.js'
// 创建一个日历
initCalendar('#calendar_main');

// 重新筛选
$(".reSelect").on("click", reSelect)


//模式切换
$(".modalDisplayPane").on("click", changeMode)

// 滚动加载更多
$(window).on("scroll", debounce(scrollHandler, 500));

//筛选
//点击一级导航栏,getInfWay = "explore"

//一级分类筛选
$(".objectList li").on("click", selectObject)
// 二级物品分类
$(".itemSelect .itemList .item").on("click", selectObjectDetail)

// 绑定选定日期事件 日期筛选
bindSelectDayEvent('#calendar_main', selectTime)

//点击地点筛选
$(".locationSelectPane .locationList .item").on("click", selectLocation);


//刷新
$(".refreshBtn").on("click", selectGoods)


// 展示item 4-5的切换
$(window).on("resize", debounce(resizeHandler, 100))

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




















