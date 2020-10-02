function postIntegration(integration){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
        printPostResult(this.status);
    }
  };
  xhttp.open("POST", "/namespace/default/integration", true);
  var name = document.getElementById("NAME");
  xhttp.setRequestHeader("Content-Type", "application/json");
  var payload = JSON.stringify({ "name": name.value, "integration": integration });

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

function deleteIntegration(integrationId){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
        printDeleteResult(this.status, integrationId);
    }
  };
  xhttp.open("DELETE", "/namespace/default/integration/" + integrationId, true);

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

function patchIntegration(name, integration){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
        printPatchResult(this.status);
    }
  };
  xhttp.open("PATCH", "/namespace/default/integration/" + name, true);
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
