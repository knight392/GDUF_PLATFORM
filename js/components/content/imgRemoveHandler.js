// 对父容器使用事件委派来处理删除item
/**
 * 
 * @param {*} containerId 照片父容器
 * @param {*} btnClassName 关闭按钮的类名
 * @param {*} handler 移出处理函数
 */
export default function BindRmoveItemEvent(containerId, btnClassName, handler) {
  $(containerId).on('click', function(e) {
      if (e.target.className == btnClassName) {
          handler.call(e.target)
      }
  })
}
