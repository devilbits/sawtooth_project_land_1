

function writereg(event){
    event.preventDefault();
       var pvtkey = document.getElementById('pvtkey').value;
      $.post('/regstr',{key:pvtkey},'json');
}

function writeusr(){
    // event.preventDefault();
        console.log('write user function running');
       var pvtkey = document.getElementById('usrpvtkey').value
       var adhar_no = document.getElementById('adhar').value
       var usr_name = document.getElementById('name').value
      $.post('/usr',{key:pvtkey,no:adhar_no,name:usr_name},(data, textStatus, jqXHR)=>{
        if(data.ss=1){
          console.log('inside aaaa');
         sessionStorage.clear();
         sessionStorage.setItem("no",data.no);
         sessionStorage.setItem("name",data.name);
        window.location.href="/usr";
         }else{window.location.href="/test"}
      }'json');
}
