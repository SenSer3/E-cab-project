import nodemailer from 'nodemailer';
import User from "@/model/userData";
import bcryptjs from 'bcryptjs';

export const sendEmail = async({email,emailType,userId})=>{
    try {
          
        const hashedToken = await bcryptjs.hash(userId.toString(),10)
        
        if (emailType === 'Verify'){
            await User.findByIdAndUpdate(userId,
                {
                    $set:{verifyToken:hashedToken,verifyTokenExpiry:Date.now()+3600000}
                }
            )
        }else if (emailType === 'Reset'){
            await User.findByIdAndUpdate(userId,
                {
                    $set:{forgotPasswordToken:hashedToken,forgotPasswordTokenExpiry:Date.now()+3600000}
                }
            )
        }

       // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
            user: process.env.TRANSPORT_USER,
            pass: process.env.TRANSPORT_PASSWORD
            }
        });

          const mailOptions = {
            from: 'xyz@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        }

        const mailresponse = await transport.sendMail
        (mailOptions);
        return mailresponse;


    } catch (error) {
        throw new Error(error.message)
    }
}