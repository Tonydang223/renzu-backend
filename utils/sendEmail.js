require('dotenv').config();
const mailer = require('nodemailer')
const emailActive =(acc,url,text)=>{
    let content
    const transporter = mailer.createTransport({
        host:'smtp.gmail.com',
        port:456,
        secure:true,
        requireTLS:true,
        service:'gmail',
        auth:{
            user: process.env.EMAIL_ADMIN,
            pass: process.env.PASS_EMAIL_ADMIN
        },
        tls:{
            rejectUnauthorized:false
        }
    })
    content = `
    <div style="margin:auto;padding:20px 30px;font-size:1.5em;background:rgba(0,0,0,0.05)">
    <h3>Thanks you for being a new member</h3>
    <div style="font-size:18px">
    <p style="color:#2a2b2b"> 
    Firstly, you completed registering a new account. Please click the text here to vertify your new account, so you can log in the system.
    </p>
    <p style="color:#2a2b2b"> 
    The link is expired at 1 hour 
    </p>
    <a href=${url} style="text-decoration:none;color:#095ae6">${text}</a>
    </div>
    </div>
    `
    const mailOp = {
        from:`"BookingRenzu📧"<${process.env.EMAIL_ADMIN}>`,
        to:acc,
        subject:"Confirm Your Account ✅",
        html:content
    }
    transporter.sendMail(mailOp,function(err,info){
        if(err){
            console.log(err)
            return err
        }else{
            return info
        }
    })
    
}
module.exports = {emailActive}