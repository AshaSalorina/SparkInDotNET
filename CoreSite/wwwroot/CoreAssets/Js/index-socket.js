/**
 * 初始化调用
 */
(function () {
    /**
     * 初始化映射表
     * */
    var occupationMap = ["other", "academic", "artist", "clerical", "college", "service"
        , "doctor", "executive", "farmer", "homemaker", "student", "lawyer"
        , "programmer", "retired", "sales", "scientist", "self-employed", "engineer"
        , "tradesman", "unemployed", "writer"];
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
    var startCallBack = function () {
        var message = {
            "type": "movie"
        };
        socketController.invoke("getAllAvgRatings", message);
        /* 初始化搜索类型列表*/
        initSearchTypeList();
    };

    /**
     * 平均分数据到达
     * @param msg
     */
    var onAvgDataArrive = function (msg) {
        var ratingObj = JSON.parse(msg);
        var genderRatings = ratingObj.ratings.sex;
        var typeRatings = ratingObj.ratings.type;
        var occupationRatings = ratingObj.ratings.occupation;
        var areaRatings = ratingObj.ratings.area;
        /**
         * 格式化数据
         * */
        for (var i = 0; i < typeRatings.length; i++) {
            typeRatings[i].rating = typeRatings[i].rating.toFixed(2);
        }
        for (var i = 0; i < occupationRatings.length; i++) {
            occupationRatings[i].rating = occupationRatings[i].rating.toFixed(2);
            occupationRatings[i].name = occupationMap[parseInt(occupationRatings[i].name)];
        }
        for (var i = 0; i < areaRatings.length; i++) {
            areaRatings[i].rating = areaRatings[i].rating.toFixed(2);
        }
    
        /**
         * 初始化全部图表
         */
        typeChart.initGender(genderRatings);
        typeChart.initType(typeRatings);
        dailyChart.initOccupation(occupationRatings);
        dailyChart.initArea(areaRatings);
    };
    /**
     * 执行事件绑定
     */
    socketController.initConnect(startCallBack);
    socketController.on("getAllAvgRatings", onAvgDataArrive);
    /* 搜索类型列表 */
    socketController.on("getTypeList", onTypeListArrive);
})();