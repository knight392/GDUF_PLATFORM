
export default function bindImageSacningEvent(containerId, imgTargetClassName) {
  $(containerId).on('click', function (e) {
    if (e.target.classList.contains(imgTargetClassName)) {
      $('.modal_bg_img .modal_content img').attr("src", $(e.target).attr("src"));
      $('.modal_bg_img').fadeIn();
      $('.modal_bg_img .modal').css({
        transform: 'translate(-50%,-50%) scale(1)'
      })
    }
  })
}

// 定义关闭模板事件
$('.modal_bg_img .fadeout').on("click", function () {
  $('.modal_bg_img').fadeOut();
  $('.modal_bg_img .modal').css({
    transform: 'translate(-50%,-50%) scale(0.7)'
  })
})