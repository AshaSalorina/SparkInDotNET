$(function () {
    var mChart = $(".movie-rating .circle-chart");
    $(mChart).attr("data-percentage", parseInt(Math.random() * 50));
    $(mChart).circlechart();

    $.get("http://fanyi.youdao.com/translate", {
        "doctype": "json",
        "type": "AUTO",
        "i": "Fate Stay Night"
    }, function (res) {
        var jsonObj = {
            translateResult: [{"tgt": "暂无"}]
        };
        jsonObj = res;
        var title = "暂无信息";
        if(jsonObj.errorCode === 0){
            title = jsonObj.translateResult[0][0].tgt;
        }
        $(".movie-title .movie-title-zh").html(title);
    });
});
