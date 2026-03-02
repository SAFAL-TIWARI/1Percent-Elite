# 1% Elite - Document Management Dashboard

A premium, responsive document management interface designed to seamlessly integrate with Google Drive. This application provides a sleek, modern way to browse, preview, and share resources directly from a connected Drive folder.

## 🚀 Features

-   **Drive Integration**: Browse folders and files in real-time using the Google Drive API.
-   **File Preview**: Instant preview for Images, PDFs, and Videos within the dashboard.
-   **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile devices.
-   **Theme System**: Built-in Dark and Light modes with persistent preference.
-   **File Actions**:
    -   **Download**: Direct download links for files.
    -   **Share**: Generate shareable links and share directly to WhatsApp, Telegram, or Email.
-   **Modern UI**: Glassmorphism effects, smooth transitions, and a clean, professional aesthetic.
-   **PWA Support**:
    -   **Installable**: Install as a native app on Android, iOS, and Desktop.
    -   **Offline Capable**: Works offline with a hybrid caching strategy (Cache-First for assets, Network-First for data).
    -   **App-like Experience**: Standalone mode with custom splash screen and icons.

## 🛠️ Tech Stack

-   **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+)
-   **Backend/Tooling**: Node.js (Environment setup), Vercel (Deployment)
-   **Icons**: FontAwesome 6
-   **Fonts**: Inter (Google Fonts)

## ⚙️ Installation & Setup

### Prerequisites

-   Node.js installed on your machine.
-   A Google Cloud Project with the **Google Drive API** enabled.
-   An API Key from Google Cloud Console.

### Installation & Setup

#### 📱 Install as App (PWA)
1.  **Visit the Website**: Go to the deployed URL.
2.  **Install**:
    -   **Desktop**: Click the install icon in the address bar.
    -   **Android**: Tap "Add to Home Screen" or "Install App" from the Chrome menu.
    -   **iOS**: Tap Share -> "Add to Home Screen".
3.  **Offline Use**: The app will now work offline and load instantly!

### Local Development

1.  **Clone the repository**
    ```bash
    git clone https://github.com/SAFAL-TIWARI/OnePercent-Elite.git
    cd OnePercent-Elite
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your Google Drive API Key:
    ```env
    GOOGLE_DRIVE_API_KEY=your_api_key_here
    ```

4.  **Start the Development Server**
    ```bash
    npm run dev
    ```
    The application will launch at `http://127.0.0.1:8080/public/index.html`.

## 🚀 Deployment (Vercel)

This project is optimized for deployment on Vercel.

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  **Configure Project Settings**:
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `public`
4.  **Environment Variables**:
    -   Add `GOOGLE_DRIVE_API_KEY` in the Vercel Project Settings.

## 📂 Project Structure

```
├── public/              # Static assets and frontend code
│   ├── assets/          # Images and icons
│   ├── index.html       # Main entry point
│   ├── styles.css       # Global styles and themes
│   ├── scripts.js       # UI logic and event handling
│   ├── server.js        # Google Drive API integration logic
│   └── env.js           # Generated at runtime
└── .env                 # Local environment variables (gitignored)
```

## 📱 App Development Roadmap

Looking to build a mobile app using AI tools? Check out our **[Complete AI App Development Roadmap](docs/AI-App-Development-Roadmap.md)** — a step-by-step guide covering:

- **Design** with Stitch (Figma AI)
- **Generate** code with Antigravity
- **Customize** in Flutter
- **Connect** Firebase backend
- **Build** APK/IPA
- **Publish** on Play Store & App Store (and free alternatives)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
