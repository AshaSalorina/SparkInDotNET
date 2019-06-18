var app = new Vue({
    el: '#app',
    data: {
        message: '我爱电影 -  Vue 标题实例!'
    }
});

// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('echartsTest'));

// 指定图表的配置项和数据
var option = {
    title: {
        text: 'ECharts 示例'
    },
    tooltip: {},
    legend: {
        data:['销量']
    },
    xAxis: {
        data: ["哆啦A梦","简单爱","余罪","神奇动物","哈利波特","冰雪奇缘"]
    },
    yAxis: {},
    series: [{
        name: '票房',
        type: 'bar',
        data: [500, 208, 3770, 170, 810, 4660]
    }]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);