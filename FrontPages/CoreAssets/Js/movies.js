/**
 * 电影列表控制器
 */
var movieController = (function () {
    var movieControllerObj = {};
    /**
     * 加载锁 锁定后不能进行页面载入操作
     * @type {boolean}
     */
    movieControllerObj.loadLock = false;
    movieControllerObj.oldSLeft = 0;
    movieControllerObj.filmData = null;
    movieControllerObj.pageNo = 1;

    /**
     * 横向滚动
     */
    var wheelRollerListener = function () {
        var element = $("#moviesList")[0];
        element.addEventListener('DOMMouseScroll', handler, false);
        element.addEventListener('mousewheel', handler, false);
        var mItem = $(".movie-item")[0];
        var itemW = $(mItem).width();  //一个电影元素宽度
        function handler(event) {
            var detail = event.wheelDelta || event.detail;
            var moveForwardStep = 1;
            var moveBackStep = -1;
            var step = 0;
            if (detail > 0) {
                step = moveForwardStep * itemW;
            } else {
                step = moveBackStep * itemW;
            }
            element.scrollLeft -= step;
        }
    };
    /**
     * 滚动监听初始化
     */
    var movieScrollListenerInit = function () {
        $("#moviesList").scroll(function () {
            var moviesList = $("#moviesList");
            var mContainer = $(".movies-container");
            var mItem = $(".movie-item")[0];
            var scroW = $(moviesList).scrollLeft();  //滚动左边距
            var viewW = $(moviesList).width();  //可见宽度
            var contentW = $(mContainer).width();  //内容宽度
            var itemW = $(mItem).width();  //一个电影元素宽度
            if (contentW - scroW - viewW < itemW) {
                movieControllerObj.oldSLeft = scroW;
                movieSocketSender.pageRequestSend();
            }
        });
    };
    /**
     * 重新刷新电影列表宽度
     */
    movieControllerObj.resizeMovieContainer = function () {
        var mContainer = $(".movies-container");
        var size = $(mContainer).children(".movie-item").length;
        $(mContainer).css("width", (size * 17) + "vw");
    };
    /**
     * 动态加载一页元素
     */
    movieControllerObj.loadPage = function () {
        if (movieControllerObj.loadLock) {
            return false;
        }
        /*加异步锁*/
        movieController.loadLock = true;
        var mContainer = $(".movies-container");
        var moviesList = $("#moviesList");
        /* 初始化变量 */
        for (var i = 0; i < movieControllerObj.filmData.length; i++) {
            var filmDetail = movieControllerObj.filmData[i];
            var filmNameSplit = filmDetail.movieName.split("(");
            var filmName = filmNameSplit[0];
            var filmYear = filmNameSplit[1].split(")")[0];
            var filmId = filmDetail.movieId;
            var filmRating = filmDetail.rating;
            var filmType = filmDetail.movieType.split("/");
            var itemTemplate = $("#templates .movie-item").clone(true);
            $(itemTemplate).find("img").attr("src", "CoreAssets/Images/Movies/" + filmType[0] + ".jpg");
            $(itemTemplate).find(".circle-chart").attr("data-percentage", parseInt(filmRating * 10));
            $(itemTemplate).find(".circle-chart").circlechart();
            $(itemTemplate).find(".movie-title").html(filmName);
            $(itemTemplate).find(".movie-era").html("(" + filmYear + ")");
            var movieTypeTags = $(itemTemplate).find(".movie-type-tags");
            for (var j = 0; j < filmType.length; j++) {
                var movieTag = $("<div class=\"movie-tag\"></div>");
                $(movieTag).html(filmType[j]);
                $(movieTypeTags).append(movieTag);
            }
            $(itemTemplate).attr("data-id", filmId);
            $(itemTemplate).click(function () {
                window.open("movieDetail.html?movieId=" + $(this).attr("data-id"));
            });
            $(mContainer).append(itemTemplate);
        }
        movieControllerObj.resizeMovieContainer();
        $(moviesList).scrollLeft(movieControllerObj.oldSLeft);
    };
    movieControllerObj.setFilmData = function (filmData) {
        movieControllerObj.filmData = filmData;
    };
    movieControllerObj.init = (function () {
        movieScrollListenerInit();
        wheelRollerListener();
    })();
    return movieControllerObj;
})();