<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reset Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background: #7c3aed;
            color: #fff;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            color: #333;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #7c3aed;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
            font-weight: 500;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
        }
        .icon {
            width: 48px;
            height: 48px;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- Graduation Cap Icon from Lucide -->
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            <h1>Reset Your Password</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>You are receiving this email because we received a password reset request for your account at Crowd Funding University.</p>
            <p>Please click the button below to reset your password:</p>
            <center>
                <a href="{{ url('reset-password/'.$token) }}" class="button">Reset Password</a>
            </center>
            <p>If you did not request a password reset, no further action is required.</p>
            <p>This password reset link will expire in 60 minutes.</p>
            <p>Best regards,<br>Crowd Funding University Team</p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} Crowd Funding University. All rights reserved.</p>
            <p>If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:</p>
            <p style="word-break: break-all;">{{ url('reset-password/'.$token) }}</p>
        </div>
    </div>
</body>
</html> 