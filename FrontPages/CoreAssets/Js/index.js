$(function () {
    let searchPanel = $("#searchPanel");
    $(".searchClose").click(function () {
        $(searchPanel).removeClass("search-panel-show");
        $(searchPanel).addClass("search-panel-hide");
        rawPlayer.playSound("click");
    });
    $(".searchOpen").click(function () {
        $(searchPanel).removeClass("search-panel-hide");
        $(searchPanel).addClass("search-panel-show");
        rawPlayer.playSound("click");
        rawPlayer.playSound("loading");
    });
    $(".btn,.right-btn,.left-btn").mouseenter(function () {
        rawPlayer.playSound("hover");
    });
});