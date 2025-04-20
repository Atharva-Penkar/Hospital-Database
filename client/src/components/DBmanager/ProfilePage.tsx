// ProfilePage.tsx

import React from "react";

const userId = "daud123";
const userName = "Daud";

const ProfilePage: React.FC = () => (
  <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #ddd", borderRadius: 8 }}>
    <h2>Welcome aboard, {userName}!</h2>
    <p>We're thrilled to have you join us. Get ready for a memorable experience!</p>
    <div>
      <strong>User ID:</strong> {userId}
    </div>
    <div>
      <strong>Name:</strong> {userName}
    </div>
  </div>
);

export default ProfilePage;
