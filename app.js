//import external libraries
var express = require('express');
var multer = require('multer');
var mailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var auth = require('basic-auth');

var rootFilePath = './uploads/';

//run external libraries
var app = express();
var upload = multer({ dest: rootFilePath });

//define regular expressions
var validEmailRegex = /^[\w\W.-]+@[\w.-]+\.[\w.:]{2,}$/;
var validFileRegex = /.*\.zip$/;

//define global configurations
var emailServer = {address: 'erwtere@gmail.com', password: 'davidschool'};
var CorrectLogin = {username: 'admin', password: 'admin'};

/**
 * run server on available port or port 3000
 */
app.listen(process.env.VCAP_APP_PORT || 3000, function () {
    console.log('App is up and running');
});

/**
 * makes sure authentication was successful before use of the service is allowed
 */
app.use(function (req, res, next) {
    //get credentials the user entered
    var credentials = auth(req);
    //make sure credentials match correct authentication credentials
    if (!credentials || credentials.name !== CorrectLogin.username || credentials.pass !== CorrectLogin.password) {
        //authentication was unsuccessful
        res.setHeader('WWW-Authenticate', 'Basic realm="Authorization is required in order to access"');
        return res.status(401).send('Unauthorized access!');
    } else {
        //access was granted so go to required site
        return next();
    }
});

/**
 * returns index.html for get on root URL
 */
app.get('/', function (req, res) {
    res.status(200).sendfile('index.html');
});

/**
 * return main.css
 */
app.get('/main.css', function (req, res) {
    res.status(200).sendfile('main.css');
});

/**
 * This method is of post method on /send URL.
 * It uploads a .zip file to the server and sends it to recipient with customized subject
 * Note: .zip file receives suffix .REMOVE as to surpass Web security
 */
app.post('/send', upload.array('uploadFile'), function(req, res){
    //get parameters from request
    var email = req.body.email;//recipients email
    var subject = req.body.subject;//email subject
    var fileName = req.files[0].originalname;//name of file to upload and send
    var content = "";//to contain file content

    //make sure email is valid
    if(!validEmailRegex.exec(email)){
        console.log('Bad email: ' + email);
        return res.status(400).send('Bad request. Invalid email address');
    }

    //make sure file is of type .zip
    if (!validFileRegex.exec(fileName)) {
        console.log('Bad file type: ' + fileName);
        return res.status(400).send('Bad request. Invalid file type, must be .zip');
    }

    //create mail object
    var transporter = mailer.createTransport(smtpTransport({
        service: "Gmail",
        secureConnection: true,
        auth: {
            user: emailServer.address,
            pass: emailServer.password
        }
    }));

    // configure the email
    var mailOptions = {
        from: emailServer.address,
        to: email,
        subject: subject,
        attachments: [{'filename': fileName, 'path': './' + req.files[0].path}]
    };

    // send the email
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            //unsuccessful send of email
            console.log(error);
            return res.status(500).send('An error occurred, email was not sent');
        }
        //email was uploaded and sent successfully
        return res.status(200).send('Email was sent successfully');
    });
});