// pages/frontDeskOperator/homepage.tsx
import { useNavigate } from "react-router-dom";
import HomePage from "@/components/frontDeskOperator/homepage";
import { Card, CardContent } from "@/components/ui/card";

const FrontDeskHomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const cardOptions = [
    {
      title: "Schedule Appointment",
      description: "Book appointments for patients with doctors.",
      path: "/frontdesk/schedule-appointment",
    },
    {
      title: "Admit Patient",
      description: "Admit patients to wards or rooms.",
      path: "/frontdesk/admit-patient",
    },
    {
      title: "Schedule Test",
      description: "Schedule diagnostic tests for patients.",
      path: "/frontdesk/schedule-test",
    },
    {
      title: "Schedule Treatment",
      description: "Assign treatments or procedures to patients.",
      path: "/frontdesk/schedule-treatment",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top Bar */}
      <HomePage />

      {/* Functionality cards with onClick behavior */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {cardOptions.map((option) => (
          <Card
            key={option.title}
            className="hover:shadow-xl transition cursor-pointer"
            onClick={() => handleNavigation(option.path)}
          >
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">{option.title}</h2>
              <p className="text-sm text-gray-600">{option.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FrontDeskHomePage;
