//失物招领的位置透明度
export const lostfoundYOpacityPosition = function(opacityY, positionY) {
    $('.inlaf').css({
        opacity: opacityY,
        bottom: positionY
    });
    $('.lf-img').css({
        opacity: opacityY,
        bottom: positionY
    });
    $('.lf-h2').css({
        opacity: opacityY,
        top: positionY,
    });
    $('.lf-p').css({
        opacity: opacityY,
        top: positionY
    })
};

//校内通知 的位置变化
export const inschoolNewsYCssPosition = function(positionY) {
    $('.deansOffice').css('top', positionY);
    $('.youthLeagueCommittee').css('bottom', positionY);
    $('.studentAffairsOffice').css('top', positionY);
    $('.other').css('bottom', positionY);
};