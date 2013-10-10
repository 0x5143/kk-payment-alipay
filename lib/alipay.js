
var qs = require('querystring');

var fparams = require('./params.func');
var fsign = require('./sign.func');
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
 * 对支付订单进行签名
 * @param {String} orderid 订单编号
 * @param {String} product 商品名称
 * @param {String} describe 商品描述字符串
 * @param {Number} fee 商品总价格(以元为单位, 支持两位小数)
 * @return {String} 返回成功签名的字符串
 */
Alipay.prototype.doOrderSign = function(orderid, product, describe, fee) {
    var sorder = {
        'partner' : this.conf.partner,
        'seller' : this.conf.partner,
        'out_trade_no' : orderid,
        'subject' : product,
        'body' : describe,
        'total_fee' : fee,
        'notify_url' : this.conf.notify_url
    };
    
    var prestr = fparams.createLinkString(sorder, true);
    var signstr = fsign.sign(prestr, this.conf.partner_private_key);
    return signstr;
};

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
