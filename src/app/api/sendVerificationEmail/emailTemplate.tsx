import React from 'react';

const emailTemplate = (email: string, verificationCode: string) => {
    return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaskJourney Email Template</title>
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
      }

      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #f4f4f4;
        padding: 20px;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
      }

      .header {
        background-color: #004d40;
        color: #ffffff;
        padding: 20px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        text-align: center;
      }

      .header h1 {
        margin: 0;
      }

      .content {
        padding: 20px;
        text-align: center;
      }

      .code {
        font-size: 32px;
        font-weight: bold;
        color: #338397;
        margin: 20px 0;
      }

      .button-container {
        margin-top: 30px;
        text-align: center;
      }

      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #00bcd4;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        transition: background-color 0.3s;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      }

      .button:hover {
        background-color: #00a5ba;
      }

      .footer {
        background-color: #004d40;
        color: #ffffff;
        padding: 10px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        text-align: center;
      }

      .footer a {
        color: #00bcd4;
        text-decoration: none;
      }

      @media screen and (max-width: 600px) {
        .container {
          max-width: 100%;
        }

        .header h1 {
          font-size: 20px;
        }

        .code {
          font-size: 28px;
        }

        .button {
          padding: 10px 20px;
        }
      }
    </style>
  </head>
  
  <body>
    <center class="wrapper">
      <table class="container">
        <tr>
          <td class="header">
            <img src="cid:tasks-solid.png" alt="TaskJourney Logo" width="50" height="50" />
            <h1>TaskJourney</h1>
          </td>
        </tr>
        <tr>
          <td class="content">
            <p>Dear user,</p>
            <p>Your verification code is:</p>
            <p class="code">${verificationCode}</p>
            <p>Please enter this code on the verification page to activate your account.</p>
            <div class="button-container" style="color: white; text-decoration: none; transition: all 0.3s ease-in-out;">
              <a href="http://localhost:3000/activate?email=${email}" class="button">
                <img src="cid:circle-check-solid.png" alt="Check Mark" width="20" height="20" style="vertical-align: middle; margin-right: 8px;" /> Activate Account
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td class="footer">
            <p>&copy; ${new Date().getFullYear()} TaskJourney. All rights reserved.</p>
            <p><a href="http://localhost:3000/unsubscribe?email=${email}">Unsubscribe</a></p>
            <div>
              <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" width="24" height="24" /></a>
              <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Twitter_t_logo.svg" alt="Twitter" width="24" height="24" /></a>
              <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" width="24" height="24" /></a>
            </div>
          </td>
        </tr>
      </table>
    </center>
  </body>
  
  </html>
  `;
};

export default emailTemplate;
