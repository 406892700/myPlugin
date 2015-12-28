var gbl_pageSize = 20; // 分页默认条数
// 判断是否是数字（包括正整数,０,负整数,小数）
String.prototype.checkNumber = function() {
	return /^-?\d+(\.\d+)?$/.test(this);
}

// 判断是否是整数
String.prototype.checkInteger = function() {
	return /^[-]{0,1}[0-9]{1,}$/.test(this);
}

// 判断是否是正整数 （负整数 /^-[0-9]*[1-9][0-9]*$/）
String.prototype.checkPositive = function() {
	return /^[1-9]+[0-9]*]*$/.test(this);
}

// 判断是否是正确的数字（10.00）
String.prototype.checkDouble = function() {
	var p = /^[0-9]+(\.[0-9]+)?$/;
	return p.test(this) ? true : false;
}

// 返回字符的长度，一个中文算2个
String.prototype.chineseLength = function() {
	return this.replace(/[^\x00-\xff]/g, "**").length;
}
// 判断字符串是否以指定的字符串结束
String.prototype.endsWith = function(str) {
	return this.substr(this.length - str.length) == str;
}
// 去掉字符左端的的空白字符
String.prototype.leftTrim = function() {
	return this.replace(/(^[\\s]*)/g, "");
}
// 去掉字符右端的空白字符
String.prototype.rightTrim = function() {
	return this.replace(/([\\s]*$)/g, "");
}
// 判断字符串是否以指定的字符串开始
String.prototype.startsWith = function(str) {
	return this.substr(0, str.length) == str;
}
// 从左边截取n个字符 ,如果包含汉字,则汉字按两个字符计算

String.prototype.left = function(n) {
	return this.slice(0, n
					- this.slice(0, n).replace(/[\x00-\xff]/g, "").length)
};
// 去掉空格
String.prototype.trim = function() {
	// return this.replace(/[(^\s+)(\s+$)]/g,"");//會把字符串中間的空白符也去掉
	// return this.replace(/^\s+|\s+$/g,""); //
	return this.replace(/^\s+/g, "").replace(/\s+$/g, "");
}

// 移除数据
Array.prototype.remove = function(b) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == b) {
			this.splice(i, 1);
			return true;
		}
	}
	return false;
};
/*
 * =========================================== //计算字符串打印长度
 * ===========================================
 */
String.prototype.lengthW = function() {
	return this.replace(/[^\x00-\xff]/g, "**").length;
}

/*
 * =========================================== //是否是正确的IP地址
 * ===========================================
 */
String.prototype.isIP = function() {

	var reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;

	if (reSpaceCheck.test(this)) {
		this.match(reSpaceCheck);
		if (RegExp.$1 <= 255 && RegExp.$1 >= 0 && RegExp.$2 <= 255
				&& RegExp.$2 >= 0 && RegExp.$3 <= 255 && RegExp.$3 >= 0
				&& RegExp.$4 <= 255 && RegExp.$4 >= 0) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}

}

/*
 * =========================================== //是否是正确的长日期
 * ===========================================
 */
String.prototype.isLongDate = function() {
	var r = this
			.replace(/(^\s*)|(\s*$)/g, "")
			.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
	if (r == null) {
		return false;
	}
	var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
	return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3]
			&& d.getDate() == r[4] && d.getHours() == r[5]
			&& d.getMinutes() == r[6] && d.getSeconds() == r[7]);

}

/*
 * =========================================== //是否是正确的短日期
 * ===========================================
 */
String.prototype.isShortDate = function() {
	var r = this.replace(/(^\s*)|(\s*$)/g, "")
			.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
	if (r == null) {
		return false;
	}
	var d = new Date(r[1], r[3] - 1, r[4]);
	return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d
			.getDate() == r[4]);
}

/*
 * =========================================== //是否是正确的日期
 * ===========================================
 */
String.prototype.isDate = function() {
	return this.isLongDate() || this.isShortDate();
}

/*
 * 验证手机号码(检验13,15,18,147开头的手机号！) ===========================================
 */
// String.prototype.isMobile = function() {
// return /^0{0,1}13[0-9]{9}$/.test(this);
// }
// String.prototype.isMobile = function() {
// // var
// //
// p=/(((\([0-9]{3,4}\)){1}|([0-9]{3,4}\-){1})([1-9]{1}[0-9]{6,7})(\-\d{3,4})*)|(0*13[0-9]{9})|(0*15[0-9]{9})|(0*18[0-9]{9})/;
// var p = /^([0\+]\d{2,3}-)?1(3|5|8|4(?=7))\d{9}$/;
// return p.test(this) ? true : false;
// }
String.prototype.isMobile = function() {
	return (/^1[3|4|5|7|8]{1}[0-9]{9}$/.test(this))
			? true
			: false;
}

/*
 * 验证固定电话号码 0\d{2,3} 代表区号 [0\+]\d{2,3} 代表国际区号 \d{7,8} 代表7－8位数字(表示电话号码)
 * 正确格式：区号-电话号码-分机号(全写|只写电话号码)
 */
String.prototype.check_Phone = function() {
	var reg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
	return reg.test(this) ? true : false;
}

String.prototype.isTelephone = function() {
	var reg0 = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,13})(-(\d{3,}))?$/;
	return reg0.test(this);
}

/*
 * =========================================== //是否是邮件
 * ===========================================
 */
String.prototype.isEmail = function() {
	return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
			.test(this);
}

/*
 * =========================================== //是否是邮编(中国)
 * ===========================================
 */

String.prototype.isZipCode = function() {
	return /^[0-9]{6}$/.test(this);
}

/*
 * =========================================== //是否是有汉字
 * ===========================================
 */
String.prototype.existChinese = function() {
	// /^([\u4e00-\u9fa5]|[A-Za-z0-9]|[,])+$/
	// [\u4E00-\u9FA5]為漢字﹐[\uFE30-\uFFA0]為全角符號
	return /^[\x00-\xff]*$/.test(this);
}

/*
 * =========================================== //是否是合法的文件名/目录名
 * ===========================================
 */
String.prototype.isFileName = function() {
	return !/[\\\/\*\?\|:"<>]/g.test(this);
}

/*
 * =========================================== //是否是有效链接
 * ===========================================
 */
String.prototype.isUrl = function() {
	return /^http[s]?:\/\/([\w-]+\.)+[\w-]+([\w-./?%&=]*)?$/i.test(this);
}
/*
 * =========================================== //关键字只能输入汉字，字母，数字和逗号！
 * ===========================================
 */
String.prototype.searchKey = function() {
	return /^([\u4e00-\u9fa5]|[A-Za-z0-9]|[,])+$/.test(this);
}

/*
 * =========================================== //是否找到匹配的字符
 * ===========================================
 */
String.prototype.isReg = function(reg) {
	return reg.test(this);
}

/*
 * =========================================== //是否是有效的身份证(中国)
 * ===========================================
 */
// String.prototype.isIDCard = function() {
// var iSum = 0;
// var info = "";
// var sId = this;
//
// var aCity = {
// 11 : "北京",
// 12 : "天津",
// 13 : "河北",
// 14 : "山西",
// 15 : "内蒙古",
// 21 : "辽宁",
// 22 : "吉林",
// 23 : "黑龙江",
// 31 : "上海",
// 32 : "江苏",
// 33 : "浙江",
// 34 : "安徽",
// 35 : "福建",
// 36 : "江西",
// 37 : "山东",
// 41 : "河南",
// 42 : "湖北",
// 43 : "湖南",
// 44 : "广东",
// 45 : "广西",
// 46 : "海南",
// 50 : "重庆",
// 51 : "四川",
// 52 : "贵州",
// 53 : "云南",
// 54 : "西藏",
// 61 : "陕西",
// 62 : "甘肃",
// 63 : "青海",
// 64 : "宁夏",
// 65 : "新疆",
// 71 : "台湾",
// 81 : "香港",
// 82 : "澳门",
// 91 : "国外"
// };
//
// if (!/^\d{17}(\d|x)$/i.test(sId)) {
// return false;
// }
// sId = sId.replace(/x$/i, "a");
// // 非法地区
// if (aCity[parseInt(sId.substr(0, 2))] == null) {
// return false;
// }
//
// var sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-"
// + Number(sId.substr(12, 2));
//
// var d = new Date(sBirthday.replace(/-/g, "/"))
//
// // 非法生日
// if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d
// .getDate())) {
// return false;
// }
// for (var i = 17; i >= 0; i--) {
// iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
// }
//
// if (iSum % 11 != 1) {
// return false;
// }
// return true;
//
// }
/**
 * 验证身份证
 */
String.prototype.isIDCard = function() {
	// 15位数身份证正则表达式
	var arg1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
	// 18位数身份证正则表达式
	var arg2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;
	if (this.match(arg1) == null && this.match(arg2) == null) {
		return true;
	} else {
		return false;
	}
}

/*
 * =========================================== //是否是有效的电话号码(中国)
 * ===========================================
 */
String.prototype.isPhoneCall = function() {
	return /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/
			.test(this);
}

/*
 * =========================================== //是否是颜色(#FFFFFF形式)
 * ===========================================
 */
String.prototype.IsColor = function() {
	var temp = this;
	if (temp == "")
		return true;
	if (temp.length != 7)
		return false;
	return (temp.search(/\#[a-fA-F0-9]{6}/) != -1);
}

/*
 * =========================================== //转换成全角
 * ===========================================
 */
String.prototype.toCase = function() {
	var tmp = "";
	for (var i = 0; i < this.length; i++) {
		if (this.charCodeAt(i) > 0 && this.charCodeAt(i) < 255) {
			tmp += String.fromCharCode(this.charCodeAt(i) + 65248);
		} else {
			tmp += String.fromCharCode(this.charCodeAt(i));
		}
	}
	return tmp
}

/*
 * =========================================== //对字符串进行Html编码
 * ===========================================
 */
String.prototype.toHtmlEncode = function() {
	var str = this;

	str = str.replace(/&/g, "&amp;");
	str = str.replace(/</g, "&lt;");
	str = str.replace(/>/g, "&gt;");
	str = str.replace(/\'/g, "&apos;");
	str = str.replace(/\"/g, "&quot;");
	str = str.replace(/\n/g, "<br>");
	str = str.replace(/\ /g, "&nbsp;");
	str = str.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");

	return str;
}

String.prototype.toGEncode = function() {
	var str = this;
	str = str.replace("&amp;", /&/g);
	str = str.replace("&lt;", /</g);
	str = str.replace("&gt;", />/g);
	str = str.replace("&apos;", /\'/g);
	str = str.replace("&quot;", /\"/g);
	str = str.replace("<br>", /\n/g);
	str = str.replace("&nbsp;"," ");
	str = str.replace("&#39;","'");
	return str;
}

function replaceAll(arg0, arg1, arg2) {
	arg0 = arg0.replace(arg1, arg2);
	if (arg0.indexOf(arg1) > -1) {
		arg0 = replaceAll(arg0, arg1, arg2);
	}
	return arg0;
}

/*
 * =========================================== //转换成日期
 * ===========================================
 */
String.prototype.toDate = function() {
	try {
		return new Date(this.replace(/-/g, "\/"));
	} catch (e) {
		return null;
	}
}
/**
 * 对Date的扩展，将 Date 转化为指定格式的String 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 * 可以用 1-2 个占位符 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) eg: (new
 * Date()).toString("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 (new
 * Date()).toString("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04 (new
 * Date()).toString("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04 (new
 * Date()).toString("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04 (new
 * Date()).toString("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function(fmt) {

	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, // 小时
		"H+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
		// 毫秒
	};
	var week = {
		"0" : "\u65e5",
		"1" : "\u4e00",
		"2" : "\u4e8c",
		"3" : "\u4e09",
		"4" : "\u56db",
		"5" : "\u4e94",
		"6" : "\u516d"
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4
						- RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1)
						? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468")
						: "")
						+ week[this.getDay() + ""]);
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
							? (o[k])
							: (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}
/**
 * 格式化时间，字符串输入，字符串输出
 * 
 * @param {}
 *            arg0
 * @param {}
 *            frm
 * @return {}
 */
function formatDate(arg0, frm) {

	if (arg0 == null || arg0 == '') {

		return "";
	}
	var now = arg0.toDate();
	return now.format(frm);

}

function formatDate2(arg0, frm) {
	if (arg0 == null || arg0 == 'null' || arg0 == '') {
		return "";
	}
	var now = arg0.toDate();
	return now.format(frm);

}
function getAllCheckedValue(form, checkName) {

	var rtn = new Array();
	for (var i = 0; i < form.elements.length; i++) {
		var e = form.elements[i];
		if (e.name != 'allcheck' && e.value.indexOf('[v:') != 0
				&& e.name == checkName && e.checked) {

			rtn.push(e.value);

		}
	}
	return rtn;
}
function checkAll(form) {
	for (var i = 0; i < form.elements.length; i++) {
		var e = form.elements[i];
		if (e.name != 'allcheck' && e.value.indexOf('[v:') != 0) {
			e.checked = form.allcheck.checked;

		}
	}
}

// 取得浏览器请求地址的某个域值
function getQueryField(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

function getQueryFieldNoUnescape(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return decodeURI(r[2]);
	return null;
}

function GetRequest(url) {
   var theRequest = new Object();
   if (url.indexOf("?") != -1) {
      var str = url.substr(url.indexOf("?")+1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
      }
   }
   return theRequest;
}

/**
 * 打开弹出窗
 * 
 * eg:
 * openWindow("../common/publication/PublicationList.do?classId=4150&role=admin",
 * "", 600, 520);
 * 
 */
function openWindow(_sUrl, _sName, _nWidth, _nHeight) {
	var nLeft = (screen.availWidth - _nWidth) / 2;
	var nTop = (screen.availHeight - _nHeight - 20) / 2;
	var win = window
			.open(
					_sUrl,
					_sName,
					'left='
							+ nLeft
							+ ', top='
							+ nTop
							+ ', height='
							+ _nHeight
							+ 'px, width='
							+ _nWidth
							+ 'px, toolbar=no,menubar=no,scrollbars=yes,resizable=yes,status=no');
	win.focus();
}

function locationURL(url) {

	self.location = url;
	// window.location.href = url;
	// if (Prototype.Browser.IE) {
	// if (window.event != null) {
	// window.event.returnValue = false;
	// }
	// }
}
function locationURLInParent(url) {
	top.location = url;
	// window.parent.location.href = url;
	// if (Prototype.Browser.IE) {
	// if (window.event != null) {
	// window.event.returnValue = false;
	// }
	// }
}

function setIframeHeight(ifrId) {
	// alert(ifrId);
	// for(var i=0;i<$(ifrId).ancestors().length;i++){
	// alert($(ifrId).ancestors()[i].outerHTML);
	// }

	var iframeid = document.getElementById(ifrId); // iframe id
	var height = iframeid.height;

	if (document.getElementById) {
		if (iframeid && !window.opera) {
			if (iframeid.contentDocument
					&& iframeid.contentDocument.body.offsetHeight) {
				iframeid.height = iframeid.contentDocument.body.offsetHeight;

			} else if (iframeid.Document && iframeid.Document.body.scrollHeight) {
				iframeid.height = iframeid.Document.body.scrollHeight;
			}
		}
	}

	if (height != null && height != ''
			&& parseInt(iframeid.height) < parseInt(height)) {

		iframeid.height = height;
	}
}
// 得到相同名字属性的值
function getAllHiddenValue(form, checkName) {
	var obj = $(form);
	var rtn = new Array();
	for (var i = 0; i < obj.elements.length; i++) {
		var e = obj.elements[i];
		if (e.name == checkName) {
			rtn.push(e.value);
		}
	}
	return rtn;
}

// 得到相同名字属性的值
function setFormReadOnly(form) {
	var obj = $(form);
	for (var i = 0; i < obj.elements.length; i++) {
		var e = obj.elements[i];
		e.readOnly = true;
	}
}

function setSelect(obj, value) {
	for (var i = 0; i < obj.options.length; i++) {
		if (obj.options[i].value == value) {
			obj.options[i].selected = true;
		}
	}
}

/** 显示或隐藏某个区域 */
function setDisplay(areaId) {
	if (document.getElementById(areaId).style.display == "none") {
		document.getElementById(areaId).style.display = "block";
	} else {
		document.getElementById(areaId).style.display = "none";
	}
}

/** 判断页面上是否存在某个id元素 */
function exist(id) {
	var obj = $(id + "");
	if (obj) {
		return true;
	} else {
		return false;
	}
}

function updateValue(areaId, val) {
	if (exist(areaId)) {
		$(areaId + "").update(val);
	}
}

function initValue(areaId, val) {
	if (exist(areaId)) {
		$(areaId + "").value = val;
	}
}

function renderPayOrNot(val) {
	switch (val) {
		case 'false' :
			return "<font color='red'>未结账</font>";
		case 'true' :
			return "已结账";
		default :
			return "未找到配置值";
	}
}

// 打开弹出层
function openTCC(src, title, width, height) {
	// appUrl 在fun.jsp加载
	var url = src;
	var html = '<iframe  width="' + width + '" height="' + height + '" src="'
			+ url + '" id="ifid" frameborder="0" scrolling="auto"></iframe>';
	Show(html, width, height, title, '');
}

function isPostalCode(s) {
	var pattern = /^[0-9]{6}$/;
	if (s != "") {
		if (!pattern.exec(s)) {
			return false;
		}
	}
	return true;
}

/**
 * 使浏览器最大化
 */
function maxWindow() {
	// 浏览器最大化
	if (top.location.href == window.location.href
			&& window.location.href.indexOf("no_full_screen") == -1) {
		self.moveTo(-4, -4);
		self.resizeTo((screen.availWidth + 5), (screen.availHeight + 5));
	}
}
function playSound(val) {
	if (val == null || val == '') {
		return '';
	} else {
		return '<a href="#" onclick=player("'
				+ val
				+ '")><img src="../images/btn_lis.gif" alt="试听" title="试听" /></a>';
	}

}
function player(filename) {
	ymPrompt.win({
				message : 'call/player.jsp?filename=' + filename,
				width : 328,
				height : 185,
				title : '语音播放',
				handler : null,
				iframe : true
			});

}
/**
 * 获取RADIO
 */
function getRadioValue(name) {
	var value = '';
	$$('input[type="radio"][name=' + name + ']').select(function(i) {
				return i.checked
			}).each(function(i) {
				value = i.value
			});
	return value;
}

/**
 * 给Raido赋值
 */
function setRadioValue(name, value) {
	var objs = document.getElementsByName(name);
	for (var i = 0; i < objs.length; i++) {
		var obj_value = objs[i].value;
		if (obj_value == value) {
			objs[i].checked = true;
		}
	}
}

/**
 * 获取地区 省、市、县 的数组
 * 
 * @param {}
 *            zone
 * @return {} Array(省,市,县)
 */
function getZoneArray(zone) {
	var zoneArray = new Array("", "", "");

	var tempArray = zone.split(',');

	for (var i = 0; i < tempArray.length; i++) {
		zoneArray[i] = tempArray[i];
	}
	return zoneArray;
}

// Event.observe(document, 'keydown', function(event) {
// if (event.keyCode == 8) {
// if (event.srcElement.tagName.toLowerCase() == "input"
// || event.srcElement.tagName.toLowerCase() == "textarea") {
// var obj = event.srcElement;
// if (obj.readOnly) {
// alert('禁用退格键!');
// event.returnValue = false;
// }
// } else {
// if (typeof(event) == 'object') {
// alert('禁用退格键!');
// event.returnValue = false;
// }
//
// }
// }
// })

function filterHTMLEncode(arg0) {

	if (arg0 != null) {

		arg0 = arg0.replace(/ /g, "&nbsp;");
		arg0 = arg0.replace(/\'/g, "&#39;");
		arg0 = arg0.replace(/\"/g, "&quot;");
		arg0 = arg0.replace(/>/g, "&gt;");
		arg0 = arg0.replace(/</g, "&lt;");
		arg0 = arg0.replace(/\r\n/g, "<br>");
		arg0 = arg0.replace(/\n/g, "<br>");

	}

	return arg0;
}

// nAfterDot小数位数
function FormatNumber(srcStr, nAfterDot) {
	// var srcStr,nAfterDot;
	var resultStr, nTen;
	srcStr = "" + srcStr + "";
	strLen = srcStr.length;
	dotPos = srcStr.indexOf(".", 0);
	if (dotPos == -1) {
		resultStr = srcStr + ".";
		for (i = 0; i < nAfterDot; i++) {
			resultStr = resultStr + "0";
		}
		return resultStr;
	} else {
		if ((strLen - dotPos - 1) >= nAfterDot) {
			nAfter = dotPos + nAfterDot + 1;
			nTen = 1;
			for (j = 0; j < nAfterDot; j++) {
				nTen = nTen * 10;
			}
			resultStr = Math.round(parseFloat(srcStr) * nTen) / nTen;
			return resultStr;
		} else {
			resultStr = srcStr;
			for (i = 0; i < (nAfterDot - strLen + dotPos + 1); i++) {
				resultStr = resultStr + "0";
			}
			return resultStr;
		}
	}

}

function addNumber(start, end) {
	return start * 1 + end * 1;
}

function loadEmail(email) {
	var str = email.toLowerCase();
	if (str == '51box.cn') {
		str = 'exmail.qq.com';
	} else if (str == 'gmail.com') {
		str = 'mail.google.com';
	} else {
		str = 'mail.' + str;
	}
	return str;
}

// -----模仿title提示

function hjd_tooltip_findPosX(obj) {
	var curleft = 0;
	if (obj.offsetParent) {
		while (obj.offsetParent) {
			curleft += obj.offsetLeft
			obj = obj.offsetParent;
		}
	} else if (obj.x)
		curleft += obj.x;
	return curleft;
}

function hjd_tooltip_findPosY(obj) {
	var curtop = 0;
	if (obj.offsetParent) {
		while (obj.offsetParent) {
			curtop += obj.offsetTop
			obj = obj.offsetParent;
		}
	} else if (obj.y)
		curtop += obj.y;
	return curtop;
}
/**
 * hjd_tooltip_show(详细内容ID, 简短内容, 偏离X轴, 偏离Y轴)
 */
function hjd_tooltip_show(tooltipId, parentId, posX, posY) {
	it = document.getElementById(tooltipId);

	if ((it.style.top == '' || it.style.top == 0)
			&& (it.style.left == '' || it.style.left == 0)) {
		// need to fixate default size (MSIE problem)
		it.style.width = it.offsetWidth + 'px';
		it.style.height = it.offsetHeight + 'px';

		img = document.getElementById(parentId);

		// if tooltip is too wide, shift left to be within parent
		if (posX + it.offsetWidth > img.offsetWidth)
			posX = img.offsetWidth - it.offsetWidth;
		if (posX < 0)
			posX = 0;

		x = hjd_tooltip_findPosX(img) + posX;
		y = hjd_tooltip_findPosY(img) + posY;

		it.style.top = y + 'px';
		it.style.left = x + 'px';
	}

	it.style.visibility = 'visible';
}

function hjd_tooltip_hide(id) {
	it = document.getElementById(id);
	it.style.visibility = 'hidden';
}

// String函数之LTrim(),用于清除字符串开头的空格/换行符/回车等
// Date:2006-06-20
// @Param String(str)
// @Return String
// Begin
function ltrim(str) {
	var pattern = new RegExp("^[//s]+", "gi");
	return str.replace(pattern, "");
}
// End

// String函数之RTrim(),用于清除字符串结尾的空格/换行符/回车等
// Date:2006-06-20
// @Param String(str)
// @Return String
// Begin
function rtrim(str) {
	var pattern = new RegExp("[//s]+$", "gi");
	return str.replace(pattern, "");
}
// End

// String函数之Trim(),用于清除字符串开头和结尾部分的空格/换行符/回车等
// 组合调用LTrim(str)和RTrim(str)函数
// Date:2006-06-20
// @Param String(str)
// @Return String
// Begin
function trimBr(str) {
	return rtrim(ltrim(str));
}
function renderYesOrNoState(val) {
	switch (val) {
		case '0' :
		case 0 :
			return "否";
		case '1' :
		case 1 :
			return "<font color=red>是</font>";
		default :
			return "未找到配置值";
	}
}
function renderState(val) {
	switch (val) {
		case '0' :
		case 0 :
			return "启用";
		case '1' :
		case 1 :
			return "<font color=red>禁用</font>";
		default :
			return "未找到配置值";
	}
}

function renderStatus(val) {
	switch (val) {
		case '0' :
		case 0 :
			return "启用";
		case '1' :
		case 1 :
			return "<font color=red>停用</font>";
		default :
			return "未找到配置值";
	}
}
function renderSex(val) {
	if (val == 1 || val == '1') {
		return "男";
	} else if (val == 2 || val == '2') {
		return "女";
	} else {
		return "未设置";
	}
}

function ifNull(strings)   
{   
	if(strings==null)
		return true;
    var str = strings;
    str = str.replace(/(^\s*)|(\s*$)/g, "");      
    str = str.replace(/(^　*)|(　*$)/g, "");    
    if( str == '' )    
    {   
        return true;   
    }   
    return false;   
}  

function getHiddenValus(name){
	var ids = document.getElementsByName(name);
	var rtn = new Array();
	for(var i=0;i<ids.length;i++){
		rtn.push(ids[i].value);
	}
	return rtn;
}

/**
 * 等比例缩放图片
 * @param {} maxWidth
 * @param {} maxHeight
 * @param {} objImg
 * @returns {} 
 */
function AutoResizeImage(maxWidth,maxHeight,objImg){
var img = new Image();
img.src = objImg.src;
var hRatio;
var wRatio;
var Ratio = 1;
var w = img.width;
var h = img.height;
wRatio = maxWidth / w;
hRatio = maxHeight / h;
if (maxWidth ==0 && maxHeight==0){
Ratio = 1;
}else if (maxWidth==0){//
if (hRatio<1) Ratio = hRatio;
}else if (maxHeight==0){
if (wRatio<1) Ratio = wRatio;
}else if (wRatio<1 || hRatio<1){
Ratio = (wRatio<=hRatio?wRatio:hRatio);
}
if (Ratio<1){
w = w * Ratio;
h = h * Ratio;
}
objImg.height = h;
objImg.width = w;
}

function getInt2Time(val) {
	var ltime=val*1000;
	return new Date(ltime).format("yy/MM/dd HH:mm");
}

/**
 * 调整时间的月份,返回计算过后的日期.
 * @param date
 * @param amount 正数相加,负数相减
 * @returns
 */
function calDateMonth(date, amount){
	var _date = new Date(date);
	_date.setMonth(date.getMonth()+amount);
	return _date;
}


/** 
* 将form元素中的
* @param html元素
* @return  
*/
function serializeForm(element){
	var objs = jQuery(element).serializeArray();
	var result = {};
	for(var i =0;i<objs.length;i++){
		var obj = objs[i];
		if(obj.value==undefined){ 
			continue;
		}else if(result[obj.name]!=undefined){
			if(result[obj.name] instanceof Array){
				result[obj.name].push(obj.value);
			}else{
				result[obj.name] = [result[obj.name], obj.value];
			}
		}else{
			result[obj.name] = obj.value;
		}
	}
	return result;
}
/**
* 
* @param html元素
* @return map 
*/
function serialize(element){
	var map = {};
	jQuery(element).find("input[name]").each(function(){
		var $this = jQuery(this);
		if($this.is(":checkbox")){
			if($this.is(":checked")){
				if(map[this.name]){
					if(!(map[this.name] instanceof Array)){
						map[this.name]=[map[this.name]];
					}
					map[this.name].push(this.value);
				}else{
					map[this.name] = this.value;
				}
			}
			return true;
		}
		map[this.name] = this.value;
	});
	return map;
}

var jumpToElement = function(element){
	$('body').animate({'scrollTop':$(element).offset().top});
}