
generateCustomerId();
loadAllCustomer();

                //--------------- CRUD Operations-----------------//

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
                    loadAllCustomerIds();

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


    });  //customer add

function deleteCustomer(){

    $("#customerDelete").click(function () {
        let tempData=$("#inputCId").val();
        $.ajax({
            url:`http://localhost:8080/backend/customer?customerID=${tempData}`,
            method:"DELETE",
            success:function (resp){
                if (resp.status==200){
                    loadAllCustomer();
                    clearFields();
                    generateCustomerId();

                }else {
                    alert(resp.data);
                }
            }
        })

    });
} //customer delete

$("#customerUpdate").click(function (){
    var cusData = {
        id: $("#inputCId").val(),
        name: $("#inputCName").val(),
        address: $("#inputCAge").val(),
        salary: $("#inputCTp").val()
    }
    $.ajax({
        url:`http://localhost:8080/backend/customer`,
        method:"PUT",
        data: JSON.stringify(cusData),
        success:function (resp){
            if (resp.status==200){
                loadAllCustomer();
                clearFields();
            }else {
                alert(resp.data);
            }
        }
    });

});  //customer Update

///////////////////////////////////////////////////////////////////////////////////////////
              //Other Methods

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
});  //search customer

 $("#clearField").click(function (){
     clearFields();
 });    //btn clear

//////////////////////////////////////////////////////////////////////////////////

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






// Validations

