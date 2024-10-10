import EmailTemplate  from '@/components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API)

export interface apiResponse {
    success:boolean;
    message:string;
}

const sendVerificationEmail = async(email:string,username:string,verifyCode:string):Promise<apiResponse> => {
    try {
         await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Verification Code',
            react: EmailTemplate({ username,verifyCode }),
          });

          return {
            success:true,
            message:'Email Sent Successfully'
          }
    } catch (error) {
        console.log("Error sending email: ", error)
        return {
            success:true,
            message:'Failed to send Verification Email'
          }
    }
}

export default sendVerificationEmail;