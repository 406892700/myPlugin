/**
 * Created by Administrator on 2016/1/26.
 * 文字轮播插件
 * xhy
 * 2016-1-26
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
    $.fn.slidetext = function(opt){
        var that = this;
        var default_opt = {
            speed:50,
            data:[
                {nickname:'nickname',reward:''}
            ]
        };

        opt = $.extend({},default_opt,opt);

        var getTpl = function(){
            var tpl = [];
            tpl.push('');
            tpl.push('<div class="innerWrap">');
            tpl.push('<div class="slideBoard">');
            tpl.push('<table width="100%">');
            tpl.push('<thead>');
            tpl.push('</thead>');
            tpl.push('<tbody>');
            opt.data.map(function(v,i){
                tpl.push('<tr><td class="s_left">恭喜'+v.nikename+'</td><td class="s_left">'+ v.reward+'</td></tr>');
            });
            tpl.push('</tbody>');
            tpl.push('</table>');
            tpl.push('</div>');
            tpl.push('</div>');

            that.append(tpl.join(''));
        };

        var initSlide = function(){
            var slide = $('.slideBoard',that),
                itemHeight = slide.find('tbody tr').height(),
                offsetY = 0,
                itemList = slide.find('tbody tr'),
                length = itemList.length;
            if(length <= 5){
                return;
            }
            setInterval(function(){
                offsetY = slide.css('margin-top').slice(0,-2)*1;
                slide.css({'margin-top':(offsetY-1)+'px'});
                if(-offsetY > itemHeight){
                    offsetY = 0;
                    slide.find('tbody tr').eq(0).insertAfter(slide.find('tbody tr').eq(length-1));
                    slide.css('marginTop',0);
                }
            },opt.speed);
        };

        getTpl();
        initSlide();
    }
});

var link = document.createElement('link');
link.href = '/plugins/slidetext/slidetext.css';
link.rel = 'stylesheet';
document.getElementsByTagName('head')[0].appendChild(link);