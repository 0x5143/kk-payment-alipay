/**
 * 类名：AlipayNotify
 * 功能：支付宝通知处理类
 * 详细：处理支付宝接口通知校验
 * 日期：2013-09-26
 */

var DOMParser = require('xmldom').DOMParser;

var fparams = require('./params.func');
var fmd5 = require('./md5.func');

function AlipayNotify(conf) {
    this.conf = conf;
}

module.exports = AlipayNotify;

/**
 * 获取返回时的签名验证结果
 * @param {} params 通知返回的参数数据
 * @param {} sign 返回的签名结果
 * @return {Boolean} 签名验证结果
 */
AlipayNotify.prototype.verifyNotifySign = function(params, sign) {
    //去除空值和签名参数
    var param_filter = fparams.doParamFilter(params);
    
    //排序签名参数数组
    var param_sort = fparams.doArgSort(param_filter);
    
    //把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
    var prestr = fparams.createLinkString(param_sort);
    
    return fmd5.md5Verify(prestr, sign, this.conf.secret);
};

/**
 * 解析通知内容体
 */
AlipayNotify.prototype.parseNotityBody = function(xmlstr) {
    var json = {};
    var doc = new DOMParser().parseFromString(xmlstr, 'text/xml');
    var nodes = doc.childNodes;
    for (var i = 0, size = nodes.length; i < size; i++) {
        var node = nodes[i];
        json[node.tagName] = node.firstChild.data;
    }
    return json;
};

/**
 * 校验支付宝订单通知是否合法
 */
AlipayNotify.prototype.verifyNotify = function(notify) {
    
    var sign = notify.sign;
    var sign_type = notify.sign_type;
    var notify_data = notify.notify_data;
    
    //判断是否丢失参数
    if (!sign || !sign_type || !notify_data) {
        return false;
    }
    
    var parsered = this.parseNotityBody(notify_data);
    if (!parsered) {
        return false;
    }
    
    if (parsered.partner !== this.conf.partner) {
        return false;
    }
    
    // 校验签名结果
    var isSign = this.verifyNotifySign(parsered, sign);
    
    // 获取支付宝远程服务器ATN结果(验证是否是支付宝发来的消息)
    //var responseText = 'true';
    //if (null !== packet.notify_id) {
    //    responseText = this.getResponse(packet.notify_id);
    //}
    // responsetText的结果不是true，与服务器设置问题、合作身份者ID、notify_id一分钟失效有关
    
    // isSign的结果不是true，与安全校验码、请求时的参数格式（如：带自定义参数等）、编码格式有关
    return isSign;
};
