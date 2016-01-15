var routeMVC;
module.exports = function(app, express) {
    app.route('/')
        .get(function(req, res) {
            return routeMVC('index', 'indexGet', req, res);
        })
        .post(function(req, res) {
            return routeMVC('index', 'indexPost', req, res);
        });
    app.route('/:controller')
        .get(function(req, res) {
            return routeMVC(req.params.controller, 'indexGet', req, res);
        })
        .post(function(req, res) {
            return routeMVC(req.params.controller, 'indexPost', req, res);
        });
    app.route('/:controller/:method')
        .get(function(req, res) {
            return routeMVC(req.params.controller, req.params.method + 'Get', req, res);
        })
        .post(function(req, res) {
            return routeMVC(req.params.controller, req.params.method + 'Post', req, res);
        });
    // app.route('/:controller/:method/:id')
    //     .get(function(req, res) {
    //         return routeMVC('index', 'indexGet', req, res);
    //     })
    //     .post(function(req, res) {
    //         return routeMVC('index', 'indexPost', req, res);
    //     });
}
routeMVC = function(controllerName, methodName, req, res, next) {
    var controller, method;
    if (controllerName == null || controllerName.trim() == '') {
        controllerName = 'index';
    }
    controller = require('../controllers/' + controllerName + 'Controller');
    if (methodName == null || methodName.trim() == '') {
        methodName = 'index';
    }
    methodName = methodName.replace(/[^a-z0-9A-Z_-]/i, '');
    console.log('controller: ' + controllerName + ' method: ' + methodName);
    method = eval('controller.' + methodName);
    method(req, res);
}