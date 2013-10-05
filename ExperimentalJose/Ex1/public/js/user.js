module.exports =  { 
	User : function (accounNumber, costumerName, password, ccNumber, mAddressID, bAddressID, shoppingID, emailAddress, userType){
		this.accountNumber = accountNumber;
		this.costumerName = costumerName;
		this.password = password;
		this.ccNumber = ccNumber;
		this.mAddressID = mAddressID;
		this.bAddressID = bAddressID;
		this.shoppingID = shoppingID;
		this.emailAddress = emailAddress;
		this.userType = userType;
		
	}

}