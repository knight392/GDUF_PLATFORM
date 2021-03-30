/**
 * 防抖函数，多次触发事件最终处理成一次事件
 * @param {*} func 
 * @param {*} wait 
 * @param {*} immediate 
 * @returns 
 */
export default function debounce(func, wait = 500, immediate = true) {
    //如果在等待时间内再次进入代码块，那么就会把上一次的还没执行的函数取消，重新定义
    let timeout;
    return function () {
        let context = this;//因为是事件触发者执行该函数，所以this就是指向触发者
        let arg = arguments; //参数的实参对象
        clearTimeout(timeout); // 超时任务
        if (immediate) {//首次进入之后立即执行
            let callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait)
            if (callNow) { //有timeout就为不进去
                func.apply(context, arg);
            }
        } else {
            timeout = setTimeout(function () {
                func.apply(context, arg);
            }, wait);//毫秒数
        }
    }
}