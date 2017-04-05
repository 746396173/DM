
var csIndex = window.csIndex || {};

/**
 * tab切换及对应的商品渲染
 * @return {[type]} [description]
 */
;(function() {
  csIndex.scroller = function(b) {
    $(b).each(function() {
      var f = $(this);
      if (!f.parent().hasClass("app-type-choose")) {
        var c = f.find(".scroll-to-more");
        var e = new IScroll(this, {
          scrollX: true,
          scrollY: false,
          tap: true,
          bounce: (device.isApp && device.isAndroid) ? false : true,
          eventPassthrough: true
        });
        if (c.length != 0) {
          e.on("scroll",
            function() {
              if (this.x < this.maxScrollX - this.wrapperWidth / 5.8) {
                location.href = c.find("a").attr("href")
              }
            })
        }
        e.on("scrollEnd", d);

        function d() {
          f.find("img").each(function() {
            var g = $(this),
              j = g[0],
              h = f.offset().left;
            if (j.getAttribute("data-isrc") == null) {
              return
            }
            if ((g.offset().left >= h) && (g.offset().left - h < e.wrapperWidth) && (j.getAttribute("data-isrc") != "done")) {
              if (g.offset().top < win.innerHeight + win.scrollY) {
                j.onerror = function() {
                  this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                };
                j.src = j.getAttribute("data-isrc");
                j.setAttribute("data-isrc", "done")
              } else {
                j.setAttribute("data-src", j.getAttribute("data-isrc"));
                j.removeAttribute("data-isrc")
              }
            }
          })
        }
        d()
      }
    })
  };
  csIndex.tabProList = {
    randerProList: function(w, v, s, r) {
      var A = $("#prolist"),
        x = A.hasClass("app-pro-holder") ? A.find(".sn-tab-content").find(".current") : A,
        C = A.hasClass("new-tab");
      if (x.data("req-flag") == "true") {
        return
      }
      var y = x.attr("page-id");
      var q = parseInt(x.attr("pro-num"));
      var t = x.attr("data-cpage");
      var D = x.attr("data-tnum");
      if (!D && q) {
        D = Math.ceil(q / w);
        A.attr("data-tnum", D)
      }
      if (!s && t > 0) {
        return
      }
      var u = $(".sn-loading-type");
      if (x.attr("data-cpage") == x.attr("data-tnum")) {
        u.attr("data-status", "end")
      } else {
        u.attr("data-status", "loading")
      }
      if (q && (q < w) && (t != 0)) {
        u.attr("data-status", "end");
        return
      }
      if (x.attr("done") || (D && new Number(D) <= t)) {
        u.attr("data-status", "end");
        return
      }
      t++;
      var E = "";
      var z = x.attr("page-code");
      var B = x.attr("modelfull-id");
      if (t == 1 && !C && z) {
        E = sn_config.wapDomain + "/app/page/" + z + ".json"
      } else {
        if (y && B) {
          E = sn_config.wapDomain + "/app/list/" + y + "_" + B + "_" + t + "_" + w + ".json"
        } else {
          return
        }
      }
      $.ajax({
        url: E,
        async: false,
        dataType: "json",
        beforeSend: function() {
          x.data("req-flag", "true")
        },
        success: function(b) {
          x.data("req-flag", "false");
          x.attr("data-cpage", t);
          try {
            var e;
            if (t == 1 && !C) {
              x.attr("page-id", b.data.pageId);
              var f = "";
              if (b.data.modelList.length > 0) {
                f = b.data.modelList[0].cw_tab_pro_list.modelFullId
              }
              x.attr("modelfull-id", f);
              var c = b.data.modelList[0].cw_tab_pro_list.tag.length;
              var g = Math.ceil(c / w);
              x.attr("data-tnum", g);
              e = b.data;
              e.productList = e.modelList[0].cw_tab_pro_list.tag.slice(0, 10)
            } else {
              var g = Math.ceil(b.data.totalCount / w);
              x.attr("data-tnum", g);
              e = b.data
            }
            $.each(e.productList,
              function(h, j) {
                e.productList[h].prdUrl = $.base.getProductUrl(j.partnumber, j.vendorCode);
                e.productList[h].prdImgUrl = $.base.getProductImg(j.partnumber, 400);
                if (!e.productList[h].vendorCode) {
                  e.productList[h].vendorCode = ""
                }
              });
            var d = template.compile($("#" + v).html());
            x.find("ul").append(d(e))
          } catch (a) {
            console.log(a)
          }
          setTimeout(function() {
              $(window).trigger("scroll")
            },
            0);
          csIndex.tabProList.getProInfos();
          r && typeof r == "function" && r()
        }
      })
    },
    getProInfos: function() {
      $(".price-pro").getProPrice({
        callback: function(a, d) {
          $(d).each(function(k) {
            var h = $(this);
            if (a[k]) {
              h.attr({
                "data-price": a[k].price,
                "data-mpsid": a[k].mpsId
              });
              if (h.find(".pin-price")[0] && h.attr("data-pin") != "done") {
                var j = parseFloat(h.find(".pin-price").html().split("锟�")[1]);
                if (a[k].price) {
                  var c = parseFloat(a[k].price);
                  if (j < c) {
                    h.find(".pin-prices").html('<span class="pin-price">锟�' + j.toFixed(2) + '</span><del class="sale-price">锟�' + c.toFixed(2) + "</del>")
                  } else {
                    h.find(".pin-prices").css("bottom", "0.1rem").html('<span class="pin-price">锟�' + j.toFixed(2) + "</span>")
                  }
                } else {
                  h.find(".pin-prices").css("bottom", "0.1rem").html('<span class="pin-price">锟�' + j.toFixed(2) + "</span>")
                }
                h.attr("data-pin", "done")
              }
            }
          })
        }
      })
    },
    stickTop: function(g) {
      if (!document.querySelector(g)) {
        return
      }
      var j = $(g),
        k = j.parent().find(".placeholder"),
        b = window,
        h = j.parent().offset().top;

      function a() {
        if (j.css("position").indexOf("sticky") < 0) {
          var c = j.parent().offset().top;
          b.scrollY > c ? j.css("position", "fixed") && k.height(j.height()) : j.css("position", "static") && k.height(0)
        }
      }
      a();
      b.addEventListener("scroll", a)
    },
    tabExpandBar: function(D, s) {
      var q = this,
        w = $(D),
        C = w.data("hasmore");
      if (C) {
        var z = w.find(".app-type-more-right"),
          t = $('<div class="mask"></div>').appendTo("body"),
          v = w.find(".app-type-more"),
          x = w.find(".scroller-items"),
          u = w.find(".items-shadow"),
          E = w.find(".app-scroller");
        z.on("click", A);

        function A() {
          w.toggleClass("open");
          t.toggle();
          v.toggle()
        }

        function B() {
          w.removeClass("open");
          v.hide();
          t.hide()
        }
        t.on("click", B);
        $(window).on("scroll", B);
        q.iScroll = new IScroll(E[0], {
          scrollX: true,
          scrollY: false,
          click: false,
          bounce: (device.isApp && device.isAndroid) ? false : true,
          preventDefaultException: {
            tagName: /.*/
          },
          eventPassthrough: false
        });
        var r = (w.width() - z.width()) / 2 - 15,
          y = q.iScroll.maxScrollX;
        u.append(x.clone().children());
        w.on("click", ".item",
          function(b) {
            B();
            var c = $(this);
            var e = c.index();
            if (!c.hasClass("cur")) {
              s && typeof s == "function" && s(e)
            }
            var f = x.find(".item").eq(e);
            f.addClass("cur").siblings().removeClass("cur");
            u.find(".item").eq(e).addClass("cur").siblings().removeClass("cur");
            var a = f[0].offsetLeft;
            var g = 0;
            if ((y + a - r) < 0) {
              if (a > r) {
                g = r - a
              }
            } else {
              g = y
            }
            setTimeout(function() {
                q.iScroll.scrollTo(g, 0, 400)
              },
              180);
            var d = w.parent().offset().top;
            if (d > 0 && $(window).scrollTop() > d) {
              $(window).scrollTop(d)
            }
          })
      } else {
        w.on("click", ".item",
          function(a) {
            var b = $(this);
            var d = b.index();
            if (!b.hasClass("cur")) {
              s && typeof s == "function" && s(d)
            }
            b.addClass("cur").siblings().removeClass("cur");
            var c = w.parent().offset().top;
            if (c > 0 && $(window).scrollTop() > c) {
              $(window).scrollTop(c)
            }
          })
      }
    },
    init: function() {
      var g = 10;
      var f, j = $("#prolist"),
        h = j.hasClass("new-tab");
      if (j.length <= 0) return;
      if (j.find(".app33").length != 0) {
        f = "app33Temp"
      } else {
        if (j.find(".app34").length != 0) {
          f = "app34Temp"
        }
      }
      if (!f) {
        return
      }
      if (j.length == 0) {
        return
      }
      var k = $(".sn-loading-type");
      k.lazyload(function() {
        if (k.data("status") == "loading") {
          csIndex.tabProList.randerProList(g, f, true)
        }
      });
      h && csIndex.tabProList.randerProList(g, f, false);
      k.attr("data-status", "loading");
      if (j.hasClass("app-pro-holder")) {
        csIndex.tabProList.stickTop(".app-type-choose");
        csIndex.tabProList.tabExpandBar(".app-type-choose",
          function(b) {
            var a = $(".sn-tab-content").find(".sn-tab-box");
            a.eq(b).addClass("current").siblings().removeClass("current");
            csIndex.tabProList.randerProList(g, f, false)
          })
      }
    }
  };
  csIndex.init = function() {
    $(".pro").getProPrice();
    //tab切
    csIndex.tabProList.init();
    var $load = $('.sn-local-loading'),
        $end = $('.sn-end-loading');
    $load.hide();
    $end.show();
    $('.lazyimg').lazyload();
  }
  csIndex.init()
})();
