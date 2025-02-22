const urlBase = "http://contactmanagerproject.com/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";
const ids = [];

var contactLength = 25;

const currentUrl = document.URL;

function doLogin() {
  //if (event) event.preventDefault();

  userId = 0;
  firstName = "";
  lastName = "";

  let loginElement = document.getElementById("username");
  let passwordElement = document.getElementById("password");

  let login = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  let firstSymbol = document.getElementById("firstSymbol");
  let lastSymbol = document.getElementById("lastSymbol");

  firstSymbol.classList.add("hidden");
  lastSymbol.classList.add("hidden");

  var hash = md5(password);

  if (!validLoginForm(login, password)) {
    console.log("The login is not valid");

    if (login.trim() === "" && password.trim() === "") {
      document.getElementById("loginResult").innerHTML =
        "Please enter a username/password";
      loginElement.classList.add("border-red-500");
      passwordElement.classList.add("border-red-500");
      firstSymbol.classList.remove("hidden");
      lastSymbol.classList.remove("hidden");
      return;
    } else if (login.trim() === "") {
      document.getElementById("loginResult").innerHTML =
        "Please enter a username";
      loginElement.classList.add("border-red-500");
      passwordElement.classList.remove("border-red-500");
      firstSymbol.classList.remove("hidden");
      lastSymbol.classList.add("hidden");
      return;
    } else if (password.trim() === "") {
      document.getElementById("loginResult").innerHTML =
        "Please enter a password";
      passwordElement.classList.add("border-red-500");
      loginElement.classList.remove("border-red-500");
      firstSymbol.classList.add("hidden");
      lastSymbol.classList.remove("hidden");
      return;
    }

    return;
  }

  //document.getElementById("loginResult").innerHTML = "";

  let tmp = { login: login, password: hash };
  //let tmp = { login: login, password: password };

  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/Login." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;
        console.log(userId);

        if (userId < 1) {
          document.getElementById("loginResult").innerHTML =
            "User/Password combination incorrect";
          loginElement.classList.add("border-red-500");
          passwordElement.classList.add("border-red-500");
          firstSymbol.classList.remove("hidden");
          lastSymbol.classList.remove("hidden");
          return;
        }
        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();
        window.location.href = "contactlist.html";
      }
    };

    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}

function doSignUp() {
  firstName = document.getElementById("firstName").value;
  lastName = document.getElementById("lastName").value;

  let login = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  var hash = md5(password);

  document.getElementById("signupResult").innerHTML = "";

  let tmp = {
    firstName: firstName,
    lastName: lastName,
    login: login,
    password: hash,
  };

  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/SignUp." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState != 4) {
        return;
      }
      if (this.status == 200) {
        let jsonResponce = JSON.parse(xhr.responseText);
        if (jsonResponce.error) {
          if (jsonResponce.error === "Login already exists") {
            console.log("Login exists already/fields are invalid");
            document.getElementById("signupResult").innerHTML =
              "Login exists already/fields are invalid";
            return; // Stop further processing
          }
        }

        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;
        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        console.log("Status 200 has been triggered");
        saveCookie();
        window.location.href = "index.html";
      }
    };

    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("signupResult").innerHTML = err.message;
  }
}

function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie =
    "firstName=" +
    firstName +
    ",lastName=" +
    lastName +
    ",userId=" +
    userId +
    ";expires=" +
    date.toGMTString();
}

function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(",");
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] == "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }

  if (userId < 0) {
    window.location.href = "index.html";
  } else {
    //Needs an element in sidebar on contactlist.html
    document.getElementById("userName").innerHTML = firstName;
  }
}

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}

function validLoginForm(logName, logPass) {
  var logNameErr = (logPassErr = true);

  if (logName == "") {
    //console.log("USERNAME IS BLANK");
  } else {
    var regex = /^.*$/;

    if (regex.test(logName) == false) {
      //console.log("USERNAME IS NOT VALID");
    } else {
      //console.log("USERNAME IS VALID");
      logNameErr = false;
    }
  }

  if (logPass == "") {
    //console.log("PASSWORD IS BLANK");
    logPassErr = true;
  } else {
    var regex = /^.*$/;

    if (regex.test(logPass) == false) {
      //console.log("PASSWORD IS NOT VALID");
    } else {
      //console.log("PASSWORD IS VALID");
      logPassErr = false;
    }
  }

  if ((logNameErr || logPassErr) == true) {
    return false;
  }
  return true;
}

function addContact() {
  let firstname = document.getElementById("contactTextFirst").value;
  let lastname = document.getElementById("contactTextLast").value;
  let phonenumber = document.getElementById("contactTextNumber").value;
  let emailaddress = document.getElementById("contactTextEmail").value;

  if (!validAddContact(firstname, lastname, phonenumber, emailaddress)) {
    console.log("INVALID FIRST NAME, LAST NAME, PHONE, OR EMAIL SUBMITTED");
    return;
  }
  let tmp = {
    firstName: firstname,
    lastName: lastname,
    phone: phonenumber,
    email: emailaddress,
    userId: userId,
  };

  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/addContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("Contact has been added");
        // Clear input fields in form
        document.getElementById("addMe").reset();
        // reload contacts table and switch view to show
        loadContacts();
        //showTable();
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    console.log(err.message);
  }
}

/*
function showTable() {
    var x = document.getElementById("addMe");
    var contacts = document.getElementById("contactsTable")
    if (x.style.display === "none") {
        x.style.display = "block";
        contacts.style.display = "none";
    } else {
        x.style.display = "none";
        contacts.style.display = "block";
    }
}
*/

function validAddContact(firstName, lastName, phone, email) {
  var fNameErr = (lNameErr = phoneErr = emailErr = true);

  var firstnameElement = document.getElementById("contactTextFirst");
  var lastnameElement = document.getElementById("contactTextLast");
  var phoneElement = document.getElementById("contactTextNumber");
  var emailElement = document.getElementById("contactTextEmail");

  var firstNameSymbol = document.getElementById("firstSymbol");
  var lastNameSymbol = document.getElementById("lastSymbol");
  var phoneSymbol = document.getElementById("phoneSymbol");
  var emailSymbol = document.getElementById("emailSymbol");

  document.getElementById("addResult").classList.remove("text-green-500");
  document.getElementById("addResult").classList.add("text-red-500");

  firstNameSymbol.classList.add("hidden");
  lastNameSymbol.classList.add("hidden");
  phoneSymbol.classList.add("hidden");
  emailSymbol.classList.add("hidden");

  if (firstName == "") {
    console.log("FIRST NAME IS BLANK");
    firstnameElement.classList.add("border-red-500");
    firstNameSymbol.classList.remove("hidden");
    document.getElementById("addResult").innerHTML =
      "Please fill in the empty fields";
  } else {
    console.log("first name IS VALID");
    firstnameElement.classList.remove("border-red-500");
    fNameErr = false;
  }

  if (lastName == "") {
    console.log("LAST NAME IS BLANK");
    lastnameElement.classList.add("border-red-500");
    lastNameSymbol.classList.remove("hidden");
    document.getElementById("addResult").innerHTML =
      "Please fill in the empty fields";
  } else {
    console.log("LAST name IS VALID");
    lastnameElement.classList.remove("border-red-500");
    lNameErr = false;
  }

  if (phone == "") {
    console.log("PHONE IS BLANK");
    phoneElement.classList.add("border-red-500");
    phoneSymbol.classList.remove("hidden");
    document.getElementById("addResult").innerHTML =
      "Please fill in the empty fields";
  } else {
    var regex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

    if (regex.test(phone) == false) {
      console.log("PHONE IS NOT VALID");
      document.getElementById("addResult").innerHTML =
        "Please fix invalid fields";
      phoneElement.classList.add("border-red-500");
      phoneSymbol.classList.remove("hidden");
    } else {
      console.log("PHONE IS VALID");
      phoneElement.classList.remove("border-red-500");
      phoneErr = false;
    }
  }

  if (email == "") {
    console.log("EMAIL IS BLANK");
    emailElement.classList.add("border-red-500");
    emailSymbol.classList.remove("hidden");
    document.getElementById("addResult").innerHTML =
      "Please fill in the empty fields";
  } else {
    var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

    if (regex.test(email) == false) {
      console.log("EMAIL IS NOT VALID");
      document.getElementById("addResult").innerHTML =
        "Please fix invalid fields";
      emailElement.classList.add("border-red-500");
      emailSymbol.classList.remove("hidden");
    } else {
      console.log("EMAIL IS VALID");
      emailElement.classList.remove("border-red-500");
      emailErr = false;
    }
  }

  if ((phoneErr || emailErr || fNameErr || lNameErr) == true) {
    return false;
  }

  document.getElementById("addResult").classList.remove("text-red-500");
  document.getElementById("addResult").classList.add("text-green-500");
  document.getElementById("addResult").innerHTML = "Contact has been added";
  return true;
}

function loadContacts() {
  let tmp = {
    search: "",
    userId: userId,
  };

  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/searchContacts." + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        if (jsonObject.error) {
          console.log(jsonObject.error);
          return;
        }
        let text = "<table border='1'>";

        let maxResults = Math.min(jsonObject.results.length, contactLength);

        for (let i = 0; i < maxResults; i++) {
          ids[i] = jsonObject.results[i].ID;
          text += "<tr class='border p-2' id='row" + i + "'>";
          text +=
            "<td class='border p-2' id='first_Name" +
            i +
            "'><span>" +
            jsonObject.results[i].FirstName.trim();
          +"</span></td>";
          text +=
            "<td class='border p-2' id='last_Name" +
            i +
            "'><span>" +
            jsonObject.results[i].LastName.trim();
          +"</span></td>";
          text +=
            "<td class='border p-2' id='email" +
            i +
            "'><span>" +
            jsonObject.results[i].Email.trim();
          +"</span></td>";
          text +=
            "<td class='border p-2' id='phone" +
            i +
            "'><span>" +
            jsonObject.results[i].Phone.trim();
          +"</span></td>";
          text +=
            "<td>" +
            '  <button id="edit_button' +
            i +
            '"onclick="edit_row(' +
            i +
            ')" class="bg-blue-500 w-20 text-white px-2 py-1 rounded font-semibold" style="display: inline-block;"> Edit </button>' +
            '  <button id="save_button' +
            i +
            '" onclick="save_row(' +
            i +
            ')" class="bg-green-500 w-20 text-white px-2 py-1 rounded font-semibold" style="display: none;">Save</button>' +
            '  <button id="delete_button' +
            i +
            '"onclick="deleteContact(' +
            i +
            ')" class="font-semibold bg-red-500 w-20 text-white px-2 py-1 rounded style="display: inline-block;"">Delete</button>' +
            "</td>";
          text += "<tr/>";
        }
        text += "</table>";
        document.getElementById("tbody").innerHTML = text;
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    console.log(err.message);
  }
}

function searchContacts() {
  let searchValue = document.getElementById("searchText").value.trim();

  let tmp = {
    search: searchValue,
    userId: userId,
  };

  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/searchContacts." + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);

        if (jsonObject.error) {
          console.log(jsonObject.error);
          document.getElementById("tbody").classList.add("hidden");
          return;
        }

        document.getElementById("tbody").classList.remove("hidden");
        let text = "<table border='1'>";

        let maxResults = Math.min(jsonObject.results.length, contactLength);

        for (let i = 0; i < maxResults; i++) {
          ids[i] = jsonObject.results[i].ID;
          text += "<tr class='border p-2' id='row" + i + "'>";
          text +=
            "<td class='border p-2' id='first_Name" +
            i +
            "'><span>" +
            jsonObject.results[i].FirstName.trim();
          +"</span></td>";
          text +=
            "<td class='border p-2' id='last_Name" +
            i +
            "'><span>" +
            jsonObject.results[i].LastName.trim();
          +"</span></td>";
          text +=
            "<td class='border p-2' id='email" +
            i +
            "'><span>" +
            jsonObject.results[i].Email.trim();
          +"</span></td>";
          text +=
            "<td class='border p-2' id='phone" +
            i +
            "'><span>" +
            jsonObject.results[i].Phone.trim();
          +"</span></td>";
          text +=
            "<td>" +
            '  <button id="edit_button' +
            i +
            '"onclick="edit_row(' +
            i +
            ')" class="bg-blue-500 w-20 text-white px-2 py-1 rounded" style="display: inline-block;"> Edit </button>' +
            '  <button id="save_button' +
            i +
            '" onclick="save_row(' +
            i +
            ')" class="bg-green-500 w-20 text-white px-2 py-1 rounded" style="display: none;">Save</button>' +
            '  <button id="delete_button' +
            i +
            '"onclick="deleteContact(' +
            i +
            ')" class="bg-red-500 w-20 text-white px-2 py-1 rounded style="display: inline-block;"">Delete</button>' +
            "</td>";
          text += "<tr/>";
        }
        text += "</table>";
        document.getElementById("tbody").innerHTML = text;
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    console.log(err.message);
  }
}

function deleteContact(no) {
  var namef_val = document.getElementById("first_Name" + no).innerText;
  var namel_val = document.getElementById("last_Name" + no).innerText;
  nameOne = namef_val.substring(0, namef_val.length);
  nameTwo = namel_val.substring(0, namel_val.length);
  let check = confirm(
    "Confirm deletion of contact: " + nameOne + " " + nameTwo
  );
  if (check === true) {
    document.getElementById("row" + no + "").outerHTML = "";
    let tmp = {
      userId: userId,
      firstName: nameOne,
      lastName: nameTwo,
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/deleteContact." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          console.log("Contact has been deleted");
          loadContacts();
        }
      };
      xhr.send(jsonPayload);
    } catch (err) {
      console.log(err.message);
    }
  }
}

function edit_row(id) {
  document.getElementById("delete_button" + id).style.display = "none";
  document.getElementById("edit_button" + id).style.display = "none";
  document.getElementById("save_button" + id).style.display = "inline-block";

  var firstNameI = document.getElementById("first_Name" + id);
  var lastNameI = document.getElementById("last_Name" + id);
  var email = document.getElementById("email" + id);
  var phone = document.getElementById("phone" + id);

  var namef_data = firstNameI.innerText;
  var namel_data = lastNameI.innerText;
  var email_data = email.innerText;
  var phone_data = phone.innerText;

  firstNameI.innerHTML =
    "<input type='text' class='bg-gray-200 rounded-md w-full' id='namef_text" +
    id +
    "' value='" +
    namef_data +
    "'>";
  lastNameI.innerHTML =
    "<input type='text' class='bg-gray-200 rounded-md w-full' id='namel_text" +
    id +
    "' value='" +
    namel_data +
    "'>";
  email.innerHTML =
    "<input type='text' class='bg-gray-200 rounded-md w-full' id='email_text" +
    id +
    "' value='" +
    email_data +
    "'>";
  phone.innerHTML =
    "<input type='text' class='bg-gray-200 rounded-md w-full' id='phone_text" +
    id +
    "' value='" +
    phone_data +
    "'>";
}

function save_row(no) {
  var namef_val = document.getElementById("namef_text" + no).value;
  var namel_val = document.getElementById("namel_text" + no).value;
  var email_val = document.getElementById("email_text" + no).value;
  var phone_val = document.getElementById("phone_text" + no).value;
  var id_val = ids[no];

  document.getElementById("first_Name" + no).innerHTML = namef_val;
  document.getElementById("last_Name" + no).innerHTML = namel_val;
  document.getElementById("email" + no).innerHTML = email_val;
  document.getElementById("phone" + no).innerHTML = phone_val;

  document.getElementById("edit_button" + no).style.display = "inline-block";
  document.getElementById("save_button" + no).style.display = "none";
  document.getElementById("delete_button" + no).style.display = "inline-block";

  console.log(namef_val);

  let tmp = {
    id: id_val,
    firstName: namef_val,
    lastName: namel_val,
    phone: phone_val,
    email: email_val,
  };

  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/updateContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("Contact has been updated");
        if (document.getElementById("searchText").value != "") {
          document.getElementById("searchText").value = namef_val;
          searchContacts();
        }
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    console.log(err.message);
  }
}

function doMoreContacts() {
  contactLength = contactLength + 25;
  console.log(contactLength);
  searchContacts(); // Reload the contacts
}

function doLessContacts() {
  if (contactLength != 25) {
    contactLength = contactLength - 25;
  }
  console.log(contactLength);
  searchContacts(); // Reload the contacts
}

function testFunction() {
  console.log("Login button pressed");
}

//Add this into the index

document
  .getElementById("signupButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    doSignUp();
  });

function easterEgg() {
  window.open(
    "https://github.com/kalypso2/COP4331-contact-manager",
    "_blank" // <- This is what makes it open in a new window.
  );
}

/*
document.addEventListener("DOMContentLoaded", function() {
    let loginButton = document.getElementById("loginButton");
    
    if (loginButton) {
        loginButton.addEventListener("click", function(event) {
            event.preventDefault();
            doLogin();
        });
    } else {
        console.error("Error: loginButton not found in the DOM.");
    }
});
*/
