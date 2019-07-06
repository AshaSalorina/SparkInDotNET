$(function () {
    var commentPanel = $("#commentPanel");
    $(".commentSubmit").click(function () {
        var userId = $("#userCommentId");
        var userRating = $("#userCommentRating");
        var userTag = $("#userCommentContent");
        var message = {
            "name": userId,
            "rating": parseFloat(userRating).toFixed(2),
            "tag": userTag
        };
        socketController.invoke("addUserComment", message);
        $(commentPanel).removeClass("user-comment-panel-show");
        $(commentPanel).addClass("user-comment-panel-hide");
        rawPlayer.playSound("click");
        alert("提交成功！");
    });
});