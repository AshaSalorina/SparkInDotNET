/**
 * 初始化调用
 */
(function () {
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
     * 初始化请求
     */
    var startCallBack = function () {
        var message = {
            "movieId": parseInt(getQueryString("movieId"))
        };
        socketController.invoke("getMovieDetail", message);
        /* 初始化搜索类型列表*/
        initSearchTypeList();
    };

    /**
     * 电影数据到达
     * @param msg
     */
    var onMovieDataArrive = function (msg) {
        var movieObj = JSON.parse(msg);
        /**
          * 格式化小数
          * */
        for (var i = 0; i < movieObj.userRatingDetails.length; i++) {
            movieObj.userRatingDetails[i].rating = movieObj.userRatingDetails[i].rating.toFixed(2);
        }
        for (var i = 0; i < movieObj.ratings.length; i++) {
            movieObj.ratings[i].rating = movieObj.ratings[i].rating.toFixed(2);
        }
        movieDetailController.initMovie(movieObj);
    };
    var onUpdateDataArrive = function (msg) {
        var movieObj = JSON.parse(msg);
        /**
         * 格式化小数
         * */
        for (var i = 0; i < movieObj.userRatingDetails.length; i++) {
            movieObj.userRatingDetails[i].rating = movieObj.userRatingDetails[i].rating.toFixed(2);
        }
        for (var i = 0; i < movieObj.ratings.length; i++) {
            movieObj.ratings[i].rating = movieObj.ratings[i].rating.toFixed(2);
        }

        movieDetailController.addMovieRatings(movieObj);
    };
    /**
     * 执行事件绑定
     */
    socketController.initConnect(startCallBack);
    socketController.on("getMovieDetail", onMovieDataArrive);
    socketController.on("updateRating", onUpdateDataArrive);
    /* 搜索类型列表 */
    socketController.on("getTypeList", onTypeListArrive);
})();