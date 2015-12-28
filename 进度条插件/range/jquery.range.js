/**
 * Created by Administrator on 2015/12/25.
 */


/*
* =--------------------------------------------
*
*
*   滑块插件
*   author xhy
*   date 2015-12-25
*   depency:jQuery
*
*
* ----------------------------------------------
* */
$.xSlide = (function($){
    /*滑块对象*/
    var XSlide = function (opt,callback) {
        this.elem = $(opt.elem);
        this.width = this.elem.width();
//            this.input = this.elem.find('input');
        this.pri_val = opt.pri_val || 0;
        this.length = opt.length || 1;
        this.callback = callback || $.noop;

        XSlide.prototype.init.call(this);
    };

    /*把小数转化为百分比*/
    XSlide.changeNum = function (str,type) {
        str = str+'';
        var reg = /[^%]*%$/;
        if(type)
            return reg.test(str) ? str : str*100+'%';
        else
            return reg.test(str) ? str.slice(0,-1)/100 : str*1;
    };

    /*保留小数*/
    XSlide.preLength = function (num,len) {
        var num = num +'',
            getZero = function (len) {
                var tmp = '';
                for(var i = 0;i<len;i++){
                    tmp+='0';
                }
                return tmp;
            };
        if(num.indexOf('.') == -1){
            return (num+'.'+getZero(2))*1;
        }else{
            var dec = num.split('.')[0],
                digi = num.split('.')[1];
            if(digi.length > len)
                digi = digi.slice(0,len);
            else
                digi+=getZero(len-digi.length);

            return dec+'.'+digi;
        }

    };

    /*获取模板方法*/
    var getTpl = function(){
        var tpl = [];
        tpl.push('<div class="xRangeWrap">');
        tpl.push('<div class="xPercent"></div>');
        tpl.push('<a href="javascript:void(0)" class="slide_btn"></a>');
        tpl.push('</div>');

        return $(tpl.join(''));
    };

    /*初始化*/
    XSlide.prototype.init = function () {
        //this.input.hide();
        getTpl().appendTo(this.elem);
        this.setVal(this.pri_val).Drag();

    };

    /*设置值，这个可以外部调用*/
    XSlide.prototype.setVal = function (val) {
        var xP = this.elem.find('.xPercent'),
            sB =this.elem.find('.slide_btn'),
            val = XSlide.changeNum(val,'%');

        xP.animate({'width':val},'0.5s');
        sB.animate({'left':val},'0.5s');
        return this;
    };

    /*拖动初始化*/
    XSlide.prototype.Drag = function () {
        var xP = this.elem.find('.xPercent'),
            sB =this.elem.find('.slide_btn'),
            that = this;
        sB.bind('mousedown',function(evt){
            evt.preventDefault();
            var oX = evt.clientX,
                ctrlVal = function (offsetX,oLeft) {
                    newLeft = offsetX+oLeft;
                    if(newLeft < 0){
                        newLeft = 0;
                    }else if(newLeft > that.width){
                        newLeft = that.width;
                    }

                    sB.css({'left':newLeft+'px'});
                    xP.css({'width':newLeft+'px'});
                    var val = XSlide.preLength(newLeft/that.width,that.length);
                    that.callback(val);
                },
                move = function(evt){
                    var cX = evt.clientX,
                        offsetX = (cX - oX),
                        oLeft =sB.css('left').slice(0,-2)*1;
                    ctrlVal(offsetX,oLeft);
                    oX = cX;
                },
                end = function(){
                    document.body.removeEventListener('mousemove',move);
                    document.body.removeEventListener('mouseup',end);
                };


            document.body.addEventListener('mousemove',move);
            document.body.addEventListener('mouseup',end);
        });
    };


    /*闭包返回*/
    return function(elem,pri_val,digi){
        return new XSlide(elem,pri_val,digi);
    }
})($);