# Database Management API

## Overview

**Database Management API** is a RESTful backend service designed to support portfolio and project management applications. Built using Node.js, Express, and MongoDB (via Mongoose), this API provides endpoints for managing projects, personal information ("About"), skills, and integrated email communication. The API is designed for easy integration with frontend clients and supports file uploads, CORS, and environment-based configuration.

---

## Features

- **Project Management**: Create, read, update, and delete project entries.
- **About Section**: Manage personal or company "About" information.
- **Skills Management**: Add and manage a list of skills or technologies.
- **Email Integration**: Send emails via integrated routes using EmailJS.
- **File Uploads**: Upload and serve files (e.g., images) using Multer.
- **CORS Support**: Configurable origins for secure cross-domain requests.
- **Template Rendering**: Renders EJS templates for basic views and error handling.
- **Environment-Based Configuration**: All sensitive data (e.g., DB URIs, CORS origins) managed via environment variables.

---

## Tech Stack

- **Node.js** (runtime)
- **Express** (web framework)
- **MongoDB** with **Mongoose** (database and ODM)
- **EmailJS** (`@emailjs/nodejs`) for email functionality
- **Multer** for file uploads
- **EJS** for view rendering
- **CORS** middleware
- **dotenv** for environment variable management

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vishantvelip/Database-managemet-api.git
   cd Database-managemet-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   - Create a `.env` file in the root with the following values:
     ```
     PORT=8000
     MONGO_URI=your_mongodb_connection_string
     CORS_ORIGINS=your_allowed_origins (comma-separated or *)
     EMAILJS_USER_ID=your_emailjs_user_id
     EMAILJS_SERVICE_ID=your_emailjs_service_id
     EMAILJS_TEMPLATE_ID=your_emailjs_template_id
     ```
   - Replace values as appropriate.

---

## Usage

### Run the Server

```bash
npm start
```
- The server runs by default on `http://localhost:8000`.

### API Endpoints

#### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

#### About
- `GET /api/about` - Get "About" info
- `POST /api/about` - Create/update "About" info

#### Skills
- `GET /api/skills` - List all skills
- `POST /api/skills` - Add a new skill
- `PUT /api/skills/:id` - Update a skill
- `DELETE /api/skills/:id` - Delete a skill

#### Email

- `POST /api/email` - Send an email (uses EmailJS service)
  - **Request Body Example:**
    ```json
    {
      "name": "Your Name",
      "email": "your@email.com",
      "subject": "Subject line",
      "message": "Your message content"
    }
    ```
- `POST /api/email/send-email` - Send email using EmailJS (dedicated endpoint)
  - **Request Body:**
    ```json
    {
      "name": "Your Name",
      "email": "your@email.com",
      "message": "Your message content"
    }
    ```
  - **Response:**
    - On Success: `{ "message": "Email sent successfully" }`
    - On Failure: `{ "error": "Failed to send email" }`
  - **Validation:** All fields (`name`, `email`, `message`) are required.
  - **How it works:**  
    This endpoint uses the EmailJS Node.js SDK to send emails via your configured EmailJS template. Credentials and template IDs are securely managed in the backend and never exposed to the client.

#### Static Files
- Uploaded files are served at: `/uploads/<filename>`

---

## File Structure

```
.
├── app.js                # Main application entry point
├── package.json
├── routes/
│   ├── project.js
│   ├── about.js
│   ├── skill.js
│   └── email.js
├── models/
├── views/                # EJS templates
├── public/               # Static files, uploads
└── .env                  # Environment variables (not committed)
```

---

## Email Functionality Details

The API integrates with [EmailJS](https://www.emailjs.com/) for sending emails, typically from a contact form or for notifications. 

- **Configuration:**  
  Set the following environment variables in your `.env` file:
  ```
  EMAILJS_USER_ID=your_emailjs_user_id
  EMAILJS_SERVICE_ID=your_emailjs_service_id
  EMAILJS_TEMPLATE_ID=your_emailjs_template_id
  ```

- **How it works:**  
  - The `/api/email/send-email` endpoint expects `name`, `email`, and `message` in the request body.
  - The backend constructs the template parameters and sends the email using your configured EmailJS service and template.
  - Errors and validation are handled server-side, and credentials are never exposed to the frontend.

- **Security Note:**  
  Credentials are never exposed to the frontend; email sending is handled entirely server-side.

---

## Error Handling

- Errors are handled centrally and rendered via EJS template `error`.
- File upload errors (via Multer) and other exceptions are managed and returned with appropriate messages.

---

## Deployment

- The API can be deployed on any Node.js-compatible service.
- Ready for deployment on Vercel (exports app for Vercel handler).
- Configure environment variables in the deployment environment.

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

---

## License

This project is licensed under the ISC License.

---

## Contact

For issues or feature requests, use the [issue tracker](https://github.com/vishantvelip/Database-managemet-api/issues).
