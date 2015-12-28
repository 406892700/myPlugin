/*
*   一个简单的标签生成器
*   author xhy
*   date 2015-6-25
*
* */
$.fn.tag_fac = function(obj){
			var default_arg = {
				tag_num:10,//标签最大数量
				tag_length:10,//标签最大长度
				input_length:'200px',//文本框长度
				disabled:false,//是否可修改
				callback_add:$.noop,//添加的回调
				callback_remove:$.noop//删除的回调
			};

			obj = $.extend({},default_arg,obj);//合并默认参数
			var that = this,
				tag_list = that.val() ? that.val().split(',') : [];//获取默认值
			var util = {
				getWrap:function(){//获取默认值拼接字符串
					var temp = [];//
					for(var i = 0;i<tag_list.length;i++){
						temp.push('<span class="tag"><span>'+tag_list[i]+'&nbsp;&nbsp;</span><a href="#" title="Removing tag" class="close_tag">x</a></span>');
					}
//					tag_list.map(function(v,i){
//						temp.push('<span class="tag"><span>'+v+'&nbsp;&nbsp;</span><a href="#" title="Removing tag" class="close_tag">x</a></span>');
//					});

					return temp.join('\n');
				},
				remove_tag:function(){//删除标签函数
					if(obj.disabled == true){
						return;
					}
					$(this).parent().remove();
				 	var temp = [];
				 	$('.tag',that.parent()).find('span').each(function(i,v){
				 		temp.push($(this).text().slice(0,-2));
				 	});

				 	tag_list = temp;
				 	console.log(tag_list);
				 	 util.change_val();//更改属性值
				 	 obj.callback_remove();//删除标签的回调
				},
				change_val:function(val){
					that.val(tag_list.join(','));
				},
				ifInArray:function(arr,ele){
					for(var i in arr){
						if(ele == arr[i]){
							return 1;
						}
					}
					return -1;
				},
				blur_fc:function(thatx){//丢失焦点函数
					var now_value = $(thatx).val();
					console.log(now_value);
					console.log()
					var random = 'id'+ String.prototype.slice.call(Math.random(),2,-1);
					// if(!now_value || now_value == '添加标签' || tag_list.indexOf(now_value) != -1|| tag_list.length > obj.tag_num || now_value.length > obj.tag_length)//不符合条件的不添加
					// 	return;
					 if(!now_value){
					 	alert('标签文字不能为空！');
					 	$('.tags_1_tag',that.parent()).focus();
					 	return;
					 }else if(now_value == '添加标签'){
					 	return;
					 }else if(this.ifInArray(tag_list,now_value) != -1){
					 	alert('标签已存在');
					 	$('.tags_1_tag',that.parent()).focus();
					 	return;
					 }else if(tag_list.length >= obj.tag_num){
					 	alert('标签最多为'+obj.tag_num+'个');
					 	$('.tags_1_tag',that.parent()).focus();
					 	return;
					 }else if(now_value.length >= obj.tag_length){
					 	alert('标签文字不得多于'+obj.tag_length+'个字');
					 	$('.tags_1_tag',that.parent()).focus();
					 	return;
					 }

					 $('<span class="tag"><span>'+now_value+'&nbsp;&nbsp;</span><a href="#" title="Removing tag" class="close_tag" id='+random+'>x</a></span>').insertBefore($(thatx));
					 tag_list.push(now_value);
					 util.change_val();//更改属性值
					 $('#'+random).click(util.remove_tag);
					 $(thatx).val('添加标签').focus();
					 console.log(tag_list);

					 obj.callback_add();//添加标签的回调
					}
			};

			//标签容器html模板
			var tpl = '<div class="tag_warp">'+util.getWrap()+'<div id="tags_1_addTag"><input class="tags_1_tag" value="添加标签" data-default="添加标签" style="color: rgb(102, 102, 102); width: '+obj.input_length+';" onfocus="if(this.value == \'添加标签\') this.value = \'\' " onblur="if(this.value == \'\')this.value = \'添加标签\'"></div></div>';//标签容器

			var init = function(){//初始化函数
				//that.css('display','none');
				//that.parent().append('<input type="hidden" value='+that.val()+' name='+that.attr('name')+' id="fake_input">');
				that.parent().append(tpl);//加入文档树

				//为添加标签绑定事件
				$('.tags_1_tag',that.parent()).blur(function(){//丢失焦点事件
					util.blur_fc(this);
				});

				$('.tags_1_tag',that.parent())[0].onkeydown = function(e){ //回车事件
				    var ev = document.all ? window.event : e;
				    if(ev.keyCode == 13) {
				    	util.blur_fc(this);
				     }
				};

				that.parent().click(function(){//点击自动获取焦点事件
					$('.tags_1_tag',that.parent()).focus();
				})

			};

			return this.each(function(){
				init();
				
				if(obj.disabled){//如果为不可修改的话
					$('.tag > .close_tag',that.parent()).css('display','none');
					$('.tags_1_tag',that.parent()).css('display','none');//添加不可见
				}
				$('.tag',that.parent()).on('click','.close_tag',util.remove_tag);//标签的删除事件
				
			});
		}