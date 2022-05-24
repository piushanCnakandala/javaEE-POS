loadAllCustomerIds();
selectedCustomer();
selectedItem();
loadAllItemIds();
generateOrderId();
setDate();



var  selectedCustomerId;
var  selectedItemId;

$("#btnAddToCart").click(function (){
addCart();
    clearInputItems();


});

$("#btnPurchase").click(function () {
    purchaseOrder();

})


$("#dis").keyup(function(event){
    discountCal();
});

$("#cash1").keyup(function (event) {
    let subTotal = parseInt($("#lblTotal").text());
    let cash = parseInt($("#cash1").val());
    let balance = cash - subTotal;
    $("#balance").val(balance);

});


//////////////-load customer and item ids /////////////////////////////////////



$("#idCustCmb").change(function (e){
     selectedCustomerId =$('#idCustCmb').find(":selected").text();
    selectedCustomer(selectedCustomerId);
});


$("#idItemCmb").change(function (e){
     selectedItemId =$('#idItemCmb').find(":selected").text();
    selectedItem(selectedItemId);
});

             /* load customer ids to cmb (customer)*/
function loadAllCustomerIds() {
    $("#idCustCmb").empty();
    let cusHint = `<option disabled selected>Select Customer ID</option>`;
    $("#idCustCmb").append(cusHint);
      $.ajax({
          url : `http://localhost:8080/backend/order?option=cmb_all_customer_Ids`,
          method:"GET",
          success:function (resp) {
              if (resp.status==200){
                  for (const customer of resp.data) {
                      let option = `<option value="${customer.id}">${customer.id}</option>`;
                      $("#idCustCmb").append(option);
                  }
              }else {
                  alert(resp.data);
              }
          }
      });
}
             /*load customer data to text fields*/
function selectedCustomer(CustomerId){


    $.ajax({
        url:`http://localhost:8080/backend/order?option=selected_cus_data&selectCusId=${CustomerId}`,
        method:"GET",
        success:function (resp){
            if (resp.status==200){
                for (const customer of resp.data) {
                    $("#txtcusName").val(customer.cusName);
                    $("#txtAge").val(customer.cusAddress);
                    $("#txtTp").val(customer.cusSalary);
                }
            }else {
                alert(resp.data);
            }
        }
    });
}


/* load item ids to cmb (item)*/
function loadAllItemIds() {
    $("#idItemCmb").empty();
    let itemHint = `<option disabled selected>Select Item ID</option>`;
    $("#idItemCmb").append(itemHint);
    $.ajax({
        url : `http://localhost:8080/backend/order?option=cmb_all_item_Ids`,
        method:"GET",
        success:function (resp) {
            if (resp.status==200){
                for (const item of resp.data) {
                    let option = `<option value="${item.itemId}">${item.itemId}</option>`;
                    $("#idItemCmb").append(option);
                }
            }else {
                alert(resp.data);
            }
        }
    });

}
/*load item data to text fields*/
function selectedItem(ItemId){

    $.ajax({
        url:`http://localhost:8080/backend/order?option=selected_item_data&selectItemId=${ItemId}`,
        method:"GET",
        success:function (resp){
            if (resp.status==200){
                for (const item of resp.data) {
                    $("#txtitemName").val(item.itemName);
                    $("#txtqtyOnHand").val(item.itemAddress);
                    $("#txtprice").val(item.itemSalary);
                }
            }else {
                alert(resp.data);
            }
        }
    });

}
////////////////////////////////////////////////////////////////////////////////////////

//generate order Id

function generateOrderId() {

    $.ajax({
        url: "http://localhost:8080/backend/order?option=GENERATED_OID", method: 'GET', success: function (resp) {
            if (resp.status == 200) {
                $("#oIdItxt").val(resp.data.oId);
            } else {
                alert(resp.data);
            }
        }

    });

}

//set date

function setDate() {
    let d = new Date();
    let dd = d.toISOString().split("T")[0].split("-");
    $("#txtDate").val(dd[0]+"-"+dd[1]+"-"+dd[2]);
    $("#txtDate").text(dd[0]+"-"+dd[1]+"-"+dd[2]);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// add to cart

var fullTotal =0;

function addCart(){
    let itemCode =selectedItemId;
    let itemName=$("#txtitemName").val();
    let qtyOnHand=parseInt($("#txtqtyOnHand").val());
    let price=$("#txtprice").val();
    let orderQty=parseInt($("#oQty").val());
    let total= 0;

    if (qtyOnHand+1 <= orderQty) {

        alert("Enter Valid QTY");
        $("#oQty").val("");
        return;
    }
        qtyOnHand = qtyOnHand - orderQty;



    //updateing qty

    for (let i = 0; i < itemDB.length; i++) {
        if (itemCode == itemDB[i].getItemId()) {
            itemDB[i].setItemQty(qtyOnHand);
        }
    }

    let newQty = 0;
    let newTotal= 0;

    if (checkDuplicates(itemCode)==-1) {
        total = orderQty * price;
        fullTotal = fullTotal + total;
        let row =
            `<tr><td>${itemCode}</td><td>${itemName}</td><td>${price}</td><td>${orderQty}<td>${total}</td></tr>`;
        $("#orderTbody").append(row);
        $("#lblTotal").text(fullTotal+" LKR");


        clearInputItems();

    }else{

        let rowNo = checkDuplicates(itemCode);
        newQty = orderQty;
        let oldQty = parseInt($($('#orderTbody>tr').eq(rowNo).children(":eq(3)")).text());
        let oldTotal = parseInt($($('#orderTbody>tr').eq(rowNo).children(":eq(4)")).text());

        fullTotal = fullTotal-oldTotal;
        newQty = parseInt(oldQty) + parseInt(newQty) ;
        newTotal = newQty * price;
        fullTotal = fullTotal + newTotal;

        //Update row
        $('#orderTbody tr').eq(rowNo).children(":eq(3)").text(newQty);
        $('#orderTbody tr').eq(rowNo).children(":eq(4)").text(newTotal);

        $("#lblFullTotal").text(fullTotal+" LKR");
        $("#subTotal").text(fullTotal+" LKR");
        clearInputItems();
    }


}


/* Check Duplicate Item */
function checkDuplicates(itemId) {
    for (let i = 0; i < $("#orderTbody> tr").length; i++) {
        if (itemId == $('#orderTbody').children().eq(i).children().eq(0).text()) {
            alert(i);
            return i;
        }

    }
    return -1;
}

/* Clear Input Field on Selected Item Area */
function clearInputItems() {
    $("#idItemCmb").val("");
    $("#txtitemName").val("");
    $("#txtqtyOnHand").val("");
    $("#txtprice").val("");
    $("#oQty").val("");
}



function discountCal() {

    var discount =0;
    var discounted_price=0;
    var tempDiscount=0;

    discount = parseInt($("#dis").val());
    tempDiscount = 100-discount;
    discounted_price = (tempDiscount*fullTotal)/100;
    console.log(typeof discounted_price);
    $("#subTotal").text(discounted_price +" LKR");

}

function purchaseOrder() {

    var obj = {
        order: {
            orderId:$("#oIdItxt").val(),
            customer: selectedCustomerId,
            orderDate: $("#txtDate").val(),
            discount: parseInt($("#dis").val()),
            total: $("#lblTotal").text().split(" ")[0],
            subTotal: $("#subTotal").text().split(" ")[0]
        },
        orderDetail:[]
    }

    for (let i = 0; i < $('#orderTbody tr').length; i++) {

        tblItemId = $('#orderTbody').children().eq(i).children().eq(0).text();
        tblItemName = $('#orderTbody').children().eq(i).children().eq(1).text();
        tblItemPrice = $('#orderTbody').children().eq(i).children().eq(2).text();
        tblItemQty = $('#orderTbody').children().eq(i).children().eq(3).text();
        tblItemTotal = $('#orderTbody').children().eq(i).children().eq(4).text();

        var details = {
            itemCode:tblItemId,
            itemName:tblItemName,
            itemPrice:tblItemPrice,
            itemQty:tblItemQty,
            itemTotal:tblItemTotal
        }
        obj.orderDetail.push(details);

    }
    console.log(JSON.stringify(obj));

    $.ajax({
        url: "http://localhost:8080/backend/order",
        method: "POST",
        data: JSON.stringify(obj),
        success: function (resp) {
            if (resp.status==200){
                generateOrderId();
                clearPurchaseFields();
            }else {
                alert(resp.data);
            }
        }
    });

}



