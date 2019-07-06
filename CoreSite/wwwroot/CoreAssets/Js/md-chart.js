/**
 * movie 每日数据图表初始化
 */
/**
 * 初始化配置
 */

var dailyChart = (function () {
    var dailyChartObj = {};
    /**
     * 初始化配置模板
     */
    var generateOption = function (datas, colors, ratings) {
        return {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} 分"
            },
            grid: {
                top: 0,
                left: 0
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y: 'center',
                align: 'left',
                data: datas,
                itemWidth: 12,
                itemHeight: 4,
                padding: [0, 20, 0, 0],
                textStyle: {
                    fontSize: '80%',
                    color: '#59baf2',
                    padding: [0, 0, 0, 10]
                },
                formatter: function (name) {
                    return name + "  " + ratings[name] + "分";
                }
            }, title: {
                text: "今日",
                left: "23%",
                top: "44%",
                textStyle: {
                    color: "#59baf2",
                    fontSize: '100%',
                    align: "center",
                    textAlign: "center"
                }
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['55%', '70%'],
                    center: ['30%', '50%'],
                    avoidLabelOverlap: false,
                    stillShowZeroSum: false,
                    itemStyle: {
                        borderWidth: 1,
                        borderColor: '#397c7e'
                    },
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        {value: ratings[datas[0]], name: datas[0], itemStyle: {color: colors[0]}},
                        {value: ratings[datas[1]], name: datas[1], itemStyle: {color: colors[1]}},
                        {value: ratings[datas[2]], name: datas[2], itemStyle: {color: colors[2]}},
                        {value: ratings[datas[3]], name: datas[3], itemStyle: {color: colors[3]}},
                        {value: ratings[datas[4]], name: datas[4], itemStyle: {color: colors[4]}}
                    ]
                }
            ]
        };
    };
    /**
     * 初始化图表对象
     */
    var mdChart = {
        "occupation": {
            "elem": echarts.init($('#mdOccupationInfo')[0])
        },
        "area": {
            "elem": echarts.init($('#mdAreaInfo')[0])
        }
    };
    /**
     * 图表初始化
     */
    dailyChartObj.initOccupation = function (dataSet) {
        var colors = ['#00e4ff', '#51eac4', '#00ff7e', '#1efe3b', '#96ff00'];
        var datas = [];
        var ratings = {};
        for (var i = 0; i < dataSet.length; i++) {
            datas.push(dataSet[i].name);
            ratings[datas[i]] = dataSet[i].rating;
        }
        var mdOccupationOption = generateOption(datas, colors, ratings);
        mdOccupationOption.title.text = '职业';
        mdOccupationOption.series[0].name = '职业平均分';
        mdChart.occupation.elem.setOption(mdOccupationOption);
    };
    dailyChartObj.initArea = function (dataSet) {
        var colors = ['#04e0f9', '#0096ff', '#006cff', '#0041fb', '#4D18E8'];
        var datas = [];
        var ratings = {};
        for (var i = 0; i < dataSet.length; i++) {
            datas.push(dataSet[i].name);
            ratings[datas[i]] = dataSet[i].rating;
        }
        var mdAreaOption = generateOption(datas, colors, ratings);
        mdAreaOption.title.text = '地区';
        mdAreaOption.series[0].name = '地区平均分';
        mdChart.area.elem.setOption(mdAreaOption);
    };
    var init = (function () {
        dailyChartObj.initOccupation([
            {
                "name": "Doctor",
                "rating": 3.25
            }, {
                "name": "Computer",
                "rating": 2.25
            }, {
                "name": "Science",
                "rating": 1.36
            }, {
                "name": "Cosmos",
                "rating": 3.33
            }, {
                "name": "Dentist",
                "rating": 4.55
            }
        ]);
        dailyChartObj.initArea([
            {
                "name": "ChengDu",
                "rating": 4.3
            }, {
                "name": "BeiJing",
                "rating": 3.66
            }, {
                "name": "ShangHai",
                "rating": 4.12
            }, {
                "name": "ShenZhen",
                "rating": 3.21
            }, {
                "name": "HaiNan",
                "rating": 2.55
            }
        ]);
    })();
    /**
     * window重置分析
     */
    window.addEventListener("resize", () => {
        mdChart.area.elem.resize();
        mdChart.area.elem.resize();
    });
    return dailyChartObj;
})();
