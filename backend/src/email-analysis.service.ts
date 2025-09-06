import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailAnalysisService {
  extractReceivingChain(headers: any): string[] {
    const receivedHeaders = headers.received || [];
    const chain: string[] = [];


    const receivedArray = Array.isArray(receivedHeaders) ? receivedHeaders : [receivedHeaders];

    for (const received of receivedArray.reverse()) {

      let server: string | null = null;


      const fromMatch = received.match(/from\s+([^\s;]+)/i);
      if (fromMatch) {
        server = fromMatch[1];
      }

     
      if (!server) {
        const byMatch = received.match(/by\s+([^\s;]+)/i);
        if (byMatch) {
          server = byMatch[1];
        }
      }

      
      if (!server) {
        const domainMatch = received.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
        if (domainMatch) {
          server = domainMatch[1];
        }
      }

     
      if (server) {
        
        server = server.replace(/[()[\]]/g, '');
       
        server = server.replace(/:\d+$/, '');
       
        if (!server.includes('localhost') && !server.includes('127.0.0.1') && server.length > 3) {
          chain.push(server);
        }
      }
    }

    
    const uniqueChain = chain.filter((server, index) => chain.indexOf(server) === index);

    return uniqueChain;
  }

  detectEsp(headers: any): string {
    const receivedHeaders = headers.received || [];
    const receivedString = Array.isArray(receivedHeaders) ? receivedHeaders.join(' ').toLowerCase() : receivedHeaders.toLowerCase();

   
    if (receivedString.includes('google.com') || receivedString.includes('gmail.com') || receivedString.includes('googlemail.com')) {
      return 'Gmail';
    }
    if (receivedString.includes('outlook.com') || receivedString.includes('hotmail.com') || receivedString.includes('live.com')) {
      return 'Outlook';
    }
    if (receivedString.includes('yahoo.com') || receivedString.includes('yahoodns.net')) {
      return 'Yahoo';
    }
    if (receivedString.includes('sendgrid.net') || receivedString.includes('sendgrid.com')) {
      return 'SendGrid';
    }
    if (receivedString.includes('mailchimp.com') || receivedString.includes('mandrillapp.com')) {
      return 'Mailchimp';
    }
    if (receivedString.includes('amazonaws.com') || receivedString.includes('ses.amazonaws.com') || receivedString.includes('email.amazon.com')) {
      return 'Amazon SES';
    }
    if (receivedString.includes('mailgun.org') || receivedString.includes('mailgun.net')) {
      return 'Mailgun';
    }
    if (receivedString.includes('postmarkapp.com') || receivedString.includes('postmark.net')) {
      return 'Postmark';
    }
    if (receivedString.includes('sparkpost.com') || receivedString.includes('sparkpostmail.com')) {
      return 'SparkPost';
    }
    if (receivedString.includes('zoho.com') || receivedString.includes('zoho.eu')) {
      return 'Zoho';
    }
    if (receivedString.includes('protonmail.com') || receivedString.includes('protonmail.ch')) {
      return 'ProtonMail';
    }
    if (receivedString.includes('icloud.com') || receivedString.includes('me.com')) {
      return 'iCloud';
    }
    if (receivedString.includes('aol.com') || receivedString.includes('aol.net')) {
      return 'AOL';
    }
    if (receivedString.includes('constantcontact.com')) {
      return 'Constant Contact';
    }
    if (receivedString.includes('campaignmonitor.com')) {
      return 'Campaign Monitor';
    }

    
    if (receivedString.includes('smtp.') || receivedString.includes('mail.')) {
      return 'Generic SMTP';
    }

    return 'Unknown';
  }
}
