
  /*hide order part  and item part*/
document.getElementById("ItemPage").style.setProperty("Display","none","important");
document.getElementById("Order Page").style.setProperty("Display","none","important");

 /*click event navbar*/
document.getElementById("click-Home").addEventListener("click",function (){
    document.getElementById("HomePage").style.setProperty("Display","block","important");
    document.getElementById("ItemPage").style.setProperty("Display","none","important");
    document.getElementById("Order Page").style.setProperty("Display","none","important");
});

  document.getElementById("click-Item").addEventListener("click",function (){
      document.getElementById("ItemPage").style.setProperty("Display","block","important");
      document.getElementById("HomePage").style.setProperty("Display","none","important");
      document.getElementById("Order Page").style.setProperty("Display","none","important");
  });

  document.getElementById("click-Order").addEventListener("click",function (){
      document.getElementById("Order Page").style.setProperty("Display","block","important");
      document.getElementById("HomePage").style.setProperty("Display","none","important");
      document.getElementById("ItemPage").style.setProperty("Display","none","important");
  });