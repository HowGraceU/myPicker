# myPicker
<h3>类似安卓源生的picker</h3>
说明：基于jq或者zepto实现的picker。
问题：因为要用到picker去网上找了一些。而找到的大多没有做响应式，而且感觉引用了iScroll代码臃肿（兼容可能要好）。所以自己做了一个picker。

注意事项：这个picker只引用jq或者zepto。使用overflow：scroll实现滑动。而ios中scroll和touch相关事件会冲突，所以不能使用一些tapjs（原因见myTap项目）。