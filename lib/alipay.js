
var AlipayNotify = require('./notify.class').AlipayNotify;
var AlipaySubmit = require('./submit.class').AlipaySubmit;

var assert = require('assert');
var url = require('url');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var DOMParser = require('xmldom').DOMParser;

var kDefaultAlipayConfig = {
    partner : '', //合作身份者id，以2088开头的16位纯数字
    key : '', //安全检验码，以数字和字母组成的32位字符
    seller_email : '', //
    host : 'http://localhost:3000', //域名
    cacert : 'cacert.pem', //ca证书路径地址, 用于curl中ssl校验，请保证cacert.pem文件在当前文件夹目录中
    transport : 'http', //访问模式，根据自己的服务器是否支持ssl访问，若支持请选择https; 若不支持请选择http
    input_charset : 'utf-8', //字符编码格式，目前支持gbk或utf-8
    sign_type : 'MD5' //签名方式 不需修改
};

function Alipay(conf) {
    EventEmitter.call(this);
    
    //default config
    this.conf = kDefaultAlipayConfig;
    //config merge
    for (var k in conf) {
        this.conf[k] = conf[k];
    }
}

util.inherits(Alipay, EventEmitter);

/**
 * 路由服务商各通知请求
 * @param {String} remoteip 服务商请求远程地址
 * @param {String} reqdata 服务商请求内容
 * @param {Function} callback 返回给服务商数据的回调函数，接收一个字符串参数
 * @param {Function} endcb 返回给逻辑层的回调函数，接收一个布尔值及其它附加参数
 */
Alipay.prototype.route = function(remoteip, requrl, reqdata, callback, endcb) {
    if (requrl === '/alipay/notify') {
        this.doOrderCompleted(remoteip, reqdata, callback, endcb);
    }
};

/**
 * 接收到服务商订单完成通知请求
 * @param {String} remoteip 服务商请求远程地址
 * @param {String} reqdata 服务商请求内容
 * @param {Function} callback 返回给服务商数据的回调函数，接收一个字符串参数
 * @param {Function} endcb 返回给逻辑层的回调函数，接收一个布尔值及其它附加参数
 */
Alipay.prototype.doOrderCompleted = function(remoteip, reqdata, callback, endcb) {
    
};


/**
 * 支付宝即时到账交易接口
 */
Alipay.prototype.create_direct_pay_by_user = function(req, res) {
    assert.ok(req.out_trade_no && req.subject && req.total_fee);
    
    //建立请求
    var submit = new AlipaySubmit(this.conf);
    
    var parameters = {
        service : 'create_direct_pay_by_user',
        partner : this.conf.partner,
        payment_type : '1', //支付类型
    };
};
