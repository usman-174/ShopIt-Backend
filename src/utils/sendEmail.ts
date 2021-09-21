import nodeMailer from 'nodemailer'
export const sendEmail = async (options : 
  {email:string,message:string,subject:string,resetUrl:string})=>
  {



    const transport = nodeMailer.createTransport({
      service:"gmail",
      // host: 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT as string),
      tls:{
        rejectUnauthorized:false 
      },
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS 
      }
    });
      const message = {
        from : `${process.env.SMTP_FROM_EMAIL} <${process.env.SMTP_FROM_EMAIL}>`,
        to :options.email,
        subject : options.subject,
        text : options.message,
        html : `<a href="${options.resetUrl}" >${options.message}</a>`
      }
      await transport.sendMail(message)
}