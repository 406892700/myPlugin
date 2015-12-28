/*
下拉刷新（简易版）
xhy 2015-10-9
*/
;(function(window,$,undefined){
	$.flush = function(opt){
		var that = this,
			oY,//起始位置
			cY = 0,//结束位置
			str = '<div class="f_dropdown_area"><div class="f_inner_content"><span class="f_preLoading"></span><label class="f_text">下拉刷新</label></div></div>';
		var bindEvent = function(){
			$('body').bind('touchstart',function(evt){			
				if($(window).scrollTop() > 0){
					return;
				}
				$('body').css('overflow','hidden');
				oY = evt.originalEvent.touches[0].clientY;

				var move  =  function(evt){
					cY = evt.originalEvent.touches[0].clientY;
					/*console.log(cY-oY);*/
					$('.f_dropdown_area').height((cY-oY)/3);
					if($('body').scrollTop() == 0){
						if((cY-oY)>0){
							evt.preventDefault();
							return;
						}
					}
					if((cY-oY) >= 300){
						$('.f_inner_content > .f_preLoading').addClass('rotate');
						$('.f_inner_content > .f_text').text('释放刷新');
					}else{
						$('.f_inner_content > .f_preLoading').removeClass('rotate');
						$('.f_inner_content > .f_text').text('下拉刷新');
					}
				};

				var end = function(evt){
					$('body').css('overflow','auto');
					if((cY-oY) <= 50){
						//console.log(cY+','+oY)
						return;
					} else if((cY-oY) <= 300 && (cY-oY) > 50){
						//console.log('小于300');
						$('.f_dropdown_area').animate({'height':'0px'},200);
					}else{
						$('.f_inner_content > .f_text').text('刷新中...');
						$('.f_inner_content > .f_preLoading').addClass('spin');
						$('.f_dropdown_area').animate({'height':'40px'},200);
						setTimeout(function(){
							window.location.reload();
						},1000);
						
					}
					$('body').unbind('touchmove',move);
					$('body').unbind('touchend',end);
				}

				$('body').bind('touchmove',move);
				$('body').bind('touchend',end);

			});
		};

		var init = function(){
			$('body').prepend($(str));
			bindEvent();
		};

		init();
	};
})(window,jQuery,undefined);