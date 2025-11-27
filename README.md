# ReadME - Markdown-Based Blogging Platform

## Overview
ReadME is a modern markdown-based blogging platform built with:
- **Next.js** for the frontend
- **Express.js** for the backend
- **Prisma** as the ORM

### Special Features:
- **AI-based Text-to-Speech (TTS)**: Converts blog posts into audio for easy listening.
- **Automatic Reference Parsing**: Extracts and displays references from markdown content.
- **JWT-based Authentication**: Custom-built authentication system instead of using Clerk.

## Setup Instructions

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Create a `.env` file with the necessary configurations:

```env
DATABASE_URL= POSTGRES DB URL
JWT_SECRET= any string
PORT= eg - 8080
DEEPGRAM_API_KEY=your-deepgram-api-key
UPLOADTHING_TOKEN=your-uploadthing-token
```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Run database migrations:
   ```sh
   npx prisma migrate dev
   ```
5. Start the backend server:
   ```sh
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Create a `.env` file with frontend-specific configurations:
   ```env
   UPLOADTHING_TOKEN=http://localhost:5000
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Usage
- Write and publish blogs in markdown format.
- AI-based narration is available for each blog post.
- References are automatically extracted and listed at the end of the blog.

## Contributing
Feel free to contribute by submitting issues or pull requests!

## License
This project is licensed under the MIT License.

