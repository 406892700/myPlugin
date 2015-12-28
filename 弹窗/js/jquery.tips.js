﻿$.tips = function(obj,url,callback){
	var that = this;
	var default_obj = {
		width:500,//宽
		height:400,//高
		close:true,//是否需要关闭按钮
		dnd:true,//是否可以拖动
		mask:true,//是否需要遮罩层
		content:'请加入内容...'//内容
	};

	callback || (callback = $.noop);//若无回调，为其赋空函数
	obj = $.extend({},default_obj,obj);//合并参数

	function tips(){//构造函数
		return tips.prototype.init();
	};

	tips.prototype = {//原型
		constructor:tips,
		html:$('<div class="tips" id="tips"><div class="drag"></div><div class="content"></div></div>'),
		mask:$('<div class="mask"></div>'),
		loading:$('<div class="loading"></div>'),
		_getRemoteData:function(url){//获取远程信息
			var that = this;
			$.ajax({
				beforeSend:function(){
					that._toggleLoading(true);
				},
				url:url,
				success:function(data){
					callback(data);
					that._toggleLoading(false);
				},
				error:function(err){
					//that._toggleLoading(false);
				}
			})
		},
		_toggleLoading:function(flag){//切换显示加载中
			flag?
				this.html.append(this.loading)
				:
				this.loading.remove();
			return this;
		},
		_setContent:function(arg){//设置填充内容
			if(!url){
				this.html.find('.content')
						.css({'height':obj.height+'px','width':obj.width+'px'})
						.empty()
						.append(obj.content);
			}else{
				this._getRemoteData(url);
			}

			return this;
		},
		_setSize:function(width,height){//重置大小
			this.html.css({'width':width+'px','height':height+'px'});
			return this;

		},
		_setPosition:function(){//设定位置
			var windowWidth = window.innerWidth;
			var windowHeight = window.innerHeight;
			var ps = {'left':((windowWidth-obj.width)/2)+'px','top':((windowHeight-obj.height)/2)+'px'};
			this.html.css(ps);
			return this;
		},
		show:function(){//显示弹窗
			this.html.css('display','block');
			return this;
		},
		hide:function(){//隐藏弹窗
			this.html.css('display','none');
			this.mask.css('display','none');
			return this;
		},
		toggleClose:function(flag){//是否可以关闭
			if(!flag)
				return this;
			var close = $('<a class="close"></a>');
			var that = this;
			this.html
				.append(close);
				close.click(function(){
					tips.prototype.hide.call(that);
				});
				return this;
		},
		dnd:function(flag){//拖放函数
			if(!flag){
				this.html.find('.drag').css('cursor','auto');
				return this;
			}
			var that = this;
			var dragArea = this.html.find('.drag');//可拖动区域
			dragArea.bind('mousedown',function(evt){//绑定事件
				var evtElem = that.html;//被拖动对象
				var evtx = evt;//事件event对象
				var move = function(evt){//拖动函数
					var left = evt.clientX-evtx.offsetX+'px';
					var top  = evt.clientY-evtx.offsetY+'px';
					evtElem.css({'left':left,'top':top});
				};

				var mouseup = function(evt){//鼠标抬起函数
					$('body')[0].removeEventListener('mousemove',move);//清除拖动
				};

				$('body')[0].addEventListener('mousemove',move);//绑定
				$('body')[0].addEventListener('mouseup',mouseup);//绑定
			});
			return this;
		},
		showMask:function(flag){//遮罩层函数
			if(!flag){
				return this;
			}
			this.mask.css('display','block');
			return this;
		},
		init:function(){//初始化
			$('body').prepend(this.mask).prepend(this.html);
			this._setPosition('center')
				._setSize(obj.width,obj.height)
				.toggleClose(obj.close)
				.dnd(obj.dnd)
				._setContent(obj.content)
				.showMask(obj.mask)
				.show();
			return this;
		}
	};

	return tips();

}