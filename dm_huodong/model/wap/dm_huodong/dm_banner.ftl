
<#compress> 
<#import "cms_macro.ftl" as cms />
<@s.model m=model>
<section class="dm-banner-block lazyimg">
	<#if dm_mainbanner?? && dm_mainbanner.tag?? && (dm_mainbanner.tag?size>0)>
	  <#list dm_mainbanner.tag as tag>
	  <div class="dm-banner">
	  	<#if tag.linkUrl?? && tag.linkUrl?length gt 1 >
		    <a href="${tag.linkUrl}" name="${tag.trickPoint}">
		      <img data-src="${imgUrl(tag.picUrl)}">
		    </a>
	    <#else>
	    	<img data-src="${imgUrl(tag.picUrl)}" name="${tag.trickPoint}">
	    </#if>
	  </div>
    </#list> 
  </#if>

  <#if dm_quan?? && dm_quan.tag?? && (dm_quan.tag?size>0)>
    <#list dm_quan.tag as tag>
	  <div class="dm-banner dm-banner2" id="J-quan">
	  	<#if tag.linkUrl?? && tag.linkUrl?length gt 1 >
		    <a href="${tag.linkUrl}" name="${tag.trickPoint}">
		      <img data-src="${imgUrl(tag.picUrl)}">
		    </a>
	    <#else>
	    	<img data-src="${imgUrl(tag.picUrl)}" name="${tag.trickPoint}">
	    </#if>
	  </div>
    </#list> 
  </#if>
</section>
</@s.model>
</#compress>
