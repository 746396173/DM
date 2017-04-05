
<#compress> 
<#import "cms_macro.ftl" as cms />
<@s.model m=model>
<#if dm_head_title?? && dm_head_title.tag?? && (dm_head_title.tag?size>0)>
  <#list dm_head_title.tag as tag>
		<div class="sn-nav" id="sn-nav">
		  <div class="sn-nav-back" id="sn-nav-back">
		  	<a href="javascript:history.go(-1);">返回</a>
		  </div>

		  <div class="sn-nav-title">
		    <h1 class="of">${tag.elementName}</h1>
		  </div>
		  
		  <div class="sn-nav-right tr pr">
		    <img id="more_dot" onclick="$('#sub-title').toggle();$('#screenIfmNav').toggle();" src="data:image/png;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAYUExURUxpcTQ8RDQ8RDQ8RDQ8RDQ8RDQ8RDQ8RAEPSCIAAAAHdFJOUwD2cEy/EYW+tvqEAAAAb0lEQVRIDe2ROw7AMAhDwy/c/8ZVOgCVKuhayUyRsSF5WQsFAiAAAl8JiBKpPN29tv2uXTO9Jk5sxuRlz6Cp85nPrrlm0MjteM0pI4M2tGNO8Q2XiEjxDU+NSPX1QCOyqq//tsy8+bKLEwiAwK8IXL+VA7VJ24A2AAAAAElFTkSuQmCC" style="width:.9rem;">
		    <ul class="nav-more-list" id="sub-title">
		      <li><a class="nav-more-icon home-icon" href="#">首页</a></li>
		      <li><a class="nav-more-icon cart-icon" href="#">购物车</a></li>
		      <li><a class="nav-more-icon search-icon" href="#">搜索</a></li>
		      <li><a class="nav-more-icon cate-icon" href="#">全部分类</a></li>
		      <li><a class="nav-more-icon ebuy-icon" href="#">我的易购</a></li>
		    </ul>
		  </div>
		  <div id="screenIfmNav" class="screenIfm" onclick="$('#sub-title').toggle();$(this).hide();" style="opacity:0;">
		  </div>
		</div>

		<script>
	    if( !device.isApp ) {
        document.getElementById('sn-nav').style.display = 'block';
	    }
		</script>

  </#list> 
</#if>
</@s.model>
</#compress>
