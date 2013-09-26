/**
 * 支付宝支付模块公用函数
 * 详细：支付宝模块所使用的各种公用函数定义
 * 版本：1.0
 * 日期：2013-08-06
 * 说明：
 */

var qs = require('querystring');
var fs = require('fs');

/**
 * 把对象所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
 * @param params 需要拼接的对象
 * return 拼接完成以后的字符串
 */
exports.createLinkString = function(params) {
    var ls = '';
    for(var k in params) {
        ls += (k + '=' + params[k] + '&');
    }
    return ls.substring(0, ls.length - 2);
};

/**
 * 把对象所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串，并对字符串做Urlencode编码
 * @param params 需要拼接的对象
 * return 拼接完成以后的字符串
 */
exports.createLinkStringWithUrlencode = function(params) {
    return qs.stringify(params);
};

/**
 * 移除参数对象中的空值和不参与签名的参数
 * @param {JSON} params 接收到的参数对象
 * @param {Array} excepts 不参与签名的属性字符串数组, 默认为[]
 * @param {Boolean} allowempty 是否允许空值(即是否不过滤空值)，默认为false
 * @return {JSON} 处理后的新签名参对象
 */
exports.doParamFilter = function(params, excepts, allowempty) {
    excepts = excepts || [];
    allowempty = allowempty || false;
    
    var param_filter = {};
    for (var k in params) {
        if ( ((!allowempty) && (params[k] === '')) || ~excepts.indexOf(k) ) {
            continue;
        } else {
            param_filter[k] = params[k];
        }
    }
    return param_filter;
};

/**
 * 对对象排序
 * @param {JSON} param 排序前的对象
 * @return {JSON} 排序后的对象
 */
exports.doArgSort = function(param) {
    var result = {};
    var keys = Object.keys(param).sort();
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        result[k] = param[k];
    }
    return result;
};
