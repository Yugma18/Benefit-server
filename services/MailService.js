const mg = require('mailgun-js');
const dotenv = require('dotenv');
dotenv.config();
const ApiError = require('../exceptions/ApiError');
const { inviteTemplate } = require('../helpers/emailTemplate')
var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API;


const mailgun = () =>
    mg({
        apiKey: process.env.MAILGUN_API,
        domain: process.env.MAILGUN_DOMAIN,
    });

class MailService {
    async sendActivationMail(to, message, subject) {
        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = 'Benefi confirmation code';
        sendSmtpEmail.htmlContent = message;
        sendSmtpEmail.sender = {
            name: 'Benefi',
            email: 'benefi@gmail.com',
        };
        sendSmtpEmail.to = [{ email: to }];
        apiInstance.sendTransacEmail(sendSmtpEmail).then(
            function (data) {
                console.log('API call success:', data);
                console.log('code: ', message);
            },
            function (error) {
                throw ApiError.BadRequest(error);
            }
        );
    }

    async sendInviteMail(to, templateData) {
        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = 'Benefi invite';
        sendSmtpEmail.htmlContent = inviteTemplate(
            templateData.name,
            templateData.login,
            templateData.password,
            templateData.link
        );
        sendSmtpEmail.sender = {
            name: 'Benefi',
            email: 'benefi@gmail.com',
        };
        sendSmtpEmail.to = [{ email: to }];
        apiInstance.sendTransacEmail(sendSmtpEmail).then(
            function (data) {
                console.log('API call success:', data);
                console.log(
                    'invite: ',
                    templateData.name,
                    templateData.login,
                    templateData.password
                );
            },
            function (error) {
                throw ApiError.BadRequest(error);
            }
        );
    }
    // async sendActivationMail(to, message, subject) {
    //     const emailInfo = {
    //         from: "Benefi <benefi@gmail.com>",
    //         to: to,
    //         html: message,
    //         subject: 'Benefi confirmation code',
    //     };
    //     console.log(emailInfo);
    //     mailgun()
    //         .messages()
    //         .send(emailInfo, (error) => {
    //             if (error) throw ApiError.BadRequest(error);
    //         });
    // }

    // async sendInviteMail(to, data) {
    //     const emailInfo = {
    //         from: "Benefi <benefi@gmail.com>",
    //         to: 'dmytro.s@terraforcesoftware.com',
    //         html: inviteTemplate(data.name, data.login, data.password, data.link),
    //         subject: 'Benefi invite',
    //     };
    //     // console.log(emailInfo);
    //     mailgun()
    //         .messages()
    //         .send(emailInfo, (error) => {
    //             if (error) throw ApiError.BadRequest(error);
    //         });
    // }
}

module.exports = new MailService();
