function ItemDTO(id,name,qty,price){
    var __id=id;
    var __name=name;
    var __qty=qty;
    var __price=price;

    this.setItemId= function (id){
        __id=id;
    }
    this.getItemId= function (){
        return __id;
    }
    this.setItemName= function (name){
        __name=name;
    }
    this.getItemName= function (){
        return __name;
    }
    this.setItemQty= function (qty){
        __qty=qty;
    }
    this.getItemQty= function (){
        return __qty;
    }
    this.setItemPrice= function (price){
        __price=price;
    }
    this.getItemPrice= function (){
        return __price;
    }
}