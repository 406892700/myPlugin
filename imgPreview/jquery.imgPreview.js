/**
 * Created by Administrator on 2016/1/20.
 */
define(['jquery'],function($){
    /*
    * 图片预览插件
    * 简易版
    * */
    $.fn.imgPreview = function(){
        var that = this,
            wrap = that.parent(),
            img = new Image(),
            flag = false;

        
        var init = function () {
            var _btn = $('<a class="_icon_preview" href="javascript:void(0)"></a>');
            wrap.css('position','relative').append(_btn);
        };
        $('body').on('click','._preview_mask',function(evt){
            $(this).remove();
        });

        $('body').on('click','._icon_preview',function(evt){

            var _mask = $('<div class="_preview_mask"> </div>'),
                _panel = $('<div class="_img_wrap"></div>');
            img.src = $(this).siblings('img').data('realPic');


            //img.onload = function(){
                var picWidth = img.width,
                    picHeight = img.height;
                _panel.css({'margin-left':-(picWidth/2)+'px','margin-top':-(picHeight/2)+'px'}).append(img);
                _mask.empty().append(_panel).appendTo($('body'));
            //}

        });

        init();


    };

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'plugins/imgPreview/imgPreview.css';
    document.getElementsByTagName('head')[0].appendChild(link);

    return $.fn.imgPreview;
});