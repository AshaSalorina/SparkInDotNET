(function () {
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
    /**
     * 初始化配置
     */
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
    var templates = document.getElementById('templates');
    var legendElem = templates.getElementsByClassName('legend-item')[0];
    /**
     * 渲染图表 - sex
     */
    var mtChartGenderElem = document.getElementById('mtChartGender');
    var mtChartSexLegend = document.getElementById('mtChartSexLegend');
    var mtChartGender = echarts.init(mtChartGenderElem);
    var mtChartGenderOption = generateOption();
    mtChartGenderOption.yAxis.data = ['按性别'];
    mtChartGenderOption.legend.data = ['女性', '男性'];
    mtChartGenderOption.grid.height = '100%';
    mtChartGenderOption.series = [];
    mtChartGenderOption.series.push(JSON.parse(JSON.stringify(item)));
    mtChartGenderOption.series[0].name = '女性';
    mtChartGenderOption.series[0].itemStyle.color = '#ff87ad';
    mtChartGenderOption.series[0].data = [3.8];
    var lenged = legendElem.cloneNode(true);
    lenged.getElementsByClassName('legend-item-color')[0].style.backgroundColor = '#ff87ad';
    lenged.getElementsByClassName('legend-item-title')[0].innerHTML = '女性';
    mtChartSexLegend.appendChild(lenged);
    mtChartGenderOption.series.push(JSON.parse(JSON.stringify(item)));
    mtChartGenderOption.series[1].name = '男性';
    mtChartGenderOption.series[1].itemStyle.color = '#4395c7';
    mtChartGenderOption.series[1].data = [2.6];
    lenged = legendElem.cloneNode(true);
    lenged.getElementsByClassName('legend-item-color')[0].style.backgroundColor = '#4395c7';
    lenged.getElementsByClassName('legend-item-title')[0].innerHTML = '男性';
    mtChartSexLegend.appendChild(lenged);
    mtChartGender.setOption(mtChartGenderOption);
    /**
     * 渲染图表 - type
     */
    var mtChartTypeElem = document.getElementById('mtChartType');
    var mtChartTypeLegend = document.getElementById('mtChartTypeLegend');
    var mtChartType = echarts.init(mtChartTypeElem);
    var mtChartTypeOption = generateOption();
    var typeColors = ["#60acfc", "#32d3eb", "#5bc49f", "#feb64d", "#ff7c7c", "#9287e7"];
    var typeNames = ["Adventure", "Animation", "Children", "Comedy", "Fantasy", "Romance"];
    var typeDatas = [5.0, 4.6, 3.8, 3.6, 2.8, 2.1];
    mtChartTypeOption.yAxis.data = ['按类型'];
    mtChartTypeOption.legend.data = ["Adventure", "Animation", "Children", "Comedy", "Fantasy", "Romance"];
    mtChartTypeOption.grid.height = '100%';
    mtChartTypeOption.series = [];
    for (var i = 0; i < typeNames.length; i++) {
        mtChartTypeOption.series.push(JSON.parse(JSON.stringify(item)));
        mtChartTypeOption.series[i].name = typeNames[i];
        mtChartTypeOption.series[i].itemStyle.color = typeColors[i];
        mtChartTypeOption.series[i].data = [typeDatas[i]];
        lenged = legendElem.cloneNode(true);
        lenged.getElementsByClassName('legend-item-color')[0].style.backgroundColor = typeColors[i];
        lenged.getElementsByClassName('legend-item-title')[0].innerHTML = typeNames[i];
        mtChartTypeLegend.appendChild(lenged);
    }
    mtChartType.setOption(mtChartTypeOption);

    /**
     * window重置分析
     */
    window.addEventListener("resize", () => {
        mtChartGender.resize();
        mtChartType.resize();

    });
})();
