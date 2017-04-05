
<#compress> 
<#import "cms_macro.ftl" as cms />
<@s.model m=model>
<div class="dm-guide" id="J-guide">
	<#if dm_guide_btn1?? && dm_guide_btn1.tag?? && (dm_guide_btn1.tag?size>0)>
		<#list dm_guide_btn1.tag as tag>
			<a href="${tag.linkUrl}" name="${tag.trickPoint}">
				${tag.elementName}
			</a>
		</#list>
	</#if>

	<#if dm_guide_btn2?? && dm_guide_btn2.tag?? && (dm_guide_btn2.tag?size>0)>
		<#list dm_guide_btn2.tag as tag>
		<a href="${tag.linkUrl}" name="${tag.trickPoint}">
			${tag.elementName}
		</a>
		</#list>
	</#if>

	<#if dm_guide_btn3?? && dm_guide_btn3.tag?? && (dm_guide_btn3.tag?size>0)>
		<#list dm_guide_btn3.tag as tag>
		<a href="javascript:;" name="${tag.trickPoint}" id="J-download">
			${tag.elementName}
		</a>
		</#list>
	</#if>
</div>

</@s.model>
</#compress>
