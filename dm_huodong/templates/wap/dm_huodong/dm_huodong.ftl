<!DOCTYPE HTML>
<#import "cms_wap_macro.ftl" as cmsWap />
<#import "cms_macro.ftl" as cms />
<#import "/wap/common/common_inc.ftl" as common>
<html class="channel">
<head>
	<@common.meta />
  <link rel="dns-prefetch" href="//res.suning.cn">
  <link rel="dns-prefetch" href="//dt.suning.com">
  <link rel="dns-prefetch" href="https://passport.suning.com">
  <link rel="dns-prefetch" href="//icps.suning.com">
  <link rel="dns-prefetch" href="https://aq.suning.com/asc/">
  <#if envName == 'DEV' || envName == 'SIT'>
    <link rel="stylesheet" type="text/css" href="//dtpre.cnsuning.com/detect/static/siller.css">
  <#elseif envName == 'PRE'>
    <link rel="stylesheet" type="text/css" href="//dtpre.cnsuning.com/detect/static/siller.css">
  <#elseif envName == 'PROD'>
    <link rel="stylesheet" type="text/css" href="//dt.suning.com/detect/static/siller.css">
  </#if>
	<link rel="stylesheet" href="${resDomian}/project/cmsWeb/suning/wap/dm_huodong/css/dm.css${v}" />
  <script type="text/javascript">
		//全局变量初始化
		var sn_config = sn_config || {
			v : '${v}',
			channelRes: '${resDomian}',
			wapDomain: '${wapDomain}'
		};
	  <#if envName == 'DEV' || envName == 'SIT'>
	  var dm = dm || {
      juDomain: '//nmpssit.cnsuning.com',
      prdDomain: '//msit.cnsuning.com',
      productDomain: '//productsit.cnsuning.com',
      imgDomain: '//10.19.95.100',
      icpsDomain: '//icpssit.cnsuning.com',
      cartDomain: '//shoppingsit.cnsuning.com',
      favoriteDomain: '//favoritesit.cnsuning.com',
      vcsDomain: '//vcssit.cnsuning.com',
      quanDomain: '//quansit.suning.com'
    };
    var passport_config = passport_config || {
      login: "https://passportsit.cnsuning.com/ids/login",
      base: "https://aqsit.cnsuning.com/asc/",
      loginTheme: "wap_new"
    };
	  <#elseif envName == 'PRE'>
	  var dm = dm || {
      juDomain: '//nmpspre.cnsuning.com',
      prdDomain: '//mpre.cnsuning.com',
      productDomain: '//productpre.cnsuning.com',
      imgDomain: '//uimgpre.cnsuning.com',
      icpsDomain: '//icpspre.cnsuning.com',
      cartDomain: '//shoppingpre.cnsuning.com',
      favoriteDomain: '//favoritepre.cnsuning.com',
      vcsDomain: '//vcspre.cnsuning.com',
      quanDomain: '//quanpre.suning.com'
    };
    var passport_config = passport_config || {
      login: "https://passportpre.cnsuning.com/ids/login",
      base: "https://aqpre.cnsuning.com/asc/",
      loginTheme: "wap_new"
    };
	  <#elseif envName == 'PROD'>
	  var dm = dm || {
      juDomain: '//nmps.suning.com',
      prdDomain: '//m.suning.com',
      productDomain: '//product.suning.com',
      imgDomain: '//image'+ parseInt(Math.floor(Math.random()*5+1)) +'.suning.cn',
      icpsDomain: '//icps.suning.com',
      cartDomain: '//shopping.suning.com',
      favoriteDomain: '//favorite.suning.com',
      vcsDomain: '//vcs.suning.com',
      quanDomain: '//quan.suning.com'
    };
    var passport_config = passport_config || {
      login: "https://passport.suning.com/ids/login",
      base: "https://aq.suning.com/asc/",
      loginTheme: "wap_new"
    };
	  </#if>
	</script>
	<script>
	// 加载客户端需要的代码
	  !function(win, d){
	      var UA = window.navigator.userAgent,
	          isApp = UA.match(/SNEBUY-APP;?/i) ? true : false,
	          isAndroid = UA.match(/android/i) ? true : false,
	          isIOS = UA.match(/(iPhone|iPod|iPad);?/i) ? true : false,
	          historyLen = history.length;

	      window.device = {
	        "isApp": isApp,
	        "isAndroid": isAndroid,
	        "isIOS": isIOS
	      };

	      if(d.documentElement && isApp) d.documentElement.className += ' sn-app';
	      if(isApp && isAndroid){
	        var headTag = d.getElementsByTagName("head")[0];
	        var appendDom = d.createElement("script");
	        appendDom.src = '//res.m.suning.com/common/script/android/sneapp.js';
	        appendDom.type = "text/javascript";
	        //appendDom.onload = onBaseApiLoad;
	        headTag.appendChild(appendDom);
	      }
	  }(window, document)
	</script>
</head>
<body>
<@cms.body/>
<@common.activeApp />

<#-- 自定义模块.. -->
<#if cmsList?exists && (cmsList?size>0)>
  <#list cmsList as model>
  ${model}
  </#list>
</#if>

<div class="sn-loading-type" data-status="end">
  <div class="end sn-end-loading"><span>DUANG~到底了</span></div>
  <div class="loading sn-local-loading">
    <span class="shape"></span>
    <span class="text">努力加载中...</span>
  </div>
</div>

<input type="hidden" id="isshareurl" value="1" title="红孩子奶粉节活动开始啦" sharecontent="红孩子奶粉节活动开始啦，千万红包免费领。" alt="" shareimg="" shareurl=""/>

<script src="${resDomian}/project/mvs/RES/common/script/??module/geo/1.0.0/geo.js${v}"></script>

<script src="//res.suning.cn/public/v5/??js/zepto/1.1.4/app.js,mod/alertBox/2.0.0/alertBox.js"></script>

<#if envName == 'DEV' || envName == 'SIT'>
  <script src="//dtpre.cnsuning.com/detect/dt/siller.js"></script>
<#elseif envName == 'PRE'>
  <script src="//dtpre.cnsuning.com/detect/dt/siller.js"></script>
<#elseif envName == 'PROD'>
  <script src="//dt.suning.com/detect/dt/siller.js"></script>
</#if>

<script src="${resDomian}/project/??cmsWeb/suning/wap/dm_huodong/js/verifyDialog.js,cmsWeb/suning/wap/dm_huodong/js/quan.js,cmsWeb/suning/wap/dm_huodong/js/dm.js${v}"></script>

</body>
</html>
