var express = require('express');
var http    = require('http');
var app     = express();

//Variable to create the hash table for categories
var MAX_NODES = 100;

//DATABASE SETUP
var pg = require('pg');
var conString = "postgres://joseacevedo:vmpasswordp@acv2.no-ip.org:5432/fase2";
isAdmin =true;

app.configure(function(){
	app.set('port', process.env.PORT || 5000);
	app.set('public', __dirname + '/public');
	app.use(express.static(__dirname + '/public'));
	app.use(express.static(__dirname + '/views'));
	app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: '1234567890QWERTY'}));
});


/***************

    Important information. In this app we are using the Express sessions features. 
    The Information stored in the Express Session object is:
      userName: The username as found in the f_name + l_name attributes of the database
      loggedIn: If the user is logged in. This is a control variable for the common.jade file that helps
                us know when to display the userName.
      account_id: The account Id of this user. This value is used in the queries to extract specific information like 
                  the products this user is selling, the shoppingCart, etc.
      userDescription: Contains the description of the user to be displayed in the profile page.
      rank: Contains the rank of the user to be displayed in the profile page.

*****************/

/*************************************************************************************
 *	This is the first route that is activated when the user goes to the webpage.   
 *  In here the info for the rendering of the JADE file is fetched and sent to the user.  
 *  Key Objects in this function:
 *    viewData: this is an object (initially almost empty) that is populated by the query to the CATEGORIES table
 * 
 **************************************************************************************/
app.get('/', function(request, response) {

	var viewData = {
		"data" : {
			"stores" : [

			],
			"dataLength" : 0,
      "loggedIn" : false,
      "userName" : undefined,
      "isAdmin" : false,
      "userDescription" : undefined,
      "rank" : 0
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
    				//In here category_id represents the PARENT ID aka main store id.
    				viewData.data.stores[i].categories = viewData.data.stores[i].categories.concat(storeCatLinkedList[viewData.data.stores[i].category_id]);
    				//Add the number of categories found on this store
    				viewData.data.stores[i].categoriesLength = viewData.data.stores[i].categories.length;
    		}

    		viewData.data.dataLength = viewData.data.stores.length;

         console.log(" session data: "+ request.session.loggedIn);
         console.log(" session data name: "+request.session.userName);
         console.log("Session data: " + request.session.account_id);

        // If this user is logged in then save the variables in the corresponiding viewData fields.
        if(request.session.loggedIn){
          viewData.data.loggedIn = request.session.loggedIn;
          viewData.data.userName = request.session.userName;
          viewData.data.isAdmin = request.session.isAdmin;
          viewData.data.userDescription = request.session.userDescription;
          viewData.data.rank = request.session.rank;
        }

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

  	client.query('SELECT * FROM sale_product, (SELECT category_id,name AS category_name, parent_category_id FROM category )AS newcat WHERE sale_product.category_id = newcat.category_id',

  		function(err, result) {
    		//call `done()` to release the client back to the pool
    		done();

    		if(err) {
				  return console.error('error running query', err);
    		}
    		//console.log(result.rows);
        var temp = {"items" : result.rows};
        res.json(temp);
  		});
	});


} );


app.get('/stores/:store/:category' , function(req, res){

	var store = req.params.store;
	var category = req.params.category;

	console.log("GET: store = "+store +" category: "+category);
	//QUERY DB for products to display in the individual store pages
	pg.connect(conString, function(err, client, done) {
 		if(err) {
  		return console.error('error fetching client from pool', err);
  	}

  	client.query('SELECT * FROM sale_product NATURAL JOIN (SELECT category_id,name AS category_name, parent_category_id FROM category) AS mod WHERE parent_category_id = $1 AND category_name = $2', [store,category],

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

app.get('/stores/:store' , function(req, res){

	var store = req.params.store;
	console.log("GET: store = "+store);
	//QUERY DB for products to display in the individual store pages
	pg.connect(conString, function(err, client, done) {
 		if(err) {
  		return console.error('error fetching client from pool', err);
  	}

  	client.query('SELECT * FROM sale_product NATURAL JOIN (SELECT category_id,name AS category_name, parent_category_id FROM category) AS mod WHERE parent_category_id = $1', [store],

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

app.get("/item/:itemId", function(req,res) {
	var itemId = req.params.itemId;
	console.log("GET : Load Item "+itemId);

	//QUERY DB for products to display in the individual item page
	pg.connect(conString, function(err, client, done) {
 		if(err) {
    		return console.error('error fetching client from pool', err);
  	}

  	client.query('SELECT product_id AS id, brand , model, description, photo_url AS picture FROM product WHERE product_id = $1', [itemId],

  		function(err, result) {
    		//call `done()` to release the client back to the pool
    		done();

    		if(err) {
	   			return console.error('error running query', err);
    		}
    		console.log(result.rows);

    		var temp = {"item" : result.rows};
        res.json(temp);
  		});
	});


});



app.get('/shoppingCart', function(req, res){

	//QUERY DB
	console.log("GET: ShoppingCart");

	// OJO UPDATE ER cada shopping cart tiene que tener item ids

	//QUERY DB for products to display in the shopping cart of this user
	pg.connect(conString, function(err, client, done) {
 		if(err) {
  		return console.error('error fetching client from pool', err);
 		}

    if(req.session.loggedIn)  
		{ 

      client.query('SELECT product_id AS id, photo_url AS picture, price,seller_id AS rating, brand, model, description FROM sale_product WHERE sale_product.product_id IN (SELECT item_id FROM items_in_cart NATURAL JOIN shopping_cart WHERE shopping_cart.owner_id = $1)', [req.session.account_id],

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
    }
    else // User is not logged in 
    {
      var temp = {"items" : "empty"}
      res.json(temp);
    }
	});


});

app.get('/placedBids', function(req, res) {

	console.log("GET : PlacedBids");

  //QUERY DB for products to display that this user has placed a bid on
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    if(req.session.loggedIn)  
    { 

      client.query('SELECT product_id AS id, photo_url AS picture, starting_price AS price, brand, model, description FROM auction_product WHERE auction_product.product_id IN (SELECT product_id FROM bid NATURAL JOIN auction_product WHERE bid.buyer_account_id = $1)', [req.session.account_id],

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
    }
    else // User is not logged in 
    {
      var temp = {"items" : "empty"}
      res.json(temp);
    }
  });

});

app.get('/itemsSelling', function(req, res){

	console.log("GET : ItemsSelling");
  //QUERY DB for products to display that this user is currently selling either by auction or sale
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    if(req.session.loggedIn)  
    { 

      client.query('SELECT product_id AS id, photo_url AS picture,  brand, model, description, price , \'sale\' AS product_type FROM sale_product  WHERE seller_id = $1 UNION SELECT product_id AS id, photo_url AS picture,  brand, model, description, starting_price AS price, \'auction\' AS product_type FROM auction_product WHERE seller_id = $1', [req.session.account_id],

      function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          return console.error('error running query', err);
        }
        console.log(result.rows);

        var temp = {"items" :  result.rows };
        res.json(temp);
      });
    }
    else // User is not logged in 
    {
      var temp = {"items" : "empty"}
      res.json(temp);
    }
  });


});

app.get("/userProfile", function(req, res){

  console.log("Get userProfile : " + req.session.account_id);
  var client = new pg.Client(conString);
  client.connect();

  var query = client.query("SELECT  password as updPassword, email_address as updEmailAddress from web_user where (web_user.account_id = $1)", [req.session.account_id]);
  
  query.on("row", function (row, result) {
     
      result.addRow(row);
  });

  query.on("end", function (result) {
    var len = result.rows.length;
    if (len == 0){
      res.statusCode = 404;
      res.send("User not found.");
    }
    else {  
      var response = {"user" : result.rows[0]};
      client.end();
      
      res.json(response);
      }
  });
});

app.get("/itemsSold", function(req, res){

	console.log("GET : Load itemsSold");
	//Should response with a list of up to 10 invoices at a time. Every time the user hits the "Load more" button
  //QUERY DB for products to display that this user has sold either by auction or sale
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    if(req.session.loggedIn)  
    { 

      client.query('SELECT product_id AS id, photo_url AS picture,  brand, model, description, invoice_id FROM has_invoice NATURAL JOIN product  WHERE seller_id = $1 ', [req.session.account_id],

      function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          return console.error('error running query', err);
        }
        console.log(result.rows);

        var temp = {"items" :  result.rows };
        res.json(temp);
      });
    }
    else // User is not logged in 
    {
      var temp = {"items" : "empty"}
      res.json(temp);
    }
  });

});


app.get("/search/:query", function(req, res)  {
	var query = req.params.query;
	console.log("GET: query= "+query);
	res.json(true);
});

/***************************************************************************************************************************************************
**************************************************  PUT METHODS ******************************************************
****************************************************************************************************************************************************/

app.put("/userLogin", function(req, res){

        
    console.log("PUT  : Login");
    console.log(req.body.hasOwnProperty('emailAddress'));
    var password = req.body.password;
    var email = req.body.emailAddress;
        
    console.log(email);
    console.log(password);
  	var client = new pg.Client(conString);
 	  client.connect();
  

    var query = client.query("SELECT email_address, password, f_name, l_name, account_id, admin_flag, user_description, rank FROM web_user WHERE (web_user.email_address = $1 AND web_user.password = $2)", [email, password]);
    
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
        console.log(result.rows);

        req.session.account_id = result.rows[0].account_id;
        req.session.userName = result.rows[0].f_name + " " + result.rows[0].l_name;
        req.session.loggedIn = true;
        req.session.isAdmin = result.rows[0].admin_flag;
        req.session.userDescription = result.rows[0].user_description;
        req.session.rank = result.rows[0].rank;

        var temp = {"items" : { "userName" : req.session.userName } };
      	res.json(temp);
        	
     	}
      	
      client.end();

    });

});


// REST Operation - HTTP PUT to update a bid
app.put("/placedBids/item:id", function(req, res){
	var id = req.params.id;
  var bid_amount = req.body;
	console.log("PUT ITEM: " +id);
  var client = new pg.Client(conString);
  client.connect();

  var query = client.query("SELECT bid.amount, bid.id FROM bid WHERE (bid.amount > $1 AND bid.id = $2)", [email, id]);
    
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
        console.log(result.rows);



        //var temp = {"items" : { "userName" : req.session.userName } };
        res.json(true);
          
      }
        
      client.end();

    });
	// if((id < 0)){
	// 	res.statusCode = 404;
	// 	res.send("Item not found");
	// }

	// else {
	// 	var target = -1;
	// 	for (var i=0; i<placedBidsVar.length; ++i) {
	// 		if(placedBidsVar[i].id === id) {
	// 			target = i;
	// 			break;
	// 		}
	// 	}
	// 	if (target ==-1) {
	// 		res.statusCode = 404;
	// 		res.send("Item not foud");
	// 	}

	// 	else {
	// 		var theItem = placedBidsVar[target];
	// 		theItem += req.body.price;
	// 		var response = {"item": theItem};
	// 		res.json(response);
	// 	}
	// }
});

// REST Operation - HTTP PUT to sign Out
app.put("/signOut", function(req, res){
	loggedIn = false;
	res.json(true);
});


/***************************************************************************************************************************************************
**************************************************  POST METHODS ******************************************************
****************************************************************************************************************************************************/

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


app.post('/newItem', function(req, res){
	var newItem = new StoreItem(req.body.iName, stores.ELECTRONICS.name, stores.ELECTRONICS.categories.TV.name, req.body.iPrice, req.body.iDescript, "","", "91347");
	data.push(newItem);
	res.json(true);
});


/***************************************************************************************************************************************************
**************************************************  DEL METHODS ******************************************************
****************************************************************************************************************************************************/

app.del("/shoppingCart/delete/:id", function(req, res){
	var id = req.params.id;
	console.log("DEL: id= " +id);

	for (var i = 0 ; i < shoppingCartVar.length ; i++){
		if(shoppingCartVar[i].id === id)
			shoppingCartVar.splice(i, 1);
	}
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

