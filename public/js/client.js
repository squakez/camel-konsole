function login(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 201 ) {
        location.href="/"
    } else {
      printLoginFailed(this.status);
    }
  };
  xhttp.open("POST", "/login", true);
  var user = document.getElementById("USER");
  var password = document.getElementById("PASSWORD");
  xhttp.setRequestHeader("Content-Type", "application/json");
  var payload = JSON.stringify({ "user": user.value, "password": password.value });

  xhttp.send(payload);
}

function printLoginFailed(httpStatusCode){
  document.getElementById("MESSAGE").innerHTML = "<div>Login failed because error code " + httpStatusCode + "</div>";
}

function postIntegration(namespace, integration){
  var name = document.getElementById("NAME");
  var permission = document.getElementById("PERMISSION");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
        printPostResult(this.status);
        location.href="./";
    }
  };
  xhttp.open("POST", "/namespace/" + namespace + "/integration", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  var payload = JSON.stringify({ "name": name.value, "integration": integration, "permission": permission.value });

  xhttp.send(payload);
}

function printPostResult(httpStatusCode){
  if (httpStatusCode == 201 ){
    message = "Integration created!"
  } else {
    message = "Integration creation failed! - " + httpStatusCode
  }
  document.getElementById("BUTTON").innerHTML = "<div>"
      + message
      + "</div>";
}

function deleteIntegration(namespace, integrationId){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
        printDeleteResult(this.status, integrationId);
    }
  };
  xhttp.open("DELETE", "/namespace/" + namespace + "/integration/" + integrationId, true);

  xhttp.send();
}

function printDeleteResult(httpStatusCode, integrationId){
  if (httpStatusCode == 200){
    var element = document.getElementById(integrationId);
    element.parentNode.removeChild(element);
  } else {
    alert("Some issue happened while deleting integration " + integrationId +". Error code " + httpStatusCode)
  }
}

function patchIntegration(namespace, name, integration){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
        printPatchResult(this.status);
    }
  };
  xhttp.open("PATCH", "/namespace/" + namespace + "/integration/" + name, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  var payload = JSON.stringify({ "integration": integration });

  xhttp.send(payload);
}

function printPatchResult(httpStatusCode){
  if (httpStatusCode == 201 ){
    message = "Integration updated!"
  } else {
    message = "Integration update failed! - " + httpStatusCode
  }
  document.getElementById("BUTTON").innerHTML = "<div>"
      + message
      + "</div>";
}

function toDiagram(source){
  document.getElementById("DIAGRAM").innerHTML = "graph LR;A-->B;";
}
