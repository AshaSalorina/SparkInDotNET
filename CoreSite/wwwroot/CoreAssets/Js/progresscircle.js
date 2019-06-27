function makesvg(percentage, inner_text) {
    var abs_percentage = Math.abs(percentage * 2).toString();
    var percentage_str = (parseFloat(percentage) / 10).toFixed(1);
    var classes = "";
    if (percentage <= 12) {
        classes = "danger-stroke";
    } else if (percentage > 12 && percentage <= 25) {
        classes = "warning-stroke";
    } else if (percentage > 25 && percentage <= 37) {
        classes = "normal-stroke";
    } else {
        classes = "success-stroke";
    }
    var svg = '<svg class="circle-chart" viewbox="0 0 35.83098862 35.83098862" xmlns="http://www.w3.org/2000/svg">'
        + '<circle class="circle-chart__background" cx="17.9" cy="17.9" r="15.9" />'
        + '<circle class="circle-chart__circle ' + classes + '"'
        + 'stroke-dasharray="' + abs_percentage + ',100"    cx="17.9" cy="17.9" r="15.9" />'
        + '<g class="circle-chart__info">'
        + '   <text class="circle-chart__percent" x="17.9" y="14.5">' + percentage_str + '</text>';
    if (inner_text) {
        svg += '<text class="circle-chart__subline" x="17.91549431" y="23">' + inner_text + '</text>'
    }
    svg += ' </g></svg>';
    return svg
}

(function ($) {
    $.fn.circlechart = function () {
        this.each(function () {
            var percentage = $(this).data("percentage");
            var inner_text = $(this).data("inner");
            $(this).html(makesvg(percentage, inner_text));
        });
        return this;
    };
}(jQuery));