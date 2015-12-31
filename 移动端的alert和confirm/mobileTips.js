/*
	
	移动端的弹窗插件
	author xhy
	date 2015-12-31
	depencies
		1：xQuery(或jQuery/zepto)
		2：fastclick（这个可选，可以不要）
	待完善：
		1：动画效果没做（不过貌似用了动画比较影响性能，尤其是在低端安卓机中）
		2：dom重绘重流较多，这个先不改了
		3：弹窗dom删除时候，没有自动去删除事件绑定，依赖浏览器的自主解绑能力，
		   可能存在内存泄露风险
*/

var __$ = (function($){

	var Alert = function(text,btnText,callback){
		this.uniqueId = '__'+$.getTime();
		/*处理不同个数参数的情况*/
		this.text = text;
		this.btnText = typeof btnText === 'function' ? '确定' : btnText || '确定';
		this.callback = callback || btnText || $.noop;
		/*调用init*/
		Alert.prototype.init.call(this);
	}

	Alert.getTpl = function(uniqueId,text,btnText){
		var tpl = [];
		tpl.push('<div class="__tips_mask" id='+uniqueId+'>');
			tpl.push('<div class="__tips">');
				tpl.push('<div class="__content">');
					tpl.push(''+text+'');
				tpl.push('</div>');
				tpl.push('<div class="__btm">');
					tpl.push('<a href="javascript:void(0)" class="doneBtn">'+btnText+'</a>');
				tpl.push('</div>');
			tpl.push('</div>');
		tpl.push('</div>');

		return tpl.join('\n');
	}


	Alert.prototype.init = function(){
		var dom = Alert.getTpl(this.uniqueId,this.text,this.btnText),
			that = this;
		$('body').append(dom);

		$('#'+this.uniqueId+' '+'.doneBtn').bind('click',function(evt){
			that.hide();
			that.callback();
		});
		try{
			FastClick.attach($('#'+this.uniqueId)[0]);
		}catch(err){
			console.log('没有引入fastclick');
		}
		//FastClick && FastClick.attach($('#'+this.uniqueId)[0]);
		return this;
	}

	Alert.prototype.hide = function(){
		$('#'+this.uniqueId).remove();
	}



	var Confirm = function(text,obj){
		this.uniqueId = '__'+$.getTime();
		/*处理不同个数参数的情况*/
		this.text = text;
		this.obj = {};
		this.obj.btnDone = (obj && obj.doneText) || '确定';
		this.obj.cbDone = (obj && obj.doneCallback) || $.noop;

		this.obj.btnCancel = (obj && obj.cancelText) || '取消';
		this.obj.cbCancel = (obj && obj.cancelCallback) || $.noop;
		
		/*调用init*/
		Confirm.prototype.init.call(this);
	}

	Confirm.getTpl = function(uniqueId,text,obj){
		var tpl = [];
		tpl.push('<div class="__tips_mask" id='+uniqueId+'>');
			tpl.push('<div class="__tips">');
				tpl.push('<div class="__content">');
					tpl.push(''+text+'');
				tpl.push('</div>');
				tpl.push('<div class="__btm">');
					tpl.push('<a href="javascript:void(0)" class="doneBtn half">'+obj.btnDone+'</a>');
					tpl.push('<a href="javascript:void(0)" class="doneCancel half">'+obj.btnCancel+'</a>');
				tpl.push('</div>');
			tpl.push('</div>');
		tpl.push('</div>');

		return tpl.join('\n');
	}

	Confirm.prototype.init = function(){
		var dom = Confirm.getTpl(this.uniqueId,this.text,this.obj),
			that = this;
		$('body').append(dom);

		$('#'+this.uniqueId+' '+'.doneBtn').bind('click',function(evt){
			that.hide();
			that.obj.cbDone();
		});

		$('#'+this.uniqueId+' '+'.doneCancel').bind('click',function(evt){
			that.hide();
			that.obj.cbCancel();
		});

		try{
			FastClick.attach($('#'+this.uniqueId)[0]);
		}catch(err){
			console.log('没有引入fastclick');
		}

		// FastClick && FastClick.attach($('#'+this.uniqueId)[0]);
		return this;
	}


	Confirm.prototype.hide = function(){
		$('#'+this.uniqueId).remove();
	}



	$.Alert = function(text,btnText,callback){
			return new Alert(text,btnText,callback);
	};

	$.Confirm = function(text,obj){
			return new Confirm(text,obj);
	};

})(xQuery);