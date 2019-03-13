
function writemsg(event){
    event.preventDefault();
    const data1 = document.getElementById('textInput1').value
    const data2 = document.getElementById('textInput2').value
    const data3 = document.getElementById('textInput3').value

    console.log(data1,data2,data3);
    if (data1.length==0){
        alert("Please enter the data")
    }
    else{
    $.post('/reg', {  data1: data1,data2: data2,data3: data3 },'json');

}
   // const data4 = document.getElementById()
}

function readmsg(event){
    event.preventDefault();
    $.get('/state',  (data,textStatus,jqXHR) =>{
        alert("your data is : " + data.balance[0]+" "+data.balance[1]+" "+data.balance[2])
       /* document.getElementById("textInput1").value ="Your data is " + data.balance[0],
document.getElementById("textInput2").value ="Your data is " + data.balance[1],
document.getElementById("textInput3").value ="Your data is " + data.balance[2], 
      */},'json');
}
 
