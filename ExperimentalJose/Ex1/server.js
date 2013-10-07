var express = require('express');
var http    = require('http');
var app     = express();
var item = require("./public/js/objects.js");
var StoreItem = item.StoreItem;
var user = require("./public/js/user.js");
var User = user.User;

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

	var generate = { "data" :{ 
			"stores" : [
				{	"name" : "electronics" ,
			 		"categories" : ["tv" , "audio" , "camera" , "phone" , "video"], 
			 		"categoriesLength" : 5 
			 	},

				{ 	"name" : "books" ,
					"categories" : ["fiction" , "business" , "children" , "technology"],
					"categoriesLength" : 4
				},

				{
					"name" : "computers",
					"categories" : ["laptops", "desktops", "tablets", "printers"],
					"categoriesLength" : 4
				},

				{
					"name" : "clothing",
					"categories" : ["children", "men", "women"],
					"categoriesLength" : 3
				},

				// {
				// 	"name" : "clothing",
				// 	"categories" : [
				// 		{
				// 			"name" : "children",
				// 			"subcategories" :[""],
				// 			"subcategoriesLength" : 0
				// 		},

				// 		{
				// 			"name" : "men",
				// 			"subcategories" :["shirts", "pants", "socks"],
				// 			"subcategoriesLength" : 3
				// 		},

				// 		{
				// 			"name" : "women",
				// 			"subcategories" :["shirts", "pants", "dresses"],
				// 			"subcategoriesLength" : 3
				// 		}
				// 		],

				// 		"categoriesLength" : 4
				// },

				{	"name" : "shoes",
					"categories" : ["children" , "men" , "women"],
					"categoriesLength" : 3
				},

				{
					"name" : "sports",
					"categories" : ["bicycles" , "fishing" , "baseball" , "golf", "basketball"],
					"categoriesLength" : 5
				}

				],
			"dataLength" : 6
		},
		"loggedIn" : false, 
		"isAdmin" : true
	} ;
	response.render('home.jade', generate);

	//response.sendfile('public/home.html');
});

app.get('/home',function(req, res ) {

	console.log("GET : home");

		//QUERY DB
	var data =  new Array(

		new StoreItem("Samsung F8000 High Def TV",stores.ELECTRONICS.name , stores.ELECTRONICS.categories.TV.name, "$4,000" ,
			 "onevkbdnv, new description woot woot wooto owtoo", "97", 
			 "http://pinoytutorial.com/techtorial/wp-content/uploads/2013/01/Samsung-F8000-led-ces.jpg"),

		new StoreItem("Justin Bieber Album", stores.ELECTRONICS.name ,stores.ELECTRONICS.categories.AUDIO.name, "$40" ,
			 "onevkbdnv, new description woot woot wooto owtoo", "97", 
			 "http://25.media.tumblr.com/tumblr_lsj02rFcmz1qh2d1ho1_500.jpg"),

		new StoreItem("HTC ONE", stores.ELECTRONICS.name ,stores.ELECTRONICS.categories.PHONE.name, "$500" ,
			 "BEST PHONE EVER", "97", 
			 "http://www.htc.com/managed-assets/shared/desktop/smartphones/htc-one/hero/HTC-ProductDetail-Hero-slide-04.png"),

		new StoreItem("Nikon somethin", stores.ELECTRONICS.name ,stores.ELECTRONICS.categories.CAMERA.name, "$3,400" ,
			 "40,000 Mega Pixel camera ", "97", 
			 "http://swotti.starmedia.com/tmp/swotti/cacheBMLRB24GZDQW/imgNikon%20D403.jpg"),

		new StoreItem("Top Gear season 300", stores.ELECTRONICS.name , stores.ELECTRONICS.categories.VIDEO.name, "$300" ,
			 "Catch your favorite TV stars in their latest car journey", "97", 
			 "https://lh6.googleusercontent.com/-nNyrLwWbpOE/Uh_YB_QPLII/AAAAAAAAADE/zeBzioai3xM/Jeremy-Clarkson-In-Ariel-Atom-AHHHHHHH-bbc-america-top-gear-10491170-480-331.jpg"),

		// BOOKS

		new StoreItem("Star Wars old republic ", stores.BOOKS.name , stores.BOOKS.categories.FICTION.name, "$30" ,
			 "Catch your favorite TV stars in their latest car journey", "97", 
			 "http://notentirelystable.org/wp-content/uploads/2011/06/logo-galactic-republic.png"),

		new StoreItem("Hairy Potter ", stores.BOOKS.name , stores.BOOKS.categories.CHILDREN.name, "$30" ,
			 "Catch your favorite TV stars in their latest car journey", "97", 
			 "http://fc02.deviantart.net/fs70/i/2010/125/b/6/Harry_Potter_Logo_by_SprntrlFAN_Livvi.png"),
		
		// COMPUTERS
		
		new StoreItem("MacBookPro", stores.COMPUTERS.name, stores.COMPUTERS.categories.LAPTOPS.name, "$1,200.00", "A Macbook Pro laptop", "97", 
			"http://images.apple.com/macbook-pro/images/overview_display_hero.png"),

		new StoreItem("iMac", stores.COMPUTERS.name, stores.COMPUTERS.categories.DESKTOPS.name, "$1,299.00", "A Macbook Pro laptop", "97", 
			"https://www.apple.com/imac/images/hero.png"),

		new StoreItem("iMac", stores.COMPUTERS.name, stores.COMPUTERS.categories.TABLETS.name, "$1,299.00", "A Macbook Pro laptop", "97", 
			"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ8uL0T_OaIHUI7rEe0U8qvwP5VBszJsJzMX5Fj73jGFHH1STcJy1OiRHjj"),

		new StoreItem("Inkjet", stores.COMPUTERS.name, stores.COMPUTERS.categories.PRINTERS.name, "$1,299.00", "A clumsy printer", "97", 
			"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSLHnGBsoKgsKNoRuISGtzZL0sGQoiRjatOll5Nnwop2UX0EmsOUw"),

		// CLOTHING
		new StoreItem("Puma - Kids Girls 2-6X Active Core Pullover", stores.CLOTHING.name, stores.CLOTHING.categories.CHILDREN.name, "$52.00", "A Puma jacket made in China", "97", 
			"http://resources.shopstyle.com/sim/1f/6f/1f6fac5c0ff3148029fe5fc2a184161f/puma-amazoncom-kids-girls-26x-active-core-pullover.jpg"),

		new StoreItem("Nautica Men's Big-Tall Wrinkle Resistant Long Sleeve Tartan Woven", stores.CLOTHING.name, stores.CLOTHING.categories.MEN.name, "$52.00", "Long Sleeve Shirt by Nautica", "97", 
			"http://ecx.images-amazon.com/images/I/51Onkkr85lL._SY246_CR0,0,190,246_.jpg"),

		new StoreItem("Designer White Strapless Long Evening Formal Dress", stores.CLOTHING.name, stores.CLOTHING.categories.WOMEN.name, "$49.99", "Hot and Sexy Designer White Strapless Long Evening Formal Dress", "97", 
			"http://ecx.images-amazon.com/images/I/311HhlaB1pL.jpg"),
		// SHOES 

			new StoreItem("Women's Jolt", stores.SHOES.name, stores.SHOES.categories.WOMEN.name, "$99.99" ,
			 "Look fashion forward in the Chinese Laundry Jolt dress sandals.", "98", 
			 "http://www.shoes.com/ProductImages/shoes_iaec1372292.jpg"),

			new StoreItem("Sperry Top-Sider" , stores.SHOES.name,  stores.SHOES.categories.MEN.name, "$40" ,
				 "Classic Nautical Style", "95", 
				 "http://a2.zassets.com/images/z/2/1/7/0/7/3/2170731-p-MULTIVIEW.jpg"), 


			new StoreItem("Women's Dantie",  stores.SHOES.name,  stores.SHOES.categories.WOMEN.name, "$500" ,
				 "Add a little edge to your flirty side wearing these Chinese Laundry Dantie booties.", "94", 
				 "http://www.shoes.com/ProductImages/shoes_iaec1239887.jpg"),

			new StoreItem("Onitsuka Tiger by Fencis" ,  stores.SHOES.name,  stores.SHOES.categories.MEN.name, "$80" ,
				 "Awesome running shoes. ", "97", 
				 "http://a3.zassets.com/images/z/1/8/4/7/3/9/1847391-p-MULTIVIEW.jpg"), 

			new StoreItem("Pom Pom Ballet Flat",  stores.SHOES.name ,  stores.SHOES.categories.CHILDREN.name, "$50" ,
				 "Have your little girl look fabulous in these flats!", "90", 
				 "http://content.childrensplace.com/www/b/TCP/images/cloudzoom/p/069942_p.jpg"),

		// SPORTS

		new StoreItem("Spalding San Antonio Spurs Basketball", stores.SPORTS.name, stores.SPORTS.categories.BASKETBALL.name, "$14.95" ,
					 "This item only comes in one size", "100", 
					 "http://nba.frgimages.com/FFImage/thumb.aspx?i=/productimages/_566000/altimages/FF_566091ALT2_xl.jpg&w=600"),

		new StoreItem("Cabela's Spinning Rod", stores.SPORTS.name, stores.SPORTS.categories.FISHING.name, "$40" ,
			 "Improved graphite reel seats with padded hoods", "96", 
			 "http://images.cabelas.com/is/image/cabelas/s7_124944_999_01?rgn=0,0,2000,114&scl=5.2631578947368425&fmt=jpeg&id=0IPjgJqgU-LC772loJnLMn"), 

		new StoreItem("Vuelta Corsa SLR Road Wheelset", stores.SPORTS.name, stores.SPORTS.categories.BICYCLES.name, "$500" ,
			 "Ideal for racing and serious training.", "94", 
			 "http://media.nashbar.com/images/nashbar/products/250/VL-CSLR-NCL-PAIR.jpg"),

		new StoreItem("St. Louis Cardinals Authentic Yadier Molina Home Cool Base Jersey",stores.SPORTS.name, stores.SPORTS.categories.BASEBALL.name, "$380" ,
			 "Just like the Big Leaguers. ", "97", 
			 "http://mlb.imageg.net/graphics/product_images/pMLB2-15819162dt.jpg"), 

		new StoreItem("Summer Series Spikeless Golf Shoes", stores.SPORTS.name, stores.SPORTS.categories.GOLF.name, "$190" ,
			 "Features a super-soft upper blend combined with ultra-cushioned midsoles to create pillows for your feet.", "45", 
			 "http://www.golfsmith.com/images/30081268_thm.jpg"),

		new StoreItem("MacBookPro", "TEst", "LAPTOPS_CATEGORY", "$1,200.00", "A Macbook Pro laptop", "97", 
			"http://images.apple.com/macbook-pro/images/overview_display_hero.png")
		);
		
	var temp = {"items" : data};
	res.json(temp);

} );


app.get('/stores/:store/:category' , function(req, res){

	var store = req.params.store;
	var category = req.params.category;

	console.log("GET: store = "+store +" category: "+category); 

	pseudoQueryCategories(store, category, res);

});

app.get('/stores/:store' , function(req, res){

	var store = req.params.store;
	console.log("GET: store = "+store); 

	pseudoQueryStores(store, res);

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


// REST Operation - HTTP GET to login
app.get("/userLogin", function(req, res){
	var response = {"user" : userList};
	loggedIn = true;
	res.json(response);
	// console.log("GET  : Login");
	// console.log(req.body.hasOwnProperty('emailAddress'));
	
	// var email = new String(req.body.userEmail);
	// var password = new String(req.body.userPassword);
	
	// var target = -1;
	// for(var i =0; i<userList.length; i++) {
	// 	var userEmail = userList[i].emailAddress;
	// 	var userPassword = userList[i].password;
	// 	console.log(i);
	// 	console.log(userEmail);
	// 	console.log(userPassword);

	// 	if (userEmail == email ){
	// 		target = i;
	// 		break;
	// 	}
	// }
	// if(target==-1){
	// 	res.statusCode = 401;
	// 	res.send("There was an error with your e-mail/password combination.");

	// }
	// else {
	// 	var response = {"user" : userList[target]};
	// 	res.json(response);
	// }
	
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
			theItem = req.body.price;
			var response = {"item": theItem};
			res.json(response);
		} 
	}
});


// REST Operation - HTTP Post to add a new item to Computer Store


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

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

//This function is just a placeholder for what will actually be the query to the db. Right now we
//need to make this IFs structure to differentiate between the hard wired stores
function pseudoQueryStores(store, res){

	if(store === stores.ELECTRONICS.name){
		var data =  new Array(
			new StoreItem("Samsung F8000 High Def TV", stores.ELECTRONICS.name , stores.ELECTRONICS.categories.TV.name, "$4,000" ,
				 "onevkbdnv, new description woot woot wooto owtoo", "97", 
				 "http://pinoytutorial.com/techtorial/wp-content/uploads/2013/01/Samsung-F8000-led-ces.jpg", "34135"),

			new StoreItem("Justin Bieber Album", stores.ELECTRONICS.name ,stores.ELECTRONICS.categories.AUDIO.name, "$40" ,
				 "onevkbdnv, new description woot woot wooto owtoo", "97", 
				 "http://25.media.tumblr.com/tumblr_lsj02rFcmz1qh2d1ho1_500.jpg", "215643"), 

			new StoreItem("HTC ONE", stores.ELECTRONICS.name ,stores.ELECTRONICS.categories.PHONE.name, "$500" ,
				 "BEST PHONE EVER", "97", 
				 "http://www.htc.com/managed-assets/shared/desktop/smartphones/htc-one/hero/HTC-ProductDetail-Hero-slide-04.png", "124546"),

			new StoreItem("Nikon somethin",stores.ELECTRONICS.name , stores.ELECTRONICS.categories.CAMERA.name, "$3,400" ,
				 "40,000 Mega Pixel camera ", "97", 
				 "http://swotti.starmedia.com/tmp/swotti/cacheBMLRB24GZDQW/imgNikon%20D403.jpg", "54736"), 

			new StoreItem("Top Gear season 300", stores.ELECTRONICS.name , stores.ELECTRONICS.categories.VIDEO.name, "$300" ,
				 "Catch your favorite TV stars in their latest car journey", "97", 
				 "https://lh6.googleusercontent.com/-nNyrLwWbpOE/Uh_YB_QPLII/AAAAAAAAADE/zeBzioai3xM/Jeremy-Clarkson-In-Ariel-Atom-AHHHHHHH-bbc-america-top-gear-10491170-480-331.jpg","34564")

			);
		var temp = {"items" : data};
		res.json(temp);
	}
	else if(store === stores.BOOKS.name){

		var data =  new Array(
			new StoreItem("Star Wars old republic ", stores.BOOKS.name , stores.BOOKS.categories.FICTION.name, "$30" ,
			 "Catch your favorite TV stars in their latest car journey", "97", 
			 "http://notentirelystable.org/wp-content/uploads/2011/06/logo-galactic-republic.png", "57653"),

			new StoreItem("Hairy Potter ", stores.BOOKS.name , stores.BOOKS.categories.CHILDREN.name, "$30" ,
				 "Catch your favorite TV stars in their latest car journey", "97", 
			 	"http://fc02.deviantart.net/fs70/i/2010/125/b/6/Harry_Potter_Logo_by_SprntrlFAN_Livvi.png","457568")

		);
		var temp = {"items" : data};
		res.json(temp);

	}
	else if(store === stores.COMPUTERS.name) {
		var data = new Array (
			new StoreItem("MacBookPro", stores.COMPUTERS.name, stores.COMPUTERS.categories.LAPTOPS.name, "$1,200.00", "A Macbook Pro laptop", "97", 
			"http://images.apple.com/macbook-pro/images/overview_display_hero.png"),

			new StoreItem("iMac", stores.COMPUTERS.name, stores.COMPUTERS.categories.DESKTOPS.name, "$1,299.00", "A Macbook Pro laptop", "97", 
				"https://www.apple.com/imac/images/hero.png"),

			new StoreItem("iMac", stores.COMPUTERS.name, stores.COMPUTERS.categories.TABLETS.name, "$1,299.00", "A Macbook Pro laptop", "97", 
				"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ8uL0T_OaIHUI7rEe0U8qvwP5VBszJsJzMX5Fj73jGFHH1STcJy1OiRHjj"),

			new StoreItem("Inkjet", stores.COMPUTERS.name, stores.COMPUTERS.categories.PRINTERS.name, "$1,299.00", "A clumsy printer", "97", 
				"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSLHnGBsoKgsKNoRuISGtzZL0sGQoiRjatOll5Nnwop2UX0EmsOUw")
			);

		var temp = {"items" : data};
		res.json(temp);
	}
	else if(store === stores.CLOTHING.name) {
		var data = new Array(
			new StoreItem("Puma - Kids Girls 2-6X Active Core Pullover", stores.CLOTHING.name, stores.CLOTHING.categories.CHILDREN.name, "$52.00", "A Puma jacket made in China", "97", 
			"http://resources.shopstyle.com/sim/1f/6f/1f6fac5c0ff3148029fe5fc2a184161f/puma-amazoncom-kids-girls-26x-active-core-pullover.jpg"),

		new StoreItem("Nautica Men's Big-Tall Wrinkle Resistant Long Sleeve Tartan Woven", stores.CLOTHING.name, stores.CLOTHING.categories.MEN.name, "$52.00", "Long Sleeve Shirt by Nautica", "97", 
			"http://ecx.images-amazon.com/images/I/51Onkkr85lL._SY246_CR0,0,190,246_.jpg"),

		new StoreItem("Designer White Strapless Long Evening Formal Dress", stores.CLOTHING.name, stores.CLOTHING.categories.WOMEN.name, "$49.99", "Hot and Sexy Designer White Strapless Long Evening Formal Dress", "97", 
			"http://ecx.images-amazon.com/images/I/311HhlaB1pL.jpg")
		);

		var temp = {"items" : data};
		res.json(temp);

	}
	else if(store === stores.SHOES.name){

		var data = new Array(
			new StoreItem("Women's Jolt", stores.SHOES.name, stores.SHOES.categories.WOMEN.name, "$99.99" ,
			 "Look fashion forward in the Chinese Laundry Jolt dress sandals.", "98", 
			 "http://www.shoes.com/ProductImages/shoes_iaec1372292.jpg", "5484571"),

			new StoreItem("Sperry Top-Sider" , stores.SHOES.name,  stores.SHOES.categories.MEN.name, "$40" ,
				 "Classic Nautical Style", "95", 
				 "http://a2.zassets.com/images/z/2/1/7/0/7/3/2170731-p-MULTIVIEW.jpg","53278874"), 

			new StoreItem("Women's Dantie",  stores.SHOES.name,  stores.SHOES.categories.WOMEN.name, "$500" ,
				 "Add a little edge to your flirty side wearing these Chinese Laundry Dantie booties.", "94", 
				 "http://www.shoes.com/ProductImages/shoes_iaec1239887.jpg", "89625"),

			new StoreItem("Onitsuka Tiger by Fencis" ,  stores.SHOES.name,  stores.SHOES.categories.MEN.name, "$80" ,
				 "Awesome running shoes. ", "97", 
				 "http://a3.zassets.com/images/z/1/8/4/7/3/9/1847391-p-MULTIVIEW.jpg", "8935315"), 

			new StoreItem("Pom Pom Ballet Flat",  stores.SHOES.name ,  stores.SHOES.categories.CHILDREN.name, "$50" ,
				 "Have your little girl look fabulous in these flats!", "90", 
				 "http://content.childrensplace.com/www/b/TCP/images/cloudzoom/p/069942_p.jpg", "12463454")


		);

		var temp = {"items" : data};
		res.json(temp);

	}
	else if(store === stores.SPORTS.name){
			var data = new Array(
				new StoreItem("Spalding San Antonio Spurs Basketball", stores.SPORTS.name, stores.SPORTS.categories.BASKETBALL.name, "$14.95" ,
					 "This item only comes in one size", "100", 
					 "http://nba.frgimages.com/FFImage/thumb.aspx?i=/productimages/_566000/altimages/FF_566091ALT2_xl.jpg&w=600", "46354"),

				new StoreItem("Cabela's Spinning Rod", stores.SPORTS.name, stores.SPORTS.categories.FISHING.name, "$40" ,
					 "Improved graphite reel seats with padded hoods", "96", 
					 "http://images.cabelas.com/is/image/cabelas/s7_124944_999_01?rgn=0,0,2000,114&scl=5.2631578947368425&fmt=jpeg&id=0IPjgJqgU-LC772loJnLMn"), 

				new StoreItem("Vuelta Corsa SLR Road Wheelset", stores.SPORTS.name, stores.SPORTS.categories.BICYCLES.name, "$500" ,
					 "Ideal for racing and serious training.", "94", 
					 "http://media.nashbar.com/images/nashbar/products/250/VL-CSLR-NCL-PAIR.jpg","748567"),

				new StoreItem("St. Louis Cardinals Authentic Yadier Molina Home Cool Base Jersey",stores.SPORTS.name, stores.SPORTS.categories.BASEBALL.name, "$380" ,
					 "Just like the Big Leaguers. ", "97", 
					 "http://mlb.imageg.net/graphics/product_images/pMLB2-15819162dt.jpg", "25773"), 

				new StoreItem("Summer Series Spikeless Golf Shoes", stores.SPORTS.name, stores.SPORTS.categories.GOLF.name, "$190" ,
					 "Features a super-soft upper blend combined with ultra-cushioned midsoles to create pillows for your feet.", "45", 
					 "http://www.golfsmith.com/images/30081268_thm.jpg","64387343")
			);
		var temp = {"items" : data};
		res.json(temp);
	}

}

//This function is just a placeholder for what will actually be the query to the db. Right now we
//need to make this IFs structure to differentiate between the hard wired categories
function pseudoQueryCategories(store, category, res){
	// QUERY AND RESPONSE 
	if (store === stores.ELECTRONICS.name){
		var categories = stores.ELECTRONICS.categories;
		if(category == categories.TV.name){
			var data =  new Array(

				new StoreItem("Samsung F8000 High Def TV", stores.ELECTRONICS.name , stores.ELECTRONICS.categories.TV.name, "$4,000" ,
					 "onevkbdnv, new description woot woot wooto owtoo", "97", 
					 "http://pinoytutorial.com/techtorial/wp-content/uploads/2013/01/Samsung-F8000-led-ces.jpg"),

				new StoreItem("Sony BRAVIA 3D ", stores.ELECTRONICS.name , stores.ELECTRONICS.categories.TV.name, "$2,000" ,
					 "Experience 3D like never before in full HD", "93", 
					 "http://www.blogcdn.com/www.engadget.com/media/2010/01/sony-bravia-lx900-6deg-left_md.jpg")

				);
			var temp = {"items" : data};
			res.json(temp);
		}
		else if(category === categories.AUDIO.name){

			var data = new Array (
					new StoreItem("Justin Bieber Album", stores.ELECTRONICS.name ,stores.ELECTRONICS.categories.AUDIO.name, "$40" ,
			 "onevkbdnv, new description woot woot wooto owtoo", "97", 
			 "http://25.media.tumblr.com/tumblr_lsj02rFcmz1qh2d1ho1_500.jpg")
				);
			var temp = {"items" : data};
			res.json(temp);
		}
		else if(category === categories.CAMERA.name){
			var data =  new Array(
				new StoreItem("Nikon somethin", stores.ELECTRONICS.name ,stores.ELECTRONICS.categories.CAMERA.name, "$3,400" ,
					 "40,000 Mega Pixel camera ", "97", 
					 "http://swotti.starmedia.com/tmp/swotti/cacheBMLRB24GZDQW/imgNikon%20D403.jpg")

				);
			var temp = {"items" : data};
			res.json(temp);
		}
		else if(category === categories.PHONE.name){
			var data = new Array (
				new StoreItem("HTC ONE",stores.ELECTRONICS.name , stores.ELECTRONICS.categories.PHONE.name, "$500" ,
					 "BEST PHONE EVER", "97", 
					 "http://www.htc.com/managed-assets/shared/desktop/smartphones/htc-one/hero/HTC-ProductDetail-Hero-slide-04.png")
			);
			var temp = {"items" : data}
			res.json(temp);
		}
		else if(category === categories.VIDEO.name){
			var data = new Array (
					new StoreItem("Top Gear season 300", stores.ELECTRONICS.name , stores.ELECTRONICS.categories.VIDEO.name, "$300" ,
					 "Catch your favorite TV stars in their latest car journey", "97", 
					 "https://lh6.googleusercontent.com/-nNyrLwWbpOE/Uh_YB_QPLII/AAAAAAAAADE/zeBzioai3xM/Jeremy-Clarkson-In-Ariel-Atom-AHHHHHHH-bbc-america-top-gear-10491170-480-331.jpg")
				);
			var temp = {"items" : data};
			res.json(temp);
		}
	}//ELECTRONICS Store
	else if(store === stores.BOOKS.name){
		var categories = stores.BOOKS.categories;

		if(category === categories.FICTION.name){
			
			var data =  new Array(
				new StoreItem("Star Wars old republic ", stores.BOOKS.name , stores.BOOKS.categories.FICTION.name, "$30" ,
				 "Catch your favorite TV stars in their latest car journey", "97", 
				 "http://notentirelystable.org/wp-content/uploads/2011/06/logo-galactic-republic.png")

			);
			var temp = {"items" : data};
			res.json(temp);

		}
		else if(category === categories.CHILDREN.name){
			
			var data =  new Array(
				new StoreItem("Hairy Potter ", stores.BOOKS.name , stores.BOOKS.categories.CHILDREN.name, "$30" ,
			 "Catch your favorite TV stars in their latest car journey", "97", 
			 "http://fc02.deviantart.net/fs70/i/2010/125/b/6/Harry_Potter_Logo_by_SprntrlFAN_Livvi.png")

			);
			var temp = {"items" : data};
			res.json(temp);

		}
	}// COMPUTER Store
	else if(store === stores.COMPUTERS.name){
		var categories = stores.COMPUTERS.categories;

		if(category === categories.LAPTOPS.name){
			var data = new Array(
				new StoreItem("MacBookPro", stores.COMPUTERS.name, stores.COMPUTERS.categories.LAPTOPS.name, "$1,200.00", "A Macbook Pro laptop", "97", 
				"http://images.apple.com/macbook-pro/images/overview_display_hero.png")

			
				);
			var temp = {"items" : data};
			res.json(temp);
		}

		else if(category === categories.DESKTOPS.name){
			var data = new Array(
				new StoreItem("iMac", stores.COMPUTERS.name, stores.COMPUTERS.categories.DESKTOPS.name, "$1,299.00", "A Macbook Pro laptop", "97", 
				"https://www.apple.com/imac/images/hero.png")

				);
			var temp = {"items" : data};
			res.json(temp);
		}

		else if(category === categories.TABLETS.name){
			var data = new Array(
				
				new StoreItem("iMac", stores.COMPUTERS.name, stores.COMPUTERS.categories.TABLETS.name, "$1,299.00", "A Macbook Pro laptop", "97", 
					"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ8uL0T_OaIHUI7rEe0U8qvwP5VBszJsJzMX5Fj73jGFHH1STcJy1OiRHjj")
			
				);
			var temp = {"items" : data};
			res.json(temp);
		}
		else if(category === categories.PRINTERS.name){
			var data = new Array(
				new StoreItem("Inkjet", stores.COMPUTERS.name, stores.COMPUTERS.categories.PRINTERS.name, "$1,299.00", "A clumsy printer", "97", 
					"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSLHnGBsoKgsKNoRuISGtzZL0sGQoiRjatOll5Nnwop2UX0EmsOUw")
				
				);
			var temp = {"items" : data};
			res.json(temp);
		}
	}// CLOTHING Store
	else if(store === stores.CLOTHING.name){

		var categories = stores.CLOTHING.categories;
		
		if (category === categories.CHILDREN.name) {
			var data = new Array(
				new StoreItem("Puma - Kids Girls 2-6X Active Core Pullover", stores.CLOTHING.name, stores.CLOTHING.categories.CHILDREN.name, "$52.00", "A Puma jacket made in China", "97", 
				"http://resources.shopstyle.com/sim/1f/6f/1f6fac5c0ff3148029fe5fc2a184161f/puma-amazoncom-kids-girls-26x-active-core-pullover.jpg")
				);
			
			var temp = {"items" : data};
			res.json(temp);
		}
		else if (category === categories.MEN.name) {
			var data = new Array( 
				new StoreItem("Nautica Men's Big-Tall Wrinkle Resistant Long Sleeve Tartan Woven", stores.CLOTHING.name, stores.CLOTHING.categories.MEN.name, "$52.00", "Long Sleeve Shirt by Nautica", "97", 
					"http://ecx.images-amazon.com/images/I/51Onkkr85lL._SY246_CR0,0,190,246_.jpg")
				);
			var temp = {"items" : data};
			res.json(temp);

		
		}
		else if(category === categories.WOMEN.name) {
			var data = new Array(

				new StoreItem("Designer White Strapless Long Evening Formal Dress", stores.CLOTHING.name, stores.CLOTHING.categories.WOMEN.name, "$49.99", "Hot and Sexy Designer White Strapless Long Evening Formal Dress", "97", 
					"http://ecx.images-amazon.com/images/I/311HhlaB1pL.jpg")
				);
			var temp = {"items" : data};
			res.json(temp);
		}
	}
	else if(store === stores.SHOES.name){
		var categories = stores.SHOES.categories;
		if(category === categories.MEN.name){
			var data = new Array(
				new StoreItem("Sperry Top-Sider" , stores.SHOES.name,  stores.SHOES.categories.MEN.name, "$40" ,
				 "Classic Nautical Style", "95", 
				 "http://a2.zassets.com/images/z/2/1/7/0/7/3/2170731-p-MULTIVIEW.jpg"), 

				new StoreItem("Onitsuka Tiger by Fencis" ,  stores.SHOES.name,  stores.SHOES.categories.MEN.name, "$80" ,
				 "Awesome running shoes. ", "97", 
				 "http://a3.zassets.com/images/z/1/8/4/7/3/9/1847391-p-MULTIVIEW.jpg")
				);
			var temp = {"items" : data};
			res.json(temp);
		}
		else if(category === categories.WOMEN.name){
			var data = new Array(
				new StoreItem("Women's Dantie",  stores.SHOES.name,  stores.SHOES.categories.WOMEN.name, "$500" ,
				 "Add a little edge to your flirty side wearing these Chinese Laundry Dantie booties.", "94", 
				 "http://www.shoes.com/ProductImages/shoes_iaec1239887.jpg"),	

				new StoreItem("Women's Dantie",  stores.SHOES.name,  stores.SHOES.categories.WOMEN.name, "$500" ,
				 "Add a little edge to your flirty side wearing these Chinese Laundry Dantie booties.", "94", 
				 "http://www.shoes.com/ProductImages/shoes_iaec1239887.jpg")
				);
			var temp = {"items" : data};
			res.json(temp);
		}
		else if(category === categories.CHILDREN.name){
			var data = new Array(
				new StoreItem("Pom Pom Ballet Flat",  stores.SHOES.name ,  stores.SHOES.categories.CHILDREN.name, "$50" ,
				 "Have your little girl look fabulous in these flats!", "90", 
				 "http://content.childrensplace.com/www/b/TCP/images/cloudzoom/p/069942_p.jpg")
				);
			var temp = {"items" : data};
			res.json(temp);
		}
	}
}

function pseudoQueryItemsSold(res){
		var data = new Array(
				new StoreItem("Pom Pom Ballet Flat",  stores.SHOES.name ,  stores.SHOES.categories.CHILDREN.name, "$50" ,
				 "Have your little girl look fabulous in these flats!", "90", 
				 "http://content.childrensplace.com/www/b/TCP/images/cloudzoom/p/069942_p.jpg")
				);
		var temp = {"items" : data};
		res.json(temp);
}
