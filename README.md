֧�����������֤ģ�� - Node.js�汾
================

## Installation
��ͨ��npmֱ�Ӱ�װ��

`npm install kk-payment-coco`


## Overview
��ģ�����ڿ��ٴ�Լ���֧����֤�����������֧������֧��ƽ̨��֤���̡�
Ŀǰ���ڲ����ڣ�����ʵ����Ŀ�������

## Usage
(1) ��д�����ļ�: �ο�alipay.example.json�ļ�;
(2) ʹ�����´������֪ͨ��֤: 
    
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

����, doOrderNotifyVerify��������������
��һ������ΪԶ��֧��ƽ̨����IP��ַ��
�ڶ�������ΪԶ��֧��ƽ̨������������(POST��GET)��
����������ΪУ����ɻص�������

## LICENSE - "MIT License"

Copyright (c) 2013 �ƾ�, http://yunjing.me/

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
