

/**
 * fastclick
 * @param {[type]} ) {	FastClick.attach(document.body);} [description]
 * @return {[type]} [description]
 */
$(function() {
	FastClick.attach(document.body);

	document.title = $('.sn-nav-title').text();

	$('.lazyimg').lazyload();

	// 需要同时引入统计埋点和点击埋点
	$.loadScript({
	  loadGa: true,
	  loadComplete: function(){
	    // 埋点后统计点击埋点，根据自己业务绑定不同的标签以及属性
	    $(document).on('click', '[name]', function() {
	      sa.click.sendDatasIndex(this);
	    })
	  }
	})

	//如果是app跳原生的
	var quanWap = dm.quanDomain + '/yhqwap.do'
	if( device.isApp ) {
		$('#J-lookquan').attr('href', 'http://m.suning.com/index.html?adTypeCode=1028');
	}else {
		$('#J-lookquan').attr('href', quanWap);
	}

})

//区分北京沈阳的活动编码
var $bj = $('#J-bjcode'),
		$sy = $('#J-sycode'),
		$bjVal = $bj.val(),
		$syVal = $sy.val();

var pageUrl = window.location.href;
var activityNo = '';
if( pageUrl.indexOf('dm_beijing') > -1 ) {
	activityNo = $bjVal;
}else {
	activityNo = $syVal;
}

/**
 * 格式化价格
 * @param {[type]}  price     [description]
 * @param {Boolean} isGbPrice [description]
 * @return {[type]}  [description]
 */
function formatPrice(price, isGbPrice) {
	var rePrice;
	if (!price) {
		rePrice = price;
	} else {
		var priceArr = price.toString().split('.');
		if (priceArr.length === 2) {
			var p = priceArr[1];
			var flag = true;
			for (var i = 0; i < p.length; i++) {
				if (p.charAt(p.length - 1) === 0) {
					priceArr[1] = priceArr[1].substring(0, priceArr[1].length - 1);
				}

				if (p.charAt(i) != 0) {
					flag = false;
					break;
				}
			}
			if (flag) {
				rePrice = priceArr[0];
			} else {
				if (isGbPrice && priceArr[0] > 999) {
					rePrice = priceArr[0];
				} else {
					// 去掉小数最后的 0
					var xiaoshu = priceArr[1].replace(/0+$/, '');
					rePrice = priceArr[0] + '.' + '<em>' + xiaoshu + '</em>';
				}
			}
		} else {
			rePrice = price;
		}
	}

	return rePrice;
}
window.formatPrice = formatPrice;

/**
 * 调用领券流程前置方法，并根据本次接口做进一步处理
 * @param {[type]} data) {	console.log(data);	var _device_session_id [description]
 * @return {[type]} [description]
 */
verifyDialog('#J-quan', activityNo, function(cb) {
	// console.log(cb);
	var _device_session_id = cb._device_session_id,
		detect = cb.detect,
		imageCode = cb.imageCode,
		salt = cb.salt,
		slideToken = cb['slide-token'],
		time = cb.time,
		uuid = cb.uuid,
		custno = $.cookie('custno'),
		activityCode = activityNo,
		channel = '', //渠道编码
		sign = ''; //加密串 (活动编码+会员编号+渠道编码+时间戳+盐)

	device.isApp ? channel = 1 : channel = 0;

	//加密 加密串activityCode + custno + channel + time + salt
	sign = cb.crypto(activityCode + custno + channel + time + salt);

	var url = verifyConfig.actDomain + '/act-wap-web/private/new/packet/city/' + channel + '/receive.do?activityCode=' + activityCode + '&_device_session_id=' + _device_session_id + '&detect=' + detect + '&slide-token=' + slideToken + '&uuid=' + uuid + '&imageCode=' + imageCode + '&time=' + time + '&sign=' + sign;
	getJSON(url)
		.done(function(res) {
			console.log(res);
			// alert(res.code)
			var $content = $('.content'),
					$iContent = $('.quan-content'),
					$count = $('#J-quancount');

			if (!(res.code == '10' && res.data.code == '11')) {
				$('#siller').hide();
				$('.verify-success').show();
				setTimeout(function() {
					$('.verify-dialog').removeClass('visible');
					$('body').off('touchmove');
				}, 500);
			}

			if( res.code == 4 ) {

				$content.hide();
				$iContent.hide();

				$('.dm-time').show();
				$('.verify-success').hide();
			}

			if( res.code == 5 ) {

				$content.hide();
				$iContent.hide();

				$('.dm-time').find('p:first').text('活动已经结束啦，下次再来哦')
				$('.dm-time').show();
				$('.verify-success').hide();
			}

			if( res.code == 10 && res.data.code == 13 ) {

				var tip = '活动太火爆，参与会员数过多'
									+ '<br/>' 
									+ '明天再来试试哦';
				$('.verify-error').html(tip).show();
				setTimeout(function() {
					$('.verify-error').hide();
					$('.verify-dialog .ldp-box input').val('');
					randomImage('.verify-dialog .ldp-box');
					slider();
					$('.verify-success').hide();
					$('.verify-dialog').hide();
				}, 3000);

			}

			setTimeout(function() {

				if (res.code == 1 && res.data.sendResult == 1) { //成功

					var counts = res.data.couponLst[0].couponAmount; //券数额

					$content.hide();
					$iContent.show();
					$count.text(formatPrice(counts));

					//把券数额的信息储存起来
					var vipcode = $.cookie('custno');
					if( vipcode && vipcode.length > 0 ) {
						// 定义存储key(带有会员编号标识)
						var vipCount = 'count_'+ vipcode;
						window.localStorage.setItem(vipCount, counts);
					}

					//把领完券的信息储存起来( 注意要对应不同的会员)
					var vip = $.cookie('custno');
					if( vip && vip.length > 0 ) {
						// 定义存储key(带有会员编号标识)
						var vipCode = 'code_'+ vip;
						window.localStorage.setItem(vipCode, 0);
					}


				} else if (res.code == '10' && res.data.code == '11') {
					$('.verify-inner-error').find('p').text('请输入正确的验证码').show();
					$('.verify-dialog .ldp-box input').val('');
					randomImage('.verify-dialog .ldp-box');
					slider();
					setTimeout(function() {
						$('.verify-inner-error').find('p').hide();
					}, 3000);
				} else if( res.code == '6001' ) {  // 非客户端访问
					$('.verify-error').text('请至客户端领取哦').show();
					setTimeout(function() {
						$('.verify-error').hide();
						$('.verify-dialog .ldp-box input').val('');
						randomImage('.verify-dialog .ldp-box');
						slider();
						$('.verify-success').hide();
					}, 2000);
				}

				if( res.code == '0' ) { //参与次数已达上限
					// 取出券数额信息
					var custnos = $.cookie('custno');
					if( custnos && custnos.length > 0 ) {
						// 定义存储key(带有会员编号标识)
						var vipCounts = 'count_'+ custnos;
						var quane = localStorage.getItem(vipCounts);
						$count.text(formatPrice(quane));
					}

					$('.verify-dialog').show();

					$content.hide();
					$iContent.show();
					
					$iContent.find('h2').text('禀告皇上皇后');
					$('.quan-text').find('.txt1').text('您已领过');
					$('.quan-text').find('.txt2').text('优惠券了哦');
					$('.quan-text').find('small').hide();

				}

				if( res.code == 1 && res.data.sendResult == 0 ) {  
					if( res.data.couponLst[0].sendResult == -1 ) { //领券失败(券自身问题)
						var tiperr = '主人，抢券过于火爆，请稍后再试'
						$('.verify-error').html(tiperr).show();
						setTimeout(function() {
							$('.verify-error').hide();
							$('.verify-dialog .ldp-box input').val('');
							randomImage('.verify-dialog .ldp-box');
							slider();
							$('.verify-success').hide();
							$('.verify-dialog').hide();
						}, 3000);
					}

					if( res.data.couponLst[0].sendResult == 4 ) { //活动次数或者活动额度已超过
						var str = '优惠券已经被全部领完了哦' 
											+ '<br/>'
											+ '下次活动再来参与吧~';

						$('.verify-error').html(str).show();
						setTimeout(function() {
							$('.verify-error').hide();
							$('.verify-dialog .ldp-box input').val('');
							randomImage('.verify-dialog .ldp-box');
							slider();
							$('.verify-success').hide();
							$('.verify-dialog').hide();
						}, 3000);
					}

					if( res.data.couponLst[0].sendResult == 20 ) {  //中风控（比如用户是黑名单）
						// 
						var str = '您的操作太频繁或账号存在异常' 
											+ '<br/>'
											+ '请您稍后再试或联系客服解决~';

						$('.verify-error').html(str).show();
						setTimeout(function() {
							$('.verify-error').hide();
							$('.verify-dialog .ldp-box input').val('');
							randomImage('.verify-dialog .ldp-box');
							slider();
							$('.verify-success').hide();
							$('.verify-dialog').hide();
						}, 3000);
					}

					if( res.data.couponLst[0].sendResult == -4 ) {  //当前时段的发券量已达到上限

						$('.verify-error').text('当前时段的券已经发完啦，下次早点来哦').show();
						setTimeout(function() {
							$('.verify-error').hide();
							$('.verify-dialog .ldp-box input').val('');
							randomImage('.verify-dialog .ldp-box');
							slider();
							$('.verify-success').hide();
							$('.verify-dialog').hide();
						}, 2000);
					}

				}

			}, 500);
		})
		.fail(function(res) {
			console.log('error!')
		})
})

//下载或打开易购客户端
function topDownloadApp(m, r) {
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
}
