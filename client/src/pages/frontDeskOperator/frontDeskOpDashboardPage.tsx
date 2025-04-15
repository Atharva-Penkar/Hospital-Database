// pages/frontDeskOperator/homepage.tsx
import { useNavigate } from "react-router-dom";
import HomePage from "@/components/frontDeskOperator/frontDeskOpDashboard";

const FrontDeskHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top Bar */}
      <HomePage />
    </div>
  );
};

export default FrontDeskHomePage;
