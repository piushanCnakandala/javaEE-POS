function CustomerDTO(Id,Name,Age,Tp){
    var __customerId=Id;
    var __customerName=Name;
    var __customerAge=Age;
    var __customerTp=Tp;

    this.getCustomerId =function (){
        return __customerId;
    }

    this.setCustomerId =function (id){
        __customerId=id;
    }

    this.getCustomerName =function (){
        return __customerName;
    }
    this.setCustomerName =function (name){
        __customerName=name;
    }

    this.getCustomerAge =function (){
        return __customerAge;
    }
    this.setCustomerAge =function (age){
        __customerAge=age;
    }

    this.getCustomerTp =function (){
        return __customerTp;
    }
    this.setCustomerTp =function (tp){
        __customerTp=tp;
    }
}