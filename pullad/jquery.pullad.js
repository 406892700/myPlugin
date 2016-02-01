/**
 * Created by xhy on 16/1/23.
 */
/*
* 首页广告插件
* 从以前写的网站上扒下来的
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
}(function ($) {
    $.pull_ad = function (n) {
        var r = {
                pic_lg: "",
                pic_sm: "",
                link: "",
                speed: 1000,
                delay: 5000,
                callback: function () {
                }
            },
            t,
            i;
        (n = $.extend({},
            r, n), n.pic_lg && n.pic_sm) && (n.callback(), t = $('<a style="background-position: center 0px;height: 300px;display:block;" href=' + n.link + ' target="_blank"><\/a>'), i = function () {
            t.css("background-image", "url(" + n.pic_lg + ")");
            t.prependTo($("body"));
            setTimeout(function () {
                    t.animate({
                            height: "0px"
                        },
                        n.speed, "swing",
                        function () {
                            $(this).css("background-image", "url(" + n.pic_sm + ")")
                        }).animate({
                            height: "120px"
                        },
                        n.speed, "swing")
                },
                n.delay)
        },
    i())
    };
}));