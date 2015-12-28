/**
 * E框架V3.0 菜单部分
 */

Easy.Menu = {
	url : 'user/menurootJSON.jspx',
	childrenUrl : 'user/menuchildrenJSON.jspx',
	selectedNodeId : '',
	mainFrameId : 'main_frame',
	initMenuParameters : function(options) {
		if (options != null) {

			if (options['leftMenu.height'] != null) {
				$("#left_menu_button")
						.css("height", options['leftMenu.height']);
				$("#left_menu").css("height", options['leftMenu.height']);

			}
			if (options['leftMenu.width'] != null) {
				$("#left_menu").css("width", options['leftMenu.width']);

			}

		}
	},
	/**
	 * 加载渲染第一级菜单
	 */
	loadRootMenu : function(options) {

		Easy.Menu.initMenuParameters(options);
		var parameters = {};
		Easy.Ajax.request(Easy.Menu.url, {
			parameters : parameters,
			// isMask : false
			callBack : 'Easy.Menu.callBack_loadRootMenu(response,'
					+ Easy.Method.jsonToString(options) + ')'
		});

	},
	callBack_loadRootMenu : function(response, options) {

		var selectMenuIndex = 0;
		var result = Easy.Method.toJSON(response);
		if (result.success != null && result.success) {
			var JSONList = result.data;
			var total = JSONList.length;
			for (var i = JSONList.length - 1; i >= 0; i--) {
				var JSONobj = JSONList[i];
				var cls = "";

				$(
						"<td width='100' "
								+ " id='rootMenu_"
								+ i
								+ "'><a href=javascript:Easy.Menu.selectRootMenu({'selectMenuIndex':"
								+ i + ",'menuTotal':" + total
								+ ",'selectMenuCode':'" + JSONobj.code
								+ "','selectMenuUrl':'" + JSONobj.url + "'})>"
								+ JSONobj.alias + "</a></td>").insertAfter(
						"#rootMenu");
				$("#rootMenu").next().attr("id", "rootMenu_" + i);

				if (options != null && options['selectMenuCode'] != null
						&& options['selectMenuCode'] == JSONobj.code) {

					selectMenuIndex = i;
				}
			}

			var args = {};

			if (total > 0) {
				args['selectMenuIndex'] = selectMenuIndex;
				args['menuTotal'] = total;
				args['selectMenuCode'] = JSONList[selectMenuIndex].code;
				args['selectMenuUrl'] = JSONList[selectMenuIndex].url;

				Easy.Menu.selectRootMenu(args);

			}
		}
	},
	/**
	 * 选择一级菜单
	 */

	selectRootMenu : function(args) {

		for (var i = 0; i < args['menuTotal']; i++) {
			$("#rootMenu_" + i).attr("class" , "");
		}

		$("#rootMenu_" + args['selectMenuIndex']).get(0).className = 'current';

		Easy.Menu.loadSecondMenu({
			'code' : args['selectMenuCode']
		});
	},
	/**
	 * 加载渲染第二级菜单
	 */
	loadSecondMenu : function(args) {
		
		var parameters = {};
		parameters['node'] = args['code'];
		Easy.Ajax.request(Easy.Menu.childrenUrl, {
			parameters : parameters,
			// isMask : false
			callBack : 'Easy.Menu.callBack_loadSecondMenu(response)'
		});

	},
	callBack_loadSecondMenu : function(response) {
		
		var JSONList = Easy.Method.toJSON(response);
		var html = "";
		for (var i = 0; i < JSONList.length; i++) {
			var JSONobj = JSONList[i];

			html += "<h3 id='secondMenu_" + i + "' load='false' ><a id='a_"
					+ JSONobj.id
					+ "'  href=javascript:Easy.Menu.selectSecondMenu('"
					+ JSONobj.id + "','" + JSONobj.url + "'," + i + ",'"
					+ JSONobj.alias + "') ><span class='" + JSONobj.cls
					+ "'></span>" + JSONobj.alias + "</a></h3>";
			if(i==0){
				$("#main_frame").attr("src",JSONobj.url);
			}
			
		}
		$("#menu2").html(html);
	},
	/**
	 * 隐藏或显示头部区块
	 * 
	 */
	hideOrShowHead : function(obj, element) {
		if (obj.src.indexOf('up') == -1) {
			obj.src = 'images/up.gif';
			$("#" + element).show();

		} else {
			obj.src = 'images/down.gif';
			$("#" + element).hide();
		}
	},
	/**
	 * 隐藏或显示左边菜单
	 */
	hideOrShow : function(obj, element) {
		var hidesrc = "images/left_hide.gif";
		var showsrc = "images/left_show.gif";

		if (obj.src.indexOf('hide') == -1) {
			obj.src = 'images/left_hide.gif';
			$("#" + element).show();

		} else {
			obj.src = 'images/left_show.gif';
			$("#" + element).hide();

		}
	},
	/**
	 * 改变选中节点样式
	 * 
	 * @param {}
	 *            code
	 */
	updateSelectNodeClass : function(code) {

		if (Easy.Menu.selectedNodeId != null && Easy.Menu.selectedNodeId != '') {

			if ($('#a_' + Easy.Menu.selectedNodeId).length != 0) {
				$('#a_' + Easy.Menu.selectedNodeId).parent().get(0).className = "";
			}

		}

		if ($('#a_' + code).parent().get(0).tagName.toLowerCase() == 'h3') {
			$('#a_' + code).parent().get(0).className = '';
			$('#a_' + code).parent().get(0).className = 'current';
		} else {
			$('#a_' + code).parent().get(0).className = '';
			$('#a_' + code).parent().get(0).classNamee = 'current1';
		}

		Easy.Menu.selectedNodeId = code;

	},
	/**
	 * 选择二级菜单
	 * 
	 * @param {}
	 *            code
	 * @param {}
	 *            url
	 * @param {}
	 *            index
	 */

	selectSecondMenu : function(code, url, index, alias) {

		Easy.Menu.updateSelectNodeClass(code);
	
		if (url == "") {
		
			// 已经请求过AJAX就不再请求
			if ($("#secondMenu_" + index).attr("load")== 'true') {
				
				// 原来是隐藏的就显示
				Easy.Menu.hideOrShowDiv("thirdMenu_" + index);
			
			} else {
				// 通过AJAX加载菜单
				
				Easy.Menu.loadThirdMenu(code, index);
			}
		} else {

			Easy.Menu.locationURL(code, url, alias);

		}
	},
	locationURL : function(code, url, alias) {

		if ($("#" + Easy.Menu.mainFrameId).length != 0) {

			$("#" + Easy.Menu.mainFrameId).get(0).src = url;
		}

	},
	loadThirdMenu : function(code, index) {

		var options = {};
		options['code'] = code;
		options['index'] = index;
		var parameters = {};
		parameters['node']=code;

		Easy.Ajax.request(Easy.Menu.childrenUrl, {
			parameters : parameters,
			
			onSuccess : function(response) {
				var JSONList = Easy.Method.toJSON(response);
				var html = "<ul id='thirdMenu_" + options['index'] + "'>";
				for (var i = 0; i < JSONList.length; i++) {
					var JSONobj = JSONList[i];

					html += "<li align='left'><a id='a_" + JSONobj.id
							+ "' href=javascript:Easy.Menu.locationURL('" + JSONobj.id
							+ "','" + JSONobj.url + "','" + JSONobj.alias
							+ "') class='" + JSONobj.cls + "'>" + JSONobj.alias
							+ "</a></li>";
				}
				html += "</ul>";

				$(html).insertAfter("#secondMenu_" + options['index']);


				$("#secondMenu_" + options['index']).attr('load', 'true');
			}

		});

	},

	hideOrShowDiv : function(id) {
		if ($("#" + id).get(0).style.display == 'none') {
			$("#" + id).show();
		} else {
			$("#" + id).hide();
		}
	}

}
