支付宝服务端验证模块 - Node.js版本
================

## Installation
可通过npm直接安装：

`npm install kk-payment-coco`


## Overview
此模块用于快速搭建自己的支付验证服务器，针对支付宝的支付平台验证流程。
目前处于测试期，用于实际项目请谨慎。

## Usage
(1) 填写配置文件: 参考alipay.example.json文件;
(2) 使用以下代码进行通知验证: 
    
    var conf = require('alipay.json');
    var Alipay = require('kk-payment-alipay');
    var alipay = new Alipay(conf);
    alipay.doOrderNotifyVerify(
        remoteip,
        reqdata,
        function(isValid, text, orderinfo) {
            if (isValid) {
                // todo order info handle
            }
        }
    );

其中, doOrderNotifyVerify接收三个参数：
第一个参数为远程支付平台主机IP地址；
第二个参数为远程支付平台发过来的数据(POST或GET)；
第三个参数为校验完成回调函数；

## LICENSE - "MIT License"

Copyright (c) 2013 云景, http://yunjing.me/

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

![spacer](http://yunjing.me/1px.gif)
