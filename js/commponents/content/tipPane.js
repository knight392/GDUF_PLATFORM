export default function displayTipPane(tipPane = '.tipPane', text) {
    $(tipPane).html(text);
    $(tipPane).fadeIn(100);
    setTimeout(() => {
        $(tipPane).fadeOut(100);
    }, 1300)
}