import { Link, useLocation } from "react-router-dom";
import ChatSection from "@/components/ChatSection";

const Index = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-white">
      <div className="relative z-10">
        {/* Header Navigation */}
        <header className="py-6 px-6">
          <nav className="max-w-6xl mx-auto">
            <div className="flex space-x-8">
              <Link 
                to="/" 
                className={`font-medium transition-colors ${
                  location.pathname === "/" 
                    ? "text-cyan-400 border-b-2 border-cyan-400 pb-1" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
              </Link>
            </div>
          </nav>
        </header>
        {/* Chat Section */}
        <ChatSection />
      </div>
    </div>
  );
};

export default Index;
