package ua.softserve.rv036.findmeplace.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class MailSender {

    @Autowired
    private JavaMailSender mailSender;


    @Value("${spring.mail.mailName}")
    private String mailName;

    //But google don't allow to rewrite 'from'
    public void sendFromTo(String from, String emailTo, String subject, String message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "utf-8");

            mimeMessage.setContent(message, "text/html; charset=UTF-8");
            helper.setFrom(from);
            helper.setTo(emailTo);
            helper.setSubject(subject);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void send(String emailTo, String subject, String message) {
        sendFromTo(mailName, emailTo, subject, message);

//        SimpleMailMessage mailMessage = new SimpleMailMessage();
//
//        mailMessage.setFrom(mailName);
//        mailMessage.setTo(emailTo);
//        mailMessage.setSubject(subject);
//        mailMessage.setText(message);
//
//        mailSender.send(mailMessage);
    }

    public void sendWithUserEmail(String userEmail, String emailTo, String subject, String message) {
        String fullMessage = "<h3>From: " + userEmail + "</h3>\n" + message;
        send(emailTo, subject, fullMessage);
    }
}
