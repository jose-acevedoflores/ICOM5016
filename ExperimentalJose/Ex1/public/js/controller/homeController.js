var host = "192.168.1.3:4000";

/*******************************************************************************************************************************************/
// Home 
/*******************************************************************************************************************************************/

$(document).on('pagebeforeshow', "#home", function( event, ui ) {

	$.ajax({
		url : "http://"+host+"/home",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var itemList = data.items;
			var len = itemList.length;
			var list;
			var item;
			for (var i=0; i < len; ++i){
				item = itemList[i];

		
				list = $("#" + item.store +"List");

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


/*******************************************************************************************************************************************/
// General
/*******************************************************************************************************************************************/

function findStore(store){

	$(document).on('pagebeforeshow', "#"+store+"Store", function( event, ui ) {
		console.log("Store: "+ store);
		
		$.mobile.loading("show");	

		$.ajax({
			url : "http://"+host+"/stores/"+store,
			contentType: "application/json",
			success : function(data, textStatus, jqXHR){

				var itemList = data.items;
				var len = itemList.length;
				var list;
				var item;
				for (var i=0; i < len; ++i){
					item = itemList[i];
					list = $("#"+item.category+"STORE"+item.store+"List")
					
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
	$.mobile.navigate("#"+store+"Store");

}

function findCategory(store, category){

	$.mobile.loading("show");
	console.log("cat: " + category);
	$.ajax({
		url : "http://"+host+"/stores/"+store+"/"+category,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){

			$(document).on('pagebeforeshow', "#"+category+"CategorySTORE"+store, function( event, ui ) {
	
				var itemList = data.items;
				var len = itemList.length;
				var list = $("#"+category+"CategoryItemListSTORE"+store);
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
			$.mobile.navigate("#"+category+"CategorySTORE"+store);
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("NOOOO");
		}
	});
};


/*******************************************************************************************************************************************/
// Shopping cart
/*******************************************************************************************************************************************/

$(document).on('pagebeforeshow', "#shoppingCart", function( event, ui ) {
	console.log("wooooooooot");
	$.ajax({
		url : "http://"+host+"/shoppingCart",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var itemList = data.items;
			var len = itemList.length;
			var list = $("#cartItemList");
			list.empty();
			var item;
			var totalAmount = 0 ;
			for (var i=0; i < len; ++i){
				item = itemList[i];
				totalAmount += parseFloat(item.price);
				list.append("<li id=itemID"+item.id+"><a href=\"#\">" + 
					"<img src="+ item.picture + ">"  + 
					"<h2>" + item.itemName + "</h2>" + 
					"<p>" + item.description + "</p>" +
					"<p> Rating:" + item.rating + " </p>" + 
					"<p class=\"ui-li-aside\"> Price: $" + item.price + "</p>" +
					"</a>"+
					"<a onclick=\"toRemove("+item.id+")\" href=\"#removeItemFromCart\" data-rel=\"popup\" data-position-to=\"window\" data-transition=\"pop\">remove from cart</li>");
				list.listview("refresh");	
			}

			var totalAmountField = $("#shoppingCartAmount");
			totalAmountField.empty();
			totalAmountField.append("$"+totalAmount);
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});
//Global Variable to know which item the user wants to remove
var itemToRemove;
function toRemove(itemId){
	itemToRemove = itemId;
}

function checkoutCart(){
	console.log("Checkout");
}

function removeItemFromCart(){
	$.mobile.loading("show");
	console.log("remove item: "+ itemToRemove);
	$.ajax({
		url : "http://"+host+"/shoppingCart/delete/"+itemToRemove,
		method : "delete",
		contentType: "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR){
			console.log("mierd");
			$.mobile.loading("hide");

			$.mobile.changePage(
		    $("#shoppingCart") ,
		    {
				allowSamePageTransition : true,
				transition              : 'none',
				showLoadMsg             : false,
				reloadPage              : true
		    }
			);
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	itemToRemove = undefined;

}

/*******************************************************************************************************************************************/
// Placed Bids
/*******************************************************************************************************************************************/
$(document).on('pagebeforeshow', "#placedBids", function( event, ui ) {
	console.log("Placed");
	$.ajax({
		url : "http://"+host+"/placedBids",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var itemList = data.items;
			var len = itemList.length;
			var list = $("#bidItemList");
			list.empty();
			var item;
			var totalAmount = 0 ;
			for (var i=0; i < len; ++i){
				item = itemList[i];
				totalAmount += parseFloat(item.price);
				list.append("<li id=itemID"+item.id+"><a href=\"#\">" + 
					"<img src="+ item.picture + ">"  + 
					"<h2>" + item.itemName + "</h2>" + 
					"<p>" + item.description + "</p>" +
					"<p> Rating:" + item.rating + " </p>" + 
					"<p class=\"ui-li-aside\"> Price: $" + item.price + "</p>" +
					"</a>"+
					"<a onclick=\"itemToIncreaseBid("+item.id+")\" href=\"#increaseBid\" data-rel=\"popup\" data-position-to=\"window\" data-transition=\"pop\">increa bid</li>");
				list.listview("refresh");	
			}

			// var totalAmountField = $("#shoppingCartAmount");
			// totalAmountField.empty();
			// totalAmountField.append("$"+totalAmount);
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

var toIncreaseBid;
function itemToIncreaseBid(itemId){
	toIncreaseBid = itemId;
}

function increaseBid(){
	$.mobile.loading("show");
	console.log("Increase Bid: "+ toIncreaseBid);
	$.ajax({
		url : "http://"+host+"/placedBids/increaseBid/"+ toIncreaseBid,
		method : "put",
		contentType: "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR){
			console.log("mierd");
			$.mobile.loading("hide");

			$.mobile.changePage(
		    $("#placedBids") ,
		    {
				allowSamePageTransition : true,
				transition              : 'none',
				showLoadMsg             : false,
				reloadPage              : true
		    }
			);
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	toIncreaseBid= undefined;
}
/*******************************************************************************************************************************************/
// Items Sold 
/*******************************************************************************************************************************************/
$(document).on('pagebeforeshow', "#itemsSold", function( event, ui ) {

	$.ajax({
		url : "http://"+host+"/itemsSold",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var itemList = data.items;
			var len = itemList.length;
			var list = $("#itemsSoldList");
			list.empty();
			var item;
			var totalAmount = 0 ;
			for (var i=0; i < len; ++i){
				item = itemList[i];
				list.append("<li data-role=\"list-divider\", data-theme=\"a\"> Invoice Date  <p class=\"ui-li-aside\"> Total Amount Paid: $3</p> </li>");
				list.append("<li id=itemID"+item.id+"><a href=\"#\">" + 
					"<img src="+ item.picture + ">"  + 
					"<h2>" + item.itemName + "</h2>" + 
					"<p>" + item.description + "</p>" +
					"<p> Rating:" + item.rating + " </p>" + 
					"<p class=\"ui-li-aside\"> Purchased Price: $" + item.price + "</p>" +
					"</a>");
				list.listview("refresh");	
			}
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

function loadMoreItemsSold(){
	console.log("Load More items sold");
}

/*******************************************************************************************************************************************/
// Log In
/*******************************************************************************************************************************************/

function loginForm(){
	console.log("Loggin");
}

/*******************************************************************************************************************************************/
// Register
/*******************************************************************************************************************************************/

function registerForm(){
	console.log("Registered");
}