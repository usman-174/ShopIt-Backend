import nodeMailer from 'nodemailer'
export const sendEmail = async (options : 
  {email:string,message:string,subject:string})=>
  {



    const transport = nodeMailer.createTransport({
      host : process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT as string),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS 
      }
    });
      const message = {
        from : `${process.env.SMTP_FROM_EMAIL} <${process.env.SMTP_FROM_EMAIL}>`,
        to :options.email,
        subject : options.subject,
        text:options.message
      }
      await transport.sendMail(message)
}