import nodeMailer from 'nodemailer'
export const sendEmail = async (options : 
  {email:string,message:string,subject:string,resetUrl:string})=>
  {



    const transport = nodeMailer.createTransport({
      service:"gmail",
      // host: 'smtp.gmail.com',
      // port: parseInt(process.env.SMTP_PORT as string),
      // tls:{
      //   rejectUnauthorized:false 
      // },
      auth: {
        user: "hellmughal123@gmail.com",
        pass: "speed123" 
      }
    });
      const message = {
        from : `${process.env.SMTP_FROM_EMAIL} <${process.env.SMTP_FROM_EMAIL}>`,
        to :options.email,
        subject : options.subject,
        text : options.message,
        html : `<body><br/>
        <a href="${options.resetUrl}" >Click here to reset password</a></body>
        `
      }
      await transport.sendMail(message)
}