/**
 * Created by Administrator on 2016/1/18.
 */
define(['jquery'], function ($) {
    $.fn.preview = function () {

        var that = this,//图片对象
            wrap = this.parent(),//图片外容器
            wrap_width = wrap.width(),//外容器宽度
            wrap_height = wrap.height(),//外容器高度
            FLY_WIDTH = 200,//移动块宽高
            natural_src = that.data('realPic'),//原图路径
            _fly_div = '<div class="_fly_div"></div>',//移动块模板
            _preview_div = 
                '<div class="_preview_div"><img src="'+natural_src+'" alt=""/></div>';//预览块

        var init = function(){
            wrap.append(_fly_div).append(_preview_div);
            var flyDiv = wrap.find('._fly_div'),
                previewDiv = wrap.find('._preview_div').css({width:wrap_width+'px',height:wrap_height+'px','left':(wrap_width+20)+'px'});
            bindEvent(flyDiv,previewDiv);
        };

        /*
         *
         * 下面这些事以前写的,感觉一已经看不懂了,醉了了
         * 直接给他抄过来了
         *
         * */
        //下面是一些工具函数
        var show = function(obj){//显示
            return obj.css('display','block');
        };

        var hide = function(obj){//隐藏
            return obj.css('display','none');
        };

        var addId = function(obj){//给flyDiv加上唯一的id
            obj = $(obj);
            var timeStamp = new Date().getTime();
            var id = "id_"+ timeStamp;
            obj.attr('id',id);
            return id;
        };

        var getPosition = function(obj){//获取位置(把带单位的值换算成数字型)
            return {
                left:$(obj).css('left').slice(0,-2)*1,
                top:$(obj).css('top').slice(0,-2)*1
            };
        };
        var inRange = function(range,value){//判断是不是在可用范围内
            var min = range.min,
                max = range.max;
            if(value < min)
                return min;
            else if(value > max)
                return max;
            else
                return value;
        };
        var changePosition = function(position,obj){//更改预览图的背景位置
            var left = position.left;
            var top = position.top;
            var ratio = wrap_width/FLY_WIDTH;
            obj.css({'left':-left*ratio+'px','top':-top*ratio+'px'});
            //obj.css({'background-position':''+(left*ratio)+'px '+(top*ratio)+'px'});
        };

        var bindEvent = function(flyDiv,previewDiv){//事件绑定
            var flyId = addId(flyDiv);
            wrap.mouseenter(function (evt) {//鼠标进入事件判断
                previewDiv.find('img')[0].src = that.data('realPic');
            });
            wrap.mousemove(function(evt){//移动事件
                var position,rangex,rangey,left,top;
                show(flyDiv);//显示flyDiv
                show(previewDiv);//显示previewDiv
                if(evt.target.id != flyId){
                    flyDiv.css({'left':evt.offsetX-FLY_WIDTH/2+'px','top':evt.offsetY-FLY_WIDTH/2+'px'});
                }
                else{
                    var position = getPosition(evt.target);
                    flyDiv.css({'left':evt.offsetX+position.left-FLY_WIDTH/2+'px','top':evt.offsetY+position.top-FLY_WIDTH/2+'px'});
                }
                position =  getPosition(flyDiv);
                rangex = {'min':0,'max':wrap_width-flyDiv.width()};
                rangey = {'min':0,'max':wrap_height-flyDiv.height()};
                left  = inRange(rangex,position.left);
                top  = inRange(rangey,position.top);

                flyDiv.css({'left':left+'px','top':top+'px'});

                changePosition(getPosition(flyDiv),previewDiv.find('img'));
            });

            wrap.mouseout(function (evt) {//移出事件

                hide(flyDiv);
                hide(previewDiv);
                changePosition({left:0,top:0},previewDiv.find('img'));
            });
        };

        init();//初始化函数

        return this;
    };

    //在这里直接加样式
    var link = document.createElement('link');
    link.href = 'plugins/preview/preview.css';
    link.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);
});