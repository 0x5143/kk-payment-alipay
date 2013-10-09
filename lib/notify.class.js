/**
 * 类名：AlipayNotify
 * 功能：支付宝通知处理类
 * 详细：处理支付宝接口通知校验
 * 日期：2013-09-26
 */

var DOMParser = require('xmldom').DOMParser;

var fparams = require('./params.func');
var fsign = require('./sign.func');

function AlipayNotify(conf) {
    this.conf = conf;
    
    //是否开启调试日志
    this._log = this.conf.debug || false;
}

module.exports = AlipayNotify;

/**
 * 调试日志
 */
AlipayNotify.prototype.debug = function(formator) {
    if (this._log) {
        console.log.apply(null, arguments);
    }
};

/**
 * 获取返回时的签名验证结果
 * @param {} prestr 参与验签的源字符串
 * @param {} sign 返回的签名结果
 * @return {Boolean} 签名验证结果
 */
AlipayNotify.prototype.verifyNotifySign = function(prestr, sign) {
    return fsign.verify(prestr, sign, this.conf.partner_private_key, this.conf.alipay_public_key);
};

/**
 * 解析通知内容体
 */
AlipayNotify.prototype.parseNotityBody = function(xmlstr) {
    var json = {};
    var doc = new DOMParser().parseFromString(xmlstr, 'text/xml');
    var nodes = doc.childNodes;
    if (nodes.length === 1 && nodes[0].tagName === 'notify') {
        nodes = nodes[0].childNodes;
        for (var i = 0, size = nodes.length; i < size; i++) {
            var node = nodes[i];
            json[node.tagName] = node.firstChild.data;
        }
    }
    
    return json;
};

/**
 * 校验支付宝订单通知是否合法
 * @return {JSON} 如果校验通过则返回订单对象, 否则返回null.
 */
AlipayNotify.prototype.verifyNotify = function(notify) {
    
    var sign = notify.sign;
    var sign_type = notify.sign_type;
    var notify_data = notify.notify_data;
    
    //判断是否丢失参数
    if (!sign || !sign_type || !notify_data) {
        this.debug('Receive request data not legal : parameters not correct.');
        return null;
    }
    
    var parsered = this.parseNotityBody(notify_data);
    if (!parsered) {
        this.debug('Parse notify data with XMLParser found error : XML format not correct.');
        return null;
    }
    
    if (parsered.partner !== this.conf.partner) {
        this.debug('Partner ID is not correct : please check config file with partner id.');
        return null;
    }
    
    var trade_status = parsered.trade_status;
    if (!trade_status || (trade_status !== 'TRADE_FINISHED' && trade_status !== 'TRADE_SUCCESS')) {
        this.debug('Receive notify data with NOT correct trade status string.');
        return null;
    }
    
    // 校验签名结果
    var isSign = this.verifyNotifySign('notify_data=' + notify_data, sign);
    
    // 获取支付宝远程服务器ATN结果(验证是否是支付宝发来的消息)
    //var responseText = 'true';
    //if (null !== packet.notify_id) {
    //    responseText = this.getResponse(packet.notify_id);
    //}
    // responsetText的结果不是true，与服务器设置问题、合作身份者ID、notify_id一分钟失效有关
    
    // isSign的结果不是true，与安全校验码、请求时的参数格式（如：带自定义参数等）、编码格式有关
    if (!isSign) {
        this.debug('Verify notify data sign not correct.');
        return null;
    }
    
    return parsered;
};
