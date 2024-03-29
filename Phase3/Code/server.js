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
      "userPicture" : undefined,
      "rank" : 0,
      "email" : "",
      "password" : "",
      "searchCounter" : 0 
		}
	};

   

	//Query the DB for all the Categories.
	pg.connect(conString, function(err, client, done) {
 		if(err) {
    	return console.error('error fetching client from pool', err);
  	}

  	client.query('SELECT * FROM  category WHERE is_active = true', function(err, result) {
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
         console.log("picture: " + request.session.userPicture);

        // If this user is logged in then save the variables in the corresponiding viewData fields.
        if(request.session.loggedIn){
          viewData.data.loggedIn = request.session.loggedIn;
          viewData.data.userName = request.session.userName;
          viewData.data.isAdmin = request.session.isAdmin;
          viewData.data.userDescription = request.session.userDescription;
          viewData.data.userPicture = request.session.userPicture;
          viewData.data.rank = request.session.rank;
          viewData.data.email = request.session.email;
          viewData.data.password = request.session.password;

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

  	client.query(' SELECT photo_url, parent_category_id, product_id, product_name,seller_id, description, \'sale\' AS ptype , price, 0 AS highest_bid_amount, is_active, l_name, f_name FROM sale_product NATURAL JOIN (SELECT category_id,name AS category_name, parent_category_id FROM category )AS newcat NATURAL JOIN (select l_name, f_name, account_id as seller_id from web_user) as webu WHERE is_active = TRUE UNION SELECT photo_url, parent_category_id, product_id, product_name,seller_id, description, \'auction\' AS ptype , starting_price AS price, amount AS highest_bid_amount, is_active, l_name , f_name FROM auction_product NATURAL JOIN (SELECT category_id,name AS category_name, parent_category_id FROM category )AS newcat NATURAL LEFT JOIN (SELECT bid_id AS highest_bid, amount FROM bid ) as from_bid NATURAL JOIN (select l_name, f_name, account_id as seller_id from web_user) as webu WHERE is_active = TRUE',

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


});


app.get('/search/:label', function(req,res){

    var label = req.params.label;

    console.log("GET: search label: " + label);
    pg.connect(conString, function(err, client, done) {
      if (err) {
        return console.error('Error making search', err);
      }

      client.query("SELECT  id, brand , model,  pname, description,  picture, ptype, amount, starting_price FROM (SELECT product_id AS id, brand , model, product_name AS pname, description, photo_url AS picture, \'sale\' AS ptype , price AS amount , 0 AS starting_price FROM sale_product UNION SELECT product_id AS id, brand , model, product_name AS pname, description, photo_url AS picture, \'auction\' AS ptype, highest_bid_amount as amount, starting_price FROM auction_product NATURAL LEFT JOIN (SELECT bid_id AS highest_bid, amount AS highest_bid_amount FROM bid ) AS temp )  AS together WHERE pname LIKE $1", ['%'+label+'%'],
        
        function(err,result) {
          done();

          if (err) {
            return console.error('Error running main search query', err);
          }
          console.log(result.rows);

          var temp = {"items" : result.rows};
          res.json(temp);
        });
    });
});

app.get('/stores/:store/:category' , function(req, res){

	var store = req.params.store;
	var category = req.params.category;

	console.log("GET: store = "+store +" category: "+category);
	//QUERY DB for products to display in the individual store pages
	pg.connect(conString, function(err, client, done) {
 		if(err) {
  		return console.error('error fetching client from pool', err);
  	}

  	client.query('SELECT * FROM sale_product NATURAL JOIN (SELECT category_id,name AS category_name, parent_category_id FROM category) AS mod NATURAL JOIN (SELECT account_id as seller_id, l_name, f_name FROM web_user ) AS webu WHERE parent_category_id = $1 AND category_name = $2 AND  is_active = TRUE ORDER BY price DESC', [store,category],

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

app.get('/stores/:store/:category/:sortOrder' , function(req, res){

  var store = req.params.store;
  var category = req.params.category;
  var sortOrder = req.params.sortOrder;

  console.log("GET: ORDER store = "+store +" category: "+category);
  //QUERY DB for products to display in the individual store pages
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    var q ;
    if(sortOrder === "lowToHigh"){
      q = 'SELECT * FROM sale_product NATURAL JOIN (SELECT category_id,name AS category_name, parent_category_id FROM category) AS mod NATURAL JOIN (select l_name, f_name, account_id as seller_id from web_user) as webu  WHERE parent_category_id = $1 AND category_name = $2 AND  is_active = TRUE ORDER BY price ';
    }
    else if(sortOrder === "highToLow"){
      q = 'SELECT * FROM sale_product NATURAL JOIN (SELECT category_id,name AS category_name, parent_category_id FROM category) AS mod NATURAL JOIN (select l_name, f_name, account_id as seller_id from web_user) as webu WHERE parent_category_id = $1 AND category_name = $2 AND is_active = TRUE  ORDER BY price DESC';
    }
    else if(sortOrder === "alphabetical"){
      q = 'SELECT * FROM sale_product NATURAL JOIN (SELECT category_id,name AS category_name, parent_category_id FROM category) AS mod NATURAL JOIN (select l_name, f_name, account_id as seller_id from web_user) as webu WHERE parent_category_id = $1 AND category_name = $2 AND is_active = TRUE  ORDER BY brand ';
    }
    else if(sortOrder === "revAlphabetical"){
       q = 'SELECT * FROM sale_product NATURAL JOIN (SELECT category_id,name AS category_name, parent_category_id FROM category) AS mod NATURAL JOIN (select l_name, f_name, account_id as seller_id from web_user) as webu WHERE parent_category_id = $1 AND category_name = $2 AND is_active = TRUE  ORDER BY brand DESC';
    }
    else if(sortOrder === "alphabeticalN"){
         q = 'SELECT * FROM sale_product NATURAL JOIN (SELECT category_id,name AS category_name, parent_category_id FROM category) AS mod NATURAL JOIN (select l_name, f_name, account_id as seller_id from web_user) as webu WHERE parent_category_id = $1 AND category_name = $2 AND is_active = TRUE  ORDER BY product_name ';
    }
    else if(sortOrder ==="revAlphabeticalN"){
         q = 'SELECT * FROM sale_product NATURAL JOIN (SELECT category_id,name AS category_name, parent_category_id FROM category) AS mod NATURAL JOIN (select l_name, f_name, account_id as seller_id from web_user) as webu WHERE parent_category_id = $1 AND category_name = $2 AND is_active = TRUE ORDER BY product_name DESC';
    }
    client.query(q, [store,category],

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

  	client.query('SELECT * FROM sale_product NATURAL JOIN (SELECT category_id,name AS category_name, parent_category_id FROM category) AS mod NATURAL JOIN (SELECT account_id as seller_id , f_name, l_name FROM web_user) as webu WHERE parent_category_id = $1 AND  is_active = TRUE', [store],

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

  	client.query('SELECT  id, brand , model,  pname, description,  picture, ptype, amount, starting_price FROM (SELECT product_id AS id, brand , model, product_name AS pname, description, photo_url AS picture, \'sale\' AS ptype , price AS amount , 0 AS starting_price FROM sale_product UNION SELECT product_id AS id, brand , model, product_name AS pname, description, photo_url AS picture, \'auction\' AS ptype, highest_bid_amount as amount, starting_price FROM auction_product NATURAL LEFT JOIN (SELECT bid_id AS highest_bid, amount AS highest_bid_amount FROM bid ) AS temp )  AS together WHERE id = $1', [itemId],


  		function(err, result) {
    		//call `done()` to release the client back to the pool
    		done();

    		if(err) {
	   			return console.error('error running query', err);
    		}

        if(result.rows[0].ptype === "auction" && result.rows[0].amount === null){
            result.rows[0].amount = result.rows[0].starting_price;
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

      client.query('SELECT  product_id AS id, photo_url AS picture, price,seller_id AS rating, brand, model, product_name AS pname, description, quantity, total_amount FROM sale_product NATURAL JOIN (SELECT *, item_id AS product_id FROM shopping_cart NATURAL JOIN items_in_cart WHERE owner_id = $1 ) AS TempName', [req.session.account_id],


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
      var temp = {"items" : []};
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

      client.query('SELECT product_id AS id, seller_id, l_name, f_name, photo_url AS picture, starting_price AS price, brand, model, product_name AS pname, description, bid_amount, highest_bidder_id, \'winning\' AS whoiswin FROM auction_product NATURAL JOIN (SELECT bid_id AS highest_bid, amount AS bid_amount, buyer_account_id AS highest_bidder_id FROM bid ) AS temp NATURAL JOIN (select l_name, f_name, account_id as seller_id from web_user) as webu WHERE auction_product.product_id IN (SELECT product_id FROM bid NATURAL JOIN auction_product WHERE bid.buyer_account_id = $1)', [req.session.account_id],

      function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          return console.error('error running query', err);
        }
        
        for (var i = 0 ; i < result.rows.length; i++) {
          if(result.rows[i].highest_bidder_id != req.session.account_id )
            result.rows[i].whoiswin = "losing";
        };
        console.log("GET : PlacedBids RESULT: "+  result.rows);
        var temp = {"items" : result.rows};
        res.json(temp);
      });
    }
    else // User is not logged in 
    {
      var temp = {"items" : "empty"};
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

      client.query('SELECT product_id AS id, photo_url AS picture, product_name AS pname, description, price , \'sale\' AS product_type FROM sale_product  WHERE seller_id = $1 UNION SELECT product_id AS id, photo_url AS picture, product_name AS pname, description, starting_price AS price, \'auction\' AS product_type FROM auction_product WHERE seller_id = $1', [req.session.account_id],

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
      var temp = {"items" : "empty"};
      res.json(temp);
    }
  });


});

app.get("/userProfile", function(req, res){

  console.log("Get userProfile : " + req.session.account_id);


 pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    if(req.session.loggedIn)  
    { 

      client.query("SELECT email_address AS updEmailAddress, password AS updPassword, user_description AS updDescription, security_code AS sc_card, name_on_card AS nc_card, type AS tc_card, expiration_date_month, expiration_date_year, first_line, second_line, city,country, zip_code, billing_flag FROM (SELECT *, account_id AS owner_id FROM web_user) AS webu NATURAL LEFT JOIN credit_card NATURAL LEFT JOIN address WHERE account_id = $1", [req.session.account_id],

      function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          return console.error('error running query', err);
        }
        var len = result.rows.length;
        if (len == 0){
          res.statusCode = 404;
          res.send("User not found.");
        }
        else {  
          for (var i = 0; i < result.rows.length; i++) {
            if (result.rows[i].updDescription==null) {
                result.rows[i].updDescription = "";
            }

          }
          var response = {"user" : result.rows};
      
          res.json(response);
      
        }
      });  
    }
    else // User is not logged in 
    {
      var temp = {"items" : "empty"};
      res.json(temp);
    }
  
  });
});

app.get("/userProfile:id", function(req, res){
  var id = req.params.id;
  console.log("Get xUserProfile : " + id);
  pg.connect(conString, function(err, client, done) {
    if(err){
      return console.error('error fetching client form pool', err);
    }
    if(req.session.loggedIn) {
      client.query('SELECT account_id, f_name ||\' \'|| l_name AS name, user_description AS description, rank, user_pic As picture FROM web_user WHERE (web_user.admin_flag = FALSE AND web_user.account_id = $1)',[id], 
        function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          console.log(result.rows); 
          
          if (result.rows[0].picture== null) {
             result.rows[0].picture = "http://www.icm.espol.edu.ec/estudiantes/2005/200511889/images/Juan%20Pueblo.jpg";
           }

          if (result.rows[0].description == null) {
            result.rows[0].description = "Description not available";
          }
         
          var temp = {"user" : result.rows};
          res.json(temp);
        });

    }
    else {
      var temp = {"user": "[]"};
      res.json(temp);
    }
  });
});

app.get("/adminProfile:id", function(req, res){
  var id = req.params.id;
  console.log("Get xUserProfile : " + id);
  pg.connect(conString, function(err, client, done) {
    if(err){
      return console.error('error fetching client form pool', err);
    }
    if(req.session.loggedIn) {
      client.query('SELECT f_name ||\' \'|| l_name AS name, user_description AS description, rank, user_pic As picture FROM web_user WHERE (web_user.admin_flag = TRUE AND web_user.account_id = $1)',[id], 
        function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          console.log(result.rows); 
          
          if (result.rows[0].picture== null) {
             result.rows[0].picture = "http://www.icm.espol.edu.ec/estudiantes/2005/200511889/images/Juan%20Pueblo.jpg";
           }

          if (result.rows[0].description == null) {
            result.rows[0].description = "Description not available";
          }
         
          var temp = {"user" : result.rows};
          res.json(temp);
        });

    }
    else {
      var temp = {"user": "[]"};
      res.json(temp);
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


      client.query('SELECT product_id AS id, photo_url AS picture, product_name AS pname, date, description, price ,invoice_id FROM has_invoice NATURAL JOIN sale_product NATURAL JOIN invoice WHERE seller_id = $1 ORDER BY date DESC  ', [req.session.account_id],


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
      var temp = {"items" : "empty"};
      res.json(temp);
    }
  });

});

app.get("/manageUser", function(req, res){
  console.log("Get : Load manageUser");

  pg.connect(conString, function(err, client, done) {
    if(err){
      return console.error('error fetching client form pool', err);
    }
    if(req.session.loggedIn) {
      client.query('SELECT account_id AS id, f_name ||\' \'|| l_name AS name, email_address, user_description AS description, rank, user_pic As picture FROM web_user WHERE web_user.admin_flag = FALSE', 
        function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          console.log(result.rows); 
          for (var i = 0; i< result.rows.length; ++i){
            if (result.rows[i].picture== null) {
              result.rows[i].picture = "http://www.icm.espol.edu.ec/estudiantes/2005/200511889/images/Juan%20Pueblo.jpg";
            }

            if (result.rows[i].description == null) {
              result.rows[i].description = "Description not available";
            }
         }
          var temp = {"usersList" : result.rows};
          res.json(temp);
        });

    }
    else {
      var temp = {"usersList": "empty"};
      res.json(temp);
    }
  });
});

app.get("/manageAdmins", function(req, res){
  console.log("Get : Load manageUser");

  pg.connect(conString, function(err, client, done) {
    if(err){
      return console.error('error fetching client form pool', err);
    }
    if(req.session.loggedIn) {
      client.query('SELECT account_id AS id, f_name ||\' \'|| l_name AS name, email_address, user_description AS description, rank, user_pic As picture FROM web_user WHERE web_user.admin_flag = TRUE', 
        function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          console.log(result.rows); 
          for (var i = 0; i< result.rows.length; ++i){
            if (result.rows[i].picture== null) {
              result.rows[i].picture = "http://www.icm.espol.edu.ec/estudiantes/2005/200511889/images/Juan%20Pueblo.jpg";
            }

            if (result.rows[i].description == null) {
              result.rows[i].description = "Description not available";
            }
         }
          var temp = {"adminsList" : result.rows};
          res.json(temp);
        });

    }
    else {
      var temp = {"adminsList": "empty"};
      res.json(temp);
    }
  });
});

app.get("/shoppingCart/checkout/getCreditCards", function(req, res){
   console.log("Get : checkout credit_cards");

  pg.connect(conString, function(err, client, done) {
    if(err){
      return console.error('error fetching client form pool', err);
    }
    if(req.session.loggedIn) {
      client.query('SELECT * FROM credit_card WHERE owner_id = $1 ', [req.session.account_id],  
        function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          console.log(result.rows); 
          
          var temp = {"items" : result.rows};
          res.json(temp);
        });

    }
    else {
      var temp = {"items": "empty"};
      res.json(temp);
    }
  });
});

app.get("/search/:query", function(req, res)  {
	var query = req.params.query;
	console.log("GET: query= "+query);
	res.json(true);
});

app.get("/reports/:reportType", function(req, res){
  var reportType = req.params.reportType;
  console.log("GET: reports " + reportType);

  pg.connect(conString, function(err, client, done) {
    if(err){
      return console.error('error fetching client form pool', err);
    }
    if(req.session.loggedIn && req.session.isAdmin) {

      var q;
      if(reportType === "todaySales"){
       q = 'SELECT distinct(invoice_id),buyer_account_id, amount FROM invoice NATURAL JOIN has_invoice WHERE date_part(\'day\' , invoice.date) =   date_part(\'day\', current_date) ';
      }
      else if(reportType === "monthlySales"){
         q = 'SELECT distinct(invoice_id),buyer_account_id, amount FROM invoice NATURAL JOIN has_invoice WHERE date_part(\'day\' , invoice.date) =   date_part(\'day\', current_date) '
      }
      client.query(q,  

        function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          console.log("reports: "+result.rows); 
          
          var temp = {"items" : result.rows};
          res.json(temp);
        });

    }
    else {
      var temp = {"items": "empty"};
      res.json(temp);
    }
  });

});

/***************************************************************************************************************************************************
**************************************************  PUT METHODS ******************************************************
****************************************************************************************************************************************************/

app.put("/userLogin", function(req, res){

        
    console.log("PUT  : Login");
    console.log(req.body.hasOwnProperty('emailAddress'));
    var password = req.body.password;
    var email = req.body.emailAddress.toString();
    var email = email.toLowerCase();
        
    console.log(email);
    console.log(password);
  	var client = new pg.Client(conString);
 	  client.connect();
  

    var query = client.query("SELECT email_address, password, f_name, l_name, account_id, admin_flag, user_description, rank, user_pic FROM web_user WHERE (web_user.email_address = $1 AND web_user.password = $2)", [email, password]);
    
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
         
        req.session.email = result.rows[0].email_address;
        req.session.password = result.rows[0].password;
        req.session.account_id = result.rows[0].account_id;
        req.session.userName = result.rows[0].f_name + " " + result.rows[0].l_name;
        req.session.loggedIn = true;
        req.session.isAdmin = result.rows[0].admin_flag;
        req.session.userDescription = result.rows[0].user_description;
        req.session.rank = result.rows[0].rank;

        if (result.rows[0].user_pic== null) {
          req.session.userPicture = "http://www.icm.espol.edu.ec/estudiantes/2005/200511889/images/Juan%20Pueblo.jpg";
        }
        else {
          req.session.userPicture = result.rows[0].user_pic;
        }

        //Check if the user who just logged in has an existing shopping cart
        pg.connect(conString, function(err, client, done) {
          if(err) {
            return console.error('error fetching client from pool', err);
          }

          client.query("SELECT shopping_cart_id FROM shopping_cart WHERE owner_id = $1", [req.session.account_id],

            function(err, result) {
              //call `done()` to release the client back to the pool
             

              if(err) {
                
                done();
                return console.error('error running query', err);
              }
              //If this user has no shopping cart, create it
              if(result.rows.length == 0)
              {
                client.query("INSERT INTO shopping_cart(total_items , total_amount , owner_id) VALUES(0, 0, $1) ", [req.session.account_id]);
              }

              done();
            });
        });

        var temp = {"items" : { "userName" : req.session.userName } };
      	res.json(temp);
        	
     	}
      	
      client.end();

    });

});


// REST Operation - HTTP PUT to update a bid

app.put("/placedBids/item/:id/:incBid", function(req, res){
	var product_id = req.params.id;
  var bid_amount = req.params.incBid;
  var bidder_id = req.session.account_id;

	console.log("PUT INCREASE BID: " + bidder_id+" "+ bid_amount);
 
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    if(req.session.loggedIn){
      client.query("INSERT INTO bid(buyer_account_id, product_id, amount) VALUES( $1, $2, $3)", [req.session.account_id, product_id, bid_amount],

        function(err, result) {
          //call `done()` to release the client back to the pool
          done();
          if(err) {
            return console.error('error running query', err);
          }
          res.json(true);
        });
    }
    else{
      console.log("not logged in bid");
      res.json(false);
    }
  }); 
});

app.put("/userProfile/update/billingAddress", function(req, res) {

 pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    client.query("INSERT INTO address(first_line, second_line, city, country, zip_code, owner_id, billing_flag) VALUES('"+ req.body.first_line_b +"','"+ req.body.second_line_b +"', '"+ req.body.city_b +"', '"+ req.body.country_b +"', '"+ req.body.zip_code_b +"', $1, true)", [req.session.account_id],

      function(err, result) {
        //call `done()` to release the client back to the pool
        done();
        if(err) {
          return console.error('error running query', err);
        }

      });
  }); 

});

app.put("/userProfile/update/mailingAddress", function(req, res) {

 pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    if(req.session.loggedIn) {
    client.query("INSERT INTO address(first_line, second_line, city, country, zip_code, owner_id, billing_flag) VALUES( '"+ req.body.first_line +"','"+ req.body.second_line +"', '"+ req.body.city +"', '"+ req.body.country +"', '"+ req.body.zip_code +"', $1, false)",[req.session.account_id],

      function(err, result) {
        //call `done()` to release the client back to the pool
        done();
        if(err) {
          return console.error('error running query', err);
        }

      });
     }
     else {
      console.log("Not Log In")
      res.json(false)
     }
  }); 

});

app.put("/userProfile/update/creditCardInfo" , function(req,res){

   pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    client.query("INSERT INTO credit_card(security_code, type , name_on_card, expiration_date_month, expiration_date_year , owner_id) VALUES('"+req.body.sc_card+"', '"+req.body.tc_card+"', '"+req.body.nc_card+"' , '" + req.body.exp_card.split("/")[0] +"' , '"+req.body.exp_card.split("/")[1]+"' , $1)", [req.session.account_id],

      function(err, result) {
        //call `done()` to release the client back to the pool
        done();
        if(err) {
          return console.error('error running query', err);
        }
        res.json(true);
      });
  }); 
});

app.put("/userProfile/update/profileInfo" , function(req, res){

  console.log("PUT : user profile ");
  //QUERY DB to modify the mailing address, billing address, password etc.
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    console.log(req.body.updMailAddress + " bad "+ req.body.updBillMailAddress +" desc " + req.body.description + " email " + req.body.emailAddress 
    +" pass " + req.body.password +" confirm pass : " + req.body.confirmPassword + " cc :  " + req.body.updC_card )


    client.query("UPDATE web_user SET user_description = '"+ req.body.description +"', email_address = '"+req.body.emailAddress +"' WHERE account_id = $1 ", [req.session.account_id],

      function(err, result) {
        //call `done()` to release the client back to the pool
        done();
        if(err) {
          return console.error('error running query', err);
        }
        res.json(true);
      });
  }); 

});

app.put("/addItemToCart/:itemId", function(req, res){
  console.log("PUT : add Item to cart");

  pg.connect(conString, function(err, client, done) {
    if(err){
      return console.error('error fetching client form pool', err);
    }
    if(req.session.loggedIn) {
      client.query('SELECT * FROM items_in_cart WHERE shopping_cart_id = (SELECT shopping_cart_id FROM shopping_cart WHERE owner_id = $1) AND item_id = $2 ', [req.session.account_id, req.params.itemId],
        function(err, result) {
         
          if(err) {
            return console.error('error running query', err);
          }
          console.log(result.rows); 
          if(result.rows == 0 ){
           client.query('INSERT INTO items_in_cart(shopping_cart_id, item_id, quantity) VALUES((SELECT shopping_cart_id FROM shopping_cart WHERE  owner_id = $1), $2, 1) ',[req.session.account_id, req.params.itemId], function(err, result) {
             if(err) {
                return console.error('error running query', err);
              }
              done();
              res.json(true);
            });
          }
          else{
            console.log("ITEM IS ALREADY IN CART");
            done();
            res.json(false);
          }
          
        });
      //Rule to update quantity in shopping_cart 
      /* CREATE RULE update_item_count AS ON INSERT TO items_in_cart 
      DO UPDATE shopping_cart SET total_items = total_items + 1 
      WHERE owner_id IN 
      (SELECT owner_id from shopping_cart 
      where shopping_cart_id = NEW.shopping_cart_id)*/
    
    }
    else {

      res.json(false);
    }
  });
});

app.put("/itemInCart/update_quantity/:itemId/:quantity", function(req, res){
  console.log("PUT : add Item to cart");

  pg.connect(conString, function(err, client, done) {
    if(err){
      return console.error('error fetching client form pool', err);
    }
    if(req.session.loggedIn) {
      client.query('UPDATE items_in_cart SET quantity = $3 WHERE shopping_cart_id = (SELECT shopping_cart_id FROM shopping_cart WHERE owner_id = $1) AND item_id = $2  ', [req.session.account_id, req.params.itemId, req.params.quantity],
        function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          console.log(result.rows); 

          res.json(true);
        });
      //Rule to update quantity in shopping_cart 
      /* CREATE RULE update_item_count AS ON INSERT TO items_in_cart 
      DO UPDATE shopping_cart SET total_items = total_items + 1 
      WHERE owner_id IN 
      (SELECT owner_id from shopping_cart 
      where shopping_cart_id = NEW.shopping_cart_id)*/
    
    }
    else {

      res.json(false);
    }
  });
});

app.put("/shoppingCart/checkout", function(req,res){

  console.log("PUT: checkout ");
   pg.connect(conString, function(err, client, done) {
    if(err){
      return console.error('error fetching client form pool', err);
    }
    if(req.session.loggedIn) {


      client.query('INSERT INTO invoice(buyer_account_id, date, time ,amount,cc_id, invoice_id) VALUES($1, $3  , $2, (SELECT total_amount FROM shopping_cart WHERE owner_id = $1) , $4, DEFAULT) RETURNING invoice_id ', [req.session.account_id, req.body.time, req.body.date, req.body.cc_id],
        function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          var invoice_id = result.rows[0].invoice_id;
          pg.connect(conString, function(err, client, done){
            if(err){
              done();
              return console.error('error fetching client form pool', err);
            }
            client.query('SELECT  product_id, quantity , shopping_cart_id FROM sale_product NATURAL JOIN (SELECT *, item_id AS product_id FROM shopping_cart NATURAL JOIN items_in_cart WHERE owner_id = $1 ) AS TempName', [req.session.account_id] ,  
              function(err, result) {
                  
                  if(err) {
                      return console.error('error running query', err);
                  }
                  for(var i = 0 ; i < result.rows.length ; i++)
                  {
                    client.query("INSERT INTO has_invoice(product_id, invoice_id, quantity) VALUES("+result.rows[i].product_id+" , "+invoice_id+","+result.rows[i].quantity+")");
                  } 
                  for(var i = 0 ; i < result.rows.length ; i++)
                  {
                    client.query("DELETE FROM items_in_cart WHERE item_id ="+result.rows[i].product_id+" AND shopping_cart_id = "+result.rows[i].shopping_cart_id+" ");
                  } 
                  done();
                  res.json(true);
              } 
            );//End of second query
          });//end of second pg.connect

         
        });//end of first query
    }// Logged in if
    else {

      res.json(false);
    }
  }); // end of first pg.connect

});

app.put("/makeAdmin/:id", function(req, res){
  var user_id = req.params.id;
  

  console.log("PUT makeAdmin: " + user_id);
  if (req.session.isAdmin) {

  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

     client.query("UPDATE web_user SET admin_flag = $1 WHERE account_id = $2 ", [true, user_id],

      function(err, result) {
        //call `done()` to release the client back to the pool
        done();
        if(err) {
          return console.error('error running query', err);
        }
        res.json(true);
      });
   
  
 
  });
  }
  else {
    req.json(false);
  } 
});

app.put("/removeAdmin/:id", function(req, res){
  var user_id = req.params.id;
  

    console.log("PUT removeAdmin: " + user_id);
   if(req.session.isAdmin) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }

       client.query("UPDATE web_user SET admin_flag = $1 WHERE account_id = $2 ", [false, user_id],

        function(err, result) {
          //call `done()` to release the client back to the pool
          done();
          if(err) {
            return console.error('error running query', err);
          }
          res.json(true);
        });
     

    }); 
  }
  else{
    req.json(false);

  }
});
// REST Operation - HTTP PUT to sign Out
app.put("/signOut", function(req, res){
  loggedIn = false;
  userName = undefined;
  isAdmin = undefined;
  userDescription = undefined;
  userPicture = undefined;
  rank = 0;
  email = undefined;
  password = undefined;
  req.session.destroy();
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

  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

      client.query("INSERT INTO web_user(f_name, l_name, password, email_address, admin_flag, user_description, rank, user_pic) VALUES( $1, $2, $3, $4, $5, $6, $7, $8)", [req.body.fname, req.body.lname, req.body.password, req.body.emailAddress, false, req.body.description,
      0.0, "http://www.icm.espol.edu.ec/estudiantes/2005/200511889/images/Juan%20Pueblo.jpg"],

      function(err, result) {
        //call `done()` to release the client back to the pool
        done();
        if(err) {
          return console.error('error running query', err);
        }
        
        res.json(true);
      });
  }); 
  	
  
});

app.post('/add_new_admin', function(req, res){
  console.log("POST : New Admin");
  if (!req.session.isAdmin) {
    req.json(false)
  }

  else {
  if(!req.body.hasOwnProperty('aFname') || !req.body.hasOwnProperty('aLname')
      || !req.body.hasOwnProperty('aEmailAddress') ){
      res.statusCode = 400;
      return res.send('Error: Missing fields for user registration.');
    }

  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

      client.query("INSERT INTO web_user(f_name, l_name, password, email_address, admin_flag, user_description, rank, user_pic) VALUES( $1, $2, $3, $4, $5, $6, $7, $8)", [req.body.aFname, req.body.aLname, 'admin', req.body.aEmailAddress, true, '',
      0.0, 'http://www.icm.espol.edu.ec/estudiantes/2005/200511889/images/Juan%20Pueblo.jpg'],

      function(err, result) {
        //call `done()` to release the client back to the pool
        done();
        if(err) {
          return console.error('error running query', err);
        }
        
        res.json(true);
      });
  }); 
}
})

app.post('/addStore/storeName/:storeName', function(req, res){
	var storeToAdd = req.params.storeName;

	if (!req.session.isAdmin) {
    req.json(false)
  }
  else {
    pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

      client.query("INSERT INTO category(name) VALUES( $1)", [storeToAdd],

      function(err, result) {
        //call `done()` to release the client back to the pool
        done();
        if(err) {
          return console.error('error running query', err);
        }
        res.json(true);
       
      });
  }); 
  }
});

app.post('/addCategory/categoryName/:storeName/:catName', function(req, res){
  var storeName = req.params.storeName;
  var catToAdd = req.params.catName;

  if (!req.session.isAdmin) {
    req.json(false)
  }
  else {
    pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

      client.query("INSERT INTO category(name, parent_category_id) VALUES( $1, $2)", [catToAdd, storeName],

      function(err, result) {
        //call `done()` to release the client back to the pool
        done();
        if(err) {
          return console.error('error running query', err);
        }
        res.json(true);
       
      });
  }); 
  }
});


app.post('/newItem', function(req, res){


  //QUERY DB to add an item for this seller
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    var q;
    var test;

    if(req.body.sellChoice === "selling"){
      q =  "INSERT INTO sale_product(seller_id, description, photo_url, category_id, price, product_name) VALUES( $1, '"+req.body.iDescript+"', '"+ req.body.iPic +"', '"+req.body.selectCategory+ "', '" +req.body.iPrice+"', '"+req.body.iName+"' )";
    }
    else if(req.body.sellChoice === "auctioning"){
      q = "INSERT INTO auction_product(seller_id, description, photo_url, category_id, starting_price, product_name, biding_time) VALUES( $1, '"+req.body.iDescript+"', '"+ req.body.iPic +"', '"+req.body.selectCategory+ "', '"+req.body.iPrice +"', '"+req.body.iName+"' , '"+req.body.bidEndDate+"')";
    }
    client.query(q, [req.session.account_id],

      function(err, result) {
        //call `done()` to release the client back to the pool
        done();
        if(err) {
          return console.error('Error adding item', err);
        }
        res.json(true);
      });
  }); 

});


/***************************************************************************************************************************************************
**************************************************  DEL METHODS ******************************************************
****************************************************************************************************************************************************/

app.del("/shoppingCart/delete/:id", function(req, res){
	var itemId = req.params.id;
	console.log("DEL: id= " +itemId);

  //QUERY DB to update the total_items count of this user and the items_in_cart entries.
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    client.query('DELETE FROM items_in_cart WHERE item_id = $1 AND shopping_cart_id IN (SELECT shopping_cart_id FROM shopping_cart WHERE owner_id = $2)', [itemId, req.session.account_id],

      function(err, result) {
        //call `done()` to release the client back to the pool
        done();
        if(err) {
          return console.error('error running query', err);
        }
        res.json(true);
      });
  });	

});

app.del("/removeStore/storeId/:storeId", function(req, res){
	var storeToRemove = req.params.storeId;
	console.log("DELETE: "+storeToRemove);
	 

  //QUERY DB to update the total_items count of this user and the items_in_cart entries.
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    client.query('UPDATE category SET is_active = false WHERE parent_category_id = $1', [storeToRemove],

      function(err, result) {
        //call `done()` to release the client back to the pool
        done();
        if(err) {
          return console.error('error running query', err);
        }
        res.json(true);
      });
  }); 

});

app.del("/user/delete/:id", function(req, res){
  var userId = req.params.id;
  console.log("DEL: id= " +userId);

  //QUERY DB to update the total_items count of this user and the items_in_cart entries.
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    client.query('UPDATE web_user SET is_active = false WHERE account_id = $1', [userId],

      function(err, result) {
        //call `done()` to release the client back to the pool
        done();
        if(err) {
          return console.error('error running query', err);
        }
        res.json(true);
      });
  }); 

});

http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
});



