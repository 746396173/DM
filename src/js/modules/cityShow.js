
;(function() {

	/**
	 * 分享链接区分
	 * @type {[type]}
	 */
	var href = window.location.href;
	var $shareUrl = $('#isshareurl');
	if( href.indexOf('dm_beijing') > -1 ) {
		$shareUrl.attr('shareurl', 'http://c.m.suning.com/channel/dm_beijing.html');
	}else if( href.indexOf('dm_shenyang') > -1 ) {
		$shareUrl.attr('shareurl', 'http://c.m.suning.com/channel/dm_shenyang.html');
	}else {
		return;
	}

	/**
	 * 底部导航 小于三个不展示
	 * @type {[type]}
	 */
	var $guide = $('#J-guide'),
			len = $guide.find('a').length,
			$app = $('#J-download');
	if( len < 3 ) {
		$guide.hide();
	}
	//如果是在苏宁易购app里则不展示“下载苏宁易购”
	var UA = window.navigator.userAgent;
	if( UA.indexOf('SNEBUY-APP') > -1 ) {
		$app.hide();
	}else {
		$app.on('click', topDownloadApp);
	}
	
})();
