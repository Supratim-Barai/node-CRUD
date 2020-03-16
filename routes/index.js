var app = require('express');
var route = app.Router();
var UserController = require('../controller/userController');
var jwt = require('jsonwebtoken');

route.post('/adduser', (req, res) => {
    UserController.createuser(req, (resposne, statuscode) => {
        res.status(statuscode);
        res.send(resposne);
    })

});

route.post('/login', (req, res) => {
    UserController.loginuser(req, (resposne) => {
        res.send(resposne);
    })

});

route.put('/update_user', function (req, res) {
    UserController.updateuser(req, (resposne) => {
        res.send(resposne);
    })
});

route.delete('/delete_user', function (req, res) {
    UserController.deleteuser(req, (resposne) => {
        res.send(resposne);
    })
});

route.post('/addproduct', (req, res) => {
    UserController.addproduct(req, (resposne, statuscode) => {
        res.status(statuscode);
        res.send(resposne);
    })

});

route.post('/addUserproduct', (req, res) => {
    UserController.addUserproduct(req, (resposne, statuscode) => {
        res.status(statuscode);
        res.send(resposne);
    })

});

route.put('/update_product', function (req, res) {
    UserController.updateproduct(req, (resposne) => {
        res.send(resposne);
    })
});

route.put('/delete_product', function (req, res) {
    UserController.deleteproduct(req, (resposne) => {
        res.send(resposne);
    })
});

route.post('/findByDate', (req, res) => {
    UserController.findProductByDate(req, (resposne, statuscode) => {
        res.status(statuscode);
        res.send(resposne);
    })

});

route.get('/verifymail', (req, res) => {
    UserController.verifymail(req, (resposne, statuscode) => {
        res.status(statuscode);
        res.send(resposne);
    })

});


//***************************************************//
//* Middleware to check token
//*************************************************//
route.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers.token;
    if (token) {
        jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
                res.send({
                    status: 401,
                    message: err
                }, 401)

            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.send({
            status: 404,
            message: "Please provide token"
        });

    }
});
//***************************************************//
//* Middleware to check token
//*************************************************//

route.get('/alluser', (req, res) => {
    UserController.getUser(req, (response, statuscode) => {
        res.status(statuscode);
        res.send(response);
    })
});


module.exports = route;