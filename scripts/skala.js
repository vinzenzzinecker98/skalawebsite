let timer;

document.addEventListener('input', e => {
  const el = e.target;
  
  if( el.matches('[data-color]') ) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      document.documentElement.style.setProperty(`--color-${el.dataset.color}`, el.value);
    }, 100)
  }
})

function readclipboard(){  
  try{
  navigator.clipboard.readText()
  .then(text => {
    document.getElementById("pw-decrypt").value = text;    
  })
  .catch(err => {
    
    alert('Berechtigung nicht erteilt');
  });
}
catch(e){
  alert("Nicht unterstützt vom aktuellen Browser");
}  
}

function getmypw(){
    var pw = document.getElementById('chosenpw').value;
    CopyMe(pw);
}
function computeskala(){
    var number = document.getElementById('skalanumber').value;
    var passwort = document.getElementById("chosenpw").value;
    var code = encrypt(number, passwort);
    var website = "https://vinzenzzinecker98.github.io/skalawebsite/check.html?code=";
    //website = "file:///C:/Users/Lenovo/OneDrive/Dokumente/skala/check.html?code=";
    link = website + code ;
    CopyMe(link);
    alert("Link kopiert");
  }

  function decryptskala(){
      var code = findGetParameter("code");
      if(code == null){
        alert("Kein Code erkannt!");
        location.href='https://vinzenzzinecker98.github.io/skalawebsite/';
      }
      else{
      var password = document.getElementById("pw-decrypt");
      var decrypted = decrypt(code, password);
      document.getElementById("zahl-decrypt").value=decrypted;
      }
  }

  function encrypt (number, passwort){
      var pw = CryptoJS.SHA256(passwort);
      var encrypted = CryptoJS.AES.encrypt(number, String(pw));
      h = CryptoJS.SHA256(pw + encrypted.salt); // Hash von Passwort-Hash + Salt
      var e = h + encrypted.salt + String(encrypted); //alert(e.length); // encrypt ist vom type object
      return e
  }

  function decrypt(code, passwort){
      passwort=passwort.value;
      var pws = code.substring(0, 80); //alert (pws); 	// 80 zeichen hash+salt
      var pw_h2 = pws.substring(0, 64); //alert("hash: "+pw_h2); 		// Übermittelter Hash (aus Passwort + Salt)
      var salt = pws.substr(64); //alert (salt); 		// Salt 16 Zeichen	
          
      var pw = CryptoJS.SHA256(passwort); // Hash Passwort 
      
      pw_h1 = CryptoJS.SHA256(pw + salt); // Hash aus Passwort-Hash + salt

          // Hashs vergleichen
          if (pw_h1 != pw_h2) {                              
              alert ("Das Passwort ist falsch!"); //immer schön Alörts setzen
              return ""
          } else {
              // Wenn die Passworte übereinstimmen                
              encrypted = code.substr(80); // Passworthash + salt(80) abschneiden

              var decrypted = CryptoJS.AES.decrypt(encrypted, String(pw)) // entschlüsseln

              decrypted = decrypted.toString(CryptoJS.enc.Utf8);
              alert("Die Zahl war: " + decrypted)
              return decrypted;                
          }            
  }