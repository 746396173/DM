
var sn_config = window.sn_config || {};
var getEnv = function getEnv() {
  var ego_pre = /^(.*)(pre)(.*)(\.cnsuning\.com)$/;
  var ego_sit = /^(.*)(sit)(.*)(\.cnsuning\.com)$/;
  var ego_dev = /^(.*)(dev)(.*)(\.cnsuning\.com)$/;
  var _hostName = document.location.hostname;
  if (ego_pre.test(_hostName)) {
    return 'pre';
  } else if (ego_sit.test(_hostName)) {
    return 'sit';
  } else if (ego_dev.test(_hostName)) {
    return 'dev';
  } else {
    return 'prd';
  }
};
switch (getEnv()) {
  case 'pre':
    sn_config.idsauthServerUrl = 'https://passportpre.cnsuning.com';
    sn_config.idsauthUrl = 'https://aqpre.cnsuning.com/asc/auth';
    sn_config.base = 'https://aqpre.cnsuning.com/asc/';
    sn_config.dtDomain = '//dtpre.cnsuning.com';
    sn_config.regDomain = 'https://regpre.cnsuning.com';
    sn_config.actDomain = '//actpre.cnsuning.com';
    sn_config.vcsDomain = '//vcspre.cnsuning.com';
    sn_config.fpDomain = '//fppre.cnsuning.com';
    sn_config.cmsDomain = 'cpre.m.cnsuning.com';
    sn_config.cookieDomain = 'cnsuning.com';
    sn_config.productDomain = '//mpre.cnsuning.com';
    sn_config.productImgDomain = '//preimage.suning.cn';
    sn_config.icpsDomain = '//icpspre.cnsuning.com/icps-web';
    sn_config.mpayDomain = 'https://mpaypre.cnsuning.com/';
    break;
  case 'sit':
    sn_config.idsauthServerUrl = 'https://passportsit.cnsuning.com';
    sn_config.idsauthUrl = 'https://aqsit.cnsuning.com/asc/auth';
    sn_config.base = 'https://aqsit.cnsuning.com/asc/';
    sn_config.dtDomain = '//dtpre.cnsuning.com';
    sn_config.regDomain = 'https://regsit.cnsuning.com';
    sn_config.actDomain = '//actsit.cnsuning.com';
    sn_config.vcsDomain = '//vcspre.cnsuning.com';
    sn_config.fpDomain = '//fppre.cnsuning.com';
    sn_config.cmsDomain = 'csit.m.cnsuning.com';
    sn_config.cookieDomain = 'cnsuning.com';
    sn_config.productDomain = '//product.msit.cnsuning.com';
    sn_config.productImgDomain = '//sitimage.suning.cn';
    sn_config.icpsDomain = '//icpssit.cnsuning.com/icps-web';
    sn_config.mpayDomain = 'https://mpaysit.cnsuning.com/';
    break;
  case 'prd':
   sn_config.idsauthServerUrl = 'https://passport.suning.com';
   sn_config.idsauthUrl = 'https://aq.suning.com/asc/auth';
   sn_config.base = 'https://aq.suning.com/asc/';
   sn_config.dtDomain = '//dt.suning.com';
   sn_config.regDomain = 'https://reg.suning.com';
   sn_config.actDomain = '//act.suning.com';
   sn_config.vcsDomain = '//vcs.suning.com';
   sn_config.fpDomain = '//fp.suning.com';
   sn_config.cmsDomain = 'c.m.suning.com';
   sn_config.cookieDomain = 'suning.com';
   sn_config.productDomain = '//m.suning.com';
   sn_config.productImgDomain = '//image.suning.cn';
   sn_config.icpsDomain = '//icps.suning.com/icps-web';
   sn_config.mpayDomain = 'https://mpay.suning.com/';
  break;
}

var quan = quan || {};

//人机识别、设备指纹
_loadScript_({
	srcArr: [sn_config.dtDomain + '/detect/dt/detect.js', sn_config.fpDomain + '/bennu-collector/fp/porto.js'],
	withoutGa: true,
	loadComplete: function(){
		bd.init({
		    'token' : 'other'
		});
		porto.init({ 
		    partnerCode:'none', 
		    appName:'commerce', 
		    referenceId:'123', 
		    sessionId:'123', 
		    serviceUrl: sn_config.fpDomain + "/bennu-collector/fp/porto.json"
		});
	}
});

//ajax请求
quan.getJSON = function(url, data){
	return $.ajax({
      	type: 'GET',
      	dataType: 'json',
      	beforeSend: function(xhr) {
	        try {
	          	xhr.withCredentials = true;
	        } catch (e) {
	          	var nativeOpen = xhr.open;
	          	xhr.open = function () {
	            	var result = nativeOpen.apply(xhr, arguments);
	            	xhr.withCredentials = true;
	            	return result;
	          	};
	        }
      	},
      	url: url,
      	data: data || {}
	});
}

//领券触发点
quan.receivePackage = function(){
	$('.take-btn').tap(function(){
		if($(this).hasClass('disable')){
			return;
		}
		if($(this).hasClass('loading')){
			return;
		}
		var that = this;
		$.probeAuthStatus(function(){
			$(that).addClass('loading');
			pk.getJSON(sn_config.actDomain + '/act-wap-web/switch/get3.do', {
				activityCode: actCode,
				useGlobal: 0
			}).done(function(res){
				verifyCallback(res);
		    }).fail(function(){
		    	pk.getJSON(sn_config.actDomain + '/act-wap-web/switch/get2.do?activityCode=' + actCode).done(function(res){
		    		verifyCallback(res);
		    	});
		    });
		}, function(){
			location.href = sn_config.idsauthServerUrl + "/ids/login?service=" + encodeURIComponent(sn_config.idsauthUrl + "?targetUrl=" + encodeURIComponent(location.href)) + "&loginTheme=wap_new";
		});
	   	
	});

	function verifyCallback(res){
    	if(res.code == 1){
    		if(res.data.imgCodeSwitch == 1){  // 接口返回1表示 开关开启
    			pk.imgCodeScene = res.data.imgCodeScene;
    			pk.imgCodeSceneType = res.data.imgCodeSceneType;
    			$('.verify-success').hide();
			    if(res.data.imgCodeSceneType == 1){  //那要获取验证码和结果值
			    	$('.verify-dialog .ldp-box input').attr('placeholder', '请输入右侧验证码');
			    	$('.verify-dialog h5').html('为保证您的账号安全和权益<br>请输入验证码');
			    }else{
			    	$('.verify-dialog .ldp-box input').attr('placeholder', '请输入数字题答案');
			    	$('.verify-dialog h5').html('为保证您的账号安全和权益<br>请输入数字题答案');
			    }
   				$('.verify-dialog .ldp-box input').val('');
    			pk.openDialog($('.verify-dialog'));
   				pk.randomImage('.verify-dialog .ldp-box');
    			$('#siller').show();
   				pk.siller();
   				$('.verify-dialog .ldp-box img').off('tap').tap(function(){
   					pk.randomImage('.verify-dialog .ldp-box');
			    	$('.verify-dialog .ldp-box input').val('');
			    });
    		}else{
    			pk.receiveCoupons();
    		}
    	}else{
    		pk.receiveCoupons();
    	}
	}
};

//下载或打开易购客户端
quan.topDownloadApp = function(m, r) {
    var i = "com.suning.SuningEbuy://";
    var j = "suning://m.suning.com/index";
    var n = navigator.userAgent;
    if (m) {
        i += "wapToEbuy?adTypeCode=1002&adId=" + m;
        j += "?adTypeCode=1002&adId=" + m
    }
    function q(s) {
        var t = document.createElement("iframe");
        t.src = s;
        t.style.display = "none";
        document.body.appendChild(t);
        setTimeout(function() {
            document.body.removeChild(t)
        }, 1000)
    }
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        var l = new Date();
        var o = n.match(/(iPhone\sOS)\s([\d]+)/) || n.match(/(iPad).*OS\s([\d_]+)/) || n.match(/(iPod)(.*OS\s([\d_]+))?/);
        var k = parseInt(o[2], 10);
        if (k >= 9) {
            window.location.href = i
        } else {
            q(i)
        }
        var p = true;
        window.onblur = function() {
            p = false
        }
        ;
        window.setTimeout(function() {
            var s = new Date();
            if (s - l < 5000 && p) {
                if (navigator.userAgent.match(/MicroMessenger/i)) {
                    window.location.href = "http://code.suning.cn/g~raou";
                    return
                }
                if (r) {
                    window.location.href = "http://code.suning.cn/g~raou"
                } else {
                    window.location.href = "http://code.suning.cn/g~raou"
                }
            } else {
                window.close()
            }
        }, 1200)
    } else {
        if (navigator.userAgent.match(/android/i)) {
            q(j);
            if (navigator.userAgent.match(/MicroMessenger/i)) {
                window.location.href = "http://code.suning.cn/g~raou";
                return
            }
            var p = true;
            window.onblur = function() {
                p = false
            }
            ;
            setTimeout(function() {
                if (p) {
                    if (r) {
                        window.location.href = "http://code.suning.cn/g~raou"
                    } else {
                        window.location.href = "http://code.suning.cn/g~raou"
                    }
                }
            }, 1200)
        }
    }
};

//滑动验证吗
quan.siller = function(){
	$('#siller').empty();
	siller.init({
 		tip0 : '向右滑动完成验证',//初始状态文字（使用系统默认样式则不加此属性）
 		tip1 : '验证中',//验证完成文字（使用系统默认样式则不加此属性）
 		tip2 : '好像出错了呢~',//验证错误文字（使用系统默认样式则不加此属性）
 		tip3 : '加载中',//验证中文字（使用系统默认样式则不加此属性）
 		backWidth : '100%',//控件长度（使用系统默认样式则不加此属性）
 		backHeight : '2rem',//控件高度（使用系统默认样式则不加此属性）
 		slWidth : '2.58rem',//滑块宽度（使用系统默认样式则不加此属性）
 		slHeight : '2rem',//滑块高度（使用系统默认样式则不加此属性）
 		fontSize : '.56rem',//字体大小（使用系统默认样式则不加此属性）
		target : "siller",//滑动验证码所在页面div的id（业务系统预先在页面写入一个空的div，必填！）
		callback: pk.receiveCoupons,//非必填
		url : sn_config.dtDomain + '/detect/dt/dragDetect.json'//滑动验证后台地址，必填！
	});
	siller.show();
};

//加密
quan.encryptTicket = function encryptTicket(str) {
	var d = $.Deferred();
	if ($.os.android) {
	  $.AppReady().done(function (Bridge) {
	    Bridge.ticketEncrypt(str, function (code) {
	      if (typeof code == 'string') {
	        code = JSON.parse(code);
	      }
	      d.resolve(code.destStr);
	    });
	  });
	}
	if ($.os.ios) {
	  $.AppReady().done(function (Bridge) {
	    Bridge.couponMD5Encrypt(str, function (code) {
	      if (typeof code == 'string') {
	        code = JSON.parse(code);
	      }
	      d.resolve(code.destStr);
	    });
	  });
	}
	return d.promise();
}

//随机生成验证码
quan.randomImage = function(el){
	function randomUUID() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(b) {
            var g = Math.random() * 16 | 0
              , h = b == "x" ? g : (g & 3 | 8);
            return h.toString(16)
        }).toUpperCase();
    }
    var uuid = randomUUID();
	$('img', el).attr('src', sn_config.vcsDomain + '/vcs/imageCode.htm?uuid='+ uuid + '&sceneId=' + pk.imgCodeScene + '&yys=' + new Date().getTime()).attr('uuid', uuid);
};


//回到顶部
quan.goTop = function(){
	$(window).scroll(function(){
		var scrollHeight = document.body.scrollTop || document.documentElement.scrollTop;
		var windowHeight = window.innerHeight;
		if(scrollHeight - windowHeight > 0 ){
			$('.go-top').show();
		}else{
			$('.go-top').hide();
		}
	});

	$('.go-top').tap(function(){
		$('html, body').scrollTop(0);
	});
};

//跳转我的优惠券
quan.myCoupon = function(){
	$('.my-coupon').tap(function(){
		$.AppReady(function() {
	        if ($.os.android) {
	            baseApi.pageRouter('http://m.suning.com/index.html?adTypeCode=1028&adId=');
	        } else {
	            window.SNNativeClient.routeToClientPage(1028, '');
	        }
		});
	});
};

