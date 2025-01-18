# Buzz-Bee

**Buzz-Bee** is a social community platform designed for anonymous question-and-answer exchanges. Inspired by Reddit, this platform empowers users to share knowledge, participate in discussions, and engage without the fear of judgment. Users can join communities, create and vote on polls, and engage with dynamic content. All participation is anonymous for a more open and honest exchange of ideas.

## Key Features

- 🐝 **Anonymous Participation**: Share knowledge or ask questions anonymously.
- 🐝 **Community Creation**: Join existing communities or create new ones for topic-based discussions.
- 🐝 **Polls**: Create and participate in polls with real-time vote tracking.
- 🐝 **Voting System**: Vote up or down on posts, polls, and answers to influence the community's direction.
- 🐝 **Real-Time Updates**: Get instant updates with real-time data synchronization.
- 🐝 **Animated Profile Pictures**: Customize your experience with animated avatars.
  
## Technologies Used

- **Frontend**: ReactJS, JavaScript, TailwindCSS, Framer Motion
- **Backend**: Firebase Firestore (for data storage and real-time synchronization)
- **Authentication**: Firebase Authentication (for user login)
- **Deployment**: Netlify

## Getting Started

To get a copy of the project running locally on your machine, follow these steps:

### Prerequisites

Ensure you have the following tools installed:
- **Node.js** (v16 or higher)
- **npm** (v7 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KumarDeepak16/Buzz-Bee.git
   cd Buzz-Bee
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project (if you haven’t already) and enable Firestore and Firebase Authentication.
   - Create a `.env` file in the root directory and add your Firebase configuration:
     ```env
     REACT_APP_FIREBASE_API_KEY=your-api-key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
     REACT_APP_FIREBASE_PROJECT_ID=your-project-id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     REACT_APP_FIREBASE_APP_ID=your-app-id
     ```

4. Run the application locally:
   ```bash
   npm start
   ```

This should start the development server and the application will be available at [http://localhost:3000](http://localhost:3000).

## Contribution

Contributions are always welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a new Pull Request.

## License

Buzz-Bee is open-source software licensed under the [MIT License](LICENSE).
