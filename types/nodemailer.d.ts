declare module 'nodemailer' {
  export interface TransportOptions {
    service?: string;
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user: string;
      pass: string;
    };
  }

  export interface MailOptions {
    from?: string | { name: string; address: string };
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
  }

  export interface Transporter {
    sendMail(mailOptions: MailOptions): Promise<unknown>;
    verify(callback: (error: Error | null) => void): void;
  }

  export function createTransport(options: TransportOptions): Transporter;
}
