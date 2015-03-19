var restify = require('restify');
var path = require('path');
var fs = require('fs');

var models = require('./models');


function index(req, response, next) {
    response.setHeader('Content-Type', 'text/html');
    models.Resource.findOne({
        'path': 'html/index.html'
    }, function(err, indexResource) {
        response.writeHead(200);
        response.end(indexResource.content);
    });
}

function serve(request, response, next) {
    var urlPath = request.params[0];

    models.Resource.findOne({
        'path': urlPath
    }, function(err, resource) {
        if (resource === null) {
            // TODO: should be JSON with an error reason.
            next(new restify.NotFoundError(
                "No resource with path '" + urlPath + "'"));
        } else {
            response.writeHead(200, {
                'Content-Type': resource.mimeType + "; charset=UTF-8"
            });

            if (resource.content) {
                response.write(resource.content);
                response.end();
            } else if (resource.localPath) {
                // TODO: define an environment variable for production
                // instead of serving files from here.
                var appDir = path.dirname(require.main.filename);
                var absPath = path.join(appDir, "..", "..", "binary_files",
                    resource.localPath);

                // TODO: unit test to verify we don't allow directory
                // travel if localPath contains '..'.
                fs.readFile(absPath, function(err, data) {
                    if (err) throw err; // TODO: HTTP 500/404 as appropriate

                    response.write(data);
                    response.end();
                });
            }

        }
    });
}

function getResource(req, res, next) {
    var path = req.params[0];

    models.Resource.findOne({
        'path': path
    }, function(err, resource) {
        if (resource === null) {
            next(new restify.NotFoundError(
                "No resource with path '" + path + "'"));
        } else {
            res.send(resource);
            next();
        }
    });
}

function updateResource(req, res, next) {
    var path = req.params[0];

    models.Resource.findOneAndUpdate({
        'path': path
    }, {
        'content': req.body.content,
    }, function(err, resource) {
        if (resource === null) {
            next(new restify.NotFoundError(
                "No resource with path '" + path + "'"));
        } else {
            res.send(resource);
            next();
        }
    });
}

function allResources(req, res, next) {
    models.Resource.find({}, function(err, resources) {
        res.send(resources);
        next();
    });
}

module.exports = {
    serve: serve,
    getResource: getResource,
    updateResource: updateResource,
    allResources: allResources,
    index: index
};