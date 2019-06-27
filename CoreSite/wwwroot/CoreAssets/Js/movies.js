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
                movieControllerObj.loadPage();
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
        var mContainer = $(".movies-container");
        var moviesList = $("#moviesList");
        /*==========模拟载入数据===========*/
        /*加异步锁*/
        movieControllerObj.loadLock = true;
        for (var i = 0; i < 4; i++) {
            var itemTemplate = $("#templates .movie-item").clone(true);
            var imgs = ["Action", "Adventure", "Animation", "Children", "Children‘s",
                "Comedy", "Crime", "Documentary", "Drama", "Fantasy", "Film-Noir",
                "FilmNoir", "Horror", "Musical", "Mystery", "None", "Romance",
                "Sci-Fi", "SciFi", "Thriller", "War", "Western"];
            var rand = Math.random();
            var randInt = parseInt(rand * imgs.length);
            $(itemTemplate).find("img").attr("src", "CoreAssets/Images/Movies/" + imgs[randInt] + ".jpg");
            $(itemTemplate).find(".circle-chart").attr("data-percentage", parseInt(Math.random() * 50));
            $(itemTemplate).find(".circle-chart").circlechart();
            var movieTypeTags = $(itemTemplate).find(".movie-type-tags");
            for (var j = 0; j < parseInt(Math.random() * 4) + 1; j++) {
                var movieTag = $("<div class=\"movie-tag\"></div>");
                $(movieTag).html(imgs[parseInt(imgs.length * Math.random())]);
                $(movieTypeTags).append(movieTag);
            }
            $(mContainer).append(itemTemplate);
        }
        movieControllerObj.loadLock = false;
        movieControllerObj.resizeMovieContainer();
        $(moviesList).scrollLeft(movieControllerObj.oldSLeft);
        /*==========模拟结束===========*/
    };

    movieControllerObj.init = (function () {
        movieScrollListenerInit();
        wheelRollerListener();
    })();
    return movieControllerObj;
})();

/**
 * 初始化函数
 */
$(function () {
    var initMovieContainer = (function () {
        movieController.loadPage();
    })();
});