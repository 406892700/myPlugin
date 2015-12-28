/**
 * Created by Administrator on 2015/12/9.
 */
/*
*
*
*  DIYScroll 插件
*  author xhy
*  date 2015-12-9
*
*
* */


var DIYScroll = (function(global,undefined){

    String.prototype.toInt = function () {
        return this.replace('px','')*1;
    };

    var fc = {
        isElement: function (ele) {//判断是否是元素
            return ele.nodeName !== undefined ? ele : false;
        },
        getElement: function (slc) {//获取元素
            return document.querySelector(slc);
        },
        camelCase: function (str) {//驼峰式
            return str.replace(/(-[\da-z])/gi,function(word,letter){
                return RegExp.$1.substr(1,1).toUpperCase();
            });
            //return str;
        },
        css : function (ele,prop,value) {//设置样式
            if(arguments.length <= 1){
                return null;
            }else if(arguments.length == 2){
                var val = window.getComputedStyle(ele,null)[prop];
                if(val == 'auto'){
                    return '0px';
                }
                return val;
            }else{
                ele.style[prop] = value;
            }
        },
        getHeight: function (ele) {//获取height
            return ele.offsetHeight.toInt();
        },
        getWidth: function () {//获取width
            return ele.offsetWidth.toInt();
        },
        getInt : function (value) {
            return value.slice(0,-2)*1;
        }
    };
    var DIYScroll = function (outer,inner) {
        this.outer = fc.isElement(outer) || fc.getElement(outer);
        this.inner = fc.isElement(inner) || fc.getElement(inner);
    };

    var _args = DIYScroll.args = {
        oHeight:0,//外容器高度
        iHeight:0,//内容器高度
        sHeight:0, //滚动条高度
        ifNeedScroll:function () {//判断是否需要滚动条
            return _args.iHeight > _args.oHeight;
        }
       // offsetRange:[0,this.oHeight - this.sHeight]
    };


    DIYScroll.fn = DIYScroll.prototype;

    DIYScroll.fn.init = function(){//初始化方法
        var s_f_h = document.createElement('div'),
            s_i_h = document.createElement('div');
        s_f_h.className = 's_fakeWrap_h';
        s_i_h.className = 's_innerScroll_h';

        s_f_h.appendChild(s_i_h);
        this.outer.appendChild(s_f_h);
        this.addInterval(s_i_h).scrollDrag(s_i_h);
        return this;
    };
    
    var  addScrollBar = function (inner,outer,s_i_h) {//添加滚动条组件
        //<div class="s_fakeWrap_h"><div class="s_innerScroll_h"></div></div>
        var oH = DIYScroll.args.oHeight = fc.css(outer,'height').toInt(),
            iH = DIYScroll.args.iHeight = fc.css(inner,'height').toInt(),
            //sH = oH*(iH-oH)/iH;
            sH = oH*oH/iH;
        if(iH < oH){
            fc.css(s_i_h,'display','none');
        }else{
            fc.css(s_i_h,'display','block');
        }
        fc.css(s_i_h,'height',sH+'px');
        DIYScroll.args.sHeight = fc.css(s_i_h,'height').toInt();
        //console.log(oH,iH,sH);
        //    this.addInterval(s_i_h,sH);
        return this;

    };

    DIYScroll.fn.addInterval = function (s_i_h) {
        var inner = this.inner,
            outer = this.outer;
        setInterval(function(){
            addScrollBar(inner,outer,s_i_h);
        },500);
        return this;
    };

    DIYScroll.fn.scrollDrag = function (s_i_h) {
        var body = document.body,
            that = this;
        /*
        * 以下为鼠标拖动滚条事件
        * */

        var mouseFunc = function (evt) {
            if(!_args.ifNeedScroll()){
                return;
            }
            var oY = fc.css(s_i_h,'top').toInt(),//获取初始top值
                eoY = evt.clientY,//初始鼠标位置
                maxOffset = _args.oHeight - _args.sHeight,
                offsetInner = 0;
            var dragMove = function dragMove(evt) {
                evt.preventDefault();
                var ecY = evt.clientY,//移动时鼠标位置
                    offsetY = ecY-eoY,
                    topValue = oY + offsetY;
                if(topValue < 0){
                    topValue = 0;
                }else if(topValue > maxOffset){
                    topValue = maxOffset;
                }

                offsetInner = -(topValue/_args.oHeight)*_args.iHeight+'px';//内容器的卷动高度
                fc.css(that.inner,'top',offsetInner);
                fc.css(s_i_h,'top',topValue+'px');
            };

            var dragEnd = function dragEnd() {
                body.removeEventListener('mousemove',dragMove);
                body.removeEventListener('mouseup',dragEnd);
            };
            body.addEventListener('mousemove',dragMove,false);
            body.addEventListener('mouseup',dragEnd,false);
        };


        /*
        * 以下为鼠标滚珠滚动事件
        * */

        var scrollFunc = function (evt) {//事件处理函数
            if(!_args.ifNeedScroll()){
                return;
            }
            evt = evt || window.event;
            //evt.stopPropagation ? evt.stopPropagation() : evt.cancelBubble();
            evt.preventDefault();//阻止冒泡（兼容火狐）
            evt.returnValue = false;//阻止冒泡(兼容非火狐)
            var direc = evt.wheelDelta || detail,
                step = 20,//滚动条卷动步长
                oY = fc.css(s_i_h,'top').toInt(),//获取初始top值
                maxOffset = _args.oHeight - _args.sHeight,//最大卷动值
                offsetInner = 0;//inner的卷动值
            if(direc < 0){
                oY += step;
                //console.log('向下滚动');

            }else{
                oY -= step;
                //console.log('向上滚动');
            }
            topValue = oY;//距离顶部

            if(topValue < 0){
                topValue = 0;
            }else if(topValue > maxOffset){
                topValue = maxOffset;
            }

            offsetInner = -(topValue/_args.oHeight)*_args.iHeight+'px';//内容器的卷动高度
            fc.css(that.inner,'top',offsetInner);
            fc.css(s_i_h,'top',topValue+'px');
        };


        /*
        * 以下为滚轮事件与鼠标拖拽事件的事件注册
        * */
        if(document.addEventListener){//火狐必须要用这个
            this.inner.addEventListener('DOMMouseScroll',scrollFunc,false);
        }

        this.inner.onmousewheel = scrollFunc;//ie chrome opera

        s_i_h.addEventListener('mousedown',mouseFunc,false);

    };

    return DIYScroll;
})(window,undefined);