//图片轮播插件

/**
*2015-7-3
*xhy
*/

;(function(global,$){
        $.fn.slide = function(opt){
            var that = this;//保存this指针对象
            var default_opt = {//默认对象
                 obj:[
                 
                ],
                frequency:3000
            }

            opt = $.extend({},default_opt,opt);//合并配置对象

            function slide(){//轮播对象

            }

            slide.fn = slide.prototype = {
                constructor:slide,//构造函数
                wrap:that,//轮播主体
                wrapWidth:that.width(),//轮播视口宽度
                obj:opt.obj,//配置参数
                control:$("<div class=\"slide_control\"></div>"),//轮播点状控制器
                btnLeft:$("<a href=\"javascript:void(0)\" class=\"control_btn arrow_left\">&lt;</a>"),//轮播左按钮
                btnRight:$("<a href=\"javascript:void(0)\" class=\"control_btn arrow_right\">&gt;</a>"),//轮播右按钮
                imgWrap:$("<div class=\"img_wrap\"></div>"),//图片总容器
                innerWrap:"<div class=\"inner_wrap\"><a href=\"@{url}\"><img src=\"@{img}\" alt=\"@{alt}\"></a></div>",//图片内部容器
                _replaceTag:function(op){//填入数据
                    var str = this.innerWrap;
                    var tags = [];
                    for(var i in op){
                        tags.push(i);
                    }

                    var temp = str.replace(new RegExp('@{('+tags.join('|')+')}','g'),function(v){
                        return op[v.slice(2,-1)]; 
                    })
                    return temp;
                },
                _getImg:function(){//获取到所有图片
                    var imgs = this.obj,//图片数组对象
                        imgStr = [];
                    for(var i=0;i<imgs.length;i++){

                        imgStr.push(this._replaceTag(imgs[i]));
                    }
                    return imgStr.join('');
                },
                _fillControl:function(){//生成点状控制器
                    var controlStr = [];
                    console.log(-(this.control.width()/2)+'px');
                    
                    for(var i=1;i<=this.obj.length;i++){
                        if(i==1)
                            this.control.append('<a class="actived" href="javascript:void(0)" data-index='+i+'></a>');
                        else
                            this.control.append('<a href="javascript:void(0)" data-index='+i+'></a>');
                    }
                    return controlStr.join('\n');
                },
                _initImg:function(){//初始化图片
                    $('.inner_wrap',that).css('width',this.wrapWidth+'px');
                    return this;
                },
                _listImgs:function(index){//图片滑动函数
                    this.imgWrap.animate({'left':-(index-1)*this.wrapWidth+'px'});
                    return this;
                },
                _bindControl:function(){//绑定所有事件
                    var thisx = this;
                    var control = this.control,//获取控制器
                        currentIndex = control.find('.actived').data('index'),//获取序号
                        dotList = control.find('a'),//获取控制器点
                        dotLength = dotList.length;//长度

                    var addCurrent = function(index){//添加选中样式
                        control.find('.actived').removeClass('actived');
                        dotList.eq(index-1).addClass('actived');
                    }
                    var leftClick = function(e){//左滑
                        if(currentIndex == 1)
                            currentIndex = dotLength+1;
                        currentIndex--;
                        thisx._listImgs(currentIndex);
                        addCurrent(currentIndex);
                    }

                    var rightClick = function(){//右滑
                        if(currentIndex == dotLength)
                            currentIndex = 0;
                        currentIndex++;
                        thisx._listImgs(currentIndex);
                        addCurrent(currentIndex);
                    }

                    var dotClick = function(){//点状控制器点击
                        dotList.bind('click',function(e){
                            var index = $(this).data('index');
                            thisx._listImgs(index);
                            addCurrent(index);
                        });
                    }

                    var timer = setInterval(function(){//定时器~~
                            thisx.btnRight.trigger('click');
                        },opt.frequency);

                    that.hover(function(e){
                        clearInterval(timer);
                    },function(e){
                        timer = setInterval(function(){
                            thisx.btnRight.trigger('click');
                        },opt.frequency);
                    });
                    this.btnRight.bind('click',rightClick);//事件绑定
                    this.btnLeft.bind('click',leftClick);//事件绑定
                    dotClick();
                },
                init:function(){//初始化函数
                    this.wrap
                    .append(this.control.append(this._fillControl()))
                    .append(this.btnLeft)
                    .append(this.btnRight)
                    .append(this.imgWrap.append(this._getImg()));//生成轮播dom结构

                    this._initImg();//初始化图片列表
                    this._bindControl();//绑定控制器
                    this.control.css('margin-left',-(this.control.width()/2)+'px');//控制器居中，这个可以优化，先放这里了
                }

            };

            return this.each(function(){
                slide.fn.init();
            });
        }
})(window,jQuery);
