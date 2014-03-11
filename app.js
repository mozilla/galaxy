var fs = require('fs');
var http = require('http');
var zlib = require('zlib');

var nodeStatic = require('node-static');


const SERVER_HTML = '/server.html';
const REWRITES = [
  {from: '^/([\?].*)?$', to: SERVER_HTML},
  {from: '^/(friends|submit|game|genre|user|settings|leaderboard|developer|review|tests|debug)([\?].*)?$', to: SERVER_HTML},
];
const STRIP_TRAILING_SLASHES = true;
const TEMPLATE_404 = SERVER_HTML;


function patchVaryHeader(headers, header) {
  var v = headers['Vary'];
  return headers['Vary'] = (v && v !== header ? v + ', ' : '') + header;
}

/* Check if we should consider sending a deflate version of the file based on the
 * file content type and client's Accept-Encoding header value.
 */
nodeStatic.Server.prototype.deflateOk = function(req, contentType) {
  var enable = this.options.deflate;
  if (enable &&
      (typeof enable === 'boolean' ||
        (contentType && enable instanceof RegExp &&
         enable.test(contentType)))) {
    var acceptEncoding = req.headers['accept-encoding'];
    return acceptEncoding && acceptEncoding.indexOf('deflate') >= 0;
  }
  return false;
};

/* Monkeypatching `node-static`'s gzip so we can do it on the fly and also
 * support deflate (which results in smaller responses).
 */
nodeStatic.Server.prototype.respondGzip = function(pathname, status,
                                                   contentType, _headers,
                                                   files, stat, req, res,
                                                   finish) {
  var that = this;
  var gzipOk = that.gzipOk(req, contentType);
  var deflateOk = that.deflateOk(req, contentType);
  if (!(files.length === 1 && (gzipOk || deflateOk))) {
    // Client doesn't want deflate/gzip or we're sending multiple files.
    return that.respondNoGzip(pathname, status, contentType, _headers, files,
                              stat, req, res, finish);
  }

  var compFile;
  var compLib;

  if (deflateOk) {
    compFile = files[0] + '.deflate';
    compLib = zlib.createDeflate();
    _headers['Content-Encoding'] = 'deflate';
  } else {
    compFile = files[0] + '.gz';
    compLib = zlib.createGzip();
    _headers['Content-Encoding'] = 'gzip';
  }

  var inStr = fs.createReadStream(files[0]);
  var outStr = fs.createWriteStream(compFile);

  patchVaryHeader(_headers, 'Accept-Encoding');

  inStr.pipe(compLib).pipe(outStr);

  outStr.on('close', function() {
    fs.stat(compFile, function(e, stat) {
      that.respondNoGzip(pathname, status, contentType, _headers, [compFile],
                         stat, req, res, finish);
    });
  });
};

var fileServer = new nodeStatic.Server('./src', {
  // TODO: Set a reasonable `max-age` (issue #41).
  cache: 0,
  deflate: true,
  gzip: true
});


function getRewrite(req, stripslashes) {
  var data = {headers: {}};
  REWRITES.forEach(function(rewrite) {
    var re = new RegExp(rewrite.from);
    if (re.test(req.url)) {
      if (rewrite.redirect) {
        data.headers['Location'] = data.path;
        data.statusCode = rewrite.redirect === 'permanent' ? 301 : 302;
      } else {
        data.statusCode = 200;
      }
      data.path = rewrite.to;
    } else if (stripslashes && req.url.substr(-1) === '/') {
      var slashlessUrl = req.url.substr(0, req.url.length - 1);
      if (re.test(slashlessUrl)) {
        data.headers['Location'] = slashlessUrl;
        data.statusCode = 302;
      }
    }
  });
  return data;
}

http.createServer(function (req, res) {
  req.addListener('end', function () {
    if (req.url === '/') {
      req.url = SERVER_HTML;
    }
    fileServer.serve(req, res, function(err, fileRes) {
      var rewrite = getRewrite(req, STRIP_TRAILING_SLASHES);
      if (rewrite.path) {
        fileServer.serveFile(rewrite.path, rewrite.statusCode,
                             rewrite.headers, req, res);
      } else if (rewrite.statusCode) {
        res.writeHead(rewrite.statusCode, rewrite.headers);
        res.end();
      } else if (err && err.status === 404) {
        if (TEMPLATE_404) {
          fileServer.serveFile(TEMPLATE_404, 404, {}, req, res);
        } else {
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end('404');
        }
      }
    });
  }).resume();
}).listen(process.env.PORT || 9000);
