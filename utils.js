const http = require('http');
const https = require('https');

var Util = function(util){
};

/**
 * getJSON:  RESTful GET request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */

Util.getJSON = (options, onResult) => {
  const port = options.port == 443 ? https : http;
  let output = '';
  const req = port.request(options, (res) => {
    res.setEncoding('utf8');

    res.on('data', (chunk) => {
      output += chunk;
    });

    res.on('end', () => {
      let obj = JSON.parse(output);

      onResult(res.statusCode, obj);
    });
  });

  req.on('error', (err) => {
    // res.send('error: ' + err.message);
  });

  req.end();
};

Util.postJSON = (options, payload, onResult) => {
  const port = options.port == 443 ? https : http;
  let output = '';
  const req = port.request(options, (res) => {
    res.on('data', (chunk) => {
      output += chunk;
    });
    res.on('end', () => {
      let obj = JSON.parse(output);
      var statusCode = obj.code === undefined ? 201 : obj.code
      onResult(statusCode, obj);
    });
  })

  req.on('error', (error) => {
    console.error(error)
  })

  req.write(JSON.stringify(payload))
  req.end()
};

module.exports= Util;
