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

//------------------------------- Shoe Store ---------------------------------------------------

app.get('/shoeStore', function(request, response) {

	console.log("GET : shoeStore");

	var data =  new Array(

		new StoreItem("Women's Jolt", "WOMEN_SHOE_STORE", "$99.99" ,
			 "Look fashion forward in the Chinese Laundry Jolt dress sandals.", "98", 
			 "http://www.shoes.com/ProductImages/shoes_iaec1372292.jpg"),

		new StoreItem("Sperry Top-Sider", "MEN_SHOE_STORE", "$40" ,
			 "Classic Nautical Style", "95", 
			 "http://a2.zassets.com/images/z/2/1/7/0/7/3/2170731-p-MULTIVIEW.jpg"), 

		new StoreItem("Women's Dantie", "WOMEN_SHOE_STORE", "$500" ,
			 "Add a little edge to your flirty side wearing these Chinese Laundry Dantie booties.", "94", 
			 "http://www.shoes.com/ProductImages/shoes_iaec1239887.jpg"),

		new StoreItem("Onitsuka Tiger by Fencis", "MEN_SHOE_STORE", "$80" ,
			 "Awesome running shoes. ", "97", 
			 "http://a3.zassets.com/images/z/1/8/4/7/3/9/1847391-p-MULTIVIEW.jpg"), 

		new StoreItem("Pom Pom Ballet Flat", " CHILDREN_SHOE_STORE", "$50" ,
			 "Have your little girl look fabulous in these flats!", "90", 
			 "http://content.childrensplace.com/www/b/TCP/images/cloudzoom/p/069942_p.jpg")

		);
	var temp = {"items" : data};
	response.json(temp);
});

app.get('/womenShoeCategory', function(req, res){
	console.log("GET: womenShoeCategory");
var data =  new Array(

		new StoreItem("Women's Jolt", "WOMEN_SHOE_STORE", "$99.99" ,
			 "Look fashion forward in the Chinese Laundry Jolt dress sandals.", "98", 
			 "http://www.shoes.com/ProductImages/shoes_iaec1372292.jpg"),
			 
		new StoreItem("Women's Dantie", "WOMEN_SHOE_STORE", "$500" ,
			 "Add a little edge to your flirty side wearing these Chinese Laundry Dantie booties.", "94", 
			 "http://www.shoes.com/ProductImages/shoes_iaec1239887.jpg")
			 
		);
	var temp = {"items" : data};
	res.json(temp);
});

app.get('/menShoeCategory', function(req, res){
	console.log("GET: menShoeCategory");
var data =  new Array(

		new StoreItem("Sperry Top-Sider", "MEN_SHOE_STORE", "$40" ,
			 "Classic Nautical Style", "95", 
			 "http://a2.zassets.com/images/z/2/1/7/0/7/3/2170731-p-MULTIVIEW.jpg"), 
			 
		new StoreItem("Onitsuka Tiger by Fencis", "MEN_SHOE_STORE", "$80" ,
			 "Awesome running shoes. ", "97", 
			 "http://a3.zassets.com/images/z/1/8/4/7/3/9/1847391-p-MULTIVIEW.jpg") 

		);
	var temp = {"items" : data};
	res.json(temp);
});

app.get('/childrenShoeCategory', function(req, res){
	console.log("GET: childrenShoeCategory");
var data =  new Array(

		new StoreItem("Pom Pom Ballet Flat", " CHILDREN_SHOE_STORE", "$50" ,
			 "Have your little girl look fabulous in these flats!", "90", 
			 "http://content.childrensplace.com/www/b/TCP/images/cloudzoom/p/069942_p.jpg"),

		new StoreItem("Rainbow Flip Flops", "CHILDREN_SHOE_STORE", "$6" ,
			 "Your little girl will love these colorful flip flops!", "93", 
			 "http://content.childrensplace.com/www/b/TCP/images/styles/034283_s.jpg")

		);
	var temp = {"items" : data};
	res.json(temp);
});

//------------------------------- Sports Store -------------------------------

app.get('/sportStore', function(request, response) {

	console.log("GET : sportStore");

	var data =  new Array(

		new StoreItem("Spalding San Antonio Spurs Basketball", "BASKETBALL_STORE", "$14.95" ,
			 "This item only comes in one size", "100", 
			 "http://nba.frgimages.com/FFImage/thumb.aspx?i=/productimages/_566000/altimages/FF_566091ALT2_xl.jpg&w=600"),

		new StoreItem("Cabela's Spinning Rod", "FISHING_STORE", "$40" ,
			 "Improved graphite reel seats with padded hoods", "96", 
			 "http://images.cabelas.com/is/image/cabelas/s7_124944_999_01?rgn=0,0,2000,114&scl=5.2631578947368425&fmt=jpeg&id=0IPjgJqgU-LC772loJnLMn"), 

		new StoreItem("Vuelta Corsa SLR Road Wheelset", "BICYCLE_STORE", "$500" ,
			 "Ideal for racing and serious training.", "94", 
			 "http://media.nashbar.com/images/nashbar/products/250/VL-CSLR-NCL-PAIR.jpg"),

		new StoreItem("St. Louis Cardinals Authentic Yadier Molina Home Cool Base Jersey", "BASEBALL_STORE", "$380" ,
			 "Just like the Big Leaguers. ", "97", 
			 "http://mlb.imageg.net/graphics/product_images/pMLB2-15819162dt.jpg"), 

		new StoreItem("Summer Series Spikeless Golf Shoes", " GOLF_STORE", "$190" ,
			 "Features a super-soft upper blend combined with ultra-cushioned midsoles to create pillows for your feet.", "45", 
			 "http://www.golfsmith.com/images/30081268_thm.jpg")

		);
	var temp = {"items" : data};
	response.json(temp);
});


app.get('/basketballCategory', function(req, res){
	console.log("GET: basketballCategory");
var data =  new Array(

		new StoreItem("Spalding San Antonio Spurs Basketball", "BASKETBALL_STORE", "$14.95" ,
			 "This item only comes in one size", "100", 
			 "http://nba.frgimages.com/FFImage/thumb.aspx?i=/productimages/_566000/altimages/FF_566091ALT2_xl.jpg&w=600"),

		new StoreItem("New Era New York Knicks Camo Visor", "BASKETBALL_STORE", "$32" ,
			 "Top off your look with this New Era New York Knicks Camo Visor 59FIFTY fitted hat!", "93", 
			 "http://nba.frgimages.com/FFImage/thumb.aspx?i=%2fproductImages%2f_1183000%2fff_1183387_xl.jpg&w=400")

		);
	var temp = {"items" : data};
	res.json(temp);
});

app.get('/fishingCategory', function(req, res){
	console.log("GET: fishingCategory");
var data =  new Array(

		new StoreItem("Cabela's Spinning Rod", "FISHING_STORE", "$40" ,
			 "Improved graphite reel seats with padded hoods", "96", 
			 "http://images.cabelas.com/is/image/cabelas/s7_124944_999_01?rgn=0,0,2000,114&scl=5.2631578947368425&fmt=jpeg&id=0IPjgJqgU-LC772loJnLMn"), 
			 
		new StoreItem("Ike Dude Combo", "FISHING_STORE", "$54.67" ,
			 "Made especially for young anglers, this spinning combo offers the look and feel of a pro-grade outfit.", "78", 
			 "http://images.cabelas.com/is/image/cabelas/s7_129782_999_01?rgn=0,0,2000,592&scl=5.2631578947368425&fmt=jpeg&id=3JvwyZnruchWuJMJ3QLZtO")

		);
	var temp = {"items" : data};
	res.json(temp);
});

app.get('/baseballCategory', function(req, res){
	console.log("GET: baseballCategory");
var data =  new Array(

		new StoreItem("St. Louis Cardinals Authentic Yadier Molina Home Cool Base Jersey", "BASEBALL_STORE", "$380" ,
			 "Just like the Big Leaguers. ", "97", 
			 "http://mlb.imageg.net/graphics/product_images/pMLB2-15819162dt.jpg"), 

		new StoreItem("Los Angeles Angels of Anaheim Team Logo Bat", "BASEBALL_STORE", "$51.99" ,
			 "Add to your favorite team's collection with this collectible from Louisville Slugger!", "93", 
			 "http://mlb.imageg.net/graphics/product_images/pMLB2-1469514dt.jpg")

		);
	var temp = {"items" : data};
	res.json(temp);
});

app.get('/bicycleCategory', function(req, res){
	console.log("GET: bicycleCategory");
var data =  new Array(

		new StoreItem("Vuelta Corsa SLR Road Wheelset", "BICYCLE_STORE", "$500" ,
			 "Ideal for racing and serious training.", "94", 
			 "http://media.nashbar.com/images/nashbar/products/250/VL-CSLR-NCL-PAIR.jpg"),
			 
		new StoreItem("Fuji Ace 24", "BICYCLE_STORE", "$5550" ,
			 " Ideal first bike for the beginner or experienced rider!", "93", 
			 "http://cdn2.bigcommerce.com/server4900/26759/products/11911/images/26420/Fuji_Ace_24_2014_blue__53831.1380370156.185.185.jpg")

		);
	var temp = {"items" : data};
	res.json(temp);
});

app.get('/golfCategory', function(req, res){
	console.log("GET: golfCategory");
var data =  new Array(

		new StoreItem("Callaway HX Bite Golf Balls", " GOLF_STORE", "$30" ,
			 "The combination of a soft, high-energy core and advanced inner cover dramatically lowers spin off the driver, increasing distance and accuracy. ", "90", 
			 "http://www.golfsmith.com/images/304278_thm.jpg"),

		new StoreItem("Summer Series Spikeless Golf Shoes", " GOLF_STORE", "$190" ,
			 "Features a super-soft upper blend combined with ultra-cushioned midsoles to create pillows for your feet.", "45", 
			 "http://www.golfsmith.com/images/30081268_thm.jpg")

		);
	var temp = {"items" : data};
	res.json(temp);
});


}
