var host = "localhost:5000";//"192.168.1.3:4000";


// This global variable is used to keep track of the item the user is viewing in the itemsPage. 
//This variable gets set with the findItem(itemId) function 
var currentItemToAdd = undefined;
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

				if(item.ptype === "sale"){
				list.append("<li>" +
					"<a href='#' onclick=\"findItem(" +item.product_id + ")\">" + 
					"<img src="+ item.photo_url + ">"  + 
					"<h2>" + item.product_name + "</h2>" + 
					"<p>" + item.description + "</p>" +
					"<p> Seller: " + item.f_name + " " + item.l_name+  " </p>" + 
					"<p class=\"ui-li-aside\"> Price: $" + item.price + "</p>" +
					"</a></li>");	
				}
				else if(item.ptype === "auction"){
					if(item.highest_bid_amount === null ) 
						item.highest_bid_amount = item.price;

				list.append("<li>" +
					"<a href='#' onclick=\"findItem(" +item.product_id + ")\">" + 
					"<img src="+ item.photo_url + ">"  + 
					"<h2>" + item.product_name + "</h2>" + 
					"<p>" + item.description + "</p>" +
					"<p> Seller: " + item.f_name + " " + item.l_name+  " </p>" + 
					"<p class='ui-li-aside'> Highest Bid: $" + item.highest_bid_amount+  "</p>"+
					"</a></li>");

				}
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
						
						list.append("<li>"+
							"<a href='#' onclick=\"findItem(" +item.product_id + ")\">" + 
							"<img src="+ item.photo_url + ">"  + 
							"<h2>" + item.product_name + "</h2>" + 
							"<p>" + item.description + "</p>" +
							"<p> Seller: " + item.f_name + " " + item.l_name+  " </p>" + 
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

					list.append("<li>" + 
						"<a href='#' onclick=\"findItem(" +item.product_id + ")\">" + 
						"<img src="+ item.photo_url + ">"  + 
						"<h2>" + item.product_name + "</h2>" + 
						"<p>" + item.description + "</p>" +
						"<p> Seller: " + item.f_name + " " + item.l_name+  " </p>" + 
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

	currentItemToAdd = itemId;

	

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

				if(item.ptype === "auction"){
					$("#addItemToCartAnchor").hide();
					$("#placeBidAnchor").show();

					list.append("<li data-theme=\"c\">" + 
					"<h3>" + item.pname + "</h3>" + 
					"<h6> Product ID: " + item.id + "</h6>" +
					"<img src="+ item.picture + ">" +
					"<p>" + item.description + "</p></li>"+
					"<label for=\"incBidIP" +item.id+"\"> Place Bid" +
					"<input style='width:60px' id=\"incBidIP" +item.id+"\" class=\"ui-input-text ui-body-a ui-corner-all ui-shadow-inset\" data-inline=\"true\" value="+item.amount+">");
				}
				else if(item.ptype === "sale"){
					$("#placeBidAnchor").hide();
					$("#addItemToCartAnchor").show();
					
					list.append("<li data-theme=\"c\">" + 
					"<h3>" + item.pname + "</h3>" + 
					"<h6> Product ID: " + item.id + "</h6>" +
					"<img src="+ item.picture + ">" +
					"<p> Price: " + item.amount + "</p>" + 
					"<p>" + item.description + "</p>"+
					"</li>" 
					);
					
				}
				
				

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

function orderView(category, store){

	var sortOrder = document.getElementById("sortOrder").value ; 

	$.mobile.loading("show");
	console.log("orderView function with categoryId = " + category +" and Store = " + store);
	$.ajax({
		url : "http://"+host+"/stores/"+store+"/"+category+"/"+sortOrder,
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

					list.append("<li>" + 
						"<a href='#' onclick=\"findItem(" +item.product_id + ")\">" + 
						"<img src="+ item.photo_url + ">"  + 
						"<h2>" + item.product_name + "</h2>" + 
						"<p>" + item.description + "</p>" +
						"<p> Seller: " + item.f_name + " " + item.l_name+  " </p>" + 
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
}
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
				for (var i=0; i < len; ++i){
					item = itemList[i];
					console.log(item.id);
					list.append("<li id=itemID"+item.id+"><a href=\"#\">" + 
						"<img src="+ item.picture + ">"  + 
						"<h2>" + item.pname + "</h2>" + 
						"<p>" + item.description + "</p>" +
						"<p> Price:" + item.price + " </p>" + 
						"<div data-role=\"fieldcontain\" class=\"ui-li-aside\">" +
						"<h2 style='padding-right:10px'> Quantity <h2/>" +
						"<input style=\"width:30px\" id=\"nextBid"+ item.id +"\" class=\"ui-input-text ui-body-a ui-corner-all ui-shadow-inset ui-li-aside\" data-inline=\"true\" onchange='updateQuantity("+item.id+")' value="+item.quantity+">" +
						"</div></a>"+
						"<a onclick=\"toRemove("+item.id+")\" href=\"#removeItemFromCart\" data-rel=\"popup\" data-position-to=\"window\" data-transition=\"pop\">remove from cart</li>");
					list.listview("refresh");	
				}
				getCreditCards();
				if(len!=0) // Case to protect when the user doesn't have any items in cart
				{
					var totalAmountField = $("#shoppingCartAmount");
					totalAmountField.empty();

					totalAmountField.append("$"+item.total_amount);
				}

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


function updateQuantity(itemId){

	var newQuant =	document.getElementById("nextBid" +itemId).value ;

	$.mobile.loading("show");
	console.log("remove item: "+ itemToRemove);
	$.ajax({
		url : "http://"+host+"/itemInCart/update_quantity/"+itemId+"/"+newQuant,
		method : "put",
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
			$.mobile.loading("hide");
			alert("Could not update quantity");
		}
	});

}
//Global Variable to know which item the user wants to remove
var itemToRemove;
function toRemove(itemId){
	itemToRemove = itemId;
}

function getCreditCards(){
	console.log("Checkout get credit cards");

	$.ajax({
		url : "http://"+host+"/shoppingCart/checkout/getCreditCards",
		method : "get",
		contentType: "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR){

			var list = $("#cc_list_checkout");
			list.empty();
			var item;
			for(var i=0; i < data.items.length ; i++){
				item = data.items[i];

				list.append("<li id=ccID"+item.cc_id+"><a href=\"#\" onclick='checkoutCart("+item.cc_id+")'>" + 
						"<h2>" + item.name_on_card + "</h2>" + 
						"<p>" + item.type + "</p>" +
						"<p> Expiration date:" + item.expiration_date_month+"/"+item.expiration_date_year + " </p>" + 
						"</a></li>"
					);

			}
			list.listview("refresh");
			$.mobile.loading("hide");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
}

//TODO set function to respond to cancel button.
function checkoutCart(cc_id){
	console.log("Checkout cart ");
	var date = new Date();

	$.mobile.loading("show");
	var items = {
		"date" : date.getFullYear() + "-" +(date.getMonth()+1) + "-"+ date.getDate(),
		"time" : date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
		"cc_id" : cc_id
	};

	items = JSON.stringify(items);
	$.ajax({
		url : "http://"+host+"/shoppingCart/checkout",
		method : "put",
		data: items,
		contentType: "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR){

			$.mobile.loading("hide");
			alert("Order Processed");
			document.location.href = "http://"+host;
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
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
					if(item.whoiswin === "winning"){
						list.append("<li data-icon=\"false\" id=itemID"+item.id+"><a href=\"#\">" + 
							"<img src="+ item.picture + ">"  + 
							"<h2>" + item.pname + "</h2>" + 
							"<p>" + item.description + "</p>" +
							"<p> Seller: " + item.f_name + " " + item.l_name+  " </p>" + 
							"<div data-role=\"fieldcontain\" class=\"ui-li-aside\">" +
							//"<h2 class=\"ui-li-aside\"> Increase Bid:" +
							"<label for=\"incBidPB" +item.id+"\"> Winning with" +
							"<input id=\"incBidPB" +item.id+"\" class=\"ui-input-text ui-body-a ui-corner-all ui-shadow-inset\" data-inline=\"true\" value="+item.bid_amount+">" +
							"<input  onclick=\"increaseBid("+item.id+", 'incBidPB')\" type=\"submit\" data-role=\"button\" data-inline=\"true\" value=\"Bid\">"+
							"</div></a></li>"); 
					}
					else {
						list.append("<li data-icon=\"false\" id=itemID"+item.id+"><a href=\"#\">" + 
							"<img src="+ item.picture + ">"  + 
							"<h2>" + item.pname + "</h2>" + 
							"<p>" + item.description + "</p>" +
							"<p> Seller: " + item.f_name + " " + item.l_name+  " </p>" + 
							"<div data-role=\"fieldcontain\" class=\"ui-li-aside\">" +
							//"<h2 class=\"ui-li-aside\"> Increase Bid:" +
							"<label for=\"incBidPB" +item.id+"\"> Increase Bid" +
							"<input id=\"incBidPB" +item.id+"\" class=\"ui-input-text ui-body-a ui-corner-all ui-shadow-inset\" data-inline=\"true\" value="+item.bid_amount+">" +
							"<input  onclick=\"increaseBid("+item.id+", 'incBidPB')\" type=\"submit\" data-role=\"button\" data-inline=\"true\" value=\"Bid\">"+
							"</div></a></li>"); 
					}
	
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

function increaseBid(itemId, currentPage){
	

	if(currentPage === "incBidIP"){
		itemId = currentItemToAdd;
	}

	var incBid =document.getElementById(currentPage +itemId).value ;



	$.mobile.loading("show");
	console.log("incBid: "+ incBid);
	$.ajax({
		url : "http://"+host+"/placedBids/item/"+itemId+"/"+incBid,
		method : "put",
		contentType: "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR){

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
			$.mobile.loading("hide");
			alert("Could not update quantity");
		}
	});
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
					list.append("<li data-role=\"list-divider\", data-theme=\"a\"> Date: "+itemList[0].date.substring(0, itemList[0].date.indexOf("T")) );
				}

				for (var i=0; i < len; ++i){
					item = itemList[i];
					if(currentInvoiceId != item.invoice_id)
					{	
						currentInvoiceId = item.invoice_id;
						list.append("<li data-role=\"list-divider\", data-theme=\"a\"> Date: "+item.date.substring(0, item.date.indexOf("T") ) ) ;

					}

					currentInvoiceId = item.invoice_id;
					list.append("<li id=itemID"+item.id+"><a href=\"#\">" + 
						"<img src="+ item.picture + ">"  + 

						"<h2>" +  item.pname + "</h2>" + 
						"<p>" + item.description + "</p>" +

						
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
			alert("Good Bye");
			document.location.href = "http://"+host;
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
	var email;
	var password;
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
			loginForm(email, password);
			console.log("To home");

		},
		error : function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});

}

function addAdminForm(){
	console.log("Add Admin");
	$.mobile.loading("show");
	var form = $("#aRegisterForm");
	var formData = form.serializeArray();
	
	console.log("form Data: " + formData);
	var newUser = ConvertToJSON(formData);
	console.log("New Admin: " + JSON.stringify(newUser));
	var newUserJSON = JSON.stringify(newUser);
	$.ajax({
		url : "http://"+host+"/add_new_admin",
		method: 'post',
		data : newUserJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#home");
			loginForm(email, password);
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
var newAdminId = undefined

function getUser(id) {
	console.log("Admin manages");
	$.mobile.loading("show");
	$.ajax({
		url : "http://"+host+"/userProfile"+id,
		method : "get",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			$(document).on('pagebeforeshow', "#xProfilePage", function( event, ui) {
				console.log("xProfilePage on pagebeforeshow listener");
				var xUser = data.user;
				newAdminId = xUser[0].account_id;
				userId = id;
				var html = '<div class = \'ui-grid-a\'>'+
					'<h3>'+xUser[0].name+'</h3>'+
					'<br></br>'+
					'</div>' +
					'<div class =\'ui-grid-b\'></div>' +
					'</div>' +
					'<div class =\'ui-grid-a\'>' +
					'<div class=\'ui-block-a\'>' +
						'<img src='+xUser[0].picture+' width=\'120\' height=\'120\' border=\'true\'></img>'+
						'<br></br>'+
					'</div>'+
					'<div class =\'ui-block-b\'>'+
						'<p>'+
							'<b> Current Seller Rank: '+xUser[0].rank+'</b>'+
							'<br></br>'+
								'<label for="ranking"> Rank   '+
								'<select name=\'ranking\' id=\'ranking\'>'+
									'<option value=\'5\'>5</option>'+
									'<option value=\'4\'>4</option>'+
									'<option value=\'3\'>3</option>'+
									'<option value=\'2\'>2</option>'+
									'<option value=\'1\'>1</option>'+
									'<option value=\'0\'>0</option>'+
								'</select></label>'+
								'<button href=\'#\' data-role=\'button\' value=\'Rank\'>Rank  </button>'+
						'</p>'+
					'<p> <em>'+xUser[0].description+'</em></p></div>';
			
				var profileField = $('#xUserProfile');
				profileField.empty();
				profileField.append(html);
				$.mobile.loading("hide");
			});
			$.mobile.navigate("#xProfilePage");
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
			
			document.getElementById("exp_card").value = data.user[0].expiration_date_month +"/"+data.user[0].expiration_date_year;
			document.getElementById("sc_card").value = data.user[0].sc_card;
			document.getElementById("nc_card").value = data.user[0].nc_card;
			document.getElementById("tc_card").value = data.user[0].tc_card;

			for(var i=0; i< data.user.length ; i++){
				// Normal Mail address section
				if(!data.user[i].billing_flag){
					document.getElementById("first_line").value = data.user[i].first_line;
					document.getElementById("second_line").value = data.user[i].second_line;
					document.getElementById("zip_code").value = data.user[i].zip_code;
					document.getElementById("country").value = data.user[i].country;
					document.getElementById("city").value = data.user[i].city;
				}
				else if(data.user[i].billing_flag){
					document.getElementById("first_line_b").value = data.user[i].first_line;
					document.getElementById("second_line_b").value = data.user[i].second_line;
					document.getElementById("zip_code_b").value = data.user[i].zip_code;
					document.getElementById("country_b").value = data.user[i].country;
					document.getElementById("city_b").value = data.user[i].city;
				}
			}

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
				alert("Internal Server Error.");
			}
		}
	});
}

// function editProfile(){
// 	$.mobile.loading("show");
// 	var form = $("#editProfileForm");
// 	var formData = form.serializeArray();
// 	console.log("form Data: " + formData);
// 	var updUsr = ConvertToJSON(formData);
	
// 	console.log("Updated Car: " + JSON.stringify(updUsr));
// 	var updUsrJSON = JSON.stringify(updUsr);
// 	$.ajax({
// 		url : "http://"+host+"/userProfile/update" ,
// 		method: 'put',
// 		data : updUsrJSON,
// 		contentType: "application/json",
// 		dataType:"json",
// 		success : function(data, textStatus, jqXHR){
// 			$.mobile.loading("hide");
// 			$.mobile.navigate("#profilePage");
// 		},
// 		error: function(data, textStatus, jqXHR){
// 			console.log("textStatus: " + textStatus);
// 			$.mobile.loading("hide");
// 			if (data.status == 404){
// 				alert("Data could not be updated!");
// 			}
// 			else {
// 				alert("Internal Error.");		
// 			}
// 		}
// 	});
// }

function editMailAddress(){
	$.mobile.loading("show");
	var form = $("#editProfileInfoForm");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var updUsr = ConvertToJSON(formData);
	
	console.log("Updated Car: " + JSON.stringify(updUsr));
	var updUsrJSON = JSON.stringify(updUsr);
	$.ajax({
		url : "http://"+host+"/userProfile/update/mailingAddress" ,
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

function editBillAddress(){
	$.mobile.loading("show");
	var form = $("#editProfileInfoForm");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var updUsr = ConvertToJSON(formData);
	
	console.log("Updated Car: " + JSON.stringify(updUsr));
	var updUsrJSON = JSON.stringify(updUsr);
	$.ajax({
		url : "http://"+host+"/userProfile/update/billingAddress" ,
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

function editProfileInfo(){
	$.mobile.loading("show");
	var form = $("#editProfileInfoForm");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var updUsr = ConvertToJSON(formData);
	
	console.log("Updated Car: " + JSON.stringify(updUsr));
	var updUsrJSON = JSON.stringify(updUsr);
	$.ajax({
		url : "http://"+host+"/userProfile/update/profileInfo" ,
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

function editCCard(){

	$.mobile.loading("show");
	var form = $("#editProfileInfoForm");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var updUsr = ConvertToJSON(formData);
	
	console.log("Updated Credit Card: " + JSON.stringify(updUsr));
	var updUsrJSON = JSON.stringify(updUsr);
	$.ajax({
		url : "http://"+host+"/userProfile/update/creditCardInfo" ,
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

function searchItems(label) {
	console.log("search function is called");
	$.mobile.loading("show");
	$.ajax({
		url : "http://" + host + "/search/" + label,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR){

		$(document).on('pagebeforeshow', "#searchResults", function( event, ui ) {
				console.log("searchResults on pagebeforeshow listener");
				listResult = $("#resultList");

				var itemList = data.items;
				var len = itemList.length;
				listResult.empty();
				var item;

				for (var i=0; i < len; ++i){
					item = itemList[i];
					
					listResult.append("<li id=itemID"+item.id+"><a onclick=\"findItem(" +item.id + ")\">" + 
						"<img src="+ item.picture + ">"  + 
						"<h2>" +item.pname+ "</h2>" + 
						"<p>" + item.description + "</p>" +
						"<p> Brand: " + item.brand + " </p>" + 
						"<p class=\"ui-li-aside\"> Price: " + item.amount + "</p>" +
						"</a>");

					listResult.listview("refresh");
				}

		$.mobile.loading("hide");
		});
		$.mobile.navigate("#searchResults");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data not found!");
		}
	});
}

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
							"<h2>" +item.pname+ "</h2>" + 
							"<p>" + item.description + "</p>" +

							"<p class=\"ui-li-aside\"> Price: " + item.price + "</p>" +
							"</a>");

						listSales.listview("refresh");
					}
					else if(item.product_type === 'auction'){
						listAuctions.append("<li id=itemID"+item.id+"><a href=\"#\">" + 
							"<img src="+ item.picture + ">"  + 
							"<h2>" + item.pname + "</h2>" + 
							"<p>" + item.description + "</p>" +
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
var oldAdminId = undefined;
var userId = undefined;
//Sets storeToRemove in order for the call to removeStore to work with the parameter.
function toRemoveStore(storeId){
	console.log("Store to remove: " + storeId);
	storeToRemove = storeId;
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
		url : "http://"+host+"/removeStore/storeId/"+storeToRemove,
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

function getAdminsToManage() {
	console.log("Admin manageAdmin");
	$.mobile.loading("show");
	$.ajax({
		url : "http://"+host+"/manageAdmins",
		method : "get",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			$(document).on('pagebeforeshow', "#adminManageAdmins", function( event, ui) {
				console.log("adminManageUser on pagebeforeshow listener");
				var adminsList =data.adminsList;
				var len  = adminsList.length;
				var list = $("#adminsList");
				list.empty();
				var admin;
				list.append("<li data-role=\"list-divider\", data-theme=\"a\">  Admins " );
				for (var i = 0; i < len; ++i) {
					admin = adminsList[i];
					console.log(admin.id);
					list.append("<li id ="+ admin.id+" data-icon=\"false\">"+
						"<a href=\"#\" onclick=\"getAdmin("+admin.id+")\">" +
						"<img src ="+admin.picture+" > "+
						"<h1>" +admin.name+"</h1>"+
						"<p>" +admin.description+ "</p>" +
						"<p> Rating : " + admin.rank + " </p>" + 
						"</a></li>");
					list.listview("refresh");
				}
				$.mobile.loading("hide");
			});
			$.mobile.navigate("#adminManageAdmins");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Admins data not found!");
		}
	});
}
function getAdmin(id) {
	console.log("Admin manages");
	$.mobile.loading("show");
	$.ajax({
		url : "http://"+host+"/adminProfile"+id,
		method : "get",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			$(document).on('pagebeforeshow', "#xAdminPage", function( event, ui) {
				console.log("xAdminPage on pagebeforeshow listener");
				var xAdmin =data.user;
				oldAdminId = id;
				userId = id
				var html = '<div class = \'ui-grid-a\'>'+
					'<h3>'+xAdmin[0].name+'</h3>'+
					'<br></br>'+
					'</div>' +
					'<div class =\'ui-grid-b\'></div>' +
					'</div>' +
					'<div class =\'ui-grid-a\'>' +
					'<div class=\'ui-block-a\'>' +
						'<img src='+xAdmin[0].picture+' width=\'120\' height=\'120\' border=\'true\'></img>'+
						'<br></br>'+
					'</div>'+
					'<div class =\'ui-block-b\'>'+
						'<p>'+
							'<b> Current Seller Rank: '+xAdmin[0].rank+'</b>'+
							'<br></br>'+
								'<label for="ranking"> Rank   '+
								'<select name=\'ranking\' id=\'ranking\'>'+
									'<option value=\'5\'>5</option>'+
									'<option value=\'4\'>4</option>'+
									'<option value=\'3\'>3</option>'+
									'<option value=\'2\'>2</option>'+
									'<option value=\'1\'>1</option>'+
									'<option value=\'0\'>0</option>'+
								'</select></label>'+
								'<button href=\'#\' data-role=\'button\' value=\'Rank\'>Rank  </button>'+
						'</p>'+
					'<p> <em>'+xAdmin[0].description+'</em></p></div>';
			
				var profileField = $('#xAdminProfile');
				profileField.empty();
				profileField.append(html);
				$.mobile.loading("hide");
			});
			$.mobile.navigate("#xAdminPage");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Admin data not found!");
		}
	});
}

function makeAdmin(){
	console.log("Make Admin: "+ newAdminId);
	$.mobile.loading("show");
	$.ajax({
		url : "http://"+host+"/makeAdmin/"+newAdminId,
		method : "put",
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
	newAdminId = undefined;
}

function removeAdmin(){
	console.log("Remove Admin: "+ oldAdminId);
	$.mobile.loading("show");
	$.ajax({
		url : "http://"+host+"/removeAdmin/"+oldAdminId,
		method : "put",
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
	oldAdminId = undefined;
}

function deleteUser(){
	$.mobile.loading("show");
	console.log("delete user: "+ userId);
	$.ajax({
		url : "http://"+host+"/user/delete/"+userId,
		method : "delete",
		contentType: "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR){

			$.mobile.loading("hide");

			$.mobile.changePage(
		    $("#home") , 
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
	userId = undefined;
}



function addCategory(){
	console.log("add category");
	var catName = $("#newCategoryName").val();
	
	$.mobile.loading("show");
	$.ajax({
		url : "http://"+host+"/addCategory/categoryName/"+storeToAdd+"/"+catName,
		method : "post",
		contentType: "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR){

			$.mobile.loading("hide");
		
			
			document.location.href = "http://"+host;
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	storeToAdd = undefined;
}


var storeToAdd = undefined;
function toAddCategoryToStore(currentStore){
	console.log(currentStore);
    storeToAdd = currentStore;
}

function cancelAddStore(){
	storeToAdd = undefined;
}


function addItemToCart(){
	itemId = currentItemToAdd;
	$.mobile.loading("show");
	console.log("addItemToCart function with itemId = " + itemId);
	$.ajax({
		url : "http://"+host+"/addItemToCart/"+itemId,
		method: 'put',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
				alert("Added item to Cart");
						
				$.mobile.loading("hide");			
			

		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			console.log("textStatus: " + textStatus);
			alert("error in add to cart");
		}
	});
}

function adminGenerateReports(){

	$.mobile.loading("show");
	console.log("adminGenerateReports ");
	$.ajax({
		url : "http://"+host+"/reports/todaySales",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
						
		$(document).on('pagebeforeshow', "#adminGenerateReports", function( event, ui) {

				console.log("adminGenerateReports on pagebeforeshow listener");
				var len  = data.items.length;
				var list  = $("#adminGenerateReportsList");
				list.empty();
				var item;

				for (var i = 0; i < len; ++i) {
					item = data.items[i];
					list.append("<li  data-icon=\"false\">"+
						"<a href=\"#\">" +
						"<h1> Amount : " +item.amount+"</h1>"+
						"</a></li>");
					
				}
				list.listview("refresh");
				

				$.mobile.loading("hide");			
			});

			$.mobile.navigate("#adminGenerateReports");

		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			console.log("textStatus: " + textStatus);
			alert("error in generating reports");
		}
	});
}

function generateReports(){


	console.log("REPORTS "+document.getElementById("whichReport").value);
}
// //This enables the search bar to send queries to the server
// $(document).ready(function() {
// 	$(".mainSearch").on("keypress" ,function(e) { 
// 		if(e.keyCode == 13)
// 		{
// 			var temp = $('.mainSearch').val();
// 			$.ajax({
// 				url : "http://"+host+"/search/"+temp,
// 				contentType: "application/json",
// 				success : function(data, textStatus, jqXHR){
					
// 				},
// 				error: function(data, textStatus, jqXHR){
// 					console.log("textStatus: " + textStatus);
// 					alert("Data not found!");
// 				}
// 			});
// 		}
// 	});
// });

