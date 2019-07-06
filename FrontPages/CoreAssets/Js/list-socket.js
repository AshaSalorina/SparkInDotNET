/**
 * 初始化调用
 */
var movieSocketSender = (function () {
    /**
     * 搜索功能类型列表请求
     */
    var initSearchTypeList = function () {
        var message = {
            "size": 5
        };
        socketController.invoke("getTypeList", message);
    };
    var onTypeListArrive = function (msg) {
        var typeObj = JSON.parse(msg);
        console.log("获取到类型列表：");
        console.log(typeObj.typeArray);
        searchController.initTypeList(typeObj.typeArray);
    };
    /**
     * 初始化请求发送
     */
    var senderObj = {};
    var searchAttr = sessionStorage.getItem("searchAttr");
    if (searchAttr === null) {
        searchAttr = {
            "typeSelectList": [],
            "ratingMin": 0.00,
            "ratingMax": 5.00,
            "searchKeywords": ""
        };
    }

    senderObj.sendPageRequest = function () {
        var message = {
            "ratingRage": [searchAttr.ratingMin, searchAttr.ratingMax],
            "movieType": searchAttr.typeSelectList,
            "movieKeyName": searchAttr.searchKeywords,
            "pageNo": movieController.pageNo++,
            "pageSize": 4
        };
        socketController.invoke("getMovieList", message);
    };

    var startCallBack = function () {
        // 首次进入页面获取第一页
        senderObj.sendPageRequest();
        /* 初始化搜索类型列表*/
        initSearchTypeList();
    };
    /**
     * 电影列表到达
     * @param msg
     */
    var onMovieList = function (msg) {
        var ratingObj = JSON.parse(msg);
        movieController.loadLock = false;
        movieController.setFilmData(ratingObj.movieList);
        movieController.loadPage();
    };
    senderObj.pageRequestSend = function () {
        movieController.loadLock = true;
        senderObj.sendPageRequest();
    };
    /**
     * 执行事件绑定
     */
    socketController.initConnect(startCallBack);
    socketController.on("getMovieList", onMovieList);
    /* 搜索类型列表 */
    socketController.on("getTypeList", onTypeListArrive);
    return senderObj;
})();