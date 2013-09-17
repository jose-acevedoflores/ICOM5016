function tvStore(){

	$.mobile.loading("show");

	$.ajax({
		url : "http://192.168.10.106:4000/tvStore",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$(document).on('pagebeforeshow', "#store", function( event, ui ) {
	
				var itemList = data.items;
				var len = itemList.length;
				var list = $("#temps");
				var item;
				for (var i=0; i < len; ++i){
					item = itemList[i];

					list.append("<li><a href=\"#\">" + 
						"<img src="+ item.picture + ">"  + 
						"<h2>" + item.itemName + "</h2>" + 
						"<p>" + item.description + "</p>" +
						"<p> Rating:" + item.rating + " </p>" + 
						"<p class=\"ui-li-aside\"> Price: " + item.price + "</p>" +
						"</a></li>");
						
				}
				list.listview("refresh");


				
			});
			
			$(document).on('pagebeforecreate', "#store", function( event ) {
	

				var storeNavigator = $("#storeNavigator");
				storeNavigator.append(
					"<a href=\"#\" data-role=\"button\" > Electronics </a> " + 
					"<a href=\"#\" data-role=\"button\"> TV </a> "
					);
				
			});
			$.mobile.navigate("#store");
		}	
		,
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("NOOOO");
		}
	});
};

function audioStore(){

	$.mobile.loading("show");

	$.ajax({
		url : "http://192.168.10.106:4000/audioStore",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			console.log(data);
			$.mobile.loading("hide");
			$.mobile.navigate("#stores");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("NOOOO");
		}
	});
};


function cameraStore(){

	$.mobile.loading("show");

	$.ajax({
		url : "http://192.168.10.106:4000/cameraStore",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			console.log(data);
			$.mobile.loading("hide");
			$.mobile.navigate("#stores");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("NOOOO");
		}
	});
};

function phoneStore(){

	$.mobile.loading("show");

	$.ajax({
		url : "http://192.168.10.106:4000/phoneStore",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			console.log(data);
			$.mobile.loading("hide");
			$.mobile.navigate("#stores");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("NOOOO");
		}
	});
};

function videoStore(){

	$.mobile.loading("show");

	$.ajax({
		url : "http://192.168.10.106:4000/videoStore",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			console.log(data);
			$.mobile.loading("hide");
			$.mobile.navigate("#stores");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("NOOOO");
		}
	});
};

function loginForm(){

	console.log("login");

};

function registerForm(){

	console.log("register");
};


