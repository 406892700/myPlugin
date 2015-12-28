/*
亲子游产品中的用于适配日期区间的控件
日期区间控件
xhy 2015-9-30
*/
;(function(window,$){
	$.fn.dateRange = function(opt){
		var that = this;

		var default_opt = {
			startDate:'2015-12-15',
			endDate:'2016-01-21'
		}

		opt = $.extend({},default_opt,opt);
		var dateList = [];


		var getRange = function(){
			var s = new Date(opt.startDate).getTime(),
				e = new Date(opt.endDate).getTime(),
				step = 1000*60*60*24,
				cache = [],
				count = -1;
			if(s == e &&  ((s+step) > (new Date().getTime()) )){//如果只有一天的话(这一天是可用的)，直接选中
				that.val(new Date(opt.startDate).format('yyyy-MM-dd')) || that.text(Date.format('yyyy-MM-dd'));
			}
			for(var i = s;i<=e;i+=step){
				var cDate = new Date(i),
					year = cDate.getFullYear(),
					month1 = cDate.getMonth()+1,
					month = year+'年'+ (month1 < 10 ? 0+''+month1 : month1),
					day = cDate.getDate(),
					obj = {month:'',days:[]};
				if(cache.indexOf(month) == -1){
					cache.push(month);
					obj.month = month;
					dateList.push(obj);
					count++;
				}

				if(cDate < new Date() && ((cDate.getTime()+step) < (new Date().getTime()) )){
					dateList[count].days.push({'day':day,'class':'disabled'});
				}else{
					dateList[count].days.push({'day':day,'class':''});
				}
				

			}

			console.log(dateList);
			return dateList;
		}

		//getRange();

		var getTpl = function(obj){
			//console.log(obj);
			var tpl = [];
			tpl.push('<div class="mask_date" style="display:none;">');
				tpl.push('<div class="date_main">');
					tpl.push('<header>日期选择<a href="javascript:void(0)" class="select_close">确定</a></header>');
					tpl.push('<div class="body">');
					obj.map(function(v,i){
						tpl.push('');
						tpl.push('<div class="month">');
							tpl.push('<header>');
								tpl.push(''+v.month+'月');
							tpl.push('</header>');
							tpl.push('<div class="dayWraper">');
								v.days.map(function(vx,i){
									vx.day = vx.day < 10 ? 0+''+vx.day : vx.day;
									if(obj.length == 1 && obj[0].days.length == 1){
										tpl.push('<span class="'+vx.class+' actived" data-val="'+v.month.replace('年','-')+'-'+vx.day+'"">'+vx.day+'日</span>');
									}else{
										tpl.push('<span class="'+vx.class+'" data-val="'+v.month.replace('年','-')+'-'+vx.day+'"">'+vx.day+'日</span>');
									}
									
								});
								
							tpl.push('</div>');
						tpl.push('</div>');
						tpl.push('<!-- month -->');
					});
					tpl.push('</div>');
				tpl.push('</div>');
			tpl.push('</div>');

			return tpl.join('\n');

			//console.log(tpl.join('\n'));
			
		}

		var bindEvent = function(){
			$('.mask_date').on('click','.dayWraper > span:not(.disabled)',function(evt){
				$('.dayWraper > span.actived').removeClass('actived');
				$(this).addClass('actived');
				var date = $(this).data('val');
				if(that[0].tagName == 'INPUT'){
					that.val(date);
				}else{
					that.text(date);
				}
			});


			that.bind('click',function(){
				$('.mask_date').fadeIn();
			});

			$('body').on('click','.mask_date,.select_close',function(evt){
				if($(evt.target).hasClass('mask_date') || $(evt.target).hasClass('select_close')){
					evt.stopPropagation();
					$('.mask_date').fadeOut();
				}
			});
		}

		var init = function(){
			$('body').append(getTpl(getRange()));
			bindEvent();
		}

		init();
	};

})(window,jQuery);