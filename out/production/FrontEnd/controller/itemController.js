// CRUD Operations
generateItemId();

//item add

$("#addItem").click(function () {

    $("#itemTable>tr").off("click");

    let itemId = $("#inputItemId").val();
    let itemName = $("#inputItemName").val();
    let itemQuantity = $("#inputQuantity").val();
    let itemPrice= $("#inputItemPrice").val();


   /* var itemOB={
        id:itemId,
        name:itemName,
        qty:itemQuantity,
        price:itemPrice

    };*/

    var itemOB=new ItemDTO(itemId,itemName,itemQuantity,itemPrice);

    itemDB.push(itemOB);
    loadAllItems();
    clearInputItemFields();
    generateItemId();
    loadAllItemIds();

});


//item Delete

function deleteItem(){

    $("#btnDelete").click(function () {
        let itemId = $("#inputItemId").val();
        for (let i=0;i< itemDB.length;i++){
            if (itemDB[i].getItemId()==itemId){
                itemDB.splice(i,1);
            }
        }
        loadAllItems();
        clearInputItemFields();
        generateItemId();

    });
}

//item Update

$("#btnItemUpdate").click(function (){
    let itemId = $("#inputItemId").val();
    let itemName = $("#inputItemName").val();
    let itemQuantity = $("#inputQuantity").val();
    let itemPrice= $("#inputItemPrice").val();

    for (var i=0;i<itemDB.length;i++) {
        if (itemDB[i].getItemId()== itemId) {

            itemDB[i].setItemName(itemName);
            itemDB[i].setItemQty(itemQuantity);
            itemDB[i].setItemPrice(itemPrice);

            loadAllItems();
            clearFields();
            generateItemId();
        }
    }
});


            // ----------End CRUD Operations

//btn clear

$("#btnClear").click(function (){
    clearFields();
})

function loadAllItems(){ //input data to table
    $("#itemTable").empty();
    $.ajax({
        url :"http://localhost:8080/backend/item",
        method :"GET",
        success:function (resp){
            console.log(resp);

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

   //search Item

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
});

function searchItem(id){
    for(let i =0;i<itemDB.length;i++){
        if(itemDB[i].getItemId()==id){
            return itemDB[i];

        }

    }
}

$("#btnClear").click(function (){
    clearFields();
});


function clearInputItemFields(){    //clear input text fiels
    $("#inputItemName,#inputItemId,#inputQuantity,#inputItemPrice").val("");
}


function generateItemId() {

    let index = itemDB.length - 1;
    let id;
    let temp;
    if (index != -1) {
        id = itemDB[itemDB.length - 1].getItemId();
        temp = id.split("-")[1];
        temp++;
    }

    if (index == -1) {
        $("#inputItemId").val("I00-001");
    } else if (temp <= 9) {
        $("#inputItemId").val("I00-00" + temp);
    } else if (temp <= 99) {
        $("#inputItemId").val("I00-0" + temp);
    } else {
        $("#inputItemId").val("I00-" + temp);
    }

}


// Validations

