<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%><%@page import="com.blue.db.mapping.User"%><%@page
	import="com.blue.db.service.impl.MenuServiceImpl"%><%@page
	import="com.blue.db.service.IMenuService"%><%@page
	import="com.blue.bs.util.CommonUtil"%>

<%
	out.print("var serverFileRooUrl=\"" + CommonUtil.getFileRootUrl()
			+ "\";\n");
	com.blue.bs.http.Request r = new com.blue.bs.http.Request();
	r.setRequest(request);
	out.print("var appUrl=\"" + r.contextUrl() + "\";\n");
	String barIds = "";
	String roledesc = "";
	if (request.getSession().getAttribute("loginUser") != null) {
		User user = (User) request.getSession().getAttribute(
				"loginUser");
		long roleId = user.getRoleId();
		IMenuService menuService = new MenuServiceImpl();
		barIds = menuService.getHiddenBarIds(roleId);
		roledesc = user.getRoledesc();
	}
	out.print("var barIds=\"" + barIds + "\";");
	out.print("var roledesc=\"" + roledesc + "\";");
%>
function removeNoPermissionButton(obj){ if(barIds != null && barIds
!='') { arr = barIds.split(','); for(var i = 0; i < arr.length; i++) {
if(document.getElementById(arr[i])){
document.getElementById(arr[i]).style.display='none'; } } } } function
removeNotPermissionButton(){ if(barIds != null && barIds != '') { arr
=barIds.split(','); for(var i = 0; i < arr.length; i++) {
if($(arr[i])!=null){ $(arr[i]).hide(); } } } } function
hasPermission(id){ if(barIds != null && barIds != '') { arr
=barIds.split(','); for(var i = 0; i < arr.length; i++) {
if(arr[i]==id){ return false; } } } return true; }
