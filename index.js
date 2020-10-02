const express = require("express");
const path = require("path");
const util = require("./utils.js")
const bodyParser = require('body-parser');

const app = express();

var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
app.use(bodyParser.json());

app.listen(3000, function () {
  console.log("Listening on 3000");
});

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const options = {
    host: 'localhost',
    port: 8080,
    path: '/api/v1/namespaces/',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  util.getJSON(options, (statusCode, result) => {
    res.render("home", {namespaces: result.items});
  });

});

app.get("/namespace/:namespace/", async(req, res) => {
  var namespace = req.params.namespace;
  const options = {
    host: 'localhost',
    port: 8080,
    path: '/apis/camel.apache.org/v1/namespaces/' + namespace + '/integrations',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  util.getJSON(options, (statusCode, result) => {
    res.render("list", {namespace: namespace, integrations: result.items});
  });

});

app.get("/namespace/:namespace/create", (req, res) => {
  res.render("create");
});

app.get("/namespace/:namespace/integration/:name", (req, res) => {
  var namespace = req.params.namespace;
  var name = req.params.name;
  const options = {
    host: 'localhost',
    port: 8080,
    path: '/apis/camel.apache.org/v1/namespaces/' + namespace + '/integrations/' + name,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  util.getJSON(options, (statusCode, result) => {
    res.render("integration", result);
  });

});

app.delete("/namespace/:namespace/integration/:name", (req, res) => {
  var namespace = req.params.namespace;
  var name = req.params.name;
  const options = {
    host: 'localhost',
    port: 8080,
    path: '/apis/camel.apache.org/v1/namespaces/' + namespace + '/integrations/' + name,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  util.getJSON(options, (statusCode, result) => {
    res.send(result);
  });

});

app.patch("/namespace/:namespace/integration/:name", (req, res) => {
  var namespace = req.params.namespace;
  var name = req.params.name;
  var integration = req.body.integration;
  var patchedCamelkjson = getFromPatchTemplate(name, integration)

  const options = {
    host: 'localhost',
    port: 8080,
    path: '/apis/camel.apache.org/v1/namespaces/' + namespace + '/integrations/' + name,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/merge-patch+json',
      'Content-Length': JSON.stringify(patchedCamelkjson).length,
    }
  };


  util.postJSON(options, patchedCamelkjson, (statusCode, result) => {
    res.statusCode = statusCode;
    res.send(result);
  });
});

app.post("/namespace/:namespace/integration", (req, res) => {
  var namespace = req.params.namespace;
  var name = req.body.name;
  var integration = req.body.integration;
  var camelkjson = getFromTemplate(namespace, name, integration)

  const options = {
    host: 'localhost',
    port: 8080,
    path: '/apis/camel.apache.org/v1/namespaces/' + namespace + '/integrations/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(camelkjson).length,
    }
  };

  util.postJSON(options, camelkjson, (statusCode, result) => {
    res.statusCode = statusCode;
    res.send(result);
  });

});

function getFromTemplate(namespace, name, integration){
  var filename = name + ".groovy"
  return {
     "apiVersion":"camel.apache.org/v1",
     "kind":"Integration",
     "metadata":{
        "name": name,
        "namespace": namespace
     },
     "spec":{
        "sources":[
           {
              "content": integration,
              "name": filename
           }
        ]
     }
  }
}

function getFromPatchTemplate(name, integration){
  var filename = name + ".groovy"
  return {
     "spec":{
        "sources":[
           {
              "content": integration,
              "name": filename
           }
        ]
     }
  }
}
