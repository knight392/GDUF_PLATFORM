/**
 * 一键回到顶部，要求body便签的第一个子元素要为static定位
 */
export default function(){
  document.body.firstElementChild.scrollIntoView({
   behavior: 'smooth',
     block: 'start'
  })
}