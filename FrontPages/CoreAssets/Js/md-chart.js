/**
 * movie 每日数据图表初始化
 */
(function () {
    /**
     * 初始化配置
     */
    var datas =[];
    var colors = [];
    var counts = {};
    /* 测试用的数据 */
    function generateTestData() {
        datas.forEach(function (value, i) {
            counts[datas[i]] = i*0.5 + parseInt(Math.random() * 4);
        });
    }
    var generateOption = function () {
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
                    return name + "  " + counts[name] + "分";
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
                        {value: counts[datas[0]], name: datas[0], itemStyle: {color: colors[0]}},
                        {value: counts[datas[1]], name: datas[1], itemStyle: {color: colors[1]}},
                        {value: counts[datas[2]], name: datas[2], itemStyle: {color: colors[2]}},
                        {value: counts[datas[3]], name: datas[3], itemStyle: {color: colors[3]}},
                        {value: counts[datas[4]], name: datas[4], itemStyle: {color: colors[4]}}
                    ]
                }
            ]
        };
    };
    /**
     * 渲染图表 - mdTodayInfo
     */
    var mdOccupationInfo = document.getElementById('mdOccupationInfo');
    datas = ['医生', '律师', '程序员', '服务员', '工程师'];
    //生成测试数据
    generateTestData();
    colors = ['#00e4ff', '#51eac4', '#00ff7e', '#1efe3b', '#96ff00'];
    var mdOccupationCharts = echarts.init(mdOccupationInfo);
    var mdOccupationOption = generateOption();
    mdOccupationOption.title.text = '职业';
    mdOccupationOption.series[0].name = '职业平均分';
    mdOccupationCharts.setOption(mdOccupationOption);
    /**
     * 渲染图表 - mdTodayInfo
     */
    var mdAreaInfo = document.getElementById('mdAreaInfo');
    datas = ['成都', '北京', '天津', '南京', '杭州'];
    //生成测试数据
    generateTestData();
    colors = ['#04e0f9', '#0096ff', '#006cff', '#0041fb', '#4D18E8'];
    var mdAreaCharts = echarts.init(mdAreaInfo);
    var mdAreaOption = generateOption();
    mdAreaOption.title.text = '地区';
    mdAreaOption.series[0].name = '地区平均分';
    mdAreaCharts.setOption(mdAreaOption);

    /**
     * window重置分析
     */
    window.addEventListener("resize", () => {
        mdOccupationCharts.resize();
        mdAreaCharts.resize();
    });
})();
