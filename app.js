var servo = require('servojs');
var nodemailer = require("nodemailer");
var dotenv = require('dotenv');
dotenv.load()
var fs = require('fs')

var url = process.env.SITE_URL
var elem = process.env.ELEM
var existing_hash = fs.readFileSync(__dirname + "/" + process.env.FILENAME, 'utf-8')

var newContent = []


servo.getElementsFromPage(url, elem, function (elems) {

	servo.getElementArrayHash(elems, function (hash) {

		if (hash[0] == existing_hash) {
			console.log("Nothing's changed")
		}
		else {
			fs.writeFileSync(__dirname + "/" + process.env.FILENAME, hash[0])
			emailMe(elems.forEach(function (elem) {
				newContent.push(elem.html())
			}))
		}
	})
})

function emailMe () { 
	var smtpTransport = nodemailer.createTransport("SMTP",{
	    service: "Gmail",
	    auth: {
	        user: process.env.GMAIL_USER,
	        pass: process.env.GMAIL_PWD
	    }
	});

	var mailOptions = {
	    from: process.env.EMAIL_ADDRESS, // sender address
	    to: "vdavez@gmail.com", // list of receivers
	    subject: process.env.EMAIL_SUBJECT, // Subject line
	    html: newContent.join('\n') // html body
	}

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, response){
	    if(error){
	        console.log(error);
	    } else{
	        console.log("Message sent: " + response.message);
	    }
	    // if you don't want to use this transport object anymore, uncomment following line
	    smtpTransport.close(); // shut down the connection pool, no more messages
	});
}