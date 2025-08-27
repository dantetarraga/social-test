import nodemailer from 'nodemailer'
import 'dotenv/config'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
})

transporter.verify((error, success) => {
  if (error) {
    console.error('Error al verificar el transportador:', error)
  } else {
    console.log('Transportador listo para enviar correos electrónicos')
  }
})
