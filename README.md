# Buzz-Bee

**Buzz-Bee** is a cutting-edge social community platform designed for anonymous question-and-answer exchanges. Inspired by Reddit, the platform empowers users to engage in open, fear-free discussions. Users can join communities, vote on polls, and participate in meaningful discussions with the assurance of anonymity. It combines real-time functionality with a dynamic, visually appealing interface.

---

## Key Features

- 🐝 **Anonymous Participation**: Ask questions and share knowledge anonymously.
- 🐝 **Community Engagement**: Create or join communities for topic-specific discussions.
- 🐝 **Real-Time Polls**: Create and vote on polls with real-time vote percentage tracking.
- 🐝 **Voting System**: Influence discussions through dynamic upvotes and downvotes on posts, comments, and polls.
- 🐝 **Real-Time Updates**: Leveraging Firebase Firestore for seamless data synchronization.
- 🐝 **Animated Profile Pictures**: Customize your avatar for an engaging user experience.

---

## Live Link

Explore the **Buzz-Bee** platform here: [Buzz-Bee Live Website](https://buzz-bee.netlify.app)

---

## Screenshots

![Screenshot 2025-01-18 103052](https://github.com/user-attachments/assets/32291a9b-a7b9-4570-9ae6-f506c3e94510)
![Screenshot 2025-01-18 103210](https://github.com/user-attachments/assets/9c401674-ea3c-42b5-adb7-950c9cb9696b)
![Screenshot 2025-01-18 103011](https://github.com/user-attachments/assets/7f4ccb24-5516-4176-8c1a-c163d4fa715b)
![Screenshot 2025-01-18 103125](https://github.com/user-attachments/assets/15305f11-7ae2-48a9-8803-c3239275c649)
![Screenshot 2025-01-18 103148](https://github.com/user-attachments/assets/13b1d97a-e769-442b-9686-96fd8dd38b1c)
![Screenshot 2025-01-18 103025](https://github.com/user-attachments/assets/8b362839-62aa-43fb-b1f7-16193c68e81e)
![Screenshot 2025-01-18 103625](https://github.com/user-attachments/assets/e11a63f1-57a7-418b-ba35-9398bc073edf)




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
