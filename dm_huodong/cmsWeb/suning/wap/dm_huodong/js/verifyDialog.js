
var verifyConfig = verifyEnv();

//人机识别、设备指纹
$.loadScript({
  srcArr: ['//dt.suning.com/detect/dt/detect.js', '//fp.suning.com/bennu-collector/fp/porto.js'],
  withoutGa: true,
  loadComplete: function() {
    bd.init({
      'token': 'other'
    });
    porto.init({
      partnerCode: 'none',
      appName: 'commerce',
      referenceId: '123',
      sessionId: '123',
      serviceUrl: verifyConfig.fpDomain + "/bennu-collector/fp/porto.json"
    });
  }
});

function verifyDialog(btn, actCode, cb) {
  var imgCodeScene;
  var imgCodeSceneType;

  $(btn).click(function() {
    // 点击领券的时候，如果是3月22日-3月27日以外的时间 不领券
    $.probeAuthStatus(function(custNum) {
      openDialog($('#verify-dialog'));

      $(".dialog").css({
        'display': '-webkit-flex'
      });

      if( custNum && custNum.length > 0 ) {
        var code = 'code_' + custNum; // key
        var count = 'count_' + custNum; 
        var codeLocal = localStorage.getItem(code);
        var countLocal = localStorage.getItem(count);

        if( codeLocal && codeLocal.length > 0 && codeLocal == 0 ) {
          
          var $content = $('.content'),
              $iContent = $('.quan-content'),
              $count = $('#J-quancount');

          $content.hide();
          $iContent.show();
          $count.text(formatPrice(countLocal));
          $iContent.find('h2').text('禀告皇上皇后');
          $('.quan-text').find('.txt1').text('您已领过');
          $('.quan-text').find('.txt2').text('元优惠券咯');
          $('.quan-text').find('small').hide();
        }else {
          getJSON(verifyConfig.actDomain + '/act-wap-web/switch/get3.do', {
            activityCode: actCode,
            useGlobal: 0
          }).done(function(res) {
            console.log(res)
            if (res.code == 1) {
              if (res.data.imgCodeSwitch == 1) {
                imgCodeScene = res.data.imgCodeScene;
                imgCodeSceneType = res.data.imgCodeSceneType;
                openDialog($('#verify-dialog'));
                randomImage('.verify-dialog .ldp-box');
                $('#siller').show();
                slider();
                $('.verify-dialog .ldp-box img').off('click').click(function() {
                  randomImage('.verify-dialog .ldp-box');
                  $('.verify-dialog .ldp-box input').val('');
                });
              } else {
                take();
              }
            } else {
              take();
            }
          });
        }
      }

    }, function() {
      // 未登录跳转至登录页，登录完成后跳回
      var target = location.href;
      var service = passport_config.base + 'auth';
      var jumpUrl = passport_config.login + '?service=' +
        encodeURIComponent(service + '?targetUrl=' + encodeURIComponent(target)) +
        "&loginTheme=wap_new";
      location.href = jumpUrl;
    });
  });




  //打开dialog
  function openDialog(dialog) {
    $('body').on('touchmove', function(e) {
      e.preventDefault();
    });
    function closeDialog(obj) {
      obj = $(this);
      obj.closest('.dialog').hide();
      $('body').off('touchmove');
    }
    $('.dialog .close').on('click.offdialog', closeDialog);
    $('#J-closebtn').on('click.offdialog', closeDialog);
  };

  //随机生成验证码
  function randomImage(el) {
    function randomUUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(b) {
        var g = Math.random() * 16 | 0,
          h = b == "x" ? g : (g & 3 | 8);
        return h.toString(16)
      }).toUpperCase();
    }
    var uuid = randomUUID();
    $('img', el).attr('src', verifyConfig.vcsDomain + '/vcs/imageCode.htm?uuid=' + uuid + '&sceneId=' + imgCodeScene + '&yys=' + new Date().getTime()).attr('uuid', uuid);
  }
  window.randomImage = randomImage;

  //滑动验证吗
  function slider() {
    $('#siller').empty();
    siller.init({
      tip0: '滑动模块  验证', //初始状态文字（使用系统默认样式则不加此属性）
      tip1: '验证中', //验证完成文字（使用系统默认样式则不加此属性）
      tip2: '验证失败', //验证错误文字（使用系统默认样式则不加此属性）
      tip3: '加载中', //验证中文字（使用系统默认样式则不加此属性）
      backWidth: '100%', //控件长度（使用系统默认样式则不加此属性）
      backHeight: '1.17333rem', //控件高度（使用系统默认样式则不加此属性）
      slWidth: '1.14rem', //滑块宽度（使用系统默认样式则不加此属性）
      slHeight: '1.17333rem', //滑块高度（使用系统默认样式则不加此属性）
      fontSize: '.37333rem', //字体大小（使用系统默认样式则不加此属性）
      target: "siller", //滑动验证码所在页面div的id（业务系统预先在页面写入一个空的div，必填！）
      callback: take, //非必填
      url: verifyConfig.dtDomain + '/detect/dt/dragDetect.json' //滑动验证后台地址，必填！
    });
    siller.show();
  }
  window.slider = slider;

  //领券
  function take() {
    if (imgCodeScene) { //图形和滑动验证码同时打开或关闭
      if ($.trim($('.verify-dialog .ldp-box input').val()) == '') {
        if (imgCodeSceneType == 1) {
          var txt = '请输入图片验证码';
        } else {
          var txt = '请输入数字题答案';
        }
        $('.verify-inner-error').find('p').text(txt).show();
        setTimeout(function() {
          $('.verify-inner-error').find('p').hide();
          randomImage('.verify-dialog .ldp-box');
          slider();
        }, 2000);
        return;
      }

      var token = siller.queryToken();
      if (siller.status != 1) {
        AlertBox({
          type: 'mini',
          delay: 3000,
          msg: '您的操作太频繁或账号存在异常，请您稍后再试或者联系客服解决'
        });
        return;
      }
    }

    var data = {
      detect: bd.rst(),
      '_device_session_id': bd.ptoken()
    };
    if (imgCodeScene) {
      data['slide-token'] = token;
      data['uuid'] = $('.ldp-box img').attr('uuid');
      data['imageCode'] = $('.ldp-box input').val();
    }

    $.getJSON(verifyConfig.actDomain + '/act-wap-web/public/sign/encytype.do?channel=0&scenetype=0').done(function(res) {
      if (res.code == 1) {
        var crypto, salt;
        if (res.data && res.data.type) {
          crypto = res.data.type;
        } else {
          crypto = 'C9hoSH';
        }

        if (res.data && res.data.salt) {
          salt = res.data.salt;
        } else {
          salt = 'PY28nTCmSB';
        }

        $.loadScript({
          srcArr: [verifyConfig.channelRes + '/project/cmsWeb/suning/redpacket/bd2/js/' + crypto + '/' + crypto + '.js'],
          withoutGa: true,
          loadComplete: function() {
            var time = new Date().getTime();
            data.crypto = yyCrypto.crypto;
            data.time = time;
            data.salt = salt;
            cb(data);
          }
        });
      }
    });
  }

  //ajax请求
  function getJSON(url, data) {
    return $.ajax({
      type: 'GET',
      dataType: 'json',
      beforeSend: function(xhr) {
        try {
          xhr.withCredentials = true;
        } catch (e) {
          var nativeOpen = xhr.open;
          xhr.open = function() {
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
  window.getJSON = getJSON
}

function verifyEnv() {
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
    case 'sit':
      var sn_config = {
        dtDomain: '//dtsit.cnsuning.com',
        actDomain: '//actsit.cnsuning.com',
        vcsDomain: '//vcssit.cnsuning.com',
        fpDomain: '//fpsit.cnsuning.com',
        channelRes: '//sitres.suning.cn/'
      }
      break;
    case 'pre':
      var sn_config = {
        dtDomain: '//dtpre.cnsuning.com',
        actDomain: '//actpre.cnsuning.com',
        vcsDomain: '//vcspre.cnsuning.com',
        fpDomain: '//fppre.cnsuning.com',
        channelRes: '//presslres.suning.com'
      }
      break;
    case 'prd':
      var sn_config = {
        dtDomain: '//dt.suning.com',
        actDomain: '//act.suning.com',
        vcsDomain: '//vcs.suning.com',
        fpDomain: '//fp.suning.com',
        channelRes: '//res.suning.cn'
      }
      break;
  }
  return sn_config;
}
