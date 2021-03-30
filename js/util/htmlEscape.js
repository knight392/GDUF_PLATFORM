/**
 * 前端html特殊符号替换
 * @param {*} text 
 * @returns 
 */
export default function htmlEscape(text){
  return text.replace(/[<>"&]/g,function(match){
      switch(match){
          case '<':
              return '&lt;';
          case '>':
              return '&gt;';
          case '\"':
              return '&quot;';
          case '&':
              return '&amp;';
      }   
  })
}