module.exports =  { 
	StoreItem : function (itemName, category, price, description, rating, picture, auctionOrSale){
		this.id = "";
		this.itemName = itemName;
		this.category = category;
		this.price = price;
		this.description = description;
		this.rating = rating;
		this.picture = picture;
		this.auctionOrSale = auctionOrSale;
	}
}

