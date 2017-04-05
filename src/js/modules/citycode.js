
;(function() {

	var snDomain = '.suning.com';

	if(/\.cnsuning\.com$/i.test(location.host)){
		snDomain = '.cnsuning.com';
	}
	function ipPosition() {
		var cityIdTemp = $.cookie("cityId");
		var cityCodeTemp = $.cookie("cityCode");
		if( cityIdTemp && cityCodeTemp ){
			cityId = cityIdTemp;
			cityCode = cityCodeTemp
		}else {
			var date = new Date();
			date.setTime(date.getTime() + (180 * 24 * 60 * 60 * 1000));
			Wap.Geo(function (meta) {
				$.cookie("cityId", meta.cityNo, {path: "/", domain: snDomain, expires: date});
				$.cookie("provinceCode", meta.provinceCode, {path: "/", domain: snDomain, expires: date});
				$.cookie("districtId", meta.distNo, {path: "/", domain: snDomain, expires: date});
				$.cookie("cityCode", meta.cityCode, {path: "/", domain: snDomain, expires: date});
				cityId = meta.cityNo || DEF_CITY_ID;
				cityCode = meta.cityCode || DEF_CITY_CODE
			}, false)
		}

		if( $.os ){
	    var cityCodeApp = $.cookie("newCity");
	    if( cityCodeApp ){
        var date = new Date();
        var e = {
            path: "/",
            domain: snDomain,
            expires: date.setTime(date + (7 * 24 * 60 * 60 * 1000))
        };
        var g = cityCodeApp.split("_")[0];
        if (g) {
            $.cookie("cityCode", cityCodeApp.split("_")[0], e)
        }
	    }
		}

	}
	$(function() {
		ipPosition();
	})
})();
