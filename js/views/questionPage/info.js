let oAuthor; //文章的作者

//动态添加回答的数据
const questionId = getQueryletiable('id');
//获取url上query的键和获取值
function getQueryletiable(letiable) {
  let query = window.location.search.substring(1);
  let lets = query.split("&");
  for (let i = 0; i < lets.length; i++) {
    let pair = lets[i].split("=");
    if (pair[0] == letiable) { return pair[1]; }
  }
  return (false);
}

function setAuthorInfo(author) {
  oAuthor = author
}

export {oAuthor, questionId, setAuthorInfo}