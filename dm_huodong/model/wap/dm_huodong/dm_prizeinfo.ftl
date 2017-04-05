
<#compress> 
<#import "cms_macro.ftl" as cms />
<@s.model m=model>
  <div class="verify-dialog dialog">
    <div class="dialog-wrap">
      <div class="content">
        <h5>
          领券的爸妈太多了，为保证您的权益，需要填写验证码哦～
        </h5>
        <div class="ldp-box">
          <div class="ldp-verify">
            <input type="text" placeholder="请输入右侧验证码" value="" name="dialoginput">
          </div>
          <img>
        </div>
        <div class="verify-inner-error"><p>请输入正确的验证码</p></div>
        <div class="siller" id="siller"></div>
        <div class="verify-success">验证成功</div>
        <div class="verify-error"></div>
      </div>
      <div class="quan-content">
        <h2>
          恭喜您
        </h2>
        <div class="quan-text">
          <p>
            <b class="txt1">恭喜您获得母婴</b><span id="J-quancount"></span><b class="txt2">元优惠券</b>
          </p>
          <small>稍后将发送至【我的优惠券】</small>
        </div>
        <div class="quan-btn">
          <a href="#" id="J-lookquan">查看优惠券</a>
          <a href="javascript:;" id="J-closebtn">我知道了</a>
        </div>
      </div>
      <div class="dm-time">
        <p>活动尚未开始，请耐心等待哦</p>
        <p>活动时间：2017.3.22 — 3.27</p>
      </div>
      <a href="javascript:void(0)" class="close-dialog close">
        <i></i>
      </a>
    </div>
  </div>
  <#if beijing_code?? && beijing_code.tag?? && (beijing_code.tag?size>0)>
    <#list beijing_code.tag as tag>
      <input type="hidden" value="${tag.elementName}" id="J-bjcode">
    </#list> 
  </#if>
  <#if shenyang_code?? && shenyang_code.tag?? && (shenyang_code.tag?size>0)>
    <#list shenyang_code.tag as tag>
      <input type="hidden" value="${tag.elementName}" id="J-sycode">
    </#list> 
  </#if>
</@s.model>
</#compress>
