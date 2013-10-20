var host = "localhost:4000";//"192.168.1.3:4000";

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
			$("#home .listsHome li:not(:first-child)").remove();

			for (var i=0; i < len; ++i){
				item = itemList[i];
				list = $("#List" + item.parent_category_id );

				list.append("<li>" +
					"<a href='#' onclick=\"findItem('"+item.parent_category_id+"'," +item.product_id + ")\">" + 
					"<img src="+ item.photo_url + ">"  + 
					"<h2>" + item.brand + " " +item.model + "</h2>" + 
					"<p>" + item.description + "</p>" +
					"<p> Rating:" + item.seller_id + " temp" + " </p>" + 
					"<p class=\"ui-li-aside\"> Price: " + item.price + "</p>" +
					"</a></li>");
				list.listview("refresh");	
			}
			
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found #home!");
		}
	});
});

function test(storeName){
	console.log("bfad "+ storeName);
}
/*******************************************************************************************************************************************/
// General
/*******************************************************************************************************************************************/

function findStore(store){

	$(document).on('pagebeforeshow', "#Store"+store, function( event, ui ) {
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
				$("#Store"+store+" .listsHome li:not(:first-child)").remove();
				for (var i=0; i < len; ++i){
					item = itemList[i];
					list = $("#"+item.category_name+"STORE"+item.parent_category_id+"List")
					
					list.append("<li><a href=\"#\">" + 
						"<img src="+ item.photo_url + ">"  + 
						"<h2>" + item.brand + " "+item.model + "</h2>" + 
						"<p>" + item.description + "</p>" +
						"<p> Rating:" + item.seller_id +" temp" + " </p>" + 
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
		$(document).off('pagebeforeshow');
	});
	$.mobile.navigate("#Store"+store);
	
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
						"<img src="+ item.photo_url + ">"  + 
						"<h2>" + item.brand + " "+item.model + "</h2>" + 
						"<p>" + item.description + "</p>" +
						"<p> Rating:" + item.seller_id +" temp" + " </p>" + 
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

function findItem(store,item){

	$.mobile.loading("show");
	console.log("item: " + item);
	$.ajax({
		url : "http://"+host+"/item/"+store+"/"+item,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){

			console.log(data);
			$(document).on('pagebeforeshow', "#itemsPage", function( event, ui ) {
	

				var list = $("#itemsPageList");
				list.empty();
				var item = data;

				// list.append("<div(class=\"ui-grid-a\")>" + 
				// 	"<div(class=\"ui-block-a\")>" +
				// 	"<h3>" + item.itemName + "</h3></br>" +
				// 	"<h6> Product ID: " + item.id + "</h6>" +
				// 	"</div><div(class=\"ui-block-b\")></div></div>" +
				// 	"<div(class=\"ui-grid-a\")>" + 
				// 	"<div(class=\"ui-block-a\")>" + "<img src="+ item.picture + ">" +
				// 	"</br></div>" + "<div(class=\"ui-block-b\")>" +
				// 	"<p> Rating" + item.rating + "</p>" + 
				// 	"<p>" + item.description + "</p></div></div>");
						
				list.append("<li data-theme=\"c\">" + 
					"<h3>" + item.itemName + "</h3></br>" +
					"<h6> Product ID: " + item.id + "</h6>" +
					"<img src="+ item.picture + ">" +
					"<p> Rating: " + item.rating + "</p>" + 
					"<p>" + item.description + "</p></li>");

				list.listview("refresh");
				
			});

			$.mobile.loading("hide");
			$.mobile.navigate("#itemsPage");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("D:");
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
				console.log(item.id);
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
//TODO set function to respond to cancel button.
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
			
			list.append("<li data-role=\"list-divider\", data-theme=\"a\"> Bidding On:");
			for (var i=0; i < len; ++i){
				var totalAmount =0;
				item = itemList[i];
				console.log(item.id);
				totalAmount += parseFloat(item.price) ;
				list.append("<li id=itemID"+item.id+"><a href=\"#\">" + 
					"<img src="+ item.picture + ">"  + 
					"<h2>" + item.itemName + "</h2>" + 
					"<p>" + item.description + "</p>" +
					"<p> Rating:" + item.rating + " </p>" + 
					"<p class=\"ui-li-aside\"> Price: $" + item.price + "</p>" +
					"</a>"+
					"<a onclick=\"toIncreaseBid("+item.id+")\" href=\"#increaseBid\" data-rel=\"popup\" data-position-to=\"window\" data-transition=\"pop\">increase bid</li>");

				list.listview("refresh");	
				var totalAmountField = $("#nextAcceptableBid");
				totalAmountField.empty();
				totalAmountField.append("$"+totalAmount);
			}
			
			
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

var itemToIncreaseBid;
function toIncreaseBid(itemId){
	itemToIncreaseBid = itemId;
}

function increaseBid(){
	$.mobile.loading("show");
	console.log("Increase Bid: "+ itemToIncreaseBid);
	$.ajax({
		url : "http://"+host+"/placedBids/item"+itemToIncreaseBid,
		method : "put",
		contentType: "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR){

			$.mobile.loading("hide");

			$.mobile.changePage("#placedBids" ,
		    {
				allowSamePageTransition : true,
				transition              : 'none',
				showLoadMsg             : false,
				reloadPage              : true});
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	itemToIncreaseBid = undefined;
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
function ConvertToJSON(formData) {
	var result = {};
	$.each(formData, function(i,o){
		result[o.name] = o.value;
	});
	return result;
}
function loginForm(){
	console.log("Login");
	$.mobile.loading("show");
	var form = $("#loginForm");
	var formData = form.serializeArray();
	console.log("form data : "+ formData);
	var user = ConvertToJSON(formData);
	console.log("User to login : " + JSON.stringify(user));
	var userJSON = JSON.stringify(user);
	$.ajax({
		url : "http://"+host+"/userLogin",
		method : 'put',
		data : userJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus,jqXHR){
			$.mobile.loading("hide");
			console.log("algo");
			$.mobile.changePage('#home', 
				{ allowSamePageTransition : true,
				transition              : 'none',
				showLoadMsg             : false,
				reloadPage              : true});
			//$.mobile.navigate('#home');
			alert("You won NVIDIA GPU bid");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus : " + textStatus);
			$.mobile.loading("hide");
			alert("There was an error with your e-mail/password combination.");
		}
	});

}

/*******************************************************************************************************************************************/
// Sign Out
/*******************************************************************************************************************************************/
function signOut(){
	console.log("Sign Out");
	$.ajax({
		url : "http://"+host+"/signOut",
		method : 'put',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus,jqXHR){
			$.mobile.loading("hide");
			console.log("algo");
			$.mobile.changePage('#home', 
				{ allowSamePageTransition : true,
				transition              : 'none',
				showLoadMsg             : false,
				reloadPage              : true});
			//$.mobile.navigate('#home');
			alert("Good Bye");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus : " + textStatus);
			$.mobile.loading("hide");
			alert("There was an error with your e-mail/password combination.");
		}
	});

}
/*******************************************************************************************************************************************/
// Add Item
/*******************************************************************************************************************************************/

function addItem(){
	console.log("Add Item");
	$.mobile.loading("show");
	var form = $("#newItemForm");
	var formData = form.serializeArray();
	console.log("form data : "+ formData);
	var user = ConvertToJSON(formData);
	console.log("User to login : " + JSON.stringify(user));
	var userJSON = JSON.stringify(user);
	$.ajax({
		url : "http://"+host+"/newItem",
		method : 'post',
		data : userJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus,jqXHR){
			$.mobile.loading("hide");
			console.log("algo");
			
			//$.mobile.navigate('#home');
			
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus : " + textStatus);
			$.mobile.loading("hide");
			alert("Item could not be added.");
		}
	});

}
/*******************************************************************************************************************************************/
// Register
/*******************************************************************************************************************************************/

function registerForm(){
	console.log("Registered");
	$.mobile.loading("show");
	var form = $("#registerForm");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newUser = ConvertToJSON(formData);
	console.log("New User: " + JSON.stringify(newUser));
	var newUserJSON = JSON.stringify(newUser);
	$.ajax({
		url : "http://"+host+"/register/newUser",
		method: 'post',
		data : newUserJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#home");
			console.log("To home");

		},
		error : function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});

}


/*******************************************************************************************************************************************/
// Items Selling
/*******************************************************************************************************************************************/


$(document).on('pagebeforeshow', "#itemsSelling", function( event, ui ) {
	console.log("Placed");
	$.ajax({
		url : "http://"+host+"/itemsSelling",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var itemList = data.items;
			var len = itemList.length;
			var list = $("#itemsSellingList");
			list.empty();
			var item;
			var totalAmount = 0 ;
			list.append("<li data-role=\"list-divider\", data-theme=\"a\"> Selling ");
			for (var i=0; i < len; ++i){
				item = itemList[i];
				console.log(item.id);
				totalAmount += parseFloat(item.price);

				list.append("<li id=itemID"+item.id+"><a href=\"#\">" + 
					"<img src="+ item.picture + ">"  + 
					"<h2>" + item.itemName + "</h2>" + 
					"<p>" + item.description + "</p>" +
					"<p> Rating:" + item.rating + " </p>" + 
					"<p class=\"ui-li-aside\"> Price: $" + item.price + "</p>" +
					"</a>");

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

/*******************************************************************************************************************************************/
// Admin Section
/*******************************************************************************************************************************************/
var storeToRemove = undefined;
//Sets storeToRemove in order for the call to removeStore to work with the parameter.
function toRemoveStore(storeName){
	console.log("Store to remove: " + storeName);
	storeToRemove = storeName;
}

//Clears storeToRemove
function undoRemoveStore(){
	storeToRemove = undefined;
}

function addStore(){
	var storeName = $("#newStoreName").val();
	console.log("ADD STORE " + storeName);	
	$.mobile.loading("show");
	$.ajax({
		url : "http://"+host+"/addStore/storeName/"+storeName,
		method : "post",
		contentType: "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR){

			$.mobile.loading("hide");

			$.mobile.changePage('#home', 
				{ allowSamePageTransition : true,
				transition              : 'none',
				showLoadMsg             : false,
				reloadPage              : true
			});
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
}

function removeStore(){
	console.log("REMOVE STORE "+ storeToRemove);
	$.mobile.loading("show");
	$.ajax({
		url : "http://"+host+"/removeStore/storeName/"+storeToRemove,
		method : "delete",
		contentType: "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR){

			$.mobile.loading("hide");

			$.mobile.changePage(
		    "#home" ,
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
	storeToRemove = undefined;
}

function addCategory(){
	console.log("add category");
}
var storeToAdd = undefined;
function toAddCategoryToStore(currentStore){
	console.log(currentStore);
	storeToAdd = currentStore;
}

function cancelAddStore(){
	storeToAdd = undefined;
}

//This enables the search bar to send queries to the server
$(document).ready(function() {
	$(".mainSearch").on("keypress" ,function(e) { 
		if(e.keyCode == 13)
		{
			var temp = $('.mainSearch').val();
			$.ajax({
				url : "http://"+host+"/search/"+temp,
				contentType: "application/json",
				success : function(data, textStatus, jqXHR){
					
				},
				error: function(data, textStatus, jqXHR){
					console.log("textStatus: " + textStatus);
					alert("Data not found!");
				}
			});
		}
	});
});

