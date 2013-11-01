var express = require('express');
var http    = require('http');
var app     = express();
var item = require("./public/js/objects.js");
var StoreItem = item.StoreItem;
var user = require("./public/js/user.js");
var User = user.User;

//Variable to create the hash table for categories
var MAX_NODES = 100;

//DATABASE SETUP
var pg = require('pg');
var conString = "postgres://joseacevedo:vmpasswordp@acv2.no-ip.org:5432/fase2";

app.use(express.bodyParser());
var stores = {
	ELECTRONICS : {
		name : "electronics" ,
		categories : {
			TV : {name : "tv" },
			AUDIO : {name : "audio"  },
			CAMERA : {name : "camera" },
			PHONE : {name : "phone" },
			VIDEO : {name : "video"}
		}
	},
	BOOKS : {
		name : "books",
		categories : {
			FICTION : {name : "fiction"  },
			BUSINESS : {name : "business" },
			CHILDREN : {name : "children" },
			TECHNOLOGY : {name : "technology" }
		}
	},
	COMPUTERS : {
		name: "computers",
		categories : {
			LAPTOPS : {name : "laptops"},
			DESKTOPS : {name : "desktops"},
			TABLETS : {name : "tablets"},
			PRINTERS : {name : "printers"}
		}
	},
	CLOTHING : {
		name : "clothing",
		categories : {
			CHILDREN : { name : "children"},
			MEN : { name : "men"},
			WOMEN : {name : "women"}
		}
	},
	SHOES : {
		name : "shoes",
		categories : {
			CHILDREN : {name : "children"},
			WOMEN : {name : "women"},
			MEN : {name : "men"}

		}
	},
	SPORTS : {
		name : "sports",
		categories : {
			BICYCLES : {name : "bicycles"},
			FISHING : {name : "fishing"},
			BASEBALL : {name : "baseball"},
			GOLF : {name : "golf"},
			BASKETBALL : {name : "basketball"}
		}
	}
};


app.configure(function(){
	app.set('port', process.env.PORT || 4000);
	app.set('public', __dirname + '/public');
	app.use(express.static(__dirname + '/public'));
	app.use(express.static(__dirname + '/views'));
});



app.get('/', function(request, response) {

	//Add length for the stores object in the JSON generate var
//	generate.data.dataLength = generate.data.stores.length;

	//Add the length for the individual categories in the JSON generate vaer
//	for(var i = 0 ; i < generate.data.dataLength ; i++)
//		generate.data.stores[i].categoriesLength = generate.data.stores[i].categories.length;

	var viewData = {
		"data" : {
			"stores" : [

			],
			"dataLength" : 0
		}
	};

	//Query the DB for all the Categories.
	pg.connect(conString, function(err, client, done) {
 		if(err) {
    		return console.error('error fetching client from pool', err);
  		}

  		client.query('SELECT * FROM  category', function(err, result) {
    		//call `done()` to release the client back to the pool
    		done();

    		if(err) {
				return console.error('error running query', err);
    		}

    		//Variable to save the dynamic count of stores that can be available on the database
    		var storeCatLinkedList = new Array();
    		storeCatLinkedList.length = MAX_NODES;

    		for(var i=0; i < result.rows.length; i++)
    		{
    			if(result.rows[i].category_id === result.rows[i].parent_category_id)
    			{
    				viewData.data.stores.push(
    					{ "category_id" : result.rows[i].category_id,  "name" : result.rows[i].name, "categories" : [], "categoriesLength" : 0 }
    				);
    				storeCatLinkedList[result.rows[i].category_id] = new Array();
    			}
    			else{
    				//Save categories of the respective stores using the parent_category_id as the index.
    				storeCatLinkedList[result.rows[i].parent_category_id].push(result.rows[i].name);
    			}
    		}

    		//Populate categories in the viewData object
    		for(var i=0; i < viewData.data.stores.length ; i++)
    		{
    				//Join the empty template array created in the for above this one ("categories" : []) with the one saved in storeCatLinkedList
    				viewData.data.stores[i].categories = viewData.data.stores[i].categories.concat(storeCatLinkedList[viewData.data.stores[i].category_id]);
    				//Add the number of categories found on this store
    				viewData.data.stores[i].categoriesLength = viewData.data.stores[i].categories.length;
    		}

    		viewData.data.dataLength = viewData.data.stores.length;

    		response.render('home.jade', viewData);
  		});
	});

});

app.get('/home',function(req, res ) {

	console.log("GET : home");

	//QUERY DB for products to display in the front page
	pg.connect(conString, function(err, client, done) {
 		if(err) {
    		return console.error('error fetching client from pool', err);
  		}

  		client.query('SELECT * FROM sale_product, (select category_id,name as category_name, parent_category_id from category )as newcat WHERE sale_product.category_id = newcat.category_id',

  			function(err, result) {
    		//call `done()` to release the client back to the pool
    		done();

    		if(err) {
				return console.error('error running query', err);
    		}
    		console.log(result.rows);

    		var temp = {"items" : result.rows};
			res.json(temp);
  		});
	});


} );


app.get('/stores/:store/:category' , function(req, res){

	var store = req.params.store;
	var category = req.params.category;

	console.log("GET: store = "+store +" category: "+category);



});

app.get('/stores/:store' , function(req, res){

	var store = req.params.store;
	console.log("GET: store = "+store);
	//QUERY DB for products to display in the individual store pages
	pg.connect(conString, function(err, client, done) {
 		if(err) {
    		return console.error('error fetching client from pool', err);
  		}

  		client.query('SELECT * FROM sale_product, (select category_id,name as category_name, parent_category_id from category )as newcat WHERE sale_product.category_id = newcat.category_id AND parent_category_id = $1', [store],

  			function(err, result) {
    		//call `done()` to release the client back to the pool
    		done();

    		if(err) {
				return console.error('error running query', err);
    		}
    		console.log(result.rows);

    		var temp = {"items" : result.rows};
			res.json(temp);
  		});
	});



});

app.get("/item/:store/:itemId", function(req,res) {
	var store = req.params.store;
	var itemId = req.params.itemId;
	console.log("GET : Load Item "+store);
	res.json(new StoreItem("Lancer Evolution HALTECH flash ECU","empty" ,  "COMPUTER_STORE", "4000" ,
			 "onevkbdnv, new description woot woot wooto owtoo", "97",
			 "http://www.sonicperformance.com.au/productimages/HT051340.jpg", "90124") );
});




// app.get('/computerStore', function(req, res){
// 	console.log("GET : computersStore");

// 	var data =  new Array(

// 		new StoreItem("MacBookPro", "LAPTOPS_CATEGORY", "$1,200.00", "A Macbook Pro laptop", "97",
// 			"http://images.apple.com/macbook-pro/images/overview_display_hero.png")

// 		);
// 	var temp = {"items" : data};
// 	response.json(temp);
// });
var userNextId = 0;
var userList = new Array(
	new User("Andres", "Malines", "b", "andres.malines@upr.edu")
);

for (var i = 0; i<userList.length; i++) {
	userList[i].shoppingID[i]=userNextId++;
}

var shoppingCartVar =  new Array(

		new StoreItem("Lancer Evolution HALTECH flash ECU","empty" ,  "COMPUTER_STORE", "4000" ,
			 "onevkbdnv, new description woot woot wooto owtoo", "97",
			 "http://www.sonicperformance.com.au/productimages/HT051340.jpg", "90124"),

		new StoreItem("Avenged 7fold LBC", stores.ELECTRONICS.name , stores.ELECTRONICS.categories.AUDIO.name , "40" ,
			 "Rock on with Avenged Sevenfold in Long Beach", "97",
			 "http://userserve-ak.last.fm/serve/_/82208421/Avenged+Sevenfold+original.png", "1345246"),

		new StoreItem("HTC ONE", stores.ELECTRONICS.name, stores.ELECTRONICS.categories.PHONE.name, "500" ,
			 "BEST PHONE EVER", "97",
			 "http://www.htc.com/managed-assets/shared/desktop/smartphones/htc-one/hero/HTC-ProductDetail-Hero-slide-04.png", "25326")


		);
var placedBidsVar = new Array(
		new StoreItem("MacBookPro", stores.COMPUTERS.name, stores.COMPUTERS.categories.LAPTOPS.name, "1,200.00", "A Macbook Pro laptop", "97",
			"http://images.apple.com/macbook-pro/images/overview_display_hero.png", "1221"),

			new StoreItem("iMac", stores.COMPUTERS.name, stores.COMPUTERS.categories.DESKTOPS.name, "1,299.00", "A Macbook Pro laptop", "97",
				"https://www.apple.com/imac/images/hero.png", "0921"),

			new StoreItem("iPad", stores.COMPUTERS.name, stores.COMPUTERS.categories.TABLETS.name, "1,299.00", "A Macbook Pro laptop", "97",
				"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ8uL0T_OaIHUI7rEe0U8qvwP5VBszJsJzMX5Fj73jGFHH1STcJy1OiRHjj", "9281"),

			new StoreItem("Inkjet", stores.COMPUTERS.name, stores.COMPUTERS.categories.PRINTERS.name, "1,299.00", "A clumsy printer", "97",
				"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSLHnGBsoKgsKNoRuISGtzZL0sGQoiRjatOll5Nnwop2UX0EmsOUw", "817")
	);

var itemsSellingVar = new Array(

		new StoreItem("MacBookPro", stores.COMPUTERS.name, stores.COMPUTERS.categories.LAPTOPS.name, "1,200.00", "A Macbook Pro laptop", "97",
			"http://images.apple.com/macbook-pro/images/overview_display_hero.png", "1221"),

		new StoreItem("Avenged 7fold LBC", stores.ELECTRONICS.name , stores.ELECTRONICS.categories.AUDIO.name , "40" ,
			 "Rock on with Avenged Sevenfold in Long Beach", "97",
			 "http://userserve-ak.last.fm/serve/_/82208421/Avenged+Sevenfold+original.png", "1345246")
	);

app.get('/shoppingCart', function(req, res){

	//QUERY DB
	console.log("GET: ShoppingCart");
	var temp = {"items" : shoppingCartVar};
	res.json(temp);
});

app.get('/placedBids', function(req, res) {

	console.log("GET : PlacedBids");
	var temp = {'items' : placedBidsVar};
	res.json(temp);
});

app.get('/itemsSelling', function(req, res){

	console.log("GET : ItemsSelling");
	var temp = {'items' : itemsSellingVar};
	res.json(temp);
});

app.get("/itemsSold", function(req, res){

	console.log("GET : Load itemsSold");
	//Should response with a list of up to 10 invoices at a time. Every time the user hits the "Load more" button
	pseudoQueryItemsSold(res);
});


app.get("/search/:query", function(req, res)  {
	var query = req.params.query;
	console.log("GET: query= "+query);
	res.json(true);
});


app.put("/userLogin", function(req, res){

        
    console.log("POST  : Login");
    console.log(req.body.hasOwnProperty('emailAddress'));
    var password = req.body.password;
    var email = req.body.emailAddress;
        
    console.log(email);
    console.log(password);
  	var client = new pg.Client(conString);
 	client.connect();
  

    var query = client.query("SELECT email_address, password from web_user where (web_user.email_address = $1 AND web_user.password = $2)", [email, password]);
    
    query.on("row", function (row, result) {
    	result.addRow(row);

    });

    query.on("end", function (result) {
    	var len = result.rows.length;
    	if (len==0) {
    		res.statusCode = 401;
    		res.send("There was an error with your e-mail/password combination.");
     	}

      	else {
        	loggedIn = true;
        	res.json(true);
        	
     	 }
      	
      	client.end();

    });

});


// REST Operation - HTTP PUT to update a bid
app.put("/placedBids/item:id", function(req, res){
	var id = req.params.id;
		console.log("PUT ITEM: " +id);
	if((id < 0)){
		res.statusCode = 404;
		res.send("Item not found");
	}

	else {
		var target = -1;
		for (var i=0; i<placedBidsVar.length; ++i) {
			if(placedBidsVar[i].id === id) {
				target = i;
				break;
			}
		}
		if (target ==-1) {
			res.statusCode = 404;
			res.send("Item not foud");
		}

		else {
			var theItem = placedBidsVar[target];
			theItem += req.body.price;
			var response = {"item": theItem};
			res.json(response);
		}
	}
});

// REST Operation - HTTP POST to sign Out
app.put("/signOut", function(req, res){
	loggedIn = false;
	res.json(true);
});



app.del("/shoppingCart/delete/:id", function(req, res){
	var id = req.params.id;
	console.log("DEL: id= " +id);

	for (var i = 0 ; i < shoppingCartVar.length ; i++){
		if(shoppingCartVar[i].id === id)
			shoppingCartVar.splice(i, 1);
	}
	res.json(true);

});


// REST Operation - HTTP POST to add a new user
app.post('/register/newUser', function(req, res) {
	console.log("POST : newUser");

	if(!req.body.hasOwnProperty('fname') || !req.body.hasOwnProperty('lname')
  		|| !req.body.hasOwnProperty('password')  || !req.body.hasOwnProperty('emailAddress') ){
    	res.statusCode = 400;
    	return res.send('Error: Missing fields for user registration.');
  	}

  	if(req.body.password != req.body.confirmPassword) {
  		res.statusCode = 400;
  		return res.send("Error: Password doesn't match");
	}
  	var newUser = new User( req.body.fname, req.body.lname, req.body.password, req.body.emailAddress);
  	console.log("New User: " + JSON.stringify(newUser));
  	newUser.id = userNextId++;
  	userList.push(newUser);
  	res.json(true);
});

app.post('/addStore/storeName/:storeName', function(req, res){
	var storeToAdd = req.params.storeName;
	generate.data.stores.push(
		{
			"name" : storeToAdd,
			"categories" : [],
			"categoriesLength" : 0
		});
	console.log(generate);
	res.json(true);
});

app.del("/removeStore/storeName/:storeName", function(req, res){
	var storeToRemove = req.params.storeName;
	console.log("DELETE: "+storeToRemove);
	for(var i = 0 ; i < generate.data.dataLength; i++){
		if(generate.data.stores[i].name === storeToRemove)
		{
			generate.data.stores.splice(i,1);
			break;
		}

	}
	res.json(true);
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

app.post('/newItem', function(req, res){
	var newItem = new StoreItem(req.body.iName, stores.ELECTRONICS.name, stores.ELECTRONICS.categories.TV.name, req.body.iPrice, req.body.iDescript, "","", "91347");
	data.push(newItem);
	res.json(true);
});
