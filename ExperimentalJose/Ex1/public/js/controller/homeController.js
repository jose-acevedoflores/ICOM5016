/*******************************************************************************************************************************************/
// Electronic Store
/*******************************************************************************************************************************************/
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

/*******************************************************************************************************************************************/
// Book Store
/*******************************************************************************************************************************************/
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



/*******************************************************************************************************************************************/
//  Clothing Store
/*******************************************************************************************************************************************/

function clothingStore(){

}
/*******************************************************************************************************************************************/
//  Shoe Store
/*******************************************************************************************************************************************/
function shoeStore(){

}

/*******************************************************************************************************************************************/
//  Sports Store
/*******************************************************************************************************************************************/
function sportStore(){

}


function loginForm(){

	console.log("login");

};

function registerForm(){

	console.log("register");
};


/*******************************************************************************************************************************************/
// General
/*******************************************************************************************************************************************/
function generalCategory(category){

	$.mobile.loading("show");
	console.log("cat: " + category);
	$.ajax({
		url : "http://localhost:4000/"+category+"Category",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){

			$(document).on('pagebeforeshow', "#"+category+"Category", function( event, ui ) {
	
				var itemList = data.items;
				var len = itemList.length;
				var list = $("#"+category+"CategoryItemList");
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

			$.mobile.loading("hide");
			$.mobile.navigate("#"+category+"Category");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("NOOOO");
		}
	});
};



