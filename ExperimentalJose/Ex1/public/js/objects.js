module.exports =  { 
	StoreItem : function (itemName, store, category, price, description, rating, picture, auctionOrSale){
		this.id = "";
		this.itemName = itemName;
		this.category = category;
		this.store = store;
		this.price = price;
		this.description = description;
		this.rating = rating;
		this.picture = picture;
		this.auctionOrSale = auctionOrSale;
	}

}

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



