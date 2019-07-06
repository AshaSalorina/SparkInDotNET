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
    senderObj.searchAttr = sessionStorage.getItem("searchAttr");
    if (senderObj.searchAttr === null) {
        senderObj.searchAttr = {
            "typeSelectList": [],
            "ratingMin": 0.00,
            "ratingMax": 5.00,
            "searchKeywords": ""
        };
    }

    senderObj.sendPageRequest = function () {
        var message = {
            "ratingRage": [senderObj.searchAttr.ratingMin, senderObj.searchAttr.ratingMax],
            "movieType": senderObj.searchAttr.typeSelectList,
            "movieKeyName": senderObj.searchAttr.searchKeywords,
            "pageNo": movieController.pageNo++,
            "pageSize": 4
        };
        console.log("==============搜索参数=============");
        console.log(senderObj.searchAttr);
        console.log(message);
        console.log(senderObj.searchAttr);
        console.log("===================================");
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
        /**
        * 格式化小数
        * */
        for (var i = 0; i < ratingObj.movieList.length; i++) {
            ratingObj.movieList[i].rating = ratingObj.movieList[i].rating.toFixed(2);
        }
  
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