Accounts.emailTemplates.siteName = 'Cryptocean';
Accounts.emailTemplates.from = 'Cryptocean <admin@cryptocean.io>';

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return '[Cryptocean] Verify Your Email Address';
  },
  text(user, url) {
    const emailAddress = user.emails[0].address;
    const urlWithoutHash = url.replace('#/', '');
    const supportEmail = 'support@cryptocean.io';
    return `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;
  },
};

Accounts.emailTemplates.resetPassword = {
  subject() {
    return '[Cryptocean] Reset Password Request';
  },
  text(user, url) {
    const emailAddress = user.emails[0].address;
    const urlWithOutHash = url.replace('#/', '');
    const supportEmail = 'support@cryptocean.io';
    return `We received an account recovery request on test.ca for ${emailAddress}.\n\n
            If you initiated this request, click this link to reset your password.\n
            ${urlWithOutHash}\n\n
            If you did not initiate this account recovery request, just ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;
  },
};
