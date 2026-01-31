import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiDocumentation(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Recruitment Platform API</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        .content {
            padding: 40px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #667eea;
            font-size: 1.5rem;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
        }
        .endpoint {
            background: #f9fafb;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        .endpoint-method {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.85rem;
            margin-right: 10px;
        }
        .get { background: #10b981; color: white; }
        .post { background: #3b82f6; color: white; }
        .patch { background: #f59e0b; color: white; }
        .delete { background: #ef4444; color: white; }
        .endpoint-path {
            font-family: 'Courier New', monospace;
            color: #4b5563;
            font-size: 1rem;
        }
        .endpoint-desc {
            color: #6b7280;
            margin-top: 8px;
            font-size: 0.95rem;
        }
        .badge {
            display: inline-block;
            background: #e0e7ff;
            color: #667eea;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.85rem;
            margin-right: 8px;
        }
        .footer {
            background: #f9fafb;
            padding: 30px 40px;
            text-align: center;
            color: #6b7280;
        }
        .links a {
            color: #667eea;
            text-decoration: none;
            margin: 0 10px;
            font-weight: 500;
        }
        .links a:hover {
            text-decoration: underline;
        }
        .status {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-weight: 500;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 AI Recruitment Platform API</h1>
            <p>Intelligent Hiring Management System powered by Google Gemini AI</p>
            <div style="margin-top: 20px;">
                <span class="status">✓ API Online</span>
            </div>
        </div>
        
        <div class="content">
            <div class="section">
                <h2>📖 API Endpoints</h2>
                
                <h3 style="color: #4b5563; margin: 20px 0 15px;">Authentication</h3>
                <div class="endpoint">
                    <span class="endpoint-method post">POST</span>
                    <span class="endpoint-path">/auth/register</span>
                    <div class="endpoint-desc">Register new user account</div>
                </div>
                <div class="endpoint">
                    <span class="endpoint-method post">POST</span>
                    <span class="endpoint-path">/auth/login</span>
                    <div class="endpoint-desc">Login with email and password</div>
                </div>
                <div class="endpoint">
                    <span class="endpoint-method get">GET</span>
                    <span class="endpoint-path">/auth/google</span>
                    <div class="endpoint-desc">Login with Google OAuth</div>
                </div>
                
                <h3 style="color: #4b5563; margin: 30px 0 15px;">Jobs</h3>
                <div class="endpoint">
                    <span class="endpoint-method get">GET</span>
                    <span class="endpoint-path">/jobs</span>
                    <div class="endpoint-desc">Get all job listings</div>
                </div>
                <div class="endpoint">
                    <span class="endpoint-method get">GET</span>
                    <span class="endpoint-path">/jobs/:id</span>
                    <div class="endpoint-desc">Get job details by ID</div>
                </div>
                <div class="endpoint">
                    <span class="endpoint-method post">POST</span>
                    <span class="endpoint-path">/jobs</span>
                    <span class="badge">🔒 Recruiter</span>
                    <div class="endpoint-desc">Create new job posting</div>
                </div>
                
                <h3 style="color: #4b5563; margin: 30px 0 15px;">Applications</h3>
                <div class="endpoint">
                    <span class="endpoint-method post">POST</span>
                    <span class="endpoint-path">/applications</span>
                    <span class="badge">🤖 AI Analysis</span>
                    <div class="endpoint-desc">Submit job application with resume</div>
                </div>
                <div class="endpoint">
                    <span class="endpoint-method get">GET</span>
                    <span class="endpoint-path">/applications/user/:userId</span>
                    <div class="endpoint-desc">Get user's applications</div>
                </div>
                <div class="endpoint">
                    <span class="endpoint-method patch">PATCH</span>
                    <span class="endpoint-path">/applications/:id</span>
                    <span class="badge">🔒 Recruiter</span>
                    <div class="endpoint-desc">Update application status</div>
                </div>
                <div class="endpoint">
                    <span class="endpoint-method post">POST</span>
                    <span class="endpoint-path">/applications/send-email</span>
                    <span class="badge">🤖 AI Email</span>
                    <div class="endpoint-desc">Send AI-generated email to candidate</div>
                </div>
                
                <h3 style="color: #4b5563; margin: 30px 0 15px;">AI Features</h3>
                <div class="endpoint">
                    <span class="endpoint-method post">POST</span>
                    <span class="endpoint-path">/ai/analyze-resume</span>
                    <span class="badge">🤖 Gemini AI</span>
                    <div class="endpoint-desc">Extract skills and analyze resume</div>
                </div>
                <div class="endpoint">
                    <span class="endpoint-method post">POST</span>
                    <span class="endpoint-path">/ai/compare-candidates</span>
                    <span class="badge">🤖 Smart Match</span>
                    <div class="endpoint-desc">Compare up to 3 candidates with AI insights</div>
                </div>
            </div>
            
            <div class="section">
                <h2>🔑 Authentication</h2>
                <p style="color: #6b7280; line-height: 1.6;">
                    Most endpoints require JWT authentication. Include the token in request headers:
                    <br><br>
                    <code style="background: #f3f4f6; padding: 8px 12px; border-radius: 4px; display: inline-block;">
                        Authorization: Bearer YOUR_JWT_TOKEN
                    </code>
                </p>
            </div>
            
            <div class="section">
                <h2>🚀 Features</h2>
                <ul style="color: #6b7280; line-height: 2;">
                    <li>✅ AI-Powered Resume Analysis (Google Gemini 2.5 Flash)</li>
                    <li>✅ Automatic Skill Extraction from PDFs</li>
                    <li>✅ Smart Candidate-Job Matching Algorithm</li>
                    <li>✅ AI-Generated Professional Emails</li>
                    <li>✅ Multi-Candidate Comparison with AI Insights</li>
                    <li>✅ Google OAuth 2.0 Integration</li>
                    <li>✅ Resume Storage via Supabase</li>
                    <li>✅ Real-time Application Tracking</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p style="margin-bottom: 15px;">Built with NestJS, Prisma, PostgreSQL & Google Gemini AI</p>
            <div class="links">
                <a href="https://github.com/dnday/gdgoc-1" target="_blank">📦 GitHub Repository</a>
                <a href="/health">🏥 Health Check</a>
            </div>
            <p style="margin-top: 15px; font-size: 0.85rem;">© 2026 AI Recruitment Platform</p>
        </div>
    </div>
</body>
</html>
    `;
  }
}
