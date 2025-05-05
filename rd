# Temporary Cloud Drive

A simple temporary file sharing system with automatic expiration and secure access codes.
![Demo Screenshot](https://example.com/path/to/screenshot.png) <!-- 替换为实际截图链接 -->

## Features

- Upload files up to 50MB
- Generate unique access codes for each file
- Custom expiration periods (1-30 days)
- Automatic cleanup of expired files
- Admin dashboard for file management

## Tech Stack

- Backend: Node.js, Express
- Database: PostgreSQL (Neon.tech)
- Frontend: HTML, CSS, JavaScript
- Deployment: Vercel, Cloudflare Workers, or Hugging Face Spaces

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/temp-cloud-drive.git
   cd temp-cloud-drive

cloud-drive/
├── package.json
├── vercel.json
├── src/
│   ├── index.js
│   ├── config.js
│   ├── db.js
│   ├── routes/
│   │   ├── upload.js
│   │   ├── file.js
│   ├── utils/
│   │   ├── codeGenerator.js
│   │   ├── auth.js
│   ├── middleware/
│   │   ├── adminAuth.js
│   └── services/
│       ├── fileService.js
│       ├── cleanupService.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
