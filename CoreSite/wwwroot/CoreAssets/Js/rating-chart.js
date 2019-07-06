/**
 * movie 按类型图表初始化
 */
var movieDetailController = (function () {
    var mdcObj = {};
    /**
     * 初始化配置
     */
    var generateOption = function () {
        return {
            grid: {
                bottom: 60,
                height: "40%"
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: {
                        backgroundColor: '#505765'
                    }
                }
            },
            dataZoom: [
                {
                    show: true,
                    startValue: 0,
                    endValue: 5
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {onZero: false},
                    data: [
                        '2019-06-22', '2019-06-23', '2019-06-24',
                        '2019-06-25', '2019-06-26', '2019-06-27'
                    ].map(function (str) {
                        return str;
                    })
                }
            ],
            yAxis: {
                name: '分数',
                type: 'value'
            },
            series: [{
                type: 'line',
                smooth: true,
                name: '分数',
                lineStyle: {
                    width: 3,
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#00acc1'},
                            {offset: 0.33, color: '#00C851'},
                            {offset: 0.66, color: '#ffbb33'},
                            {offset: 1, color: '#ff4444'}
                        ]
                    )

                },
                data: [3.51, 2.23, 3.61, 4.15, 3.19, 2.56]
            }]
        };
    };
    var movieRatingElem = $("#movieRatingChart")[0];
    /**
     * 初始化图表对象
     */
    var mChart = {
        "movieRatingChart": {
            "elem": echarts.init(movieRatingElem)
        }
    };
    /**
     * 首次渲染chart
     * @param data
     */
    var renderChart = function (data) {
        var movieRatingChart = mChart.movieRatingChart.elem;
        var movieRatingOption = generateOption();
        movieRatingOption.xAxis[0].data = data.xAxis;
        movieRatingOption.series[0].data = data.series;
        movieRatingOption.dataZoom[0].startValue = data.xAxis.length - 5;
        movieRatingOption.dataZoom[0].endValue = data.xAxis.length - 1;
        movieRatingChart.setOption(movieRatingOption);
    };
    var updateChart = function (data) {
        var movieRatingChart = mChart.movieRatingChart.elem;
        var movieRatingOption = movieRatingChart.getOption();
        movieRatingOption.xAxis[0].data.push(data.xAxis);
        movieRatingOption.series[0].data.push(data.series);
        movieRatingChart.setOption(movieRatingOption);
    };


    /**
     * window重置分析
     */
    window.addEventListener("resize", () => {
        mChart.movieRatingChart.elem.resize();
    });

    /**
     * 初始化各类方法
     */
    var translateMovieName = function (movieEnName) {
        $.get("http://fanyi.youdao.com/translate", {
            "doctype": "json",
            "type": "AUTO",
            "i": movieEnName
        }, function (res) {
            var jsonObj = {
                translateResult: [{"tgt": "暂无"}]
            };
            jsonObj = res;
            var title = "暂无中文题目";
            if (jsonObj.errorCode === 0) {
                title = jsonObj.translateResult[0][0].tgt;
            }
            $(".movie-title .movie-title-zh").html(title);
        });
    };
    /**
     * 添加用户标签
     */
    var addUserTag = function (tag) {
        var tagContainer = $(".movie-info-container .movie-describe-container .user-tags-content");
        var userName = tag.name;
        var userTagContent = tag.content;
        var userNameElem = $("<span></span>");
        $(userNameElem).addClass("user-name");
        $(userNameElem).html(userName);
        var userTagContentElem = $("<span></span>");
        $(userTagContentElem).addClass("tag-content");
        $(userTagContentElem).html(userTagContent);
        var userTagElem = $("<div></div>");
        $(userTagElem).addClass("user-tag");
        /* 组装元素 */
        $(userTagElem).append(userNameElem);
        $(userTagElem).append(":");
        $(userTagElem).append(userTagContentElem);
        /* 添加到容器 */
        $(tagContainer).prepend(userTagElem);
    };
    /**
     * 添加用户评分数据
     */
    var addUserRatingDetail = function (ratingDetail) {
        var ratingDetailContainer = $(".movie-info-container .user-recent .rating-list");
        var userNameElem = $("<span></span>");
        $(userNameElem).addClass("user-name");
        $(userNameElem).html(ratingDetail.name);
        var ratingValueElem = $("<span></span>");
        $(ratingValueElem).addClass("rating-value");
        $(ratingValueElem).html(ratingDetail.rating);
        var ratingDateElem = $("<span></span>");
        $(ratingDateElem).addClass("rating-date");
        $(ratingDateElem).html(ratingDetail.date);
        /* 组装serRatingDetail */
        var userRatingDetailElem = $("<li></li>");
        $(userRatingDetailElem).append(userNameElem);
        $(userRatingDetailElem).append(ratingValueElem);
        $(userRatingDetailElem).append(ratingDateElem);
        /*  添加到父容器 */
        $(ratingDetailContainer).prepend(userRatingDetailElem);
    };
    /**
     * 初始化电影信息的接口
     * @param msg
     */
    mdcObj.initMovie = function (msg) {
        /**
         * 初始化电影各类信息
         */
        var movieNameSplit = msg.movieName.split("(");
        var movieNameEn = movieNameSplit[0];
        translateMovieName(movieNameEn);
        var movieYear = movieNameSplit[1].split(")")[0];
        var movieType = msg.movieType;
        var movieRating = msg.rating;
        var movieRatingNum = msg.ratingNum;
        $(".movie-info-container .movie-title-en").html(movieNameEn);
        $(".movie-info-container .movie-title-era").html("(" + movieYear + ")");
        $(".movie-info-container .movie-tags").html(movieType);
        $(".movie-info-container .movieDRating").html(movieRating);
        $(".movie-info-container .movieDRNum").html(movieRatingNum);
        $(".movie-info-container .movieDUTNum").html(msg.userTags.length);
        $(".movie-info-container .movieDYear").html(movieYear);
        /** 电影海报渲染 */
        $(".movie-poster img").attr("src", "CoreAssets/Images/Movies/" + movieType.split("/")[0] + ".jpg");
        /* 渲染分数展示 */
        var mChart = $(".movie-rating .circle-chart");
        $(mChart).attr("data-percentage", parseInt(movieRating * 10));
        $(mChart).circlechart();

        /* 渲染用户标签 */
        for (var i = 0; i < msg.userTags.length; i++) {
            addUserTag(msg.userTags[i]);
        }
        /* 渲染用户评分数据 */
        for (var i = 0; i < msg.userRatingDetails.length; i++) {
            addUserRatingDetail(msg.userRatingDetails[i]);
        }
        var ratingDetailTitleNum = $(".movie-info-container .user-recent .user-recent-title small");
        $(ratingDetailTitleNum).html("(" + msg.userRatingDetails.length + ")");
        /*  渲染图表 */
        var movieRatingXAxis = [];
        var movieRatingSeries = [];
        for (var i = 0; i < msg.ratings.length; i++) {
            var movieRatingObj = msg.ratings[i];
            movieRatingXAxis.push(movieRatingObj.date);
            movieRatingSeries.push(movieRatingObj.rating);
        }
        renderChart({
            "xAxis": movieRatingXAxis,
            "series": movieRatingSeries
        });
    };
    mdcObj.addMovieRatings = function (msg) {
        /* 渲染用户标签 */
        for (var i = 0; i < msg.userTags.length; i++) {
            addUserTag(msg.userTags[i]);
        }
        /* 渲染用户评分数据 */
        for (var i = 0; i < msg.userRatingDetails.length; i++) {
            addUserRatingDetail(msg.userRatingDetails[i]);
        }
        var ratingDetailTitleNum = $(".movie-info-container .user-recent .user-recent-title small");
        var newCount = parseInt($(ratingDetailTitleNum).html().split("(")[1].split(")")[0]) + 1;
        $(ratingDetailTitleNum).html("(" + newCount + ")");
        /*  渲染图表 */
        updateChart({
            "xAxis": msg.ratings[0].date,
            "series": msg.ratings[0].rating
        });
    };
    return mdcObj;
})();