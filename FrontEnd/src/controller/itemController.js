
generateItemId();
loadAllItems();

            // CRUD Operations

$("#addItem").click(function () {

    $("#itemTable>tr").off("click");
    $.ajax({
       url: "http://localhost:8080/backend/item" ,
        method: "POST",
        data: $("#itemForm").serialize(),
        success:function (resp){
           if (resp.status==200){
               loadAllItems();
               generateItemId()
               loadAllItemIds();
           }else {
               alert(resp.data)
           }
        },
        error:function (ob,textStatus,error){
            console.log(ob);
            console.log(textStatus);
            console.log(error);
        }
    });

    /*var itemOB=new ItemDTO(itemId,itemName,itemQuantity,itemPrice);

    itemDB.push(itemOB);*/
   /* loadAllItems();
    clearInputItemFields();*/

});  //item add


 $("#btnDelete").click(function () {
        let itemId = $("#inputItemId").val();
        $.ajax({
            url:`http://localhost:8080/backend/item?customerID=${itemId}`,
            method: "DELETE",
            success:function (resp){
                if (resp.status==200){
                    loadAllItems();
                    clearInputItemFields();
                    generateItemId();
                }else {
                    alert(resp.data);
                }
            }
        });
    });  //item Delete


$("#btnItemUpdate").click(function (){
    var itemData = {
        id: $("#inputItemId").val(),
        name: $("#inputItemName").val(),
        qty: $("#inputQuantity").val(),
        price: $("#inputItemPrice").val()
    }
    $.ajax({
        url:`http://localhost:8080/backend/item`,
        method:"PUT",
        data: JSON.stringify(itemData),
        success:function (resp){
            if (resp.status==200){
               loadAllItems();
               clearFields();
            }else {
                alert(resp.data);
            }
        }
    });
});  //item Update


            // ----------End CRUD Operations

////////////////////////////////////////////////////////////////////////////

                       //other Methods

$("#btnSearchItem").click(function (){
    var searchId=$("#txtItemSearch").val();
    var response=searchItem(searchId);
    if(response){
        $("#inputItemId").val(response.getItemId());
        $("#inputItemName").val(response.getItemName());
        $("#inputQuantity").val(response.getItemQty());
        $("#inputItemPrice").val(response.getItemPrice());

    }else {
        clearFields();
        alert("no such a Item");

    }
});  //search Item

$("#btnClear").click(function (){
    clearFields();
}) //btn clear



function searchItem(id){
    for(let i =0;i<itemDB.length;i++){
        if(itemDB[i].getItemId()==id){
            return itemDB[i];

        }

    }
}

function loadAllItems(){ //input data to table
    $("#itemTable").empty();
    $.ajax({
        url :"http://localhost:8080/backend/item?option=GetAll",
        method :"GET",
        success:function (resp){
            console.log(resp);
            for (const item of resp.data){
                let raw = `<tr><td>${item.itemId}</td><td>${item.name}</td><td>${item.qtyOnHand}</td><td>${item.unitPrice}</td></tr>`
                $("#itemTable").append(raw);
                bindItemRow();

            }

        }
    });
    /*for(var i of itemDB){
        let raw = `<tr><td>${i.getItemId()}</td><td>${i.getItemName()}</td><td>${i.getItemQty()}</td><td>${i.getItemPrice()}</td></tr>`
        $("#itemTable").append(raw);
        bindItemRow();
        deleteItem();

    }*/
}

function bindItemRow(){
    $("#itemTable>tr").click(function () {  //return data to the text fields

        let itemId = $(this).children(":eq(0)").text();
        let itemName = $(this).children(":eq(1)").text();
        let itemQuantity = $(this).children(":eq(2)").text();
        let itemPrice = $(this).children(":eq(3)").text();


        $("#inputItemId").val(itemId);    //set vales for the input fields
        $("#inputItemName").val(itemName);
        $("#inputQuantity").val(itemQuantity);
        $("#inputItemPrice").val(itemPrice);

    });
}

$("#btnClear").click(function (){
    clearFields();
});

function clearInputItemFields(){    //clear input text fiels
    $("#inputItemName,#inputItemId,#inputQuantity,#inputItemPrice").val("");
}

function generateItemId() {

    $.ajax({
        url:"http://localhost:8080/backend/item?option=GenId",
        method:"GET",
        success:function (resp){
            if (resp.status==200){
                $("#inputItemId").val(resp.data.id);
            }else {
                alert(resp.data);
            }

        }
    });

}



$("#inputItemId").keydown(function (event) { //text fields focusing
    if (event.key == "Enter") {
        $("#inputItemName").focus();
    }
});

$("#inputItemName").keydown(function (event) {
    if (event.key == "Enter") {
        $("#inputQuantity").focus();
    }
});

$("#inputQuantity").keydown(function (event) {
    if (event.key == "Enter") {
        $("#inputItemPrice").focus();
    }
});




// Validations

