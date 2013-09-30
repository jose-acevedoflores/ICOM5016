var express = require('express');
var http    = require('http');
var app     = express();
var item = require("./public/js/objects.js");
var StoreItem = item.StoreItem;

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
	}
};



app.configure(function(){
	app.set('port', process.env.PORT || 4000);
	app.set('public', __dirname + '/public');
	app.use(express.static(__dirname + '/public'));
	app.use(express.static(__dirname + '/views'));
});


app.get('/', function(request, response) {

	response.render('home.jade');

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

		new StoreItem("Star Wars old republic ", stores.BOOKS.name , stores.BOOKS.categories.FICTION.name, "$30" ,
			 "Catch your favorite TV stars in their latest car journey", "97", 
			 "http://notentirelystable.org/wp-content/uploads/2011/06/logo-galactic-republic.png"),

		new StoreItem("Hairy Potter ", stores.BOOKS.name , stores.BOOKS.categories.CHILDREN.name, "$30" ,
			 "Catch your favorite TV stars in their latest car journey", "97", 
			 "http://fc02.deviantart.net/fs70/i/2010/125/b/6/Harry_Potter_Logo_by_SprntrlFAN_Livvi.png"),


		
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

app.get('/shoppingCart', function(req, res){

	//QUERY DB
	var data =  new Array(

		new StoreItem("Lancer Evolution HALTECH flash ECU","empty" ,  "COMPUTER_STORE", "$4,000" ,
			 "onevkbdnv, new description woot woot wooto owtoo", "97", 
			 "http://www.sonicperformance.com.au/productimages/HT051340.jpg"),

		new StoreItem("Avenged 7fold LBC","empty" , "AUDIO_STORE", "$40" ,
			 "Rock on with Avenged Sevenfold in Long Beach", "97", 
			 "http://userserve-ak.last.fm/serve/_/82208421/Avenged+Sevenfold+original.png"), 

		new StoreItem("HTC ONE", "empty","PHONE_STORE", "$500" ,
			 "BEST PHONE EVER", "97", 
			 "http://www.htc.com/managed-assets/shared/desktop/smartphones/htc-one/hero/HTC-ProductDetail-Hero-slide-04.png")


		);
	var temp = {"items" : data};
	res.json(temp);
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
				 "http://pinoytutorial.com/techtorial/wp-content/uploads/2013/01/Samsung-F8000-led-ces.jpg"),

			new StoreItem("Justin Bieber Album", stores.ELECTRONICS.name ,stores.ELECTRONICS.categories.AUDIO.name, "$40" ,
				 "onevkbdnv, new description woot woot wooto owtoo", "97", 
				 "http://25.media.tumblr.com/tumblr_lsj02rFcmz1qh2d1ho1_500.jpg"), 

			new StoreItem("HTC ONE", stores.ELECTRONICS.name ,stores.ELECTRONICS.categories.PHONE.name, "$500" ,
				 "BEST PHONE EVER", "97", 
				 "http://www.htc.com/managed-assets/shared/desktop/smartphones/htc-one/hero/HTC-ProductDetail-Hero-slide-04.png"),

			new StoreItem("Nikon somethin",stores.ELECTRONICS.name , stores.ELECTRONICS.categories.CAMERA.name, "$3,400" ,
				 "40,000 Mega Pixel camera ", "97", 
				 "http://swotti.starmedia.com/tmp/swotti/cacheBMLRB24GZDQW/imgNikon%20D403.jpg"), 

			new StoreItem("Top Gear season 300", stores.ELECTRONICS.name , stores.ELECTRONICS.categories.VIDEO.name, "$300" ,
				 "Catch your favorite TV stars in their latest car journey", "97", 
				 "https://lh6.googleusercontent.com/-nNyrLwWbpOE/Uh_YB_QPLII/AAAAAAAAADE/zeBzioai3xM/Jeremy-Clarkson-In-Ariel-Atom-AHHHHHHH-bbc-america-top-gear-10491170-480-331.jpg")

			);
		var temp = {"items" : data};
		res.json(temp);
	}
	else if(store === stores.BOOKS.name){

		var data =  new Array(
			new StoreItem("Star Wars old republic ", stores.BOOKS.name , stores.BOOKS.categories.FICTION.name, "$30" ,
			 "Catch your favorite TV stars in their latest car journey", "97", 
			 "http://notentirelystable.org/wp-content/uploads/2011/06/logo-galactic-republic.png"),

			new StoreItem("Hairy Potter ", stores.BOOKS.name , stores.BOOKS.categories.CHILDREN.name, "$30" ,
				 "Catch your favorite TV stars in their latest car journey", "97", 
			 	"http://fc02.deviantart.net/fs70/i/2010/125/b/6/Harry_Potter_Logo_by_SprntrlFAN_Livvi.png")

		);
		var temp = {"items" : data};
		res.json(temp);

	}

}

//This function is just a placeholder for what will actually be the query to the db. Right now we
//need to make this IFs structure to differentiate between the hard wired categories
function pseudoQueryCategories(store, category, res)
{
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

		if(category == categories.FICTION.name){
			
			var data =  new Array(
				new StoreItem("Star Wars old republic ", stores.BOOKS.name , stores.BOOKS.categories.FICTION.name, "$30" ,
				 "Catch your favorite TV stars in their latest car journey", "97", 
				 "http://notentirelystable.org/wp-content/uploads/2011/06/logo-galactic-republic.png")

			);
			var temp = {"items" : data};
			res.json(temp);

		}
		else if(category == categories.CHILDREN.name){
			
			var data =  new Array(
				new StoreItem("Hairy Potter ", stores.BOOKS.name , stores.BOOKS.categories.CHILDREN.name, "$30" ,
			 "Catch your favorite TV stars in their latest car journey", "97", 
			 "http://fc02.deviantart.net/fs70/i/2010/125/b/6/Harry_Potter_Logo_by_SprntrlFAN_Livvi.png")

			);
			var temp = {"items" : data};
			res.json(temp);

		}
	}
}