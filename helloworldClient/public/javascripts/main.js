
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
    //$.get('/state', (data,textStatus,jqXHR) =>{
       const data1 = document.getElementById('textInput1').value
      $.post('/state1',{data1:data1}, (data,textStatus,jqXHR) =>{
       // alert("your data is : " + data.balance)
  },'json');
}
 

function writereg(event){
    event.preventDefault();
       const pvtkey = document.getElementById('pvtkey').value
      $.post('/regstr',{key:pvtkey},'json');
}

function writeusr(event){
    event.preventDefault();
       const pvtkey = document.getElementById('usrpvtkey').value
       const adhar_no = document.getElementById('adhar').value
       const usr_name = document.getElementById('name').value
      $.post('/usr',{key:pvtkey,no:adhar_no,name:usr_name},'json');
}