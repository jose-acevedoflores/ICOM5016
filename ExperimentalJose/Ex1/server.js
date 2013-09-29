var express = require('express');
var http    = require('http');
var app     = express();
var item = require("./public/js/objects.js");
var StoreItem = item.StoreItem;

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

		new StoreItem("Samsung F8000 High Def TV", "TV_CATEGORY", "$4,000" ,
			 "onevkbdnv, new description woot woot wooto owtoo", "97", 
			 "http://pinoytutorial.com/techtorial/wp-content/uploads/2013/01/Samsung-F8000-led-ces.jpg"),

		new StoreItem("Justin Bieber Album", "AUDIO_CATEGORY", "$40" ,
			 "onevkbdnv, new description woot woot wooto owtoo", "97", 
			 "http://25.media.tumblr.com/tumblr_lsj02rFcmz1qh2d1ho1_500.jpg"),

		new StoreItem("HTC ONE", "PHONE_CATEGORY", "$500" ,
			 "BEST PHONE EVER", "97", 
			 "http://www.htc.com/managed-assets/shared/desktop/smartphones/htc-one/hero/HTC-ProductDetail-Hero-slide-04.png"),

		new StoreItem("Nikon somethin", "CAMERA_CATEGORY", "$3,400" ,
			 "40,000 Mega Pixel camera ", "97", 
			 "http://swotti.starmedia.com/tmp/swotti/cacheBMLRB24GZDQW/imgNikon%20D403.jpg"),

		new StoreItem("Top Gear season 300", "VIDEO_CATEGORY", "$300" ,
			 "Catch your favorite TV stars in their latest car journey", "97", 
			 "https://lh6.googleusercontent.com/-nNyrLwWbpOE/Uh_YB_QPLII/AAAAAAAAADE/zeBzioai3xM/Jeremy-Clarkson-In-Ariel-Atom-AHHHHHHH-bbc-america-top-gear-10491170-480-331.jpg"),
		
		new StoreItem("MacBookPro", "LAPTOPS_CATEGORY", "$1,200.00", "A Macbook Pro laptop", "97", 
			"http://images.apple.com/macbook-pro/images/overview_display_hero.png")
		);
		
	var temp = {"items" : data};
	res.json(temp);

} );

app.get('/electronicsStore', function(request, response) {

	console.log("GET : electronicsStore");

	//QUERY DB
	var data =  new Array(

		new StoreItem("Samsung F8000 High Def TV", "TV_CATEGORY", "$4,000" ,
			 "onevkbdnv, new description woot woot wooto owtoo", "97", 
			 "http://pinoytutorial.com/techtorial/wp-content/uploads/2013/01/Samsung-F8000-led-ces.jpg"),

		new StoreItem("Justin Bieber Album", "AUDIO_CATEGORY", "$40" ,
			 "onevkbdnv, new description woot woot wooto owtoo", "97", 
			 "http://25.media.tumblr.com/tumblr_lsj02rFcmz1qh2d1ho1_500.jpg"), 

		new StoreItem("HTC ONE", "PHONE_CATEGORY", "$500" ,
			 "BEST PHONE EVER", "97", 
			 "http://www.htc.com/managed-assets/shared/desktop/smartphones/htc-one/hero/HTC-ProductDetail-Hero-slide-04.png"),

		new StoreItem("Nikon somethin", "CAMERA_CATEGORY", "$3,400" ,
			 "40,000 Mega Pixel camera ", "97", 
			 "http://swotti.starmedia.com/tmp/swotti/cacheBMLRB24GZDQW/imgNikon%20D403.jpg"), 

		new StoreItem("Top Gear season 300", "VIDEO_CATEGORY", "$300" ,
			 "Catch your favorite TV stars in their latest car journey", "97", 
			 "https://lh6.googleusercontent.com/-nNyrLwWbpOE/Uh_YB_QPLII/AAAAAAAAADE/zeBzioai3xM/Jeremy-Clarkson-In-Ariel-Atom-AHHHHHHH-bbc-america-top-gear-10491170-480-331.jpg")

		);
	var temp = {"items" : data};
	response.json(temp);
});


app.get('/tvCategory', function(req, res){
	console.log("GET: tvCategory");

	//QUERY DB
var data =  new Array(

		new StoreItem("Samsung F8000 High Def TV", "TV_CATEGORY", "$4,000" ,
			 "onevkbdnv, new description woot woot wooto owtoo", "97", 
			 "http://pinoytutorial.com/techtorial/wp-content/uploads/2013/01/Samsung-F8000-led-ces.jpg"),

		new StoreItem("Sony BRAVIA 3D ", "TV_CATEGORY", "$2,000" ,
			 "Experience 3D like never before in full HD", "93", 
			 "http://www.blogcdn.com/www.engadget.com/media/2010/01/sony-bravia-lx900-6deg-left_md.jpg")

		);
	var temp = {"items" : data};
	res.json(temp);
});

app.get('/cameraCategory', function(req, res){
	console.log("GET: cameraCategory");
	var data =  new Array(

		new StoreItem("Nikon somethin", "CAMERA_CATEGORY", "$3,400" ,
			 "40,000 Mega Pixel camera ", "97", 
			 "http://swotti.starmedia.com/tmp/swotti/cacheBMLRB24GZDQW/imgNikon%20D403.jpg")

		);
	var temp = {"items" : data};
	res.json(temp);

});

app.get('/phoneCategory', function(req, res){
	console.log("GET: phoneCategory");
	var data = new Array (
		new StoreItem("HTC ONE", "PHONE_CATEGORY", "$500" ,
			 "BEST PHONE EVER", "97", 
			 "http://www.htc.com/managed-assets/shared/desktop/smartphones/htc-one/hero/HTC-ProductDetail-Hero-slide-04.png")
	);
	var temp = {"items" : data}
	res.json(temp);
});

app.get('/videoCategory', function(req, res){
	console.log("videoCategory");
	var data = new Array (
			new StoreItem("Top Gear season 300", "VIDEO_CATEGORY", "$300" ,
			 "Catch your favorite TV stars in their latest car journey", "97", 
			 "https://lh6.googleusercontent.com/-nNyrLwWbpOE/Uh_YB_QPLII/AAAAAAAAADE/zeBzioai3xM/Jeremy-Clarkson-In-Ariel-Atom-AHHHHHHH-bbc-america-top-gear-10491170-480-331.jpg")
		);
	var temp = {"items" : data};
	res.json(temp);
});

app.get('/booksStore', function(req, res){
	console.log("GET: booksStore");

});

app.get("/childrenCategory", function(req, res){
	console.log("GET: childrenCategory");

});

app.get("/fictionCategory", function(req,res) {
	console.log("GET: fictionCategory");
});


app.get("/businessCategory", function(req,res) {
	console.log("GET: businessCategory");
});

app.get("/technologyCategory", function(req,res) {
	console.log("GET: technologyCategory");
});



app.get('/computerStore', function(req, res){
	console.log("GET : computersStore");

	var data =  new Array(

		new StoreItem("MacBookPro", "LAPTOPS_CATEGORY", "$1,200.00", "A Macbook Pro laptop", "97", 
			"http://images.apple.com/macbook-pro/images/overview_display_hero.png")
			
		);
	var temp = {"items" : data};
	response.json(temp);
});

app.get('/shoppingCart', function(req, res){

	//QUERY DB
	var data =  new Array(

		new StoreItem("Lancer Evolution HALTECH flash ECU", "COMPUTER_STORE", "$4,000" ,
			 "onevkbdnv, new description woot woot wooto owtoo", "97", 
			 "http://www.sonicperformance.com.au/productimages/HT051340.jpg"),

		new StoreItem("Avenged 7fold LBC", "AUDIO_STORE", "$40" ,
			 "Rock on with Avenged Sevenfold in Long Beach", "97", 
			 "http://userserve-ak.last.fm/serve/_/82208421/Avenged+Sevenfold+original.png"), 

		new StoreItem("HTC ONE", "PHONE_STORE", "$500" ,
			 "BEST PHONE EVER", "97", 
			 "http://www.htc.com/managed-assets/shared/desktop/smartphones/htc-one/hero/HTC-ProductDetail-Hero-slide-04.png")


		);
	var temp = {"items" : data};
	res.json(temp);
});


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

// Rotten tomatoes Developer account: Jose_Acv2 ; pass: quemierda123 