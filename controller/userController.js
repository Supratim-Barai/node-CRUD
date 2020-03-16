var UserModel = require('../schema/userSchema');
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');


// var bytes  = CryptoJS.AES.decrypt(ciphertext, '123');
// var originalText = bytes.toString(CryptoJS.enc.Utf8);

// console.log("fgfda",originalText);

var UserController = {}

//.............................User Create......................................//

UserController.createuser = (req, callback) => {


    const body = req.body
    var firstname = body.firstname
    var lastname = body.lastname
    var email = body.email
    var password = CryptoJS.AES.encrypt(body.password, 'password').toString();



    if (email == "") {
        callback({
            status: 401,
            message: 'email required'
        }, 401)
    } else {
        let userdata = {
            firstname,
            lastname,
            email,
            password
        }
        const newData = new UserModel(userdata)


        newData.save((err, res) => {
            console.log("Response======>", res);
            if (!err) {
                callback({
                    status: 200,
                    message: 'Successfully User Create'
                }, 200)
            } else {
                callback({
                    status: 500,
                    message: err
                }, 500)
            }

        })
    }
}

//.............................User Get......................................//

UserController.getUser = (req, callback) => {

    UserModel.find().exec(function (err, res) {
        if (!err) {
            callback({
                status: 200,
                message: 'Successfully User Details',
                response: res
            }, 200)
        } else {
            callback({
                status: 500,
                message: err
            }, 500)
        }
    })


}

//.............................User Update......................................//

UserController.updateuser = (req, callback) => {

    var updateUser = {

        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email
    }


    UserModel.updateOne({ _id: req.query._id }, { $set: updateUser }, function (err, res) {
        if (err) {
            callback({
                status: 500,
                message: err
            })
        } else {
            callback({
                status: 200,
                message: 'Successfully User Update',
            })
        }

    })
}


//.............................User Delete......................................//

UserController.deleteuser = (req, callback) => {

    console.log('id', req.query._id);

    UserModel.deleteOne({ _id: req.query._id }, function (err, res) {
        if (err) {
            callback({
                status: 500,
                message: err
            })
        } else {
            callback({
                status: 200,
                message: 'Successfully User delete',
            })
        }
    })
}


//................................Login....................................//

UserController.loginuser = (req, callback) => {


    var email = req.body.email
    var password = req.body.password





    if (email == '' || password == '') {
        callback({
            status: 401,
            message: 'email and password required'
        }, 401)
    } else {

        UserModel.findOne({ email }, (err, res) => {
            console.log("res", CryptoJS.AES.decrypt(res.password, 'password').toString(CryptoJS.enc.Utf8));
            if (res != null) {

                if (password == CryptoJS.AES.decrypt(res.password, 'password').toString(CryptoJS.enc.Utf8)) {
                    var authToken = jwt.sign({ email: email }, 'secret', { expiresIn: '1h' });
                    response = {
                        "firstname": res.firstname,
                        "lastname": res.lastname,
                        "email": res.email,
                        "authToken": authToken
                    }
                    callback({
                        status: 200,
                        message: 'Successfully User login',
                        response: response
                    }, 200)
                } else {
                    callback({
                        status: 404,
                        message: 'password not matched'
                    }, 404)
                }
            } else {
                callback({
                    status: 404,
                    message: 'email not matched'
                }, 404)
            }
            if (err) {
                callback({
                    status: 500,
                    message: 'Something went wrong'
                }, 500)
            }
        })

    }

}

//...........................................verifyToken............................................//


UserController.verifyToken = (req, callback) => {

    var token = req.headers.token
    if (token != '') {
        jwt.verify(token, 'secret', (err, decoded) => {
            if (!err) {
                callback({
                    status: 200,
                    message: 'Token verified'
                }, 200)
            } else {
                callback({
                    status: 401,
                    message: err
                }, 401)
            }
        })
    }
}

//...................................With Token all users............................................//



UserController.loginuserview = (req, callback) => {

    var token = req.headers.token
    if (token != '') {
        jwt.verify(token, 'secret', (err, decoded) => {
            if (!err) {
                UserModel.find().exec(function (err, res) {
                    if (!err) {
                        callback({
                            status: 200,
                            message: 'Successfully User Details',
                            response: res
                        }, 200)
                    } else {
                        callback({
                            status: 500,
                            message: err
                        }, 500)
                    }
                })
            } else {
                callback({
                    status: 401,
                    message: err
                }, 401)
            }

        })
    } else {
        callback({
            status: 404,
            message: 'Token Required'
        }, 404)
    }

}

//...................................Product add.................................................//


UserController.addproduct = (req, callback) => {

    var firstname = req.body.firstname
    var lastname = req.body.lastname
    var email = req.body.email
    var password = CryptoJS.AES.encrypt(req.body.password, 'password').toString();
    var myproducts = req.body.products

    let productsArray = [];
    myproducts.map(x => {
        var items = { name: x }
        productsArray.push(items)
    })

    if (email == "") {
        callback({
            status: 401,
            message: 'email required'
        }, 401)
    } else {
        let userdata = {
            firstname,
            lastname,
            email,
            password,
            myproducts: productsArray
        }
        const newData = new UserModel(userdata)
        console.log("newData", userdata);

        newData.save((err, res) => {
            if (!err) {
                callback({
                    status: 200,
                    message: 'Successfully User Create',
                    response: res
                }, 200)
            } else {
                callback({
                    status: 500,
                    message: err
                }, 500)
            }

        })
    }

}

//....................................Product Update.........................................//

UserController.updateproduct = (req, callback) => {


    UserModel.findOne({ _id: req.body._id }).exec(function (err, res) {

        if (err) {
            callback({
                status: 500,
                message: err
            }, 500)
        } else {
            if (res != null) {
                console.log("res", res.myproducts);
                var searchproduct = res.myproducts.find(x => x._id == req.body.productsid);

                var index = res.myproducts.indexOf(searchproduct);

                if (searchproduct != undefined) {
                    let products = res.myproducts;
                    products[index].name = req.body.products

                    console.log("newpro00", products);

                    var updateUser = {
                        myproducts: products
                    }

                    UserModel.updateOne({ _id: req.body._id }, { $set: updateUser }, function (err, res) {
                        if (err) {
                            callback({
                                status: 500,
                                message: err
                            })
                        } else {
                            callback({
                                status: 200,
                                message: 'Successfully Product Update',
                            })
                        }

                    })
                } else {
                    callback({
                        status: 404,
                        message: 'Product Not Found'
                    }, 404)
                }
            } else {
                callback({
                    status: 404,
                    message: 'User Not Found'
                }, 404)
            }

        }


    })

}

//.......................................Add product in existing User...........................................//


UserController.addUserproduct = (req, callback) => {

    var myproducts = req.body.products
    var availablefrom = req.body.availablefrom
    var availableto = req.body.availableto


    UserModel.updateOne({ _id: req.body._id }, { $push: { myproducts: { name: myproducts, availablefrom: availablefrom, availableto: availableto } } }, function (err, res) {
        if (err) {
            callback({
                status: 500,
                message: err
            }, 500)
        } else {
            callback({
                status: 200,
                message: 'Successfully Product Added',
            }, 200)
        }

    })

}

//....................................Product Delete.........................................//


UserController.deleteproduct = (req, callback) => {

    var myproduct_id = req.body.products_id

    UserModel.updateOne({ _id: req.body._id }, { $pull: { myproducts: { _id: myproduct_id } } }, function (err, res) {
        if (err) {
            callback({
                status: 500,
                message: err
            }, 500)
        } else {
            callback({
                status: 200,
                message: 'Successfully Product Deleted',
            }, 200)
        }

    })

}

//..........................................Product Search By Date.........................................//

UserController.findProductByDate = (req, callback) => {


    UserModel.findOne({ _id: req.body._id }).exec(function (err, res) {

        if (err) {

            callback({
                status: 500,
                message: err
            }, 500)

        } else {

            if (res != null) {

                var InputFromdate = new Date(req.body.InputFromdate).getTime();
                var InputTodate = new Date(req.body.InputTodate).getTime();

                var availableproducts = []
                res.myproducts.map(x => {
                    if (x.availablefrom.getTime() >= InputFromdate && x.availableto.getTime() <= InputTodate) {
                        availableproducts.push(x);
                    }

                })
                console.log("availableproducts==", availableproducts)

                if (availableproducts.length > 0) {
                    callback({
                        status: 200,
                        message: 'Product Found',
                        response: availableproducts
                    }, 200)
                } else {
                    callback({
                        status: 404,
                        message: 'No Product Found',
                    }, 200)
                }


            } else {
                callback({
                    status: 404,
                    message: 'User Not Found'
                }, 404)
            }
        }
    })


}

//...........................................verifymail.................................................//


UserController.verifymail = (req, callback) => {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'supratim.brainium@gmail.com',
            pass: 'supratim@123'
        }
    });

    const mailOptions = {
        from: 'supratim.brainium@gmail.com', // sender address
        to: 'biswajitmaity.brainium@gmail.com', // list of receivers
        subject: 'email checcking', // Subject line
        html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>'// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            callback({
                status: 500,
                message: err
            }, 500)
        } else {
            console.log(info);
            callback({
                status: 200,
                message: 'Successfull',
                response: info
            }, 200)
        }
    });

}

module.exports = UserController;
