
$(document).on('pagebeforeshow', "#home", function( event, ui ) {

	$.ajax({
		url : "http://localhost:4000/home",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var itemList = data.items;
			var len = itemList.length;
			var list;
			var item;
			for (var i=0; i < len; ++i){
				item = itemList[i];

				if(item.category === "TV_CATEGORY" | item.category === "AUDIO_CATEGORY" | item.category === "PHONE_CATEGORY" | item.category === "VIDEO_CATEGORY"
					| item.category === "CAMERA_CATEGORY"){
					list = $("#electronicsList");
				}
				else if(item.category === "LAPTOPS_CATEGORY"){

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
			
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});




$(document).on('pagebeforeshow', "#shoppingCart", function( event, ui ) {
	console.log("wooooooooot");
	$.ajax({
		url : "http://localhost:4000/shoppingCart",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var itemList = data.items;
			var len = itemList.length;
			var list = $("#cartItemList");
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
				list.listview("refresh");	
			}
			
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});







