import { Resend } from 'resend';
type Prop = {
	to: string;
	subject: string;
	html: string;
	text: string;
}

const resendClient = new Resend(process.env.RESEND_SERVER_TOKEN!)

export async function sendEmail({ to, subject, html, text }: Prop) {
	return await resendClient.emails.send({
		from: process.env.RESEND_FROM_EMAIL!,
		to,
		subject,
		html,
		text
	});
}