
<#compress> 
<#import "cms_macro.ftl" as cms />
<@s.model m=model>

<#if dm_tab_item??>
<#-- 二合一tab栏+app34样式的商品展示 [[ -->
	<div class="app-pro-holder app34-tab w new-tab" id="prolist">
		<#-- 选项大于四个 [[-->
		<#if (dm_tab_item.tag?exists &&dm_tab_item.tag?size>0)>
		<#if (dm_tab_item.tag?size > 4)>
				<div class="app-type-choose sticky" data-hasmore="true">
					<div class="app-scroller">
						<div class="scroller-items hor-view">
								<#list dm_tab_item.tag as  tag>
									<a name="${tag.trickPoint}" class="item <#if tag_index == 0>cur</#if>">
										${tag.elementName}
								</a>
								</#list>
						</div>
					</div>
				<div class="app-type-more-right" id="S_more"><span>更多</span></div>
				<div class="app-type-more type-choose fix none">
					<div class="items-shadow"></div>
				</div>
			</div>
		<#else>
		<#-- 选项大于四个 ]]-->
		<#-- 选项不大于四个 [[-->
		    <div class="app-type-choose sticky">
				<div class="sn-tab-nav hor-view">
					<#list dm_tab_item.tag as  tag>
						<a name="${tag.trickPoint}" class="item <#if tag_index == 0>cur</#if>">
							${tag.elementName}
						</a>
					</#list>
				</div>
			</div>
		</#if>
	</#if>
	<#-- 选项不大于四个 ]]-->
	 
	<div class="placeholder"></div>
		<div class="sn-tab-content mt20 app34">
			<#if (dm_tab_item.tag?exists &&dm_tab_item.tag?size>0)>
				<#list dm_tab_item.tag as  tag>
					<#if (dm_tab_item.nodes?exists &&dm_tab_item.nodes?size>0)>
							<#list dm_tab_item.nodes as  productlist>
                                  <#if productlist_index == tag_index>
                                  	<#if productlist.tag?exists &&productlist.tag?size gt 0>
									<#assign shownumber = productlist.elementShowNumber>
									<#assign pronum = productlist.tag?size>
									<#assign modelfullId = productlist.modelFullId>
                                     </#if>  
                                   </#if>       
							</#list>
					</#if>	
				    <div class="sn-tab-box <#if tag_index == 0>current</#if>" page-id="${pageId.pageId}"  modelfull-id = "${modelfullId}" data-cpage="0" pro-num="${pronum}">
					<ul class="pro-list dm-prolist lazyimg"></ul>
				</div>
				</#list>
			</#if>
			</div>
		</div>

		<#-- 二合一tab栏 ]] -->

		<script type="text/html" id="app34Temp">
			{{each productList as product index}}
			<li class="pro-item price-pro" data-proid="{{product.productId}}" data-procode="{{product.partnumber}}" data-vendorcode="{{product.vendorCode}}">
				<a class="pro-img-box dm-pro-img" name="{{product.trickPoint}}" href="{{product.prdUrl}}">
					<img data-src="{{product.prdImgUrl}}">
					{{if product.wpelementDesc}}
					<span class="sale-tag">{{product.wpelementDesc}}</span>
					{{/if}}
				</a>
				<div class="info-bar fix">
					<div class="pro-title dm-pro-title">
						<span>
							{{product.elementName}}
						</span>
					</div>
					<div class="dm-pro-price">
						<span class="sale-price dm-real-price"></span>
						<del class="tag-price dm-sn-price"></del>
					</div>
				</div>
			</li>
			{{/each}}
		</script>
</#if>

</@s.model>
</#compress>	
