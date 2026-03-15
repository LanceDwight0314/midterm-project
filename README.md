# NEULibraryGuard 🛡️

NEULibraryGuard is a modern, AI-powered visitor management and logging system designed for the New Era University Library. It provides a seamless check-in experience for students and faculty while giving administrators powerful tools to monitor library usage and manage access.

## 🚀 Features

- **Institutional Check-In Terminal**: A user-friendly interface for students and faculty to log their visits using their Institutional ID or Email.
- **AI-Powered Librarian**: Leverages Google Gemini via Genkit to provide personalized resource suggestions based on the visitor's stated purpose (e.g., thesis research, leisure reading).
- **Secure Visitor Registration**: Allows new visitors to enroll their institutional credentials into the system.
- **Admin Dashboard**:
  - **Real-time Analytics**: Visual trends of visitor traffic using Recharts.
  - **Access Control**: Ability to block or unblock specific IDs for security purposes.
  - **Visitor Logs**: Detailed historical records of all entries with search and filter capabilities.
  - **Automated Reports**: Quick generation of visit statistics.
- **Professional UI**: Built with a clean, academic-focused aesthetic using ShadCN UI and Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **AI Engine**: [Genkit 1.x](https://firebase.google.com/docs/genkit) with Google AI (Gemini 2.5 Flash)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: React Hooks & Local Storage (Mock DB)
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18 or later
- A Google Gemini API Key (for the AI suggestions feature)

## ⚙️ Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/neu-library-guard.git
   cd neu-library-guard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GOOGLE_GENAI_API_KEY=your_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:9002](http://localhost:9002) to view the terminal.

## 🔐 Admin Access

The Admin Portal is accessible at `/admin/login`.
- **Default Password**: `123`

## 📁 Project Structure

- `src/app`: Next.js pages and layouts.
- `src/components`: Reusable UI components (ShadCN).
- `src/ai`: Genkit flows and AI prompt definitions.
- `src/app/lib`: Database utilities and mock data handling.
- `src/hooks`: Custom React hooks for UI and state.

## ⚖️ License

This project is developed for institutional use at New Era University. All rights reserved.

---
*Built with ❤️ by the Library IT Office*