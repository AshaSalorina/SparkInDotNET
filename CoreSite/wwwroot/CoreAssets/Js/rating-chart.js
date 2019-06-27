/**
 * movie 按类型图表初始化
 */
(function () {
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
                        '2019-06-22 14:00', '2019-06-22 00:00', '2019-06-22 16:00',
                        '2019-06-22 17:00', '2019-06-23 00:00', '2019-06-23 19:00'
                    ].map(function (str) {
                        var strMap = str.split(' ');
                        if (strMap[1] === "00:00")
                            return strMap[0];
                        else
                            return strMap[1];
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
    /**
     * 渲染图表 - sex
     */
    var movieRatingElem = document.getElementById('movieRatingChart');
    var movieRatingChart = echarts.init(movieRatingElem);
    var movieRatingOption = generateOption();
    movieRatingChart.setOption(movieRatingOption);

    /**
     * window重置分析
     */
    window.addEventListener("resize", () => {
        movieRatingChart.resize();
    });
})();
