/**
 * Created by Administrator on 2016/1/21.
 */

/*
* tab 切换插件
* 简易版
* xhy
* */
;(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define([ "jquery" ], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
})(function ($) {
    $.fn.tabs = function(panels,option){
        var that = this,
            $panel = $(panels),
            default_opt = {//默认参数
                classx:'actived',//默认选中类
                eventType:'click',//默认触发事件类型
                callbacks:[]//回调函数列表
            };

        option = $.extend({},default_opt,option);//合并参数

        that.bind(option.eventType,function(evt){//事件绑定
            var $this = $(this),
                index = that.index($this),
                cb = function () {//回调的函数（这么做主要是考虑了异步的情况，但是感觉用处不大，先留着这个）
                    that.filter('.'+option.classx).removeClass(option.classx);
                    $this.addClass(option.classx);
                    $panel.css('display','none').eq(index).css('display','block');
                };
            console.log($this.index());

            if(option.callbacks[index]){//如果回调不为空
                option.callbacks[index](evt,cb);
            }else{//如果回调为空，直接执行cb
                cb();
            }

        });

    };

    return $.fn.tabs;
});