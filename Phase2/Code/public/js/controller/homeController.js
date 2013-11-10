var host = "localhost:5000";//"192.168.1.3:4000";

/*******************************************************************************************************************************************/
// Home 
/*******************************************************************************************************************************************/

$(document).on('pagebeforeshow', "#home", function( event, ui ) {
	console.log("#home on pagebeforeshow listener");
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
					"<a href='#' onclick=\"findItem(" +item.product_id + ")\">" + 
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
		
		$.mobile.loading("show");	

		console.log("findStore function with store = " + store);
		$.ajax({
			url : "http://"+host+"/stores/"+store,
			contentType: "application/json",
			success : function(data, textStatus, jqXHR){

				$(document).on('pagebeforeshow', "#Store"+store, function( event, ui ) {
					console.log("#Store"+store+" on pagebeforeshow listener");

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
					$(document).off('pagebeforeshow');
				});

				$.mobile.navigate("#Store"+store);
		
			},
			error: function(data, textStatus, jqXHR){
				$.mobile.loading("hide");
				console.log("textStatus: " + textStatus);
				alert("Data not found!");
			}
		});
	
}

function findCategory(store, category){

	$.mobile.loading("show");
	console.log("findCategory function with categoryId = " + category +" and Store = " + store);
	$.ajax({
		url : "http://"+host+"/stores/"+store+"/"+category,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){

			$(document).on('pagebeforeshow', "#"+category+"CategorySTORE"+store, function( event, ui ) {

				console.log("#"+category+"CategorySTORE"+store+" on pagebeforeshow listener");
				var itemList = data.items;
				var len = itemList.length;
				var list = $("#"+category+"CategoryItemListSTORE"+store);
				list.empty();
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
				$(document).off('pagebeforeshow');
				$.mobile.loading("hide");			
			});


			if($.mobile.activePage.attr("id") === category+"CategorySTORE"+store){

				//Change to the page by hiding the panel
				$.mobile.changePage("#"+category+"CategorySTORE"+store,
		    	{
					allowSamePageTransition : true,
					transition              : 'none',
					showLoadMsg             : false,
					reloadPage              : false
				});
			}
			else{
				$.mobile.navigate("#"+category+"CategorySTORE"+store);
			}
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			console.log("textStatus: " + textStatus);
			alert("NOOOO");
		}
	});
};

function findItem(itemId){

	$.mobile.loading("show");
	console.log("findItem function with itemId = " + itemId);
	$.ajax({
		url : "http://"+host+"/item/"+itemId,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){

			$(document).on('pagebeforeshow', "#itemsPage", function( event, ui ) {
				console.log("itemsPage on pagebeforeshow listener");

				var list = $("#itemsPageList");
				list.empty();
				var item = data.item[0];

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
					"<h3>" + item.brand + " " +item.model + "</h3>" + 
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
			$.mobile.loading("hide");
			console.log("textStatus: " + textStatus);
			alert("D:");
		}
	});
};


/*******************************************************************************************************************************************/
// Shopping cart
/*******************************************************************************************************************************************/

function shoppingCart(){

	console.log("Shopping cart function");
	$.mobile.loading("show");
	$.ajax({
		url : "http://"+host+"/shoppingCart",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){

			$(document).on('pagebeforeshow', "#shoppingCart", function( event, ui ) {
				console.log("shoppingCart on pagebeforeshow listener");
				var itemList = data.items;
				var len = itemList.length;
				var list = $("#cartItemList");
				list.empty();
				var item;
				var totalAmount = 0 ;
				for (var i=0; i < len; ++i){
					item = itemList[i];
					console.log(item.id);
					totalAmount += parseFloat(item.price.substring(1).replace(',','')); // Take the $ added by the db and also replace the commas 
					list.append("<li id=itemID"+item.id+"><a href=\"#\">" + 
						"<img src="+ item.picture + ">"  + 
						"<h2>" + item.brand + " " +item.model + "</h2>" + 
						"<p>" + item.description + "</p>" +
						"<p> Rating:" + item.rating + " </p>" + 
						"<p class=\"ui-li-aside\">Quantity: "+ item.quantity+ "    Price: " + item.price + "</p>" +
						"</a>"+
						"<a onclick=\"toRemove("+item.id+")\" href=\"#removeItemFromCart\" data-rel=\"popup\" data-position-to=\"window\" data-transition=\"pop\">remove from cart</li>");
					list.listview("refresh");	
				}

				var totalAmountField = $("#shoppingCartAmount");
				totalAmountField.empty();
				totalAmountField.append("$"+totalAmount);

				$.mobile.loading("hide");
				
			});
			$.mobile.navigate("#shoppingCart");
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			console.log("textStatus: " + textStatus);
			alert("Data in Shopping Cart not found!");
			
		}
	});
}

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

function placedBids(){

	console.log("Placed Bids function");
	$.mobile.loading("show");
	$.ajax({
		url : "http://"+host+"/placedBids",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			$(document).on('pagebeforeshow', "#placedBids", function( event, ui ) {
				console.log("placedBids on pagebeforeshow listener");
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

					list.append("<li data-icon=\"false\" id=itemID"+item.id+"><a href=\"#\">" + 
						"<img src="+ item.picture + ">"  + 
						"<h2>" + item.itemName + "</h2>" + 
						"<p>" + item.description + "</p>" +
						"<p> Rating:" + item.rating + " </p>" + 
						"<div data-role=\"fielcontain\" class=\"ui-li-aside\">" +
						//"<h2 class=\"ui-li-aside\"> Increase Bid:" +
						"<label for=\"nextBid\"> Increase Bid" +
						"<input id=\"nextBid\" class=\"ui-input-text ui-body-a ui-corner-all ui-shadow-inset\" data-inline=\"true\" value="+item.price+">" +
						"<input  onclick=\"increaseBid()\" type=\"submit\" data-role=\"button\" data-inline=\"true\" value=\"Bid\">"+
						"</div></a></li>"); //+
						//"<a onclick=\"toIncreaseBid("+item.id+")\" href=\"#increaseBid\" data-rel=\"popup\" data-position-to=\"window\" data-transition=\"pop\">increase bid</li>");

					list.listview("refresh");	
					var totalAmountField = $("#nextAcceptableBid");
					totalAmountField.empty();
					totalAmountField.append("$"+totalAmount);
				}
				$.mobile.loading("hide");
			});		
			$.mobile.navigate("#placedBids");
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});

}

var itemToIncreaseBid;
function toIncreaseBid(itemId){
	itemToIncreaseBid = itemId;
}

function increaseBid(){
	$.mobile.loading("show");
	console.log("Increase Bid: "+ itemToIncreaseBid);
	console.log("BID");
	var bid = $("#increaseBid");
	var bidData = bid.serializeArray(bidData);
	console.log("bid data : " + bidData);
	var jsonBid = ConvertToJSON(bidData);
	var readyBid = JSON.stringify(jsonBid);
	console.log(bid);
	$.ajax({
		url : "http://"+host+"/placedBids/item"+itemToIncreaseBid,
		method : "put",
		data : readyBid,
		contentType: "application/json",
		dataType : "json",
		

	// $.mobile.loading("show");
	// var form = $("#loginForm");
	// var formData = form.serializeArray();
	// console.log("form data : "+ formData);
	// var user = ConvertToJSON(formData);
	// console.log("User to login : " + JSON.stringify(user));
	// var userJSON = JSON.stringify(user);
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
function itemsSold(){
	console.log("Items Sold function");
	$.mobile.loading("show");
	$.ajax({
		url : "http://"+host+"/itemsSold",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){

			$(document).on('pagebeforeshow', "#itemsSold", function( event, ui ) {
				console.log("itemsSold on pagebeforeshow listener");
				var currentInvoiceId=undefined;
				var itemList = data.items;
				var len = itemList.length;
				var list = $("#itemsSoldList");
				list.empty();
				var item;
				var totalAmount = 0 ;
				if(len > 0 )
				{	
					currentInvoiceId = itemList[0].invoice_id;
					list.append("<li data-role=\"list-divider\", data-theme=\"a\"> Invoice Date (#) "+currentInvoiceId+"   <p class=\"ui-li-aside\"> Total Amount Paid: $3</p> </li>");
				}

				for (var i=0; i < len; ++i){
					item = itemList[i];
					if(currentInvoiceId != item.invoice_id)
					{	
						currentInvoiceId = item.invoice_id;
						list.append("<li data-role=\"list-divider\", data-theme=\"a\"> Invoice Date (#)  "+currentInvoiceId+" <p class=\"ui-li-aside\"> Total Amount Paid: $3</p> </li>");

					}

					currentInvoiceId = item.invoice_id;
					list.append("<li id=itemID"+item.id+"><a href=\"#\">" + 
						"<img src="+ item.picture + ">"  + 
						"<h2>" + item.itemName + "</h2>" + 
						"<p>" + item.description + "</p>" +
						"<p> Rating:" + item.rating + " </p>" + 
						"<p class=\"ui-li-aside\"> Purchased Price: $" + item.price + "</p>" +
						"</a>");
					list.listview("refresh");	

					
				}
				$.mobile.loading("hide");
			});	
			$.mobile.navigate("#itemsSold");
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});

}

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

			document.location.href = "http://"+host;

		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus : " + textStatus);
			$.mobile.loading("hide");
			alert(data.responseText);
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
			alert("Log out failed.");
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
// Update Profile
/*******************************************************************************************************************************************/
var currentUsr = {};

function getUser(id) {
	console.log("Admin manageUser");
	$.mobile.loading("show");
	$.ajax({
		url : "http://"+host+"/manageUser",
		method : "get",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			$(document).on('pagebeforeshow', "#adminManageUser", function( event, ui) {
				console.log("adminManageUser on pagebeforeshow listener");
				var userList =data.usersList;
				var len  = userList.length;
				var list = $("#usersList");
				list.empty();
				var user;
				list.append("<li data-role=\"list-divider\", data-theme=\"a\">  Users " );
				for (var i = 0; i < len; ++i) {
					user = userList[i];
					console.log(user.id);
					list.append("<li id ="+ user.id+" data-icon=\"false\">"+
						"<a href=\"#\" onclick=\"getUser("+user.id+")\">" +
						"<img src ="+user.picture+" > "+
						"<h1>" +user.name+"</h1>"+
						"<p>" +user.description+ "</p>" +
						"<p> Rating : " + user.rank + " </p>" + 
						"</a></li>");
					list.listview("refresh");
				}
				$.mobile.loading("hide");
			});
			$.mobile.navigate("#adminManageUser");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Users data not found!");
		}
	});
}

function getUserProfileInfo(){
	$.mobile.loading("show");
	$.ajax({
		url : "http://"+host+"/userProfile",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			currentUsr = data.user;
			
			$.mobile.loading("hide");
			$.mobile.navigate("#editProfile");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("User not found.");
			}
			else {
				alter("Internal Server Error.");
			}
		}
	});
}

function editProfile(){
	$.mobile.loading("show");
	var form = $("#editProfileForm");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var updUsr = ConverToJSON(formData);
	
	console.log("Updated Car: " + JSON.stringify(updUsr));
	var updUsrJSON = JSON.stringify(updUsr);
	$.ajax({
		url : "http://"+host+"/userProfile" ,
		method: 'put',
		data : updUsrJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#profilePage");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Data could not be updated!");
			}
			else {
				alert("Internal Error.");		
			}
		}
	});
}


/*******************************************************************************************************************************************/
// Items Selling
/*******************************************************************************************************************************************/

function itemsSelling(){
	console.log("Items Selling function");
	$.mobile.loading("show");
	$.ajax({
		url : "http://"+host+"/itemsSelling",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){

			$(document).on('pagebeforeshow', "#itemsSelling", function( event, ui ) {
				console.log("itemsSelling on pagebeforeshow listener");
				listSales = $("#itemsSellingList");
				listAuctions = $("#itemsAuctioningList");

				var itemList = data.items;
				var len = itemList.length;
				listSales.empty();
				listAuctions.empty();
				var item;

				listSales.append("<li data-role=\"list-divider\", data-theme=\"a\">  Selling " );
				listAuctions.append("<li data-role=\"list-divider\", data-theme=\"a\">  Auctioning ");
				for (var i=0; i < len; ++i){
					item = itemList[i];
					if(item.product_type === 'sale'){
						listSales.append("<li id=itemID"+item.id+"><a href=\"#\">" + 
							"<img src="+ item.picture + ">"  + 
							"<h2>" + item.brand + " " +item.model + "</h2>" + 
							"<p>" + item.description + "</p>" +
							"<p> Rating:" + item.rating + " </p>" + 
							"<p class=\"ui-li-aside\"> Price: " + item.price + "</p>" +
							"</a>");

						listSales.listview("refresh");
					}
					else if(item.product_type === 'auction'){
						listAuctions.append("<li id=itemID"+item.id+"><a href=\"#\">" + 
							"<img src="+ item.picture + ">"  + 
							"<h2>" + item.brand + " " +item.model + "</h2>" + 
							"<p>" + item.description + "</p>" +
							"<p> Rating:" + item.rating + " </p>" + 
							"<p class=\"ui-li-aside\"> Starting Price: " + item.price + "</p>" +
							"</a>");

						listAuctions.listview("refresh");
					}	
				}

				$.mobile.loading("hide");
			});
			$.mobile.navigate("#itemsSelling");
			// var totalAmountField = $("#shoppingCartAmount");
			// totalAmountField.empty();
			// totalAmountField.append("$"+totalAmount);
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data not found!");
		}
	});
}

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


function getUser(id) {
	console.log("Admin manageUser");
	$.mobile.loading("show");
	$.ajax({
		url : "http://"+host+"/manageUser",
		method : "get",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			$(document).on('pagebeforeshow', "#adminManageUser", function( event, ui) {
				console.log("adminManageUser on pagebeforeshow listener");
				var userList =data.usersList;
				var len  = userList.length;
				var list = $("#usersList");
				list.empty();
				var user;
				list.append("<li data-role=\"list-divider\", data-theme=\"a\">  Users " );
				for (var i = 0; i < len; ++i) {
					user = userList[i];
					console.log(user.id);
					list.append("<li id ="+ user.id+" data-icon=\"false\">"+
						"<a href=\"#\" onclick=\"getUser("+user.id+")\">" +
						"<img src ="+user.picture+" > "+
						"<h1>" +user.name+"</h1>"+
						"<p>" +user.description+ "</p>" +
						"<p> Rating : " + user.rank + " </p>" + 
						"</a></li>");
					list.listview("refresh");
				}
				$.mobile.loading("hide");
			});
			$.mobile.navigate("#adminManageUser");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Users data not found!");
		}
	});
}

function getUsersToManage() {
	console.log("Admin manageUser");
	$.mobile.loading("show");
	$.ajax({
		url : "http://"+host+"/manageUser",
		method : "get",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			$(document).on('pagebeforeshow', "#adminManageUser", function( event, ui) {
				console.log("adminManageUser on pagebeforeshow listener");
				var userList =data.usersList;
				var len  = userList.length;
				var list = $("#usersList");
				list.empty();
				var user;
				list.append("<li data-role=\"list-divider\", data-theme=\"a\">  Users " );
				for (var i = 0; i < len; ++i) {
					user = userList[i];
					console.log(user.id);
					list.append("<li id ="+ user.id+" data-icon=\"false\">"+
						"<a href=\"#\" onclick=\"getUser("+user.id+")\">" +
						"<img src ="+user.picture+" > "+
						"<h1>" +user.name+"</h1>"+
						"<p>" +user.description+ "</p>" +
						"<p> Rating : " + user.rank + " </p>" + 
						"</a></li>");
					list.listview("refresh");
				}
				$.mobile.loading("hide");
			});
			$.mobile.navigate("#adminManageUser");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Users data not found!");
		}
	});
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

