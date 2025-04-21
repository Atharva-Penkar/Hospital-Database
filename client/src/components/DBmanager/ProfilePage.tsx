// // ProfilePage.tsx

// import React from "react";


// const ProfilePage: React.FC = () => (
//   <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #ddd", borderRadius: 8 }}>
//     <h2>Welcome aboard, {userName}!</h2>
//     <p>We're thrilled to have you join us. Get ready for a memorable experience!</p>
//     <div>
//       <strong>User ID:</strong> {userId}
//     </div>
//     <div>
//       <strong>Name:</strong> {userName}
//     </div>
//   </div>
// );

// export default ProfilePage;
import React from "react";

// Define the props interface
interface ProfilePageProps {
  user: {
    id: string | number;
    name: string;
  };
  darkMode: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, darkMode }) => (
  <div style={{ 
    maxWidth: 400, 
    margin: "40px auto", 
    padding: 24, 
    border: `1px solid ${darkMode ? '#3b82f6' : '#ddd'}`, 
    borderRadius: 8,
    backgroundColor: darkMode ? '#1e293b' : '#fff',
    color: darkMode ? '#e2e8f0' : '#333'
  }}>
    <h2 style={{ color: darkMode ? '#3b82f6' : '#000' }}>Welcome aboard, {user.name}!</h2>
    <p>We're thrilled to have you join us. Get ready for a memorable experience!</p>
    <div style={{ marginTop: 16 }}>
      <strong>User ID:</strong> {user.id}
    </div>
    <div style={{ marginTop: 8 }}>
      <strong>Name:</strong> {user.name}
    </div>
  </div>
);

export default ProfilePage;
