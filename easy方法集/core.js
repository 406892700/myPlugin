/**
 * E框架V2.5
 * 
 */

var Easy = {
	Version : '2.5.2',
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

			if ($(objectId) != null) {

				if ($(objectId).tagName.toLowerCase() == 'input') {
					if ($(objectId).type == '') {
					} else {
						$(objectId).value = this.replaceTag($(objectId).value,
								JSONobj, key);
					}
				} else if ($(objectId).tagName.toLowerCase() == 'textarea') {
					$(objectId).value = this.replaceTag($(objectId).value,
							JSONobj, key);
				} else if ($(objectId).tagName.toLowerCase() == 'select') {

					$(objectId).value = this.replaceTag($(objectId).value,
							JSONobj, key);
				} else {

					if ($(objectId).tagName.toLowerCase() == 'span'
							&& $(objectId).readAttribute('type') != null
							&& $(objectId).readAttribute('type') == 'radio') {

						// 单选框赋值
						var radios = $(objectId).immediateDescendants();
						for (var i = 0; i < radios.length; i++) {
							if (radios[i].tagName.toLowerCase() == 'input'
									&& radios[i].type == 'radio') {
								if (radios[i].value == JSONobj[key]) {
									radios[i].checked = true;
								}
							}
						}

					} else if ($(objectId).tagName.toLowerCase() == 'span'
							&& $(objectId).readAttribute('type') != null
							&& $(objectId).readAttribute('type') == 'checkbox') {

						// 复选框赋值
						var value = JSONobj[key];
						value = "" + value;
						var values = value.split(',');

						var checkboxs = $(objectId).immediateDescendants();
						for (var i = 0; i < checkboxs.length; i++) {

							if (checkboxs[i].tagName.toLowerCase() == 'input'
									&& checkboxs[i].type == 'checkbox') {
								for (var k = 0; k < values.length; k++) {
									if (checkboxs[i].value == values[k]) {
										checkboxs[i].checked = true;
										break;
									}
								}
							}
						}

					} else {
						$(objectId).innerHTML = this.replaceTag(
								$(objectId).innerHTML, JSONobj, key);

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
			var method = "POST";
			if (options.method != null) {
				method = options.method;
			}
			new Ajax.Request(url, {
				method : method,
				parameters : parameters,
				onSuccess : function(response) {

					var result = response.responseText.evalJSON();
					var JSONobj = result.data;
					if (result.success != null && result.success) {
						for (var key in JSONobj) {
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

							}
						}
					}

				},
				onFailure : function(transport) {
					if (options.isMask == null || options.isMask) {
						Easy.MessageBox.unmask();
					}
					Alert('服务器出现错误请稍后再试！');
				}
			});
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
					&& $(options.gridId) != null) {
				$(options.gridId).hide();
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

			var html = $(gridId).outerHTML;

			if (Prototype.Browser.IE) {
				html = Easy.Method.innerHTMLTAddQuotes(html);
			}

			html = html.replace(gridId, gridId + "_" + index);
			var seqIndex = start;
			if (seqIndex==null || seqIndex==''||seqIndex < 0) {
				seqIndex = 0;
			}

			html = html.replace(/\[v:g@#index#@]/g, parseInt(seqIndex)
							+ parseInt(index) + 1);

			html = html.replace(/\[v:g@#record#@]/g, Object.toJSON(JSONobj));
			html = this.replaceTag(html, JSONobj);

			new Insertion.Before(gridId, html)
			$(gridId + "_" + index).show();

			Easy.Grid.setTrBgColor($(gridId + "_" + index), false, bgColor)
			Easy.Grid.addTableListener($(gridId + "_" + index), bgColor);

		},
		removeALLCell : function(gridId, limit) {

			var total = limit;
			if (limit==null || limit=='' ||limit == -1) {
				total = 10000;
			}

			for (var i = 0; i < total; i++) {
				if ($(gridId + "_" + i) != null) {
					$(gridId + "_" + i).remove();
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
			var JSON = str.evalJSON();
			var result = JSON.v;

			return result;
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
			var asynchronous = true;
			if (options.asynchronous != null) {
				asynchronous = options.asynchronous;
			}
			var method = "POST";
			if (options.method != null) {
				method = options.method;
			}

			new Ajax.Request(url, {
						method : method,
						parameters : parameters,
						asynchronous : asynchronous,
						onSuccess : function(response) {

							var result = response.responseText.evalJSON();
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
								Easy.Grid.bindJsonId(options, url);
							}

							// 反射回调函数
							if (options.callBack != null) {
								eval(options.callBack);
							}
							Easy.Grid.loaded(options);
						},
						onFailure : function(transport) {
							Easy.Grid.loaded(options);
							Alert('服务器出现错误请稍后再试！');
						}
					});
		},
		bindJsonId : function(options, url) {
			var bindJsonId = options.gridId + "_json";
			if ($(bindJsonId) == null) {
				var element = document.createElement('div');
				document.body.appendChild(element); // 
				element.id = bindJsonId;
				element.style.width = '100%';
				element.style.display = 'none';

			}
			options['bindPreUrl'] = url;
			$(bindJsonId).update(Object.toJSON(options));
		},
		history : function(gridId) {
			var bindJsonId = gridId + "_json";

			var options = $(bindJsonId).innerHTML.evalJSON();

			Easy.Grid.load(options.bindPreUrl, options);

		},
		sort : function(obj, gridId, sort) {

			var bindJsonId = gridId + "_json";
			var options = $(bindJsonId).innerHTML.evalJSON();
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
		getHistoryURL : function(gridId) {
			var bindJsonId = gridId + "_json";
			return $(bindJsonId).innerHTML;

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
			var aBgColor = ["#FFFFFF", "#f5fce9", "#d1eea7", "#d1eea7"];
			if (bgColor != null) {
				aBgColor = bgColor;
			}
			oTr.rowIndex % 2 != 0 ? oTr.style.backgroundColor = b
					? aBgColor[3]
					: aBgColor[1] : oTr.style.backgroundColor = b
					? aBgColor[2]
					: aBgColor[0];
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
					+ Object.toJSON(options) + '</span>';

			if ($(pageId) != null) {
				$(pageId).update(tb);
			}

		},
		locationPage : function(queryStringId, start, url, gridId, pageId,
				pageIds) {

			var options = $(queryStringId).innerHTML.evalJSON();
			options.parameters["start"] = start;
			options.parameters["gridId"] = gridId;
			options.parameters["pageId"] = pageIds;

			this.load(url, options);

		},
		gotoPage : function(queryStringId, pageNo, url, gridId, pageId,
				pageIds, totalPage) {

			if (!isNaN($F(pageNo)) && $F(pageNo) <= totalPage) {
				var options = $(queryStringId).innerHTML.evalJSON();
				options.parameters["start"] = options.parameters["limit"]
						* ($F(pageNo) - 1);
				if (parseInt(options.parameters["start"]) < 0) {
					return;
				}
				options.parameters["gridId"] = gridId;
				options.parameters["pageId"] = pageIds;
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
			new Ajax.Request(url, {
						method : 'post',
						parameters : parameters,
						asynchronous : asynchronous,
						onSuccess : function(response) {
							// 反射回调函数 加上的-YB
							if (options.callBack != null) {
								try {
									eval(options.callBack);
								} catch (e) {

								}

							}
							Easy.Grid.loaded(options);
						},
						onFailure : function(transport) {
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
			$(this.maskId).style.display = 'none';
		},
		/**
		 * 弹出遮罩，处于下载状态
		 * 
		 * @param {}
		 *            msg
		 */
		wait : function(msg) {

			if ($(this.maskId) == null) {
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
				$(this.loadingId).update("<div class='loadingImage'></div>"
						+ msg + "</div>");
			}
			var obj = $(this.maskId);
			var loadingObj = $(this.loadingId);
			if (obj) {
				var iWidth = document.body.clientWidth;
				var iHeight = document.body.clientHeight;
				obj.style.width = Math.max(document.body.clientWidth, iWidth)
						+ "px";
				obj.style.height = Math
						.max(document.body.clientHeight, iHeight)
						+ "px";
				/*
				 * if (loadingObj) { loadingObj.style.margin =
				 * (document.documentElement.offsetHeight - obj.offsetHeight)/2; }
				 */
				obj.style.display = 'block';
				var changeAlpha = function() {
					var obj_w;
					var e_add = 0;
					var obj_a = 0;
					// alert(Prototype.Browser.WebKit);

					if (Prototype.Browser.Gecko) {
						obj_a = parseInt(obj.style.opacity);
					} else if (Prototype.Browser.WebKit) {
					} else {

						if (obj.filters == null || obj.filters.alpha == null
								|| obj.filters.alpha.opacity == null
								|| obj.filters.alpha.opacity == '') {
							obj_a = 0;
						} else {
							obj_a = parseInt(obj.filters.alpha.opacity);
						}
					}
					e_add += 20;
					if (obj_a < 80) {
						if (Prototype.Browser.Gecko) {
							obj.style.opacity = (obj_a + e_add);
						} else if (Prototype.Browser.WebKit) {
						} else {
							obj.filters.alpha.opacity = (obj_a + e_add);
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
			if ($(divId) == null) {
				var messageBoxElement = document.createElement('div');
				document.body.appendChild(messageBoxElement); // 
				messageBoxElement.id = divId;
				messageBoxElement.style.display = 'none';

			}
			
			
			
			var fields = "";
			var method = "get";
			for (var key in opations) {
				var name = key.toString();
				if(name == 'method')method=opations[name];
				fields += "<input type='hidden' name='" + name + "' value='"
						+ opations[name] + "'>";
			}

			$(divId).update('<form id="' + formId
					+ '" action="" method="'+method+'" >' + fields + '</form>');
			$(formId).action = url;
			$(formId).submit();
		},
		/**
		 * 针对IE innerHTML,outerHTML得到引号等问题
		 * 
		 * @param {}
		 *            zz
		 * @return {}
		 */
		innerHTMLTAddQuotes : function(zz) {
			var specialCharArray = {};
			specialCharArray["specialChar0"] = ":";
			specialCharArray["specialChar1"] = "$";
			specialCharArray["specialChar2"] = "@";
			specialCharArray["specialChar3"] = "_";
			specialCharArray["specialChar4"] = "-";
			specialCharArray["specialChar5"] = "[";
			specialCharArray["specialChar6"] = "]";
			for (var specialChar in specialCharArray) {
				for (var key in specialCharArray) {
					zz = zz.replace(eval("/\\" + specialCharArray[key] + "/g"),
							key);
				}
			}

			var z = zz
					.match(/<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>/g);
			if (z) {
				for (var i = 0; i < z.length; i++) {
					var y, zSaved = z[i];
					z[i] = z[i].replace(/(<?\w+)|(<\/?\w+)\s/, function(a) {
								return a.toLowerCase();
							});
					y = z[i].match(/\=\w+[?\s+|?>]/g);
					if (y) {
						for (var j = 0; j < y.length; j++) {
							z[i] = z[i].replace(y[j], y[j].replace(
											/\=(\w+)([?\s+|?>])/g, '="$1"$2'));
						}
					}
					zz = zz.replace(zSaved, z[i]);
				}
			}
			for (var specialChar in specialCharArray) {
				for (var key in specialCharArray) {
					zz = zz.replace(eval("/" + key + "/g"),
							specialCharArray[key]);
				}
			}

			return zz;
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

			if ($(id) != null) {
				return $(id).contentWindow;
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

			return $(this.mainFrameId);
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

				$($(id).title).remove();
				$(id).remove();
				var length = $(this.panelId).siblings().length;

				if (length > 0) {
					this.activeTab($(this.panelId).siblings()[length - 1].id);
				}
			}
			this.getActiveTabId = function() {

				var siblings = $(this.panelId).siblings();
				for (var i = 0; i < siblings.length; i++) {
					if ($(siblings[i].id).className == 'current')
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

				var siblings = $(this.panelId).siblings();
				for (var i = 0; i < siblings.length; i++) {
					if ($(siblings[i].id).down('p')) {
						$(siblings[i].id).down('p').removeClassName("red_X");
						$(siblings[i].id).down('p').addClassName("grey_X");
					}
					if (siblings[i].id == id) {
						isExist = true;
						currentIndex = i;

					} else {
						$(siblings[i].id).removeClassName("current");
						// 隐藏Iframe

						$(siblings[i].title).hide();
					}

				}

				if (isExist) {
					// 已经存在
					$(id).addClassName("current");
					if ($(id).down('p')) {
						$(id).down('p').removeClassName("grey_X");
						$(id).down('p').addClassName("red_X");
					}

					$($(id).title).show();
				} else {
					var tabTitle = title;
					if (tabTitle.length > 20) {
						tabTitle = tabTitle.substring(0, 20);
					}
					// Object.toJSON(this)
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
					new Insertion.Before(this.panelId, html)
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
					new Insertion.Before(this.iframeId, iframeHtml);

				}

			}

		},

		registerIframe : function(renderTo, html) {
			if (renderTo != null && $(renderTo) != null) {
				$(renderTo).update(html);
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
	Msg : {
		/**
		 * id:提示框架span位置ID,msg:提示语,style:样式,align:对齐方式
		 * 
		 * @param {}
		 *            options
		 */
		error : function(options) {
			if ($(options.id) != null) {

				var msg = "";
				if (options.msg != null) {
					msg = options.msg;
					var style = "";
					if (options.style != null) {
						style = options.style;
					}
					var className = "msg_error";
					if (typeof(options.align) != 'undefined') {
						className += " " + options.align;
					}
					$(options.id).update('<span class="' + className
							+ '" style="' + style + '">' + msg + '</span>');
				}
			}
		},
		/**
		 * id:提示框架span位置ID,msg:提示语,style:样式,align:对齐方式
		 * 
		 * @param {}
		 *            options
		 */
		ok : function(options) {
			if ($(options.id) != null) {
				var msg = "";
				if (options.msg != null) {
					msg = options.msg;
				}
				if (msg == '') {
					msg = '&nbsp;';
				}
				var style = "";
				if (options.style != null) {
					style = options.style;
				}
				var className = "msg_ok";
				if (typeof(options.align) != 'undefined') {
					className += " " + options.align;
				}
				$(options.id).update('<span class="' + className + '" style="'
						+ style + '">' + msg + '</span>');
			}
		}
	}
}
function g() {
	return arguments[0];

}
