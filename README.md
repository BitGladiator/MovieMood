# MovieMood

A modern, feature-rich web application for tracking your movie-watching journey, analyzing viewing statistics, and discovering new films based on your mood.

## Overview

MovieMood is a comprehensive movie tracking platform that helps film enthusiasts maintain a digital diary of watched movies, visualize viewing patterns through detailed statistics, and receive personalized movie recommendations. Built with a sleek, responsive interface supporting both light and dark themes, MovieMood transforms the way you engage with cinema.

## Features

### Core Functionality
- **Movie Diary**: Keep a detailed log of all watched movies with ratings, reviews, and timestamps
- **Statistics Dashboard**: Visualize your viewing habits with interactive charts and analytics
- **Watch Later**: Create and manage a watchlist of movies you want to see
- **Mood-Based Recommendations**: Discover movies tailored to your current mood
- **Movie Finder**: Advanced search and filtering capabilities to find your next favorite film

### User Experience
- **User Profiles**: Personalized user accounts with customizable settings
- **Theme Support**: Seamless switching between light and dark modes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Notifications**: Toast notifications for user actions and updates
- **Interactive Demo**: Try the platform before signing up

### Authentication & Security
- **Firebase Authentication**: Secure user authentication and session management
- **Protected Routes**: Authorization-based access to user-specific features
- **Privacy Controls**: Comprehensive privacy policy and terms of service

### Additional Pages
- **Features Overview**: Detailed breakdown of platform capabilities
- **How It Works**: Step-by-step guide to using the platform
- **Pricing Plans**: Subscription tiers and payment options
- **Contact**: Get in touch with support
- **Settings**: Customize account preferences and notifications

## Technology Stack

### Frontend
- **React 18.2**: Modern React with hooks and functional components
- **Vite**: Lightning-fast build tool and development server
- **React Router v7**: Declarative routing for seamless navigation
- **Framer Motion**: Smooth animations and transitions
- **Tailwind CSS v4**: Utility-first CSS framework for rapid UI development

### State Management & Data
- **React Context API**: Theme management and global state
- **Firebase**: Authentication and real-time database
- **Axios**: HTTP client for API requests

### UI Components & Libraries
- **Chart.js & Recharts**: Interactive data visualizations
- **Lucide React & React Icons**: Comprehensive icon sets
- **React Hot Toast & React Toastify**: User-friendly notifications
- **React Helmet Async**: Dynamic document head management

### Development Tools
- **ESLint**: Code quality and consistency enforcement
- **Vite**: Hot module replacement for rapid development
- **Firebase Hooks**: Simplified Firebase integration

## Project Structure

```
MovieMood/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-specific page components
│   │   ├── context/       # React context providers
│   │   ├── images/        # Image assets
│   │   ├── App.jsx        # Main application component
│   │   ├── main.jsx       # Application entry point
│   │   └── firebase.js    # Firebase configuration
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── package.json           # Root dependencies
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase account for authentication setup

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BitGladiator/MovieMood.git
cd MovieMood
```

2. Install root dependencies:
```bash
npm install
```

3. Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

4. Configure Firebase:
   - Create a `.env` file in the `frontend` directory
   - Add your Firebase configuration credentials

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified by Vite).

## Available Scripts

### Frontend Development
- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the production-ready application
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Configuration

### Environment Variables
Create a `.env` file in the `frontend` directory with the following Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Deployment

The application includes Kubernetes deployment configurations:
- `frontend-deployment.yaml` - Deployment configuration
- `frontend-service.yaml` - Service configuration
- `Dockerfile` - Container image definition

Deploy using kubectl:
```bash
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is available for personal and educational use.

## Support

For issues, questions, or suggestions, please use the Contact page within the application or open an issue on GitHub.

## Acknowledgments

Built with modern web technologies and a passion for cinema. Special thanks to the open-source community for the amazing libraries and tools that made this project possible.
