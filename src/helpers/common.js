const nodemailer = require('nodemailer')

const sendEmail = (toEmail, toName, token) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_VERIFICATION,
      pass: process.env.PASS_VERIFICATION
    }
  })

  transporter.sendMail({
    from: `"Telegram" <${process.env.EMAIL_VERIFICATION}>`,
    to: toEmail,
    subject: `Activation for ${toName}`,
    html: `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">
  
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  
    <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
    <title></title>
  </head>
  
  <body>
    <div class="flex flex-col w-screen h-screen items-center justify-center gap-4">
      <h1 class="text-indigo-400 font-black text-4xl">Telegram</h1>
      <hr />
      <div class="text-center">
        <p class="text-sm font-medium mb-3">THANKS FOR SIGN UP!</p>
        <h3 class="text-lg font-bold">Verify your E-mail Address</h3>
      </div>
      <hr />
      <div class="flex flex-col items-center">
        <p class="text-medium font-base">Hi ${toName}</p>
        <span class="text-center my-3">You're almost ready to get started.<br/>
        Please click on the button bellow to verify your email address and enjoy our best service!</span>
        <a class="px-6 py-2 text-white bg-indigo-400 hover:outline-none hover:bg-indigo-500 rounded-md" href=${process.env.BASE_URL}/v1/auth/activation/${token}>Activate</a>
      </div>
    </div>
  </body>
  
  </html>`,
  })
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.log(error)
  })
}

module.exports = {
  sendEmail
}