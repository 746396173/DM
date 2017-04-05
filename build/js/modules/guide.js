
/**
 * wap右侧栏拼接跳转链接
 * @return {[type]} [description]
 */
;(function() {
	var strIndex = dm.prdDomain,
			strCart = dm.cartDomain + "/project/cart/cart1.html",
			strSearch = dm.prdDomain + '/search.html',
			strCate = dm.prdDomain + "/list/list.html",
			strTip = '//my.suning.com/wap/home.do',

			arrLink = [strIndex, strCart, strSearch, strCate, strTip],
			$linkArr = $('#sub-title');

	$linkArr.find('li a').each(function(index, element) {
		$(this).attr('href', arrLink[index]);
	});
})();
