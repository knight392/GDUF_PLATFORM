import SensitiveWordHandler from './sensitiveWordHandler.js'
import htmlEscape from '../../util/htmlEscape.js'

/**
 * 
 * @param {*} text 
 * @returns {Promise}
 */
export default function inputTextFilter(text) {
  // xss处理
  text = htmlEscape(text);
  return  SensitiveWordHandler(text);
}