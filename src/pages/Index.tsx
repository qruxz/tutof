import { Link, useLocation } from "react-router-dom";
import ChatSection from "@/components/ChatSection";

const Index = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-white">
      <div className="relative z-10">

        {/* Chat Section */}
        <ChatSection />
      </div>
    </div>
  );
};

export default Index;
