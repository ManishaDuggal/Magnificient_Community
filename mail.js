var nodemailer = require('nodemailer');
module.exports={
    sendmail:function(receiver,password,callback){
var transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: "FirePrincess18091997@gmail.com",
    pass: "dugg@lm@nu9",
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready  to take messages');
  }
});


var mail = {
    from: "FirePrincess18091997@gmail.com",
    to: receiver, 
    subject: 'Community Builder',
    text: "Your password is "+password,
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      callback(err);
    } 
  });
  
    }

}