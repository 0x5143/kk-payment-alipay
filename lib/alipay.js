
var qs = require('querystring');

var AlipayNotify = require('./notify.class');


var kDefaultAlipayConfig = {
    partner : '2088xxxxxxxxxxxx', //合作身份者id，以2088开头的16位纯数字
    secret : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', //安全检验码，以数字和字母组成的32位字符
    seller_email : 'xxx@xxx.xxx' //卖家邮件地址
};

function Alipay(conf) {
    //default config
    this.conf = kDefaultAlipayConfig;
    //config merge
    for (var k in conf) {
        this.conf[k] = conf[k];
    }
    
    this.notify = new AlipayNotify(this.conf);
}

module.exports = Alipay;

/**
 * 接收到支付平台的订单完成通知请求
 * @param {String} remoteip 服务商请求远程地址
 * @param {String|JSON} reqdata 服务商请求内容
 * @param {Function} callback 校验完成回调函数
 */
Alipay.prototype.doOrderNotifyVerify = function(remoteip, reqdata, callback) {
    var reqjson = (typeof reqdata == 'string') ? qs.parse(reqdata) : reqdata;
    
    var isValid = true;
    
    if (!this.notify.verifyNotify(reqjson)) {
        isValid = false;
    }
    
    var oinfo = this.notify.parseNotityBody(reqjson.notify_data);
    
    //无论签名校验是否通过都通知服务器接收消息成功
    callback(isValid, 'success', oinfo);
};

/**
 * 向支付平台发起订单校验请求
 */
Alipay.prototype.doVerifyOrderSubmit = function() {
    //TODO(Neil): 待实现具体功能, 敬请期待.
};
