/**
 * E框架V3.0
 * 
 */

var Easy = {
	Version : '3.0',
	sequence : new Date().getTime(),
	getSequence : function() {
		Easy.sequence++;
		return Easy.sequence;
	},
	Object : {
		replaceTag : function(html, JSONobj, key) {

			html += "";
			var reCat = /\[v:.*?\]/gi;

			var arrMactches = html.match(reCat);
			if (arrMactches != null && arrMactches.length > 0) {

			} else {

				var arrParams = key.split(".");

				var tempObj = JSONobj;
				for (var k = 0; k < arrParams.length; k++) {
					if (k == arrParams.length - 1) {
						var tempParam = arrParams[k];
						// alert(tempObj[tempParam]);
						if (tempObj[tempParam] != null) {
							html = tempObj[tempParam];
						} else {
							html = "";
						}
					} else {
						tempObj = tempObj[arrParams[k]];

					}

				}

			}

			// 其他类型,span div等
			return Easy.Grid.replaceTag(html, JSONobj);
		},

		/**
		 * 解析Easy标记
		 * 
		 * @param {}
		 *            JSONList
		 * @param {}
		 *            options
		 */
		parserTag : function(JSONobj, key, objectId) {

			if (Easy.Object.get(objectId) != null) {
				var docObject = Easy.Object.get(objectId);
				var obj = docObject.get(0);
				if (obj.tagName.toLowerCase() == 'input') {
					if (obj.type == '') {
					} else {
						obj.value = this.replaceTag(obj.value, JSONobj, key);
					}
				} else if (obj.tagName.toLowerCase() == 'textarea') {
					obj.value = this.replaceTag(obj.value, JSONobj, key);
				} else if (obj.tagName.toLowerCase() == 'select') {

					obj.value = this.replaceTag(obj.value, JSONobj, key);
				} else {

					if (obj.tagName.toLowerCase() == 'span'
							&& docObject.attr('type') != null
							&& docObject.attr('type') == 'radio') {
						for (var i = 0; i < docObject.children().length; i++) {
							var child = docObject.children()[i];
							if (child.tagName.toLowerCase() == 'input'
									&& child.type == 'radio') {
								if (child.value == JSONobj[key]) {
									child.checked = true;
								}
							}
						}

					} else if (obj.tagName.toLowerCase() == 'span'
							&& docObject.attr('type') != null
							&& docObject.attr('type') == 'checkbox') {

						// 复选框赋值
						var value = JSONobj[key];
						value = "" + value;
						var values = value.split(',');
						for (var i = 0; i < docObject.children().length; i++) {
							var child = docObject.children()[i];
							if (child.tagName.toLowerCase() == 'input'
									&& child.type == 'checkbox') {

								for (var k = 0; k < values.length; k++) {

									if (child.value == values[k]) {

										child.checked = true;
										break;
									}
								}

							}
						}

					} else {
						obj.innerHTML = this.replaceTag(obj.innerHTML, JSONobj,
								key);

					}

				}

			}

		},

		printData : function(response, options) {

			options.callBack = options.realCallBack;

			var result = Easy.Method.toJSON(response);

			var JSONobj = result.data;
			if (result.success != null && result.success) {
				for ( var key in JSONobj) {
					var objectId = key.toString();

					if (options.prefix != null && options.prefix != '') {
						objectId = options.prefix + "." + objectId;
					}
					Easy.Object.parserTag(JSONobj, key, objectId);
				}

				// 反射回调函数
				if (options.callBack != null) {
					try {
						eval(options.callBack);
					} catch (e) {
						// Alert(e);
					}
				}
				if (options.isMask == null || options.isMask) {
					Easy.MessageBox.unmask();
				}
			} else {
				if (options.isMask == null || options.isMask) {
					Easy.MessageBox.unmask();
				}
				// Alert(result.error);
				// 反射回调函数 加上的-YB
				if (options.callBack != null) {
					try {
						eval(options.callBack);
					} catch (e) {
						Alert(e);
					}
				}
			}
		},
		/**
		 * 发送Ajax请求
		 * 
		 * @param {}
		 *            url
		 * @param {}
		 *            options
		 */
		request : function(url, options) {

			var parameters = {};
			if (options.parameters != null) {
				parameters = options.parameters;
			}

			options.realCallBack = options.callBack;
			options.callBack = 'Easy.Object.printData(response,options)';
			Easy.Ajax.request(url, options);

		},
		load : function(url, options) {

			if (options.isMask == null || options.isMask) {
				var msg = "下载中...";
				if (options.msg != null) {
					msg = options.msg;
				}
				Easy.MessageBox.wait(msg);
			}

			this.request(url, options);
		},
		/**
		 * 通过id获取对象..
		 * 
		 * @param {}
		 *            id
		 * @return {}
		 */
		get : function(id) {

			var newid = "#" + id.replace(/\./g, "\\.");
			if ($(newid).length > 0) {
				return $(newid);
			} else {
				return null;
			}
		},
		outerHTML : function(o) {
			if (o == null) {
				return;
			}
			var outerHTML = "<";
			outerHTML += o.tagName;
			for (i = 0; i < o.attributes.length; i++) {
				outerHTML += " " + o.attributes[i].name;
				outerHTML += "='";
				outerHTML += " " + o.attributes[i].value;
				outerHTML += "'";

			}
			outerHTML += ">";
			outerHTML += o.innerHTML;
			outerHTML += "</";
			outerHTML += o.tagName;
			outerHTML += ">";

			return outerHTML;
		}
	},

	Grid : {
		/**
		 * 正在请求队列
		 */
		loadingArray : new Array(),
		/**
		 * 是否另一请求在加载中，如果已经有请求取消，没有，存入请求队列中，返回TRUE
		 * 
		 * @param {}
		 *            gridId
		 * @return {Boolean}
		 */
		isLoading : function(gridId) {
			for (var i = 0; i < this.loadingArray.length; i++) {
				// gridId存在，则查看是否请求中有重复 -YB加
				if (gridId && gridId == this.loadingArray[i]) {
					return true;
				}
			}
			this.loadingArray.push(gridId);
			return false;
		},
		/**
		 * 加载完，从下载队列中移除,反射回调函数
		 * 
		 * @param {}
		 *            gridId
		 */
		loaded : function(options) {
			if (options.isMask == null || options.isMask) {
				Easy.MessageBox.unmask();
			}
			if (options.gridId != null) {

				for (var i = 0; i < this.loadingArray.length; i++) {
					if (options.gridId == this.loadingArray[i]) {
						this.loadingArray.splice(i, 1);
						return;
					}
				}
			}
		},
		/**
		 * @param {}
		 *            parameters 参数
		 * @param {}
		 *            url 请求URL地址
		 * @param {}
		 *            gridId 表格元素ID
		 * @param {}
		 *            pageId 分页ID
		 * @param {}
		 *            callBack 强回调函数
		 */
		load : function(url, options) {

			if (this.isLoading(options.gridId)) {// 已经下载中，本次被取消
				return;
			}
			if (options.isMask == null || options.isMask) {
				var msg = "下载中...";
				if (options.msg != null) {
					msg = options.msg;
				}
				Easy.MessageBox.wait(msg);
			}

			if (options.gridId != null && options.gridId != ''
					&& Easy.Object.get(options.gridId) != null) {
				Easy.Object.get(options.gridId).hide();
			}
			this.request(url, options);

		},
		/**
		 * 解析Easy标记
		 * 
		 * @param {}
		 *            JSONList
		 * @param {}
		 *            options
		 */
		parserTag : function(JSONList, options) {

			for (var i = 0; i < JSONList.length; i++) {
				var JSONobj = JSONList[i];

				this.parserCell(options.gridId, JSONobj, i,
						options.parameters.start, options.bgColor);

			}

		},
		/**
		 * 替换标记为对应值
		 * 
		 * @param {}
		 *            gridId
		 * @param {}
		 *            JSONobj
		 * @param {}
		 *            index
		 * @param {}
		 *            start
		 */
		parserCell : function(gridId, JSONobj, index, start, bgColor) {

			var o = Easy.Object.get(gridId).get(0);
			var html = Easy.Object.outerHTML(o);

			html = html.replace(gridId, gridId + "_" + index);

			var seqIndex = start;
			if (seqIndex == null || seqIndex == '' || seqIndex < 0) {
				seqIndex = 0;
			}
			html = html.replace(/\[v:g@#index#@]/g, parseInt(seqIndex)
					+ parseInt(index) + 1);
			var ntext = $.base64({
				data : Easy.Method.jsonToString(JSONobj),
				type : 0
			});

			html = html.replace(/\[v:g@#record#@]/g, ntext);
			html = this.replaceTag(html, JSONobj);
			$(html).insertBefore("#" + gridId);
			$("#" + gridId).prev().attr("id", gridId + "_" + index);
			$("#" + gridId).prev().show();
			Easy.Grid.setTrBgColor($("#" + gridId).prev().get(0), false,
					bgColor);
			Easy.Grid.addTableListener($("#" + gridId).prev().get(0), bgColor);

		},
		removeALLCell : function(gridId, limit) {

			var total = limit;
			if (limit == null || limit == '' || limit == -1) {
				total = 10000;
			}

			for (var i = 0; i < total; i++) {

				if (Easy.Object.get(gridId + "_" + i) != null) {

					Easy.Object.get(gridId + "_" + i).remove();
				} else {
					break;
				}
			}
		},
		/**
		 * 分解标签
		 * 
		 * @param {}
		 *            data
		 * @param {}
		 *            JSONobj
		 * @return {}
		 */
		replaceTag : function(html, JSONobj) {

			var lastData = html.toString() + "";
			var reCat = /\[v:.*?\]/gi;
			html += "";
			var arrMactches = html.match(reCat);

			if (arrMactches != null) {
				for (var i = 0; i < arrMactches.length; i++) {
					var match = arrMactches[i];
					var attribute = this.tagHTML(JSONobj, match);
					lastData = lastData.replace(match, attribute);
				}
			}

			return lastData;
		},
		tagHTML : function(JSONobj, arg0) {

			var sIndex = arg0.indexOf("@");
			strParam = arg0.substring(sIndex + 1, arg0.length - 2);
			var params = strParam.split(",");

			for (var i = 0; i < params.length; i++) {
				var param = params[i];
				if (params[i].indexOf("$") == 0) {
					param = param.substring(1, param.length);
					// if (JSONobj[param] != null) {

					var arrParams = param.split(".");

					var tempObj = JSONobj;
					for (var k = 0; k < arrParams.length; k++) {

						if (k == arrParams.length - 1) {
							var tempParam = arrParams[k];

							if (tempObj[tempParam] != null) {
								param = tempObj[tempParam];
							} else {
								param = "";
							}
						} else {
							tempObj = tempObj[arrParams[k]];
						}
					}

					param = param.toString();
					param = param.replace(/<br>/g, "\n");
					param = param.replace(/\'/g, "&#39;");
					param = param.replace(/\"/g, "&quot;");
				}

				params[i] = "'" + param + "'";

			}

			var str = "{" + arg0.substring(1, sIndex) + "(" + params.toString()
					+ ")}";

			var htmlFilterStr = "<br>";
			str = str.replace(/\r\n/g, htmlFilterStr);
			str = str.replace(/\n/g, htmlFilterStr);
			str = str.replace(/\r\t/g, htmlFilterStr);
			var JSON = Easy.Method.toJSON(str);
			var result = JSON.v;

			return result;
		},
		printData : function(url, response, options) {

			options.callBack = options.realCallBack;

			var result = Easy.Method.toJSON(response);

			var JSONList = result.root;
			if (JSONList == null) {
				JSONList = result.result;
				result.root = result.result;
			}
			if (JSONList == null) {
				JSONList = result.data;
				result.root = result.data;
			}

			var total = result.total;
			if (total == null) {
				total = result.totalCounts;
				result.total = result.totalCounts;
			}

			if (options.gridId != null && options.gridId != '') {

				Easy.Grid.removeALLCell(options.gridId,
						options.parameters.limit);
				Easy.Grid.parserTag(JSONList, options);

				Easy.Grid.printPageInfo(url, options, total);

				//	
			}

			// 反射回调函数
			if (options.callBack != null) {
				eval(options.callBack);
			}
		},
		/**
		 * 发送Ajax请求
		 * 
		 * @param {}
		 *            url
		 * @param {}
		 *            options
		 */
		request : function(url, options) {

			var parameters = {};
			if (options.parameters != null) {
				parameters = options.parameters;
			}

			Easy.Grid.bindJsonId(options, url);
			options.realCallBack = options.callBack;
			options.callBack = 'Easy.Grid.printData(url,response,options)';
			Easy.Ajax.request(url, options);

		},
		bindJsonId : function(options, url) {
			if (options.onSuccess && typeof (options.onSuccess) == 'function') {
				options.onSuccessToString = options.onSuccess.toString();
			}
			if (options.onFailure && typeof (options.onFailure) == 'function') {
				options.onFailureoString = options.onFailure.toString();
			}
			var bindJsonId = options.gridId + "_json";
			if (Easy.Object.get(bindJsonId) == null) {
				var element = document.createElement('div');
				document.body.appendChild(element); // 
				element.id = bindJsonId;
				element.style.width = '100%';
				element.style.display = 'none';

			}
			options['bindPreUrl'] = url;
			$("#" + bindJsonId).text(Easy.Method.jsonToString(options));
		},

		history : function(gridId) {

			var bindJsonId = gridId + "_json";

			var options = Easy.Method.toJSON($("#" + bindJsonId).text());

			if (options.onSuccessToString
					&& options.onSuccessToString.trim() != '') {
				options.onSuccess = Easy.Method
						.toJSON(options.onSuccessToString);

			}

			if (options.onFailureToString
					&& options.onFailureToString.trim() != '') {
				options.onFailure = Easy.Method
						.toJSON(options.onFailureToString);
			}
			Easy.Grid.load(options.bindPreUrl, options);

		},
		initHistoryGrid : function() {

			var bindJsonId = "historyURL";
			if (Easy.Method.getQueryField('historyURL') != null) {
				text = $.base64({
					data : Easy.Method.getQueryField('historyURL'),
					type : 1
				});

				var element = document.createElement('div');

				document.body.appendChild(element); // 
				element.id = bindJsonId;
				element.style.width = '100%';
				element.style.display = 'none';
				$("#" + bindJsonId).text(text);
			}

		},
		loadHistoyGrid : function() {

			if (Easy.Object.get("historyURL") != null
					&& Easy.Object.get("historyURL").html().trim() != '') {
				var options = Easy.Method.toJSON(Easy.Object.get("historyURL")
						.text());

				if (options.onSuccessToString
						&& options.onSuccessToString.trim() != '') {
					options.onSuccess = Easy.Method
							.toJSON(options.onSuccessToString);
				}
				if (options.onFailureToString
						&& options.onFailureToString.trim() != '') {
					options.onFailure = Easy.Method
							.toJSON(options.onFailureToString);
				}

				Easy.Grid.load(options.bindPreUrl, options);
				return true;
			} else {
				return false;
			}
		},
		sort : function(obj, gridId, sort) {

			var bindJsonId = gridId + "_json";
			var options = Easy.Method.toJSON($("#" + bindJsonId).html());
			options.parameters['sort'] = sort;
			if (obj.className == 'sort_asc') {
				obj.className = 'sort_desc';
				options.parameters['dir'] = 'desc';
			} else {
				obj.className = 'sort_asc';
				options.parameters['dir'] = 'asc';
			}

			Easy.Grid.load(options.bindPreUrl, options);

		},
		getNextParam : function(gridId) {
			var bindJsonId = gridId + "_json";

			return "historyURL=" + $.base64({
				data : $("#" + bindJsonId).text(),
				type : 0
			});

		},
		getPreURLParm : function() {
			var bindJsonId = "historyURL";

			return "historyURL=" + $.base64({
				data : $("#" + bindJsonId).text(),
				type : 0
			});

		},
		// 从前面iHead行开始变色，直到倒数iEnd行结束
		addTableListener : function(o, bgColor) {

			o.onmouseover = function() {
				Easy.Grid.setTrBgColor(o, true, bgColor)
			}
			o.onmouseout = function() {
				Easy.Grid.setTrBgColor(o, false, bgColor)
			}
		},
		setTrBgColor : function(oTr, b, bgColor) {

			// 分别是奇数行默认颜色,偶数行颜色,鼠标放上时奇偶行颜色
			var aBgColor = [ "#FFFFFF", "#f5fce9", "#d1eea7", "#d1eea7" ];
			if (bgColor != null) {
				aBgColor = bgColor;
			}

			if (b) {

				$('#' + oTr.id).css("background-color", aBgColor[2]);
			} else {
				if (oTr.rowIndex % 2 != 0) {
					$('#' + oTr.id).css("background-color", aBgColor[1]);
				} else {
					$('#' + oTr.id).css("background-color", aBgColor[0]);
				}
			}

		},
		/**
		 * 打印页码信息
		 * 
		 * @param {}
		 *            url
		 * @param {}
		 *            options
		 */
		printPageInfo : function(url, options, total) {

			if (options.pageId != null && options.pageId != '') {

				var pageIds = options.pageId.split(',');
				for (var i = 0; i < pageIds.length; i++) {
					if (pageIds != "") {

						this.printPageInfoHTML(url, options, total, pageIds[i]);

					}
				}

			}
			this.fillPageInfo(url, options, total);

		},
		fillPageInfo : function(url, options, total) {

			if (Easy.Object.get('rec_total')) {
				$('#rec_total').html(total);
			}

			var rand = new Date().getTime();
			rand++;
			var queryStringId = "queryString_" + rand;
			$(document.body).append(
					'<span id="' + queryStringId
							+ '" style="display:none"></span>');
			$('#' + queryStringId).text(Easy.Method.jsonToString(options));

			var currentPageNo = 1;

			var limit = options.parameters["limit"];
			var start = options.parameters["start"];

			if (limit == -1) {
				return;
			}
			var totalPage = 1;
			if (total > 0) {
				totalPage = parseInt(total / limit);
				if ((total % limit) > 0) {
					totalPage += 1;
				}
			}
			if (totalPage < 0) {
				totalPage = 1;
			}
			if (start > 0) {
				currentPageNo = parseInt(start / limit) + 1;
			}
			if (currentPageNo < 0) {
				currentPageNo = 1;
			}
			if (Easy.Object.get('rec_current_page')) {
				$('#rec_current_page').html(currentPageNo);
			}

			if (Easy.Object.get('rec_page_total')) {

				$('#rec_page_total').html(totalPage);
			}

			if (start >= limit) {
				// var nextIndex = 0;
				if (Easy.Object.get('rec_first_page')) {
					$("#rec_first_page").unbind();
					if (options.showpage != null && options.showpage) {
						$("#rec_first_page").show();
					}
					$("#rec_first_page").click(
							function() {

								Easy.Grid.locationPage(queryStringId, 0, url,
										options.gridId, '', '');

							});
				}
			} else {
				$("#rec_first_page").unbind();
				if (options.showpage != null && options.showpage) {
					$("#rec_first_page").hide();
				}
			}
			if (start - limit >= 0) {

				if (Easy.Object.get('rec_pre_page')) {
					$("#rec_pre_page").unbind();
					if (options.showpage != null && options.showpage) {
						$("#rec_pre_page").show();
					}
					$("#rec_pre_page").click(
							function() {
								var options = Easy.Method.toJSON($(
										"#" + queryStringId).text());
								Easy.Grid.locationPage(queryStringId,
										parseInt(options.parameters.start)
												- limit, url, options.gridId,
										'', '');

							});
				}

			} else {
				$("#rec_pre_page").unbind();
				if (options.showpage != null && options.showpage) {
					$("#rec_pre_page").hide();
				}
			}

			if (start + limit < total) {

				if (Easy.Object.get('rec_next_page')) {
					$("#rec_next_page").unbind();
					if (options.showpage != null && options.showpage) {
						$("#rec_next_page").show();
					}
					$("#rec_next_page").click(
							function() {
								var options = Easy.Method.toJSON($(
										"#" + queryStringId).text());
								Easy.Grid.locationPage(queryStringId,
										parseInt(options.parameters.start)
												+ limit, url, options.gridId,
										'', '');

							});
				}
			} else {
				$("#rec_next_page").unbind();
				if (options.showpage != null && options.showpage) {
					$("#rec_next_page").hide();
				}
			}
			if (options.showpage != null && options.showpage) {
			}
			if (start + limit < total) {
				var nextIndex = limit * (totalPage - 1);

				if (Easy.Object.get('rec_last_page')) {
					$("#rec_last_page").unbind();
					if (options.showpage != null && options.showpage) {
						$("#rec_last_page").show();
					}
					$("#rec_last_page")
							.click(
									function() {
										Easy.Grid.locationPage(queryStringId,
												nextIndex, url, options.gridId,
												'', '');

									});
				}
			} else {

				$("#rec_last_page").unbind();
				if (options.showpage != null && options.showpage) {

					$("#rec_last_page").hide();
				}
			}
		},
		/**
		 * 计算并打印页码HTML
		 * 
		 * @param {}
		 *            total
		 * @param {}
		 *            parameters
		 * @param {}
		 *            url
		 * @param {}
		 *            listId
		 * @param {}
		 *            pageIds
		 * @param {}
		 *            pageId
		 */
		printPageInfoHTML : function(url, options, total, pageId) {

			var rand = new Date().getTime();
			var pageIds = options.pageId;
			var currentPageNo = 1;

			var limit = options.parameters["limit"];
			var start = options.parameters["start"];
			if (start == null || start == 'undefined') {
				start = 0;
			}

			if (limit == -1) {
				return;
			}
			var totalPage = 1;
			if (total > 0) {
				totalPage = parseInt(total / limit);
				if ((total % limit) > 0) {
					totalPage += 1;
				}
			}
			if (totalPage < 0) {
				totalPage = 1;
			}
			if (start > 0) {
				currentPageNo = parseInt(start / limit) + 1;
			}
			if (currentPageNo < 0) {
				currentPageNo = 1;
			}

			rand++;
			var queryStringId = "queryString_" + rand;
			var tb = '<table width="100%" height="38" cellpadding="0" cellspacing="0" border="0" align="center">'
			tb += '<tr>';
			tb += '<td width="50%" ><span style="font-weight:bold;">共'
					+ total
					+ '条信息</span>&nbsp;&nbsp;每页'
					+ limit
					+ '条&nbsp;&nbsp;第<input type="text" id="pageNo_'
					+ rand
					+ '" name="page" style="width:20px"  value="'
					+ currentPageNo
					+ '"/>页<input type="button" value="跳&nbsp;转" class="click"  onclick="Easy.Grid.gotoPage(\''
					+ queryStringId + '\',\'pageNo_' + rand + '\',\'' + url
					+ '\',\'' + options.gridId + '\',\'' + pageId + '\',\''
					+ pageIds + '\',' + totalPage + ')"/>/共' + totalPage
					+ '页</td>';
			tb += '<td  align="right">';

			if (start >= limit) {
				var nextIndex = 0;
				tb += '<button class="mid_Btn" onclick="Easy.Grid.locationPage(\''
						+ queryStringId
						+ '\','
						+ nextIndex
						+ ',\''
						+ url
						+ '\',\''
						+ options.gridId
						+ '\',\''
						+ pageId
						+ '\',\''
						+ pageIds + '\')">首&nbsp;&nbsp;页</button>&nbsp;';
			}
			if (start - limit >= 0) {
				var nextIndex = start - limit;
				tb += '<button class="mid_Btn" onclick="Easy.Grid.locationPage(\''
						+ queryStringId
						+ '\','
						+ nextIndex
						+ ',\''
						+ url
						+ '\',\''
						+ options.gridId
						+ '\',\''
						+ pageId
						+ '\',\''
						+ pageIds + '\')">上一页</button>&nbsp;';
			}

			if (start + limit < total) {
				var nextIndex = start + limit;
				tb += '<button class="mid_Btn" onclick="Easy.Grid.locationPage(\''
						+ queryStringId
						+ '\','
						+ nextIndex
						+ ',\''
						+ url
						+ '\',\''
						+ options.gridId
						+ '\',\''
						+ pageId
						+ '\',\''
						+ pageIds + '\')">下一页</button>&nbsp;';
			}

			if (start + limit < total) {
				var nextIndex = limit * (totalPage - 1);
				tb += '<button class="mid_Btn" onclick="Easy.Grid.locationPage(\''
						+ queryStringId
						+ '\','
						+ nextIndex
						+ ',\''
						+ url
						+ '\',\''
						+ options.gridId
						+ '\',\''
						+ pageId
						+ '\',\''
						+ pageIds + '\')">末&nbsp;页</button>';
			}
			tb += '</td>';
			tb += '</tr>';
			tb += '</table>';

			tb += '<span id="' + queryStringId + '" style="display:none">'
					+ Easy.Method.jsonToString(options) + '</span>';

			if (Easy.Object.get(pageId) != null) {
				$("#" + pageId).html(tb);
			}

		},
		locationPage : function(queryStringId, start, url, gridId, pageId,
				pageIds) {

			var options = Easy.Method.toJSON($("#" + queryStringId).text());
			options.parameters["start"] = start;
			options.parameters["gridId"] = gridId;
			options.parameters["pageId"] = pageIds;
			if (options.onSuccessToString
					&& options.onSuccessToString.trim() != '') {
				options.onSuccess = Easy.Method
						.toJSON(options.onSuccessToString);
			}
			if (options.onFailureToString
					&& options.onFailureToString.trim() != '') {
				options.onFailure = Easy.Method
						.toJSON(options.onFailureToString);
			}
			this.load(url, options);

		},
		gotoPage : function(queryStringId, pageNo, url, gridId, pageId,
				pageIds, totalPage) {

			if (!isNaN($("#" + pageNo).val())
					&& $("#" + pageNo).val() <= totalPage) {
				var options = Easy.Method.toJSON($("#" + queryStringId).text());

				options.parameters["start"] = options.parameters["limit"]
						* ($("#" + pageNo).val() - 1);
				if (parseInt(options.parameters["start"]) < 0) {
					return;
				}
				options.parameters["gridId"] = gridId;
				options.parameters["pageId"] = pageIds;
				if (options.onSuccessToString
						&& options.onSuccessToString.trim() != '') {
					options.onSuccess = Easy.Method
							.toJSON(options.onSuccessToString);
				}
				if (options.onFailureToString
						&& options.onFailureToString.trim() != '') {
					options.onFailure = Easy.Method
							.toJSON(options.onFailureToString);
				}
				this.load(url, options);
			}

		}
	},
	Ajax : {
		request : function(url, options) {

			if (options.isMask == null || options.isMask) {

				var msg = "下载中...";
				if (options.msg != null) {
					msg = options.msg;
				}

				Easy.MessageBox.wait(msg);
			}

			var parameters = {};
			if (options.parameters != null) {
				parameters = options.parameters;
			}

			var asynchronous = true;
			if (options.asynchronous != null) {
				asynchronous = options.asynchronous;
			}
			var method = "post";
			if (options.method != null) {
				method = options.method;
			}

			$
					.ajax({
						url : url,
						data : parameters,
						async : asynchronous,
						dataType : 'text',
						type : method,
						traditional : true,
						success : function(response) {
							if (response.indexOf(
									'failure:true, invalidation:true,', 1) > 0) {

								var invalidRTN = Easy.Method.toJSON(response);
								ymPrompt
										.errorInfo(
												invalidRTN.error,
												null,
												null,
												null,
												function(tp) {
													if (tp == 'ok') {
														if (invalidRTN.type == 'nopermit'
																|| invalidRTN.type == 'exception') {
														} else if (invalidRTN.type == 'logout') {

															top.location = invalidRTN.loginUrl;
														}

													}
												});

							}

							// 反射回调函数 加上的-YB
							if (options.callBack != null) {
								try {
									eval(options.callBack);
								} catch (e) {
									// Alert(e);
								}

							}
							if (options.onSuccess
									&& typeof (options.onSuccess) == 'function') {
								options.onSuccess.call(this, response);
							}

							Easy.Grid.loaded(options);

						},
						failure : function(transport) {
							if (options.onFailure
									&& typeof (options.onFailure) == 'function') {
								options.onFailure.call(this, transport);
							}
							Easy.Grid.loaded(options);
							Alert('服务器出现错误请稍后再试！');
						}

					});

		}
	},
	MessageBox : {
		maskId : 'topFill',
		loadingId : 'loadingMsgId',
		/**
		 * 取消遮罩
		 */
		unmask : function() {
			$("#" + this.maskId).hide();
		},
		/**
		 * 弹出遮罩，处于下载状态
		 * 
		 * @param {}
		 *            msg
		 */
		wait : function(msg) {

			if ($("#" + this.maskId).length == 0) {

				var messageBoxElement = document.createElement('div');
				document.body.appendChild(messageBoxElement); // 
				messageBoxElement.id = this.maskId;
				messageBoxElement.style.width = '100%';
				messageBoxElement.style.display = 'none';
				messageBoxElement.innerHTML = "<div id='"
						+ this.loadingId
						+ "' class='loading-in'><div class='loadingImage'></div>"
						+ msg + "</div></div>";

			} else {

				$("#" + this.loadingId).html(
						"<div class='loadingImage'></div>" + msg + "</div>");

			}

			var obj = Easy.Object.get(this.maskId);

			var loadingObj = $("#" + this.loadingId);

			if (obj) {
				var iWidth = document.body.clientWidth;
				var iHeight = document.body.clientHeight;
				obj.css('width', Math.max(document.body.clientWidth, iWidth)
						+ "px");

				obj.css('height', Math.max(document.body.clientHeight, iHeight)
						+ "px");

				obj.show();
				var changeAlpha = function() {
					var obj_w;
					var e_add = 0;
					var obj_a = 0;
					// alert(Prototype.Browser.WebKit);

					if (Easy.browser.gecko) {
						obj_a = parseInt(obj.style.opacity);
					} else if (Easy.browser.webkit) {
					} else {

						if (obj.filters == null || obj.filters.alpha == null
								|| obj.filters.alpha
								|| obj.filters.alpha.opacity == null
								|| obj.filters.alpha.opacity == '') {

							obj_a = 0;
						} else {

							obj_a = parseInt(obj.filters.alpha.opacity);
						}
					}
					e_add += 20;
					if (obj_a < 80) {
						if (Easy.browser.gecko) {
							obj.style.opacity = (obj_a + e_add);
						} else if (Easy.browser.webkit) {
						} else {
							if (obj.filters != null
									&& obj.filters.alpha != null) {
								obj.filters.alpha.opacity = (obj_a + e_add);
							}
						}
					} else {

						clearInterval(bw);
					}
				}
				var bw = window.setInterval(changeAlpha, 1);
			}

		}
	},
	Method : {
		showImg : function(src) {

			ymPrompt.win(
					'<div align="center"><img style="max-width:600px;max-height:500px;" src="'
							+ src + '" ></div>', 600, 500, '图片预览')

		},
		/**
		 * 转化为JSON
		 * 
		 * @param {}
		 *            jsonString
		 * @return {}
		 */
		toJSON : function(jsonString) {

			if (typeof (eval("(" + jsonString + ")")) == 'undefined') {
				return Easy.Method.evalJSON(jsonString);
			}

			return eval("(" + jsonString + ")");
		},
		evalJSON : function(str) {
			var json = (new Function("return " + str))();
			return json;
		},
		toJSONString : function(object) {
			if (object == null) {
				return null;
			}
			var type = typeof object;
			if ('object' == type) {
				if (Array == object.constructor)
					type = 'array';
				else if (RegExp == object.constructor)
					type = 'regexp';
				else
					type = 'object';
			}
			switch (type) {
			case 'undefined':
			case 'unknown':
				return;
				break;
			case 'function':
			case 'boolean':
			case 'regexp':
				return object.toString();
				break;
			case 'number':
				return isFinite(object) ? object.toString() : 'null';
				break;
			case 'string':
				return '"'
						+ object.replace(/(\\|\")/g, "\\$1").replace(
								/\n|\r|\t/g,
								function() {
									var a = arguments[0];
									return (a == '\n') ? '\\n'
											: (a == '\r') ? '\\r'
													: (a == '\t') ? '\\t' : ""
								}) + '"';
				break;
			case 'object':
				if (object === null)
					return 'null';
				var results = [];
				for ( var property in object) {
					var value = Easy.Method.toJSONString(object[property]);
					if (value !== undefined)
						results.push(Easy.Method.toJSONString(property) + ':'
								+ value);
				}
				return '{' + results.join(',') + '}';
				break;
			case 'array':
				var results = [];
				for (var i = 0; i < object.length; i++) {
					var value = Easy.Method.toJSONString(object[i]);
					if (value !== undefined)
						results.push(value);
				}
				return '[' + results.join(',') + ']';
				break;
			}
		},
		/**
		 * 转化为JSON
		 * 
		 * @param {}
		 *            jsonString
		 * @return {}
		 */
		jsonToString : function(json) {
			return Easy.Method.toJSONString(json);

		},
		/**
		 * URL重定向
		 * 
		 * @param {}
		 *            zz
		 * @return {}
		 */
		location : function(url, opations) {
			var divId = "easyUrlLocationDiv";
			var formId = "easyUrlLocation";
			if (Easy.Object.get(divId) == null) {
				var messageBoxElement = document.createElement('div');
				document.body.appendChild(messageBoxElement); // 
				messageBoxElement.id = divId;
				messageBoxElement.style.display = 'none';

			}

			var fields = "";
			var method = "get";
			for ( var key in opations) {
				var name = key.toString();
				if (name == 'method')
					method = opations[name];
				fields += "<input type='hidden' name='" + name + "' value='"
						+ opations[name] + "'>";
			}

			$("#" + divId).html(
					'<form id="' + formId + '" action="" method="' + method
							+ '" >' + fields + '</form>');
			Easy.Object.get(formId).get(0).action = url;
			Easy.Object.get(formId).get(0).submit();
		},
		/**
		 * 获取URL参数
		 */
		getQueryField : function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null)
				return unescape(r[2]);
			return null;
		}

	},
	Iframe : {
		mainFrameId : 'main_frame',
		/**
		 * 重新设定高度
		 * 
		 * @param {}
		 *            iframe
		 */
		reinitIframe : function(iframe) {
			try {

				var bHeight = iframe.contentWindow.document.body.scrollHeight;
				var dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
				var height = Math.max(bHeight, dHeight);
				iframe.height = height;
			} catch (ex) {
			}

		},

		bindInterval : function(funcName) {
			var args = [];
			for (var i = 1; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			return function() {
				funcName.apply(this, args);
			}
		},
		/**
		 * IFRAME加载后启动定时，时时监控高度并且重新设定
		 * 
		 * @param {}
		 *            obj
		 */
		init : function(obj) {
			window.setInterval(Easy.Iframe.bindInterval(
					Easy.Iframe.reinitIframe, obj), 200);
		},
		/**
		 * 获取iframe中对应ID的对象
		 * 
		 * @param {}
		 *            id
		 * @return {}
		 */
		getObjectInMainFrameById : function(id) {

			var mainFrame = this.getMainFrame();
			if (mainFrame != null) {
				return mainFrame.document.getElementById(id);
			}
			return null;
		},
		getMainFrameById : function(id) {

			if (Easy.Object.get(id) != null) {
				return Easy.Object.get(id).get(0).contentWindow;
			} else {

				return null;
			}

		},
		/**
		 * 获取IFRMAE对象，以便操作相关属性
		 * 
		 * @return {}
		 */
		getMainFrameObject : function() {

			return Easy.Object.get(this.mainFrameId).get(0);
		},
		/**
		 * 获取IFRMAE对象,以便调用iframe网页内部函数、元素等；
		 * 
		 * @return {}
		 */
		getMainFrame : function() {

			return this.getMainFrameById(this.mainFrameId);
		}
	},
	Tab : {
		removeTab : function(renderTo, id) {

			var tab = new Easy.Tab.Panel({
				renderTo : renderTo,
				hadRegister : true
			});

			tab.removeTab(id);
		},
		activeTab : function(renderTo, id) {

			var tab = new Easy.Tab.Panel({
				renderTo : renderTo,
				hadRegister : true
			});

			tab.activeTab(id);
		},
		Panel : function(options) {

			this.panelId = "tab_" + options.renderTo + "_hide_panel";
			this.iframeId = "tab_" + options.renderTo + "_hide_iframe";
			this.options = options;

			if (options.hadRegister == null || options.hadRegister == false) {

				Easy.Tab.registerIframe(options.renderTo, Easy.Tab
						.getIframeHTML(this.panelId, this.iframeId));
			}

			// }
			/**
			 * 删除选中的tab
			 * 
			 * @param {}
			 *            id
			 */
			this.removeTab = function(id) {

				Easy.Object.get(Easy.Object.get(id).get(0).title).remove();
				Easy.Object.get(id).remove();
				var length = $("#" + this.panelId).siblings().length;

				if (length > 0) {
					this
							.activeTab($("#" + this.panelId).siblings()[length - 1].id);
				}
			}
			this.getActiveTabId = function() {

				var siblings = $("#" + this.panelId).siblings();
				for (var i = 0; i < siblings.length; i++) {
					if ($("#" + siblings[i].id).className == 'current')
						return siblings[i].id;

				}
				return "";
			}
			this.activeTab = function(id) {

				this.addTab({
					id : id,
					title : '',
					url : '',
					close : true
				});
			}

			this.addTab = function(options) {
				var isExist = false;

				var id = options.id;
				var title = options.title;
				var url = options.url;
				var close = options.close;
				var currentIndex = 0;

				var siblings = $("#" + this.panelId).siblings();

				for (var i = 0; i < siblings.length; i++) {

					if ($("#" + siblings[i].id).children("p").length > 0) {
						var child = $("#" + siblings[i].id).children("p")[0];

						child.className = "";
						child.className = "grey_X";

					}
					if (siblings[i].id == id) {
						isExist = true;
						currentIndex = i;

					} else {
						$("#" + siblings[i].id).removeClass("current");
						// 隐藏Iframe

						Easy.Object.get(siblings[i].title).hide();

					}

				}

				if (isExist) {
					// 已经存在

					$("#" + id).addClass("current");

					if ($("#" + id).children("p").length > 0) {

						var child = $("#" + id).children("p")[0];
						child.className = "";
						child.className = "red_X";

					}
					Easy.Object.get(Easy.Object.get(id).get(0).title).show();

				} else {

					var tabTitle = title;
					if (tabTitle.length > 20) {
						tabTitle = tabTitle.substring(0, 20);
					}

					var html = '<li  id="'
							+ id
							+ '" class="current" title="iframe_'
							+ id
							+ '"><span></span><a href=javascript:Easy.Tab.activeTab("'
							+ this.options.renderTo + '","' + id + '") title="'
							+ title + '">' + tabTitle + '</a>';
					if (close) {
						html += '<p class="red_X" onclick=Easy.Tab.removeTab("'
								+ this.options.renderTo + '","' + id
								+ '")></p></li>';
					}
					$(html).insertBefore("#" + this.panelId);
					$("#" + this.panelId).prev().attr("id", id);

					var height = 0;
					var onload = "";
					if (this.options.autoHeight != null
							&& this.options.autoHeight == true) {
						onload = "onload=\"Easy.Iframe.init(this)\"";

					}
					if (this.options.height != null) {
						height = this.options.height;
					}
					var iframeHtml = '<iframe id="iframe_' + id
							+ '" width="100%" height="' + height + '" src="'
							+ url + '" frameborder="0" scrolling="auto") "'
							+ onload + '"></iframe>';

					$(iframeHtml).insertBefore("#" + this.iframeId);
					$("#" + this.iframeId).prev().attr("id", "iframe_" + id);

				}

			}

		},

		registerIframe : function(renderTo, html) {
			if (renderTo != null && Easy.Object.get(renderTo) != null) {
				$("#" + renderTo).html(html);
			}

		},
		getIframeHTML : function(panelId, iframeId) {

			var html = "";
			html += '<div class="common_box"><div class="title" ><div class="open">';
			html += '<div class="lt"></div><div class="rt"></div>';
			html += '<ul class="Tab"><li id="' + panelId
					+ '" style="display:none"></li></ul></div> </div>';
			html += '<div class="main" id="main_1"><div class="lt2"></div><div class="rt2"></div><span id="'
					+ iframeId + '"></span></div></div>';

			return html;

		}
	},

	mulselecter : {
		register : function(obj, opt) {

			if (!Easy.Object.get('mul_box_' + opt.boxid)) {
				var initHTML = '<div class="bor bort_none" id="mul_box_'
						+ opt.boxid
						+ '" ><div class="title_s relative"><a class="more" href="javascript:void(0);" onclick=$("#mul_box_'
						+ opt.boxid
						+ '").hide()>[关闭]</a><a class="more clear" href="javascript:void(0);">[清空]</a><h3 class="absolute Fw qie" id="mul_h3_'
						+ opt.boxid
						+ '"></h3></div><div class="p15" id="mul_ul_div_'
						+ opt.boxid + '"></div></div>';

				$("body").append(initHTML);
				if (obj.id == '') {
					obj.id = "obj_" + Easy.getSequence();
				}
				$('#mul_box_' + opt.boxid).click(function(event) {
					event.stopPropagation(); // 阻止冒泡事件

				});

				$(document).click(function(event) {
					var eo = $(event.target);
					if (eo.attr('id') != obj.id) {
						if ($('#mul_box_' + opt.boxid).is(":visible")) {
							$('#mul_box_' + opt.boxid).hide();
							// $('#mul_box_' + opt.boxid).slideUp("fast");
						}
					}

				});

				if (opt.single) {
					Easy.Object.get('mul_box_' + opt.boxid)
							.children('.title_s').hide();
					Easy.Object.get('mul_box_' + opt.boxid).children('.p15')
							.attr('class', 'p15 p15append');

				}
				if (opt.width) {
					Easy.Object.get('mul_box_' + opt.boxid).css("width",
							opt.width + "px");
				}
				Easy.Object.get('mul_box_' + opt.boxid).css("top",
						($(obj).offset().top + $(obj).height()) + "px");

				Easy.Object.get('mul_box_' + opt.boxid).css("left",
						$(obj).offset().left);
				Easy.Object.get('mul_box_' + opt.boxid).find(".clear").click(
						function() {
							Easy.Object.get('mul_box_' + opt.boxid).remove();
							if (opt.clear && typeof (opt.clear) == 'function') {
								opt.clear.call(this, opt.boxid);
							}
						});
			} else {
				Easy.Object.get('mul_box_' + opt.boxid).css("top",
						($(obj).offset().top + $(obj).height()) + "px");
				Easy.Object.get('mul_box_' + opt.boxid).css("left",
						$(obj).offset().left);
				Easy.Object.get('mul_box_' + opt.boxid).show();
				return;
			}

			for (var i = 0; i < opt.mulobjects.length; i++) {
				var mulobject = opt.mulobjects[i];
				var h3classname = 'on fltL';
				if (i > 0) {
					h3classname = 'off fltL';
				}
				$('#mul_h3_' + opt.boxid)
						.append(
								'<a id="mul_a_'
										+ opt.boxid
										+ '_'
										+ i
										+ '" class="'
										+ h3classname
										+ '" href="javascript:void(0);" onclick=Easy.mulselecter.boxuishow("'
										+ opt.boxid + '","' + i + '","'
										+ opt.mulobjects.length + '") >'
										+ mulobject.name + '</a>');
				$('#mul_ul_div_' + opt.boxid).append(
						'<ul id="mul_ul_' + opt.boxid + '_' + i + '" ></ul>');

			}
			if (!opt.single) {
				opt.single = false;
			}
			$('#mul_box_' + opt.boxid).data("options", opt);
			Easy.mulselecter.loadMulValue(opt.pid, opt.boxid, opt.url, 0,
					opt.mulobjects.length, opt.single);

			Easy.mulselecter.select = function(boxid, ret) {

				if (opt.select && typeof (opt.select) == 'function') {
					opt.select.call(this, boxid, ret);
				}
			}
		},
		loadMulValue : function(pid, boxid, url, idx, total, single) {

			var params = {};
			params['pid'] = pid;
			var opt = $('#mul_box_' + boxid).data("options");
			if (opt && opt.params) {
				params = $.extend(opt.params, params);
			}

			Easy.Ajax
					.request(
							url,
							{
								parameters : params,
								onSuccess : function(response) {
									var jsonData = Easy.Method.toJSON(response);
									if (jsonData.success) {
										var records = jsonData.data;

										for (var i = 0; i < records.length; i++) {

											record = records[i];
											var liclassname = 'fltL';

											if (i % 3 == 0) {
												liclassname = 'fltL';
											} else {
												liclassname = 'fltL ml15';
											}

											$('#mul_ul_' + boxid + '_' + idx)
													.append(
															'<li id="mul_li_'
																	+ boxid
																	+ '_'
																	+ idx
																	+ '_'
																	+ i
																	+ '" class="'
																	+ liclassname
																	+ '"><div class="boxdiv"><a href="javascript:void(0)"'
																	+ ' onclick=Easy.mulselecter.selectMulValu(this,"'
																	+ boxid
																	+ '","'
																	+ record.id
																	+ '",'
																	+ idx
																	+ ','
																	+ total
																	+ ',"'
																	+ url
																	+ '","'
																	+ record.name
																	+ '",'
																	+ single
																	+ ')>'
																	+ record.name
																	+ '</a></div></li>');
											if (single) {

												$(
														'#mul_li_' + boxid
																+ '_' + idx
																+ '_' + i).css(
														"width", '100%');
												$(
														'#mul_li_' + boxid
																+ '_' + idx
																+ '_' + i)
														.mouseover(
																function() {
																	this.style.backgroundColor = '#f1f1f1';
																})
												$(
														'#mul_li_' + boxid
																+ '_' + idx
																+ '_' + i)
														.mouseout(
																function() {
																	this.style.backgroundColor = '';
																})
											}

										}
									}

								}
							});
		},
		selectMulValu : function(obj, boxid, fid, idx, total, url, name) {
			var selClass = "selected";
			var $sli = $(obj).closest("li");
			$sli.parent().find("." + selClass).removeClass(selClass);
			$sli.addClass(selClass);
			var nidx = parseInt(idx) + 1;
			if (!Easy.Object.get('mul_value_' + idx)) {
				$('#mul_box_' + boxid).append(
						'<div id="mul_value_' + idx
								+ '" style="display:none"></div>');
			}

			Easy.Object.get('mul_value_' + idx).text(
					"{'name':'" + name + "','id':'" + fid + "'}");
			for (i = nidx; i < total; i++) {
				$('#mul_ul_' + boxid + '_' + i).html('');
				if (Easy.Object.get('mul_value_' + i)) {
					Easy.Object.get('mul_value_' + i).text('');
				}
			}

			if (nidx < total) {

				Easy.mulselecter.loadMulValue(fid, boxid, url, nidx, total);

				Easy.mulselecter.boxuishow(boxid, nidx, total);

				var retArray = new Array();
				for (var i = 0; i < idx + 1; i++) {

					retArray.push(Easy.Method.toJSON(Easy.Object.get(
							'mul_value_' + i).text()));

				}

				Easy.mulselecter.select(boxid, retArray);
			} else {
				var retArray = new Array();
				for (var i = 0; i < total; i++) {

					retArray.push(Easy.Method.toJSON(Easy.Object.get(
							'mul_value_' + i).text()));

				}
				$('#mul_box_' + boxid).hide()
				Easy.mulselecter.select(boxid, retArray);

			}
		},
		boxuishow : function boxuishow(boxid, idx, total) {

			for (var i = 0; i < total; i++) {
				$('#mul_a_' + boxid + '_' + i).attr('class', '');
				$('#mul_a_' + boxid + '_' + i).attr('class', 'off fltL');
				$('#mul_ul_' + boxid + '_' + i).hide();
			}
			$('#mul_a_' + boxid + '_' + idx).attr('class', 'on fltL');
			$('#mul_ul_' + boxid + '_' + idx).show();

		}
	}

	,

	browser : {
		getInfo : function() {
			if($.browser==null){
				Easy.browser.version=10;
				Easy.browser.chrome = true;
				return;
			}
			// alert(Easy.Method.jsonToString($.browser));
			Easy.browser.version = $.browser.version;
			
			if ($.browser.webkit) {
				Easy.browser.webkit = true;

			} else if ($.browser.gecko) {
				Easy.browser.gecko = true;
			} else if ($.browser.mozilla) {
				Easy.browser.mozilla = true;
			}
			if ($.browser.chrome) {
				Easy.browser.chrome = true;
			} else {

			}
		},
		webkit : false,
		gecko : false,
		mozilla : false,
		chrome : false,
		version : null
	}

}
Easy.browser.getInfo();
$(document).ready(function() {
	var mulcssfile = document.createElement("LINK");
	mulcssfile.rel = "stylesheet";
	mulcssfile.type = "text/css";
	mulcssfile.href = '/js/easy/core.css';
	document.getElementsByTagName("HEAD")[0].appendChild(mulcssfile);

	Easy.Grid.initHistoryGrid();
});

function g() {
	return arguments[0];

}
