const {createHash} = require('crypto')
const {CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const protobuf = require('sawtooth-sdk/protobuf')
const fs = require('fs')
const http = require('http');
const fetch = require('node-fetch');
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1')	
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')


FAMILY_NAME='landreg'

prkey = "";
function hash(v) {
  return createHash('sha512').update(v).digest('hex');
}

class UserClient{
  constructor(key,id,name,property_name,property_area,property_location){
    if(key){prkey=key;}
    else if(key==undefined | key==null){key=prkey;}
    const context = createContext('secp256k1');
    console.log('key111111:'+key);
    const secp256k1pk = Secp256k1PrivateKey.fromHex(key.trim());
    this.signer = new CryptoFactory(context).newSigner(secp256k1pk);
    this.publicKey = this.signer.getPublicKey().asHex();
    //this.address = hash("landreg").substr(0, 6) + hash(this.publicKey).substr(0, 64);
   this.address = hash(FAMILY_NAME).substr(0, 6) +hash(property_location).substr(0,10)+hash(property_area).substr(0,10)+hash(property_name).substr(0,10)+hash(this.publicKey).substr(0, 34);;

    console.log("Storing at: " + this.address);
    
  }



send_data(values){
  
  var payload = ''
  const address = this.address;
  var inputAddressList = [address];
  var outputAddressList = [address];
  payload = values;
  console.log('payload'+payload);
  var encode =new TextEncoder('utf8');
  const payloadBytes = encode.encode(payload)
  const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: 'landreg',
    familyVersion: '1.0',
    inputs: inputAddressList,
    outputs: outputAddressList,
    signerPublicKey: this.signer.getPublicKey().asHex(),
    nonce: "" + Math.random(),
    batcherPublicKey: this.signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: hash(payloadBytes),
  }).finish();

  const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: this.signer.sign(transactionHeaderBytes),
    payload: payloadBytes
  });
  
  console.log("transacction")
  const transactions = [transaction];
  const  batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: this.signer.getPublicKey().asHex(),
    transactionIds: transactions.map((txn) => txn.headerSignature),
  }).finish();

  const batchSignature = this.signer.sign(batchHeaderBytes);
  const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: batchSignature,
    transactions: transactions,
  });

  const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
  }).finish();
console.log("restapi")
  this._send_to_rest_api(batchListBytes);	
}


async _send_to_rest_api(batchListBytes){
  if (batchListBytes == null) {
    try{
    var geturl = 'http://rest-api:8008/state/'+this.address
    console.log("Getting from: " + geturl);
    let response=await fetch(geturl, {
      method: 'GET',
    })
    let responseJson = await response.json();
      var data = responseJson.data;
      var newdata = new Buffer(data, 'base64').toString();
      return newdata;
    }
    catch(error) {
      console.error(error);
    }	
  }
  else{
    console.log("new code");
    try{
   let resp =await fetch('http://rest-api:8008/batches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream'},
      body: batchListBytes
      })
         console.log("response", resp);
      }
       catch(error) {
         console.log("error in fetch", error);
       
     } 
 }
}

 async getState (address, isQuery) {
    let stateRequest = 'http://rest-api:8008/state';
    if(address) {
      if(isQuery) {
        stateRequest += ('?address=')
      } else {
        stateRequest += ('/address/');
      }
      stateRequest += address;
    }
    let stateResponse = await fetch(stateRequest);
    let stateJSON = await stateResponse.json();
    return stateJSON;
  }

 async getData() {
    let addr = hash("landreg").substr(0, 6);
    return this.getState(addr, true);
  }


}module.exports.UserClient = UserClient;
