# Buzz-Bee

**Buzz-Bee** is a cutting-edge social community platform designed for anonymous question-and-answer exchanges. Inspired by Reddit, the platform empowers users to engage in open, fear-free discussions. Users can join communities, vote on polls, and participate in meaningful discussions with the assurance of anonymity. It combines real-time functionality with a dynamic, visually appealing interface.

---

## Live Link

Explore the **Buzz-Bee** platform here: [Buzz-Bee Live Website](https://buzz-bee.netlify.app)

---

## Key Features

- 🐝 **Anonymous Participation**: Ask questions and share knowledge anonymously.
- 🐝 **Community Engagement**: Create or join communities for topic-specific discussions.
- 🐝 **Real-Time Polls**: Create and vote on polls with real-time vote percentage tracking.
- 🐝 **Voting System**: Influence discussions through dynamic upvotes and downvotes on posts, comments, and polls.
- 🐝 **Real-Time Updates**: Leveraging Firebase Firestore for seamless data synchronization.
- 🐝 **Animated Profile Pictures**: Customize your avatar for an engaging user experience.

---

## Screenshots


![Screenshot 2025-01-18 103052](https://github.com/user-attachments/assets/1255ac3e-be62-4c13-af29-9ce46f4e166f)
![Screenshot 2025-01-18 103210](https://github.com/user-attachments/assets/684c665d-5f45-4932-acd0-1b2458bca6d9)
![Screenshot 2025-01-18 103148](https://github.com/user-attachments/assets/1ccaa99c-9fda-479c-97c2-d915280f7a3d)
![Screenshot 2025-01-18 103125](https://github.com/user-attachments/assets/78eeddfc-9d16-499c-9738-931d7f279b03)
![Screenshot 2025-01-18 103025](https://github.com/user-attachments/assets/7d05997a-6256-4c8c-a184-7a1d41824312)
![Screenshot 2025-01-18 103011](https://github.com/user-attachments/assets/3d60a6bf-585f-4e6c-82ae-ceddaa6a55cf)
![Screenshot 2025-01-18 103625](https://github.com/user-attachments/assets/d92f0afa-965c-40d9-aa5e-7d20cb9336ee)



---

## Technologies Used

### **Core Stack**
- **Frontend**: React (with Vite), TailwindCSS, Framer Motion
- **Backend**: Firebase Firestore (Real-time data storage)
- **Authentication**: Firebase Authentication
- **AI Integration**: Google Gemini API
- **Deployment**: Netlify

### **Libraries and Frameworks**
- **React**: Core frontend framework for building the UI.
- **Vite**: A fast build tool optimized for modern web development.
- **Framer Motion**: For animations and transitions to enhance user interactivity.
- **TailwindCSS**: Utility-first CSS framework for building custom designs.
- **Firebase SDK**: For Firestore and Authentication services.

---

## Setting Up the Project (Vite + React)

To set up the Buzz-Bee project on your local machine using **Vite**, follow these steps:

### **Prerequisites**
Ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### **Installation Steps**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KumarDeepak16/Buzz-Bee.git
   cd Buzz-Bee
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase**:
   - Create a new project in Firebase and enable **Firestore Database** and **Firebase Authentication**.
   - Get your Firebase configuration details from the project settings.
   - Create a `.env` file in the root directory and include your Firebase configuration details:
     ```env
     VITE_FIREBASE_API_KEY=your-api-key
     VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     VITE_FIREBASE_APP_ID=your-app-id
     ```

4. **Configure Google Gemini API**:
   - Obtain an API key from **Google Gemini API** for enabling AI-based responses and integration.
   - Add the Gemini API key to your `.env` file:
     ```env
     VITE_GOOGLE_GEMINI_API_KEY=your-gemini-api-key
     ```

5. **Run the project locally**:
   ```bash
   npm run dev
   ```

6. **Access the application**:
   Visit [http://localhost:5173](http://localhost:5173) to view the app in action.

---

## Note

This project uses **Firebase Storage** for image uploads. However, Firebase Storage has become a paid service, and costs may apply based on your usage. Consider alternative storage solutions if needed.

---

## Contribution

Contributions to **Buzz-Bee** are always appreciated. If you have ideas, bug fixes, or new features, feel free to:
1. **Fork the repository**.
2. **Create a feature branch**:
   ```bash
   git checkout -b feature-branch-name
   ```
3. **Commit changes**:
   ```bash
   git commit -m 'Description of changes'
   ```
4. **Push changes**:
   ```bash
   git push origin feature-branch-name
   ```
5. **Create a pull request**: Submit your branch for review and inclusion in the main project.

---

## License

Buzz-Bee is released under the [MIT License](LICENSE), allowing developers to freely use, modify, and distribute the project.

Enjoy exploring Buzz-Bee, a space for judgment-free engagement! 🚀
