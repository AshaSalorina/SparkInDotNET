/**
 * 搜索控制器
 */
var searchController = (function () {
    var searchControllerObj = {};
    searchControllerObj.initTypeList = function (typeList) {
        var searchTypeRadio = $("#searchTypeRadio");
        var radioGroupHtml = "<div class='radio-group'></div>";
        var inputControlHtml = "<div class='input-control-btn'></div>";
        var inputControlContainer = $(radioGroupHtml);
        for (var i = -1; i < 5; i++) {
            var inputControlBtn = $(inputControlHtml);
            // 根据不同的条件加载选择类目
            if (i === -1) {
                $(inputControlBtn).addClass("radio-all");
                $(inputControlBtn).attr("data-selected", "true");
                $(inputControlBtn).attr("data-group", "type");
                $(inputControlBtn).html("ALL");
            } else if (i < typeList.length) {
                $(inputControlBtn).html(typeList[i]);
                $(inputControlBtn).attr("data-value", typeList[i]);
                $(inputControlBtn).attr("data-group", "type");
            } else {
                $(inputControlBtn).html("none");
                $(inputControlBtn).attr("data-disable", "true");
            }
            $(inputControlContainer).append(inputControlBtn);
            // 每两个元素成一组
            if (i % 2 === 0) {
                $(searchTypeRadio).append(inputControlContainer);
                inputControlContainer = $(radioGroupHtml);
            }
        }
        // 初始化选择控件
        inputController.init();
        searchControllerObj.clickListener();
    };
    searchControllerObj.clickListener = function () {
        var searchSubmit = $("#searchSubmit");
        $(searchSubmit).click(function () {
            var searchAttr = {
                "typeSelectList": inputController.getRadioSelectList(),
                "ratingMin": $("#ratingMin").val(),
                "ratingMax": $("#ratingMax").val(),
                "searchKeywords": $("#searchKeywords").val()
            };
            sessionStorage.setItem("searchAttr", JSON.stringify(searchAttr));
            window.location.href = "movieList.html";
        });
    };
    return searchControllerObj;
})();
