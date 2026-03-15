# NEULibraryGuard 🛡️

NEULibraryGuard is a high-performance, AI-integrated visitor management and security logging system specifically engineered for the **New Era University Library**. It replaces traditional paper logs with a sophisticated digital terminal that enhances security and provides personalized academic assistance.

## 🌟 Core Features

### 1. Institutional Check-In Terminal
- **Dual-Mode Authentication**: Supports both alphanumeric School IDs and Institutional Google Emails (`@neu.edu.ph`).
- **Purpose Selection**: Intelligent categorization of visits (Thesis Research, Leisure Reading, Computer Use, etc.).
- **Real-time Validation**: Instant cross-referencing with the visitor database to prevent unauthorized access.

### 2. AI Librarian (Powered by Genkit & Gemini)
- **Context-Aware Suggestions**: Leverages Google Gemini 2.5 Flash via Firebase Genkit to provide immediate resource recommendations based on the visitor's purpose.
- **Academic Routing**: Suggests specific library sections (e.g., Periodicals, Reserve Section) to streamline the student's research process.

### 3. Visitor Enrollment System
- **Self-Service Registration**: Allows new students and faculty to securely link their institutional credentials to the system.
- **College-Specific Data**: Captures department information for granular usage analytics.

### 4. Secure Admin Portal
- **Protected Access**: Dashboard secured with management credentials (Default: `123`).
- **Interactive Analytics**: Visual traffic trends powered by Recharts, showing peak hours and daily visitor counts.
- **Dynamic Access Control**: Ability for library administrators to "Block" or "Unblock" specific IDs in real-time.
- **Enriched Logging**: A historical audit trail of all library entries with search and filter capabilities.

## 🛠️ Technical Architecture

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **AI Orchestration** | Genkit 1.x |
| **LLM Model** | Google Gemini 2.5 Flash |
| **UI Components** | ShadCN UI |
| **Styling** | Tailwind CSS (with CSS Variables for Theming) |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **State/Storage** | LocalStorage API (Browser-persistent Mock Database) |
| **Language** | TypeScript |

## 🚀 Installation & Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-org/neu-library-guard.git
    cd neu-library-guard
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```env
    GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
    ```

4.  **Launch the System**:
    ```bash
    npm run dev
    ```
    - **Public Terminal**: `http://localhost:9002/`
    - **Admin Dashboard**: `http://localhost:9002/admin/login` (Password: `123`)

## 📁 Project Structure Highlights

- `src/ai/flows`: Contains the Genkit logic for library resource suggestions.
- `src/app/admin`: Secure administrative routes for analytics and access control.
- `src/app/lib/db.ts`: Local database interface for managing visitors and logs.
- `src/components/terminal`: The core interactive check-in experience.
- `src/app/globals.css`: Customized ShadCN theme with professional academic styling.

## 🔐 Security & Compliance

- **Authentication**: Institutional ID validation ensures only active community members can log entries.
- **Data Privacy**: Local storage approach for the prototype ensures data stays within the client environment.
- **Admin Security**: Restricted management routes prevent unauthorized modification of access lists.

---

*This project is an official prototype for the New Era University Library Information Technology Office.*