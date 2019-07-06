/**
 * 音效播放器
 */
var rawPlayer = (function () {
    var rawPlayerObj = {};
    rawPlayerObj.playSound = function (soundName) {
        var audioElem = $("#sound-" + soundName)[0];
        if (audioElem.readyState === 4) {
            audioElem.currentTime = 0;
            audioElem.play();
        }
    };
    return rawPlayerObj;
})();

var inputController = (function () {
    var inputControlObj = {};
    var radiosMap = {};

    /**
     * 可以获得元素，根绝selector或者就是值
     * @param selector
     */
    function getNumber(selector) {
        var num = 0.0;
        if (selector.indexOf("#") > -1) {
            num = parseFloat($(selector).val());
        } else {
            num = parseFloat(selector);
        }
        return num;
    }

    /**
     * 为input增加0.1 number
     * @param input
     */
    function addNumber(input) {
        var numberSource = getNumber($(input).val());
        var numberMax = getNumber($(input).attr("data-max"));
        numberMax = isNaN(numberMax) ? 99999999.0 : numberMax;
        var numberStep = getNumber($(input).attr("data-step"));
        numberStep = isNaN(numberStep) ? 1 : numberStep;
        var numberFixed = parseInt($(input).attr("data-fixed"));
        numberFixed = isNaN(numberFixed) ? 0 : numberFixed;
        if (isNaN(numberSource)) {
            numberSource = 0.0;
        }
        numberSource += numberStep;
        if (numberSource > numberMax) {
            numberSource = numberMax;
        }
        $(input).val(numberSource.toFixed(numberFixed));
    }

    /**
     * 为input减少0.1 number
     * @param input
     */
    function decNumber(input) {
        var numberSource = getNumber($(input).val());
        var numberMin = getNumber($(input).attr("data-min"));
        numberMin = isNaN(numberMin) ? -99999999.0 : numberMin;
        var numberStep = getNumber($(input).attr("data-step"));
        numberStep = isNaN(numberStep) ? 1 : numberStep;
        var numberFixed = parseInt($(input).attr("data-fixed"));
        numberFixed = isNaN(numberFixed) ? 0 : numberFixed;
        if (isNaN(numberSource)) {
            numberSource = 0.0;
        }
        numberSource -= numberStep;
        if (numberSource < numberMin) {
            numberSource = numberMin;
        }
        $(input).val(numberSource.toFixed(numberFixed));
    }

    /**
     * 判断number是否越界
     * @param input
     */
    function checkNumber(input) {
        var numberSource = getNumber($(input).val());
        var numberMax = getNumber($(input).attr("data-max"));
        numberMax = isNaN(numberMax) ? 99999999.0 : numberMax;
        var numberMin = getNumber($(input).attr("data-min"));
        numberMin = isNaN(numberMin) ? -99999999.0 : numberMin;
        var numberFixed = parseInt($(input).attr("data-fixed"));
        numberFixed = isNaN(numberFixed) ? 0 : numberFixed;
        if (numberSource < numberMin) {
            numberSource = numberMin;
        }
        if (numberSource > numberMax) {
            numberSource = numberMax;
        }
        $(input).val(numberSource.toFixed(numberFixed));
    }

    /**
     * 选择一个list中的所有元素
     * @param radioList
     */
    function radioSelectAll(radioList) {
        for (var i = 0; i < radioList.length; i++) {
            var radioElem = radioList[i];
            var isDisable = !!$(radioElem).attr("data-disable");
            if (isDisable) continue;
            $(radioElem).attr("data-selected", "true");
        }
    }

    /**
     * 取消选择一个list中的所有元素
     * @param radioList
     */
    function radioDisSelectAll(radioList) {
        for (var i = 0; i < radioList.length; i++) {
            var radioElem = radioList[i];
            var isDisable = !!$(radioElem).attr("data-disable");
            if (isDisable) continue;
            $(radioElem).removeAttr("data-selected");
        }
    }

    /**
     * 获取ALLBtn的元素
     * @param radioList
     */
    function radioGetAllBtn(radioList) {
        for (var i = 0; i < radioList.length; i++) {
            var radioElem = radioList[i];
            if ($(radioElem).hasClass("radio-all")) {
                return radioElem;
            }
        }
        return null;
    }

    /**
     * 是否有选中元素
     * @param radioList
     */
    function radioHasSelect(radioList) {
        for (var i = 0; i < radioList.length; i++) {
            var radioElem = radioList[i];
            if (!!$(radioElem).attr("data-selected")) {
                return true;
            }
        }
        return false;
    }

    /**
     * 选择Radio元素的事件
     * @param thisElem
     * @param group
     * @param isAllBtn
     * @param isSelect
     * @param radioList
     */
    function radioSelect(thisElem, group, isAllBtn, isSelect, radioList) {
        if (isAllBtn) {
            if (isSelect) {
                radioSelectAll(radioList);
                $(thisElem).removeAttr("data-selected");
            } else {
                radioDisSelectAll(radioList);
                $(thisElem).attr("data-selected", "true");
            }
            rawPlayer.playSound("click");
        } else {
            var allBnt = radioGetAllBtn(radioList);
            if (isSelect) {
                $(thisElem).removeAttr("data-selected");
                if (!radioHasSelect(radioList)) {
                    $(allBnt).attr("data-selected", "true");
                }
            } else {
                $(thisElem).attr("data-selected", "true");
                if (allBnt !== null) {
                    $(allBnt).removeAttr("data-selected");
                }
            }
            rawPlayer.playSound("hover");
        }
    }

    var addClickListener = function () {
        $(".number-input .up-number-btn").click(function () {
            var numberInput = $(this).parent().find("input")[0];
            addNumber(numberInput);
            rawPlayer.playSound("hover");
        });
        $(".number-input .down-number-btn").click(function () {
            var numberInput = $(this).parent().find("input")[0];
            decNumber(numberInput);
            rawPlayer.playSound("hover");
        });
        $(".radio-group .input-control-btn").click(function () {
            var group = $(this).attr("data-group");
            var isAllBtn = $(this).hasClass("radio-all");
            var isSelect = !!$(this).attr("data-selected");
            var radioList = radiosMap[group];
            radioSelect(this, group, isAllBtn, isSelect, radioList);
        });
        $(".text-input input").focus(function () {
            rawPlayer.playSound("hover3");
        }).blur(function () {
            rawPlayer.playSound("hover3");
        });
    };
    var addChangeListener = function () {
        $(".number-input input").change(function () {
            var numberInput = $(this).parent().find("input")[0];
            checkNumber(numberInput);
            rawPlayer.playSound("hover");
        });
    };
    /**
     * 载入所有radio btn
     */
    var loadRadios = function () {
        var radios = $(".radio-group").find(".input-control-btn");
        for (var i = 0; i < radios.length; i++) {
            var radio = radios[i];
            var rGroup = $(radio).attr("data-group");
            if (radiosMap[rGroup] === undefined || radiosMap[rGroup] === null) {
                radiosMap[rGroup] = [];
            }
            radiosMap[rGroup].push(radio);
        }
    };
    /**
     * 获取选择情况
     */
    inputControlObj.getRadioSelectList = function () {
        var radios = $(".radio-group").find(".input-control-btn");
        var allBtn = radioGetAllBtn(radios);
        /**
         * 如果全选，则不返回任何值
         */
        if ($(allBtn)[0].hasAttribute("data-selected")) {
            return [];
        }
        var selectList = [];
        for (var i = 0; i < radios.length; i++) {
            var elem = $(radios[i]);
            if ($(elem).hasClass("radio-all")) {
                continue;
            }
            if ($(elem)[0].hasAttribute("data-disable")) {
                continue;
            }
            if ($(elem)[0].hasAttribute("data-selected")) {
                selectList.push($(elem).attr("data-value"));
            }
        }
        return selectList;
    };
    /**
     * 初始化
     */
    inputControlObj.init = function () {
        addClickListener();
        addChangeListener();
        loadRadios();
    };
    return inputControlObj;
})();
/**
 * 封装请求方法
 */
var socketController = (function () {
    var socketControllerObj = {};
    var user = returnCitySN["cip"];
    socketControllerObj.connection = null;
    socketControllerObj.initConnect = function (startCallBack) {
        socketControllerObj.connection = new signalR.HubConnectionBuilder().withUrl("/sparkMovie").build();
        socketControllerObj.connection.start().then(function () {
            startCallBack();
        }).catch(function (err) {
            return console.error(err.toString());
        });
    };
    socketControllerObj.invoke = function (method, message) {
        socketControllerObj.connection.invoke(method, user, JSON.stringify(message)).catch(function (err) {
            return console.error(err.toString());
        });
    };
    socketControllerObj.on = function (method, callBack) {
        socketControllerObj.connection.on(method, function (code, info, message) {
            console.log("===========请求返回数据===============");
            console.log(message);
            console.log("================END====================");
            callBack(message);
        });
    };
    return socketControllerObj;
})();
/**
 *
 * @param name
 * @returns {*}
 * @constructor
 */
var getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};