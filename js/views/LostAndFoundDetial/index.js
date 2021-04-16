import { infoLostHTML, infoFoundHTML } from './info.js'

$(function () {
  if (window.location.href.indexOf('lostAndFound-lost') != -1) {
    infoLostHTML();
  } else if (window.location.href.indexOf('lostAndFound-found') != -1) {
    infoFoundHTML();
  }
})