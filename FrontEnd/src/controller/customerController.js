            //--------------- CRUD Operations-----------------//
generateCustomerId();
//customer add

    $("#addCust").click(function () {
        $("#customerTable>tr").off("click");

        let customerId = $("#inputCId").val();
        let customerName = $("#inputCName").val();
        let customerAge = $("#inputCAge").val();
        let customerTp = $("#inputCTp").val();


        /*var customerOB = {   //input data to array
            id: customerId,
            name: customerName,
            age: customerAge,
            tp: customerTp

        };*/

         var customerOB= new CustomerDTO(customerId,customerName,customerAge,customerTp);

        customerDB.push(customerOB);
        loadAllCustomer();

        clearFields();
        generateCustomerId();
         ();

    });

//customer delete


function deleteCustomer(){

    $("#customerDelete").click(function () {
        let customerId = $("#inputCId").val();
       for (let i=0;i< customerDB.length;i++){
           if (customerDB[i].getCustomerId()==customerId){
               customerDB.splice(i,1);
           }
       }
loadAllCustomer();
       clearFields();
       generateCustomerId();
    });
}




//customer Update

$("#customerUpdate").click(function (){
    let customerId = $("#inputCId").val();
    let customerName = $("#inputCName").val();
    let customerAge = $("#inputCAge").val();
    let customerTp = $("#inputCTp").val();

    for (var i = 0; i < customerDB.length; i++) {
            if (customerDB[i].getCustomerId()==customerId){

                customerDB[i].setCustomerName(customerName);
                customerDB[i].setCustomerAge(customerAge);
                customerDB[i].setCustomerTp(customerTp);
                loadAllCustomer();
                clearFields();
                generateCustomerId();
                /*$("#btnUpdate").prop('disabled', true);*/
            }
    }
});

              // ----------End CRUD Operations------------------------//

//btn clear

 $("#clearField").click(function (){
     clearFields();
 });


$("#inputCId").keydown(function (event) {  //text fields focusing
    if (event.key == "Enter") {
        $("#inputCName").focus();
    }
});

$("#inputCName").keydown(function (event) {
    if (event.key == "Enter") {
        $("#inputCAge").focus();
    }
});

$("#inputCAge").keydown(function (event) {
    if (event.key == "Enter") {
        $("#inputCTp").focus();
    }
});


function loadAllCustomer(){ //input data to table
    $("#customerTable").empty();
for(var i of customerDB){
    let raw = `<tr><td>${i.getCustomerId()}</td><td>${i.getCustomerName()}</td><td>${i.getCustomerAge()}</td><td>${i.getCustomerTp()}</td></tr>`
    $("#customerTable").append(raw);
    bindCustomer();
    deleteCustomer();
}
}


//search customer

$("#btnCustomerSearch").click(function (){
var searchId=$("#txtCustomerSearch").val();
var response=searchCustomer(searchId);
if(response){
    $("#inputCId").val(response.getCustomerId());
    $("#inputCName").val(response.getCustomerName());
    $("#inputCAge").val(response.getCustomerAge());
    $("#inputCTp").val(response.getCustomerTp());

}else {
    clearFields();
    alert("no such a customer");

}
});

function searchCustomer(id){
    for(let i =0;i<customerDB.length;i++){
        if(customerDB[i].getCustomerId()==id){
            return customerDB[i];

        }

    }
}

function bindCustomer(){
    $("#customerTable>tr").click(function () {  //return data to the text fields
        let customerId = $(this).children(":eq(0)").text();
        let customerName = $(this).children(":eq(1)").text();
        let customerAge = $(this).children(":eq(2)").text();
        let customerTp = $(this).children(":eq(3)").text();

        $("#inputCId").val(customerId); //set vales for the input fields
        $("#inputCName").val(customerName);
        $("#inputCAge").val(customerAge);
        $("#inputCTp").val(customerTp);
    });
}

function clearFields(){
    $("#inputCName,#inputCAge,#inputCTp,#inputCId").val("");
}


function generateCustomerId() {

    let index = customerDB.length - 1;
    let id;
    let temp;
    if (index != -1) {
        id = customerDB[customerDB.length - 1].getCustomerId();
        temp = id.split("-")[1];
        temp++;
    }

    if (index == -1) {
        $("#inputCId").val("C00-001");
    } else if (temp <= 9) {
        $("#inputCId").val("C00-00" + temp);
    } else if (temp <= 99) {
        $("#inputCId").val("C00-0" + temp);
    } else {
        $("#inputCId").val("C00-" + temp);
    }

}


// Validations

