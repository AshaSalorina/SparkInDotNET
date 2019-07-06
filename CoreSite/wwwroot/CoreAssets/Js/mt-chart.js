/**
 * movie 按类型图表初始化
 */
var typeChart = (function () {
    var typeChartObj = {};
    /**
     * 初始化配置模板
     */
    var item = {
        name: '男性平均分',
        type: 'bar',
        barGap: 1.5,
        label: {
            normal: {
                show: true,
                position: 'right',
                color: '#00a4ff',
                fontSize: '100%'
            }
        },
        itemStyle: {
            color: '#4395c7'
        },
        data: [1.6]
    };
    var generateOption = function () {
        return {
            title: {
                show: false
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                show: false,
                orient: 'horizontal',
                top: '0%',
                left: '0%',
                data: ['F', 'M'],
                textStyle: {
                    color: '#fff'
                }
            },
            grid: {
                left: 0,
                top: 0
            },
            toolbox: {
                show: false
            },
            xAxis: {
                show: false,
                type: 'value',
                name: 'rantings'
            },
            yAxis: {
                show: false,
                type: 'category',
                inverse: true,
                data: ['性别'],
            },
            series: []
        };
    };
    var templates = $('#templates');
    var legendElem = $(templates).find('.legend-item')[0];
    /**
     * 初始化图表对象
     */
    var mtChart = {
        "gender": {
            "elem": echarts.init($('#mtChartGender')[0]),
            "legend": $('#mtChartSexLegend')
        },
        "type": {
            "elem": echarts.init($('#mtChartType')[0]),
            "legend": $('#mtChartTypeLegend')
        }
    };

    /**
     * 生成节点
     */
    function createLenged(name, color) {
        var lenged = legendElem.cloneNode(true);
        $(lenged).find('.legend-item-color')[0].style.backgroundColor = color;
        $(lenged).find('.legend-item-title')[0].innerHTML = name;
    }

    function generateData(name, color, data) {
        var config = JSON.parse(JSON.stringify(item));
        config.name = name;
        config.itemStyle.color = color;
        config.data = data;
        return config;
    }

    /**
     * 渲染按性别平均分
     * @param dataSet
     */
    typeChartObj.initGender = function (dataSet) {
        var mtChartGenderOption = generateOption();
        // y轴名称
        mtChartGenderOption.yAxis.data = ['按性别'];
        // 提示信息名称
        mtChartGenderOption.legend.data = ['女性', '男性'];
        // 图表高度
        mtChartGenderOption.grid.height = '100%';

        mtChartGenderOption.series = [];
        mtChartGenderOption.series.push(generateData('女性', '#ff87ad', [dataSet.female]));
        mtChartGenderOption.series.push(generateData('男性', '#4395c7', [dataSet.men]));
        $(mtChart.gender.legend).append(createLenged('女性', '#ff87ad'));
        $(mtChart.gender.legend).append(createLenged('男性', '#4395c7'));
        mtChart.gender.elem.setOption(mtChartGenderOption);
    };
    /**
     * 渲染按类型平均分 - type
     */
    typeChartObj.initType = function (dataSet) {
        var mtChartTypeOption = generateOption();
        var typeColors = ["#60acfc", "#32d3eb", "#5bc49f", "#feb64d", "#ff7c7c", "#9287e7"];
        mtChartTypeOption.yAxis.data = ['按类型'];
        mtChartTypeOption.legend.data = [];
        mtChartTypeOption.grid.height = '100%';
        mtChartTypeOption.series = [];
        for (var i = 0; i < dataSet.length; i++) {
            mtChartTypeOption.series.push(generateData(dataSet[i].name, typeColors[i], [dataSet[i].rating]));
            $(mtChart.type.legend).append(createLenged(dataSet[i].name, typeColors[i]));
            mtChartTypeOption.legend.data.push(dataSet[i].name);
        }
        mtChart.type.elem.setOption(mtChartTypeOption);
    };
    /**
     * 刷新窗口大小的时候，重置图表大小
     */
    window.addEventListener("resize", () => {
        mtChart.gender.elem.resize();
        mtChart.type.elem.resize();
    });
    return typeChartObj;
})();

