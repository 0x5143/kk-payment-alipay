/**
 * 类名：AlipaySubmit
 * 功能：支付宝各接口请求提交接口
 * 详细：构造支付宝各接口请求表单，获取远程HTTP数据
 * 版本：1.0
 * 日期：2013-08-06
 * 说明：
 */

var core = require('./core.func');
var md5 = require('./md5.func');
var DOMParser = require('xmldom').DOMParser;
var http = require('http');

function AlipaySubmit(conf) {
    this.kAlipayGatewayUrl = 'https://mapi.alipay.com/gateway.do?';
    this.conf = conf;
}

/**
 * 生成签名结果
 * @param {Array} param_sort 已排序要签名的数组
 * @return {String} 签名结果字符串
 */
AlipaySubmit.prototype.buildRequestSign = function(param_sort) {
    //把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
    var prestr = core.createLinkString(param_sort);
    
    var sign_type = this.conf.sign_type.trim().toUpperCase();
    return (sign_type === 'MD5') ? md5.md5Sign(prestr, sign, this.conf.key) : '';
};

/**
 * 生成要请求支付宝的参数数组
 * @param {JSON} params 请求前的参数数组
 * @return {Array} 要请求的参数数组
 */
AlipaySubmit.prototype.buildRequestParam = function(params) {
    //除去待签名参数数组中的空值和签名参数
    var param_filter = core.paramFilter(params);
    
    //对待签名参数数组排序
    var param_sort = core.argSort(param_filter);
    
    //生成签名结果
    var mysign = this.buildRequestSign(param_sort);
    
    //签名结果与签名方式加入请求提交参数数组中
    param_sort.sign = mysign;
    param_sort.sign_type = this.conf.sign_type.trim().toUpperCase();
    
    return param_sort;
};

/**
 * 生成要请求给支付宝的参数数组
 * @param {Object} params 请求前的参数数组
 * @return {String} 要请求的参数数组字符串
 */
AlipaySubmit.prototype.buildRequestParamToString = function(params) {
    var param_sort = this.buildRequestParam(params);
    
    var request_data = core.createLinkStringWithUrlencode(param_sort);
    
    return request_data;
};

/**
 * 建立请求，以模拟远程HTTP的POST请求方式构造并获取支付宝的处理结果
 * @param {JSON} params 请求参数
 * @return {Object} 支付宝处理结果
 */
AlipaySubmit.prototype.buildRequestHttp = function(params, callback) {
    var request_data = this.buildRequestParam(params);
    core.getHttpResponseWithPost(this.kAlipayGatewayUrl, this.conf.cacert, request_data, this.conf.input_charset.toLowerCase().trim(), callback);
};

/**
 * 建立请求，以模拟远程HTTP的POST请求方式构造并获取支付宝的处理结果(带文件上传功能)
 * @param {JSON} params 请求参数
 * @param {String} file_param_name 文件类型的参数名
 * @param {String} file_name 文件完整绝对路径
 * @return {Object} 支付宝处理结果
 */
AlipaySubmit.prototype.buildRequestHttp = function(params, file_param_name, file_name, callback) {
    var request_data = this.buildRequestParam(params);
    request_data[file_param_name] = '@' + file_name;
    
    core.getHttpResponseWithPost(this.kAlipayGatewayUrl, this.conf.cacert, request_data, this.conf.input_charset.toLowerCase().trim(), callback);
};

/**
 * 用于防钓鱼，调用接口query_timestamp来获取时间戳的处理函数
 * 注意：该功能PHP5环境及以上支持，因此必须服务器、本地电脑中装有支持DOMDocument、SSL的PHP配置环境。建议本地调试时使用PHP开发软件
 * @return {String} 时间戳字符串 
 */
AlipaySubmit.prototype.queryTimestamp = function(callback) {
    var url = this.kAlipayGatewayUrl + 'service=query_timestamp&partner=' + this.conf.partner.toLowerCase().trim();
    
    http.get(url, function(res) {
        var responseText = '';
        res.on('data', function(chunk) {
            
        });
        res.on('end', function() {
            var doc = new DOMParser().parseFromString(responseText);
            var item = doc.getElementsByTagName('encrypt_key');
            var encrypt_key = item.item(0);
            callback && callback(encrypt_key);
        });
    });
};

exports.AlipaySubmit = AlipaySubmit;
