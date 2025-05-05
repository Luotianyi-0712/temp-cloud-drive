
# Temporary Cloud Drive

A secure temporary file sharing system with automatic expiration and access control.

 <!-- 替换为实际截图链接 -->
#### Project structure

```
backend/
├── api/
│   ├── admin.js
│   ├── download.js
│   └── upload.js
├── db/
│   └── index.js
├── middleware/
│   └── auth.js
├── utils/
│   ├── helpers.js
│   └── index.js
└── package.json
frontend/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── download.html
│   ├── index.html
│   └── upload.html
└── README.md

```

## Features

- **File Uploads**
  - Max 50MB file size
  - Custom expiration (1-30 days)
  - Optional custom access codes
  - Admin API key protection

- **File Downloads**
  - Unique access code verification
  - Download statistics tracking
  - Automatic expiry enforcement

- **Admin Features**
  - File management dashboard
  - Bulk deletion
  - API key generation
  - Real-time monitoring

## Tech Stack

| Component       | Technology                  |
|-----------------|-----------------------------|
| Backend         | Node.js, Express            |
| Database        | PostgreSQL (Neon.tech)      |
| Frontend        | Bootstrap 5, Vanilla JS     |
| Storage         | In-Database (BYTEA)         |
| Deployment      | Vercel + Cloudflare Workers |

## Installation

### Prerequisites
- Node.js v16+
- PostgreSQL database
- Git

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Luotianyi-0712/temp-cloud-drive.git
   cd temp-cloud-drive
   ```

2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and admin API key.

4. Initialize database:
   ```bash
   npm run db:init
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

### Deployment

#### Vercel + Cloudflare Workers
1. Set up Vercel project with Node.js preset.
2. Configure database connection in environment variables.
3. Deploy:
   ```bash
   vercel --prod
   ```

#### Docker
```bash
docker-compose up -d --build
```

## API Reference

### Upload File
- **POST** `/api/upload`
  - Headers: `X-API-Key: <admin_key>`
  - Body: `multipart/form-data`

### Download File
- **GET** `/api/download/:accessCode`

### File Info
- **GET** `/api/download/info/:accessCode`

## Admin Guide
- Generate initial API key:
  ```bash
  npm run generate-key
  ```
- Access admin dashboard at `/admin.html`.
- Manage files using the web interface or direct API calls.

## Environment Variables

| Variable         | Required | Description                               |
|------------------|----------|-------------------------------------------|
| DATABASE_URL     | Yes      | PostgreSQL connection string               |
| ADMIN_API_KEY    | Yes      | Initial admin API key                     |
| PORT             | No       | Server port (default: 3000)              |
| RATE_LIMIT       | No       | Requests per minute (default: 100)       |

## Contributing
1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/fooBar
   ```
3. Commit your changes:
   ```bash
   git commit -am 'Add some fooBar'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/fooBar
   ```
5. Create a new Pull Request.

## License
MIT License. See LICENSE for details.

## Support
For issues and feature requests, please open an issue.
