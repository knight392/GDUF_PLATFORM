function displayTipPane(text, isIndependent = true) {
    if (isIndependent) {
        clearStatus();
    }
    $('.tipPane').html(text);
    $('.tipPane').fadeIn(100);
    setTimeout(() => {
        $('.tipPane').fadeOut(100);
    }, 1300)
}

function displayTipPane_success(text) {
    clearStatus();
    $('.tipPane').addClass('tipPane_success');
    displayTipPane(text, false);
}

function displayTipPane_err(text) {
    clearStatus();
    $('.tipPane').addClass('tipPane_err');
    displayTipPane(text, false);
}

function displayTipPane_warn(text) {
    clearStatus();
    $('.tipPane').addClass('tipPane_warn');
    displayTipPane(text, false);
}

function clearStatus() {
    $('.tipPane').removeClass("tipPane_success");
    $('.tipPane').removeClass("tipPane_err");
    $('.tipPane').removeClass("tipPane_warn");
}

const tipInfo = {
    img: {
        err: '图片上传失败了哦~',
        format_warn: '图片格式有误哦~',
        upLoading: '有图片正在上传中...'
    },
    video: {
        err: '视频上传失败了哦~',
        format_warn: '视频格式有误哦~',
        upLoading: '有视频正在上传中...'
    },
    submit: {
        succees: '发布成功！',
        err: '发布失败了哦~',
        tooFrequent: '操作太频繁了哦~'
    },
    login: {
        no_login: '请先完成登录哦~'
    },
    copy: {
        note_success: '复制成功！',
        link_success: '链接复制成功！'
    },
    dev: {
      mes: '抱歉，该功能还在开发中哦~'
    }
}



export { displayTipPane, displayTipPane_err, displayTipPane_warn, displayTipPane_success, tipInfo }