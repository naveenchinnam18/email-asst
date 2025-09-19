package com.email.mail_writer.app;

import lombok.Data;

@Data
public class EmailRequest {
    private String mailContent;
    private String tone;

    public String getMailContent() {
        return mailContent;
    }

    public String getTone() {
        return tone;
    }
}

