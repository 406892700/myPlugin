/**
 * Created by Administrator on 2016/1/26.
 * 图片资源预先加载插件
 * xhy
 * 2016-1-26
 * 简易版
 * 只能对图片资源和script资源之类有src属性的进行预先加载
 *
 */
;(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define([ "jquery" ], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
})(function($){
    $.fn.prevload = function (callback) {
        var that = this,
            setting = {

            },
            setSmooth = function(start,end,callback){
                var _x = setInterval(function(){
                    if(start >= end){
                        clearInterval(_x);
                    }else{
                        callback(++start);
                        if(start*1 === 99){
                            callback(start);
                        }
                    }

                },10);
            },
            allcount = that.length,
            donecount = 0,
            precentage = 0;

        var init = function () {
            that.each(function(i,v){
                var img = new Image(),
                    self = this,
                    src = $(self).data('src');
                img.src = src;
                img.onload = function () {
                    donecount++;
                    precentage = donecount/allcount*100;
                    var precentagePre = (donecount-1)/allcount*100;
                    $(self).attr('src',src);
                    setSmooth(precentagePre,precentage,callback);
                };
            });
        };

        init();

        return this;

    };
});