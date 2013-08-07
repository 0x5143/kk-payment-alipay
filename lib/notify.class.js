/**
 * 类名：AlipayNotify 功能：支付宝通知处理类 详细：处理支付宝各接口通知返回 版本：0.1 日期：2013-08-06 说明：
 */

var core = require('./core.func');
var md5 = require('./md5.func');

function AlipayNotify(conf) {
    this.kNotifyVerifyHttpsUrl = 'https://mapi.alipay.com/gateway.do?service=notify_verify&';
    this.kNotifyVerifyHttpUrl = 'http://notify.alipay.com/trade/notify_query.do?';

    this.conf = conf;
}

/**
 * 针对nofity_url验证消息是否是支付宝发出的合法消息
 * @param {JSON} packet 通知体(post)
 * @return {Boolean} 验证结果
 */
AlipayNotify.prototype.verifyPostNotify = function(packet) {
    if (Object.keys(packet).length === 0) {
        return false;
    } else {
        // 生成签名结果
        var isSign = this.getSignVerify(packet, packet.sign);
        // 获取支付宝远程服务器ATN结果(验证是否是支付宝发来的消息)
        var responseText = 'true';
        if (null !== packet.notify_id) {
            responseText = this.getResponse(packet.notify_id);
        }

        // 验证
        // responsetText的结果不是true，与服务器设置问题、合作身份者ID、notify_id一分钟失效有关
        // isSign的结果不是true，与安全校验码、请求时的参数格式（如：带自定义参数等）、编码格式有关
        return (responseText === 'true' && isSign);
    }
};

/**
 * 针对return_url验证消息是否为支付宝发出的合法消息
 * @param {JSON} packet 通知体(get)
 * @return {Boolean} 验证结果
 */
AlipayNotify.prototype.verifyGetNotify = function(packet) {
    if (Object.keys(packet).length === 0) {
        return false;
    } else {
        //生成签名结果
        var isSign = this.getSignVerify(packet, packet.sign);
        // 获取支付宝远程服务器ATN结果(验证是否是支付宝发来的消息)
        var responseText = 'true';
        if (null !== packet.notify_id) {
            responseText = this.getResponse(packet.notify_id);
        }

        // 验证
        // responsetText的结果不是true，与服务器设置问题、合作身份者ID、notify_id一分钟失效有关
        // isSign的结果不是true，与安全校验码、请求时的参数格式（如：带自定义参数等）、编码格式有关
        return (responseText === 'true' && isSign);
    }
};

/**
 * 获取返回时的签名验证结果
 * @param {} params 通知返回的参数数据
 * @param {} sign 返回的签名结果
 * @return {Boolean} 签名验证结果
 */
AlipayNotify.prototype.getSignVerify = function(params, sign) {
    //去除空值和签名参数
    var param_filter = core.paramFilter(params);
    
    //排序签名参数数组
    var param_sort = core.argSort(param_filter);
    
    //把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
    var prestr = core.createLinkString(param_sort);
    
    var sign_type = this.conf.sign_type.trim().toUpperCase();
    return (sign_type === 'MD5') ? md5.md5Verify(prestr, sign, this.conf.key) : false;
};

/**
 * 获取远程服务器ATN结果，验证返回URL
 * @param {String} notify_id 通知校验ID
 * @return {Boolean} 服务器ATN结果
 *          验证结果集：
 *          invalid 命令参数不对，出现这个错误，请检测返回处理中的partner和key是否为空
 *          true 返回正确信息
 *          false 请检查防火墙或者是服务器阻止端口问题以及验证时间是否超过一分钟
 */
AlipayNotify.prototype.getResponse = function(notify_id, callback) {
    var transport = this.conf.transport.trim().toLowerCase();
    var partner = this.conf.partner.trim();
    var verify_url = (transport === 'https') ? this.kNotifyVerifyHttpsUrl : this.kNotifyVerifyHttpUrl;
    verify_url += ('partner=' + partner + '&notify_id=' + notify_id);
    core.getHttpResponseWithGet(verify_url, this.conf.cacert, callback);
};

exports.AlipayNotify = AlipayNotify;
