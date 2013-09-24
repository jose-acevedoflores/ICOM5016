function electronicsStore(){
		

	$(document).on('pagebeforeshow', "#electronicsStore", function( event, ui ) {

		$.mobile.loading("show");	

		$.ajax({
			url : "http://localhost:4000/electronicsStore",
			contentType: "application/json",
			success : function(data, textStatus, jqXHR){

				var itemList = data.items;
				var len = itemList.length;
				var list;
				var item;
				for (var i=0; i < len; ++i){
					item = itemList[i];

					if(item.category === "TV_CATEGORY"){
						list = $("#tvList");
					}
					else if(item.category === "AUDIO_CATEGORY"){
						list = $("#audioList");
					}
					else if(item.category === "PHONE_CATEGORY"){
						list = $("#phoneList");
					}
					else if(item.category === "VIDEO_CATEGORY"){
						list = $("#videoList");
					}
					else if(item.category === "CAMERA_CATEGORY"){
						list = $("#cameraList");
					}

					list.append("<li><a href=\"#\">" + 
						"<img src="+ item.picture + ">"  + 
						"<h2>" + item.itemName + "</h2>" + 
						"<p>" + item.description + "</p>" +
						"<p> Rating:" + item.rating + " </p>" + 
						"<p class=\"ui-li-aside\"> Price: " + item.price + "</p>" +
						"</a></li>");
					list.listview("refresh");	
				}
				$.mobile.loading("hide");
			},
			error: function(data, textStatus, jqXHR){
				console.log("textStatus: " + textStatus);
				alert("Data not found!");
			}
		});
		
	});
	$.mobile.navigate("#electronicsStore");
}

function bookStore(){
	$(document).on('pagebeforeshow', "#booksStore", function( event, ui ) {

		$.mobile.loading("show");	

		$.ajax({
			url : "http://localhost:4000/booksStore",
			contentType: "application/json",
			success : function(data, textStatus, jqXHR){

				var itemList = data.items;
				var len = itemList.length;
				var list;
				var item;
				for (var i=0; i < len; ++i){
					item = itemList[i];

					if(item.category === "FICTION_CATEGORY"){
						list = $("#tvList");
					}
					else if(item.category === "CHILDREN_CATEGORY"){
						list = $("#audioList");
					}
					else if(item.category === "BUSINESS_CATEGORY"){
						list = $("#phoneList");
					}
					else if(item.category === "TECHNOLOGY_CATEGORY"){
						list = $("#videoList");
					}

					list.append("<li><a href=\"#\">" + 
						"<img src="+ item.picture + ">"  + 
						"<h2>" + item.itemName + "</h2>" + 
						"<p>" + item.description + "</p>" +
						"<p> Rating:" + item.rating + " </p>" + 
						"<p class=\"ui-li-aside\"> Price: " + item.price + "</p>" +
						"</a></li>");
					list.listview("refresh");	
				}
				$.mobile.loading("hide");
			},
			error: function(data, textStatus, jqXHR){
				console.log("textStatus: " + textStatus);
				alert("Data not found!");
			}
		});
		
	});
	$.mobile.navigate("#booksStore");
}

function computerStore(){
$(document).on('pagebeforecreate', "#store", function( event ) {
	

			var storeContent = $("#storeContent");
			storeContent.append(" <h1> Stores </h1> " +
		  	" <p>Browse our wonderful selection of merchandise. Check out today's hot deals </p> " +
		 	" <h3>Electronics </h3> " + 
			" <ul data-role=\"listview\" id=\"laptopList\" data-inset=\"true\"> " + 
				" <li data-role=\"list-divider\" data-theme=\"a\"><a onclick=\"laptopCategory()\">Laptop</a></li>	" +
				
		   	"</ul> " +
			"<ul data-role=\"listview\" id=\"audioList\" data-inset=\"true\">"+
			"	<li data-role=\"list-divider\" data-theme=\"a\"><a onclick=\"audioStore()\">Audio</a></li> " +
		
			" </ul> " +
			"<ul data-role=\"listview\" id=\"phoneList\" data-inset=\"true\">	"+
			"	<li data-role=\"list-divider\" data-theme=\"a\"><a onclick=\"phoneStore()\">Phones</a></li> " +
			
			"</ul>	"+
			"<ul data-role=\"listview\" id=\"cameraList\" data-inset=\"true\">"+
				"<li data-role=\"list-divider\" data-theme=\"a\"><a onclick=\"cameraStore()\">Cameras</a></li>"+
			
			"</ul>"+

			"<ul data-role=\"listview\" id=\"videoList\" data-inset=\"true\">"+
				"<li data-role=\"list-divider\" data-theme=\"a\"><a onclick=\"videoStore()\">Video</a></li>"+
			
			"</ul>" );

	});
		

	$(document).on('pagebeforeshow', "#store", function( event, ui ) {

		$.mobile.loading("show");	

		$.ajax({
			url : "http://localhost:4000/computersStore",
			contentType: "application/json",
			success : function(data, textStatus, jqXHR){

				var itemList = data.items;
				var len = itemList.length;
				var list;
				var item;
				for (var i=0; i < len; ++i){
					item = itemList[i];

					if(item.category === "LAPTOPS_CATEGORY"){
						list = $("#laptopList");
					}
					else if(item.category === "DESKTOPS_CATEGORY"){
						list = $("#desktopList");
					}
					else if(item.category === "TABLETS_CATEGORY"){
						list = $("#tabletList");
					}
					else if(item.category === "PRINTERS_CATEGORY"){
						list = $("#printerList");
					}
					

					list.append("<li><a href=\"#\">" + 
						"<img src="+ item.picture + ">"  + 
						"<h2>" + item.itemName + "</h2>" + 
						"<p>" + item.description + "</p>" +
						"<p> Rating:" + item.rating + " </p>" + 
						"<p class=\"ui-li-aside\"> Price: " + item.price + "</p>" +
						"</a></li>");
					list.listview("refresh");	
				}
				$.mobile.loading("hide");
			},
			error: function(data, textStatus, jqXHR){
				console.log("textStatus: " + textStatus);
				alert("Data not found!");
			}
		});
		
	});
	$.mobile.navigate("#store");
}

function clothingStore(){

}

function shoeStore(){

}

function sportStore(){

}

//CATEGORIES

function tvCategory(){

	$.mobile.loading("show");

	$.ajax({
		url : "http://localhost:4000/tvCategory",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$(document).on('pagebeforeshow', "#tvCategory", function( event, ui ) {
	
				var itemList = data.items;
				var len = itemList.length;
				var list = $("#tvCategoryItemList");
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
			
			$.mobile.navigate("#tvCategory");
		}	
		,
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("NOOOO");
		}
	});
};

function audioCategory(){

	$.mobile.loading("show");

	$.ajax({
		url : "http://localhost:4000/audioCategory",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			console.log(data);
			$.mobile.loading("hide");
			$.mobile.navigate("#category");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("NOOOO");
		}
	});
};


function cameraCategory(){

	$.mobile.loading("show");

	$.ajax({
		url : "http://localhost:4000/cameraCategory",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			console.log(data);
			$.mobile.loading("hide");
			$.mobile.navigate("#categorys");
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
		url : "http://localhost:4000/phoneStore",
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
		url : "http://localhost:4000/videoStore",
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


