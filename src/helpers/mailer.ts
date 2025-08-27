import { transporter } from '@/config/nodemailer'

export const sendRecoveryEmail = async (to: string, token: string) => {
  try {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

    const info = await transporter.sendMail({
      from: `"Soporte" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Recuperación de contraseña',
      html: `
        <h3>Recuperación de contraseña</h3>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>Este enlace expira en 15 minutos.</p>
      `,
    })
    
    return { success: true, messageId: info.messageId }
  } catch (error) {
    return { success: false, error }
  }
}
