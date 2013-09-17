module.exports =  { 
	StoreItem : function (itemName, store, price, description, rating, picture, auctionOrSale){
		this.id = "";
		this.itemName = itemName;
		this.store = store;
		this.price = price;
		this.description = description;
		this.rating = rating;
		this.picture = picture;
		this.auctionOrSale = auctionOrSale;
	}
}

