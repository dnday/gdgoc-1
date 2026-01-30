import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Setup transporter dengan Gmail atau SMTP lain
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your app password
      },
    });
  }

  async sendRecruiterRequestApproved(toEmail: string, userName: string) {
    const subject = '🎉 Recruiter Access Approved - AI Recruitment Platform';
    const html = `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                
                <!-- Header with Logo -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🎉 RecruitPro</h1>
                    <p style="margin: 10px 0 0 0; color: #e8e8ff; font-size: 16px;">AI-Powered Recruitment Platform</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px; background-color: #ffffff;">
                    <h2 style="margin: 0 0 20px 0; color: #10b981; font-size: 24px;">Congratulations, ${userName}! 🎉</h2>
                    
                    <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      Great news! Your request for <strong>Recruiter Access</strong> has been <strong style="color: #10b981;">APPROVED</strong>.
                    </p>
                    
                    <p style="margin: 20px 0 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      <strong>You can now:</strong>
                    </p>
                    <table style="margin: 0 0 20px 0;">
                      <tr><td style="padding: 5px 0; color: #333333; font-size: 15px;">✅ Post job openings</td></tr>
                      <tr><td style="padding: 5px 0; color: #333333; font-size: 15px;">✅ Manage applications</td></tr>
                      <tr><td style="padding: 5px 0; color: #333333; font-size: 15px;">✅ Access recruiter dashboard</td></tr>
                      <tr><td style="padding: 5px 0; color: #333333; font-size: 15px;">✅ Use AI-powered candidate screening</td></tr>
                    </table>
                    
                    <p style="margin: 20px 0 25px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      Login now to start recruiting top talent!
                    </p>
                    
                    <table role="presentation" style="margin: 0;">
                      <tr>
                        <td style="border-radius: 6px; background-color: #667eea;">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/dashboard" 
                             style="display: inline-block; padding: 14px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">
                            Go to Dashboard →
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 30px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      If you have any questions, feel free to contact our support team at 
                      <a href="mailto:admin@airecruitment.com" style="color: #667eea;">admin@airecruitment.com</a>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 30px; background-color: #f9f9f9; text-align: center; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      © 2026 RecruitPro - AI Recruitment Platform. All rights reserved.
                    </p>
                    <p style="margin: 10px 0 0 0; color: #999999; font-size: 12px;">
                      This email was sent to ${toEmail}
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"AI Recruitment Platform" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject,
        html,
      });
      console.log(`✅ Approval email sent to ${toEmail}`);
    } catch (error) {
      console.error('❌ Error sending approval email:', error);
      throw error;
    }
  }

  async sendRecruiterRequestRejected(
    toEmail: string,
    userName: string,
    reason?: string,
  ) {
    const subject =
      '❌ Recruiter Access Request Update - AI Recruitment Platform';
    const html = `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                
                <!-- Header with Logo -->
                <tr>
                  <td style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">📧 RecruitPro</h1>
                    <p style="margin: 10px 0 0 0; color: #ffe8e8; font-size: 16px;">AI-Powered Recruitment Platform</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px; background-color: #ffffff;">
                    <h2 style="margin: 0 0 20px 0; color: #ef4444; font-size: 24px;">Recruiter Request Update</h2>
                    
                    <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      Hi <strong>${userName}</strong>,
                    </p>
                    
                    <p style="margin: 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      Thank you for your interest in becoming a recruiter on our platform.
                    </p>
                    
                    <p style="margin: 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      Unfortunately, we are <strong>unable to approve</strong> your recruiter access request at this time.
                    </p>
                    
                    ${
                      reason
                        ? `
                    <table style="margin: 25px 0; width: 100%; border-left: 4px solid #ef4444; background-color: #fef2f2;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0 0 10px 0; color: #991b1b; font-size: 15px; font-weight: bold;">Reason for Rejection:</p>
                          <p style="margin: 0; color: #7f1d1d; font-size: 15px; line-height: 1.6;">${reason}</p>
                        </td>
                      </tr>
                    </table>
                    `
                        : ''
                    }
                    
                    <table style="margin: 25px 0; width: 100%; background-color: #f0f9ff; border-radius: 8px;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0 0 10px 0; color: #0369a1; font-size: 15px; font-weight: bold;">💡 What's Next?</p>
                          <p style="margin: 0 0 10px 0; color: #075985; font-size: 14px; line-height: 1.6;">
                            • If you believe this is an error, please contact our support team
                          </p>
                          <p style="margin: 0 0 10px 0; color: #075985; font-size: 14px; line-height: 1.6;">
                            • You can still use our platform as a <strong>candidate</strong> to find amazing job opportunities
                          </p>
                          <p style="margin: 0; color: #075985; font-size: 14px; line-height: 1.6;">
                            • Feel free to reapply in the future with additional information
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <table role="presentation" style="margin: 25px 0 0 0;">
                      <tr>
                        <td style="border-radius: 6px; background-color: #667eea; margin-right: 10px;">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/dashboard/candidate" 
                             style="display: inline-block; padding: 14px 30px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">
                            Explore Jobs →
                          </a>
                        </td>
                        <td style="padding-left: 10px;">
                          <a href="mailto:admin@airecruitment.com" 
                             style="display: inline-block; padding: 14px 30px; background-color: #f3f4f6; color: #374151; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 6px;">
                            Contact Support
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 30px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      Thank you for your understanding and interest in our platform.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 30px; background-color: #f9f9f9; text-align: center; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      © 2026 RecruitPro - AI Recruitment Platform. All rights reserved.
                    </p>
                    <p style="margin: 10px 0 0 0; color: #999999; font-size: 12px;">
                      This email was sent to ${toEmail}
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"AI Recruitment Platform" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject,
        html,
      });
      console.log(`✅ Rejection email sent to ${toEmail}`);
    } catch (error) {
      console.error('❌ Error sending rejection email:', error);
      throw error;
    }
  }

  async sendRecruiterRequestSubmitted(toEmail: string, userName: string) {
    const subject =
      '✉️ Recruiter Access Request Received - AI Recruitment Platform';
    const html = `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                
                <!-- Header with Logo -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">✉️ RecruitPro</h1>
                    <p style="margin: 10px 0 0 0; color: #e8e8ff; font-size: 16px;">AI-Powered Recruitment Platform</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px; background-color: #ffffff;">
                    <h2 style="margin: 0 0 20px 0; color: #667eea; font-size: 24px;">Request Received Successfully! ✅</h2>
                    
                    <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      Hi <strong>${userName}</strong>,
                    </p>
                    
                    <p style="margin: 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      We have successfully received your request for <strong>Recruiter Access</strong>.
                    </p>
                    
                    <table style="margin: 25px 0; width: 100%; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0 0 10px 0; color: #1e40af; font-size: 15px; font-weight: bold;">⏱️ What Happens Next?</p>
                          <p style="margin: 0 0 10px 0; color: #1e3a8a; font-size: 14px; line-height: 1.6;">
                            <strong>1.</strong> Our team will review your request and verify your details
                          </p>
                          <p style="margin: 0 0 10px 0; color: #1e3a8a; font-size: 14px; line-height: 1.6;">
                            <strong>2.</strong> We'll get back to you within <strong>1-2 business days</strong>
                          </p>
                          <p style="margin: 0; color: #1e3a8a; font-size: 14px; line-height: 1.6;">
                            <strong>3.</strong> You'll receive an email notification with the decision
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      In the meantime, feel free to explore job opportunities on our platform!
                    </p>
                    
                    <table role="presentation" style="margin: 0;">
                      <tr>
                        <td style="border-radius: 6px; background-color: #667eea;">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/dashboard/candidate" 
                             style="display: inline-block; padding: 14px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">
                            Explore Jobs →
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 30px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      Thank you for your patience! If you have any questions, contact us at 
                      <a href="mailto:admin@airecruitment.com" style="color: #667eea;">admin@airecruitment.com</a>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 30px; background-color: #f9f9f9; text-align: center; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      © 2026 RecruitPro - AI Recruitment Platform. All rights reserved.
                    </p>
                    <p style="margin: 10px 0 0 0; color: #999999; font-size: 12px;">
                      This email was sent to ${toEmail}
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"AI Recruitment Platform" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject,
        html,
      });
      console.log(`✅ Submission confirmation email sent to ${toEmail}`);
    } catch (error) {
      console.error('❌ Error sending confirmation email:', error);
      // Don't throw error for confirmation email
    }
  }
}
