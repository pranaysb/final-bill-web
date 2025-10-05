# Modern Billing System

This is a production-ready billing application built with a modern tech stack. It features a clean user interface, a robust backend for data management, and a seamless deployment process.

![Bill Maker Page Screenshot](https://i.imgur.com/gK9qQ4n.png)
![Invoice Page Screenshot](https://i.imgur.com/GzB9pS9.png)

## ✨ Features

-   **Modern UI:** Clean, responsive design using TailwindCSS.
-   **Address Book:** Full CRUD functionality to save, manage, and reuse buyer addresses.
-   **Database Persistence:** All invoices and addresses are stored in a Postgres database.
-   **API-Driven:** Frontend communicates with a robust backend API.
-   **Offline Fallback:** If the API is unreachable, the app gracefully falls back to using the browser's `localStorage`, ensuring functionality is never lost.
-   **PDF Export:** Generate and download professional PDF invoices with a single click.
-   **Deployment Ready:** One-click deployment to Vercel with all configurations included.

## 🛠️ Tech Stack

-   **Frontend:** HTML, TailwindCSS, Vanilla JavaScript (ES6+)
-   **Backend:** Node.js (Vercel Serverless Functions)
-   **Database:** Supabase (Postgres)
-   **Deployment:** Vercel

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally and deploy it.

### Step 1: Set Up Supabase

1.  **Create a Supabase Project:** Go to [supabase.com](https://supabase.com), create a new project, and choose a strong database password.
2.  **Get Credentials:** Navigate to your project's **Settings > API**. You will need two values:
    -   Project URL (e.g., `https://xyz.supabase.co`)
    -   `anon` `public` Key
3.  **Run the Database Migrations:**
    -   Go to the **SQL Editor** in your Supabase project dashboard.
    -   Click **+ New query**.
    -   Copy the entire content of the `sql/migrations.sql` file from this repository.
    -   Paste it into the query editor and click **RUN**. This will create the `addresses` and `invoices` tables.

### Step 2: Local Development Setup

1.  **Clone the Repository:**
    ```bash
    git clone <your-repo-url>
    cd modern-billing-system
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables:**
    -   Rename the `.env.example` file to `.env`.
    -   Open `.env` and paste the Supabase credentials you copied in Step 1.
    ```
    SUPABASE_URL="[https://your-project-ref.supabase.co](https://your-project-ref.supabase.co)"
    SUPABASE_ANON_KEY="your-supabase-anon-key"
    ```

4.  **Install Vercel CLI:**
    ```bash
    npm install -g vercel
    ```

5.  **Run the Development Server:**
    ```bash
    vercel dev
    ```
    This command starts a local server that mimics the Vercel production environment, including running your serverless functions. Open your browser to the provided URL (usually `http://localhost:3000`).

### Step 3: Deployment to Vercel

1.  **Push to GitHub:** Create a new repository on GitHub and push your project code to it.

2.  **Import Project on Vercel:**
    -   Log in to your Vercel account.
    -   Click **Add New... > Project**.
    -   Import the GitHub repository you just created.

3.  **Configure Environment Variables:**
    -   In the project configuration screen on Vercel, expand the **Environment Variables** section.
    -   Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` with the same values from your `.env` file. This is crucial for the deployed application to connect to your database.

4.  **Deploy:**
    -   Click the **Deploy** button. Vercel will automatically build your project and deploy it. The `vercel.json` file in the repository tells Vercel how to handle the project structure correctly.

Your modern billing system is now live! 🎉