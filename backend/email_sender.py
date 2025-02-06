import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import os

def send_email(to_email, subject, body, attachment_path):
    from_email = "harshangthakaraestin@gmail.com"
    from_password = "tulkcvtywjeqwecx"

    # Create the email
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject

    # Attach the body with the msg instance
    msg.attach(MIMEText(body, 'plain'))

    # Open the file to be sent
    attachment = open(attachment_path, "rb")

    # Instance of MIMEBase and named as p
    part = MIMEBase('application', 'octet-stream')

    # To change the payload into encoded form
    part.set_payload((attachment).read())

    # Encode into base64
    encoders.encode_base64(part)

    part.add_header('Content-Disposition', f"attachment; filename= {os.path.basename(attachment_path)}")

    # Attach the instance 'part' to instance 'msg'
    msg.attach(part)

    # Create SMTP session for sending the mail
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(from_email, from_password)
    text = msg.as_string()
    server.sendmail(from_email, to_email, text)
    server.quit()