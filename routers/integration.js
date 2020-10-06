var express = require('express')
  , router = express.Router()

const util = require("../utils.js")
const cookieParser = require('cookie-parser');

// Session managment
router.use(function(req, res, next) {
  if (!req.cookies.user){
    // redirect to login page
    res.redirect("/login");
  } else {
    next();
  }
});

// Integrations
router.get("/", (req, res) => {
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
    res.render("home", {namespaces: result.items, user: req.cookies.user});
  });

});

router.get("/namespace/:namespace/", async(req, res) => {
  var namespace = req.params.namespace;
  var user = req.cookies.user;
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
    res.render("list", {namespace: namespace, integrations: result.items, user: user});
  });

});

router.get("/namespace/:namespace/create", (req, res) => {
  var namespace = req.params.namespace;
  var user = req.cookies.user;
  res.render("create", {namespace: namespace, user: user});
});

router.get("/namespace/:namespace/integration/:name", (req, res) => {
  var namespace = req.params.namespace;
  var user = req.cookies.user;
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
    const podOptions = {
      host: 'localhost',
      port: 8080,
      path: '/api/v1/namespaces/'+ namespace +'/pods?labelSelector=camel.apache.org%2Fintegration%3D' + name + '&limit=10',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    util.getJSON(podOptions, (statusCode2, result2) => {
      var diagram;
      var podName = getPodName(result2);
      try {
        diagram = getDiagram(result.spec.sources[0].content);
      } catch (error) {
        console.error(error);
      }
      res.render("integration", {namespace: namespace, integration: result, user: user, pod: podName, diagram: diagram});
    });
  });

});

router.get("/namespace/:namespace/integration/:name/diagram", (req, res) => {
  var namespace = req.params.namespace;
  var user = req.cookies.user;
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
    var diagram;
    try {
      diagram = getDiagram(result.spec.sources[0].content);
    } catch (error) {
      console.error(error);
    }
    res.render("diagram", {namespace: namespace, integration: result, user: user, diagram: diagram});
  });

});

function getPodName(podList){
  if (podList.items[0]){
    return podList.items[0].metadata.name;
  } else {
      return null;
  }
}

router.delete("/namespace/:namespace/integration/:name", (req, res) => {
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

router.patch("/namespace/:namespace/integration/:name", (req, res) => {
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

router.post("/namespace/:namespace/integration", (req, res) => {
  var namespace = req.params.namespace;
  var name = req.body.name;
  var integration = req.body.integration;
  var owner = req.cookies.user;
  var permission = req.body.permission;
  var camelkjson = getFromTemplate(namespace, name, integration, owner, permission)

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

function getFromTemplate(namespace, name, integration, owner, permission){
  var filename = name + ".groovy"
  return {
     "apiVersion":"camel.apache.org/v1",
     "kind":"Integration",
     "metadata":{
        "name": name,
        "namespace": namespace,
        "labels": {
          "owner": owner,
          "permission": permission
        }
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

function getDiagram(source){
  var oneLineSource = source.replace(/\r?\n|\r/g,"");
  oneLineSource = oneLineSource.replace(/\s/g,"");
  oneLineSource = oneLineSource.replace(/\'/g,"\"");
  var myRegexp = /from\(\"(.+?)\"\)(\.([^(]+).+?)?(\.to\(\"(.+?)\"\))/g;
  var match = myRegexp.exec(oneLineSource);
  var from = match[1];
  var middle = match[3];
  var to = match[5];
  var diagram="graph LR;";
  if(middle){
    diagram += "From(" + from + ") --> Middle>" + middle + "];"
    diagram += "Middle --> To(" + to + ");"
  } else {
    diagram += "From(" + from + ") --> To(" + to + ");"
  }
  return diagram;
}

module.exports = router
