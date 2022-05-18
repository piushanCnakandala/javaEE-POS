            //--------------- CRUD Operations-----------------//
generateCustomerId();
//customer add

    $("#addCust").click(function () {
        $("#customerTable>tr").off("click");

        $.ajax({
            url: "http://localhost:8080/backend/customer",
            method: "POST",
            data:$("#customerForm").serialize(),
            success:function (resp){
                if (resp.status==200){
                    loadAllCustomer();
                    generateCustomerId();

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


         var customerOB= new CustomerDTO(customerId,customerName,customerAge,customerTp);
        customerDB.push(customerOB);


        clearFields();
        generateCustomerId();
*/

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

loadAllCustomer();
generateCustomerId();

function loadAllCustomer(){ //input data to table
    $("#customerTable").empty();
    $.ajax({
        url :"http://localhost:8080/backend/customer?option=GetAll",
        method:"GET",
        success:function (resp){
            console.log(resp);
            for (const customer of resp.data){
                let raw = `<tr><td>${customer.id}</td><td>${customer.name}</td><td>${customer.address}</td><td>${customer.salary}</td></tr>`
                $("#customerTable").append(raw);
                bindCustomer();
                deleteCustomer();
            }
        }
    });
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

    $.ajax({
        url:"http://localhost:8080/backend/customer?option=GenId",
        method:"GET",
        success:function (resp){
            if (resp.status==200){
                $("#inputCId").val(resp.data.id);
            }else {
                alert(resp.data);
            }

        }
    });

}


// Validations

