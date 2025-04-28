
import { Rabbit, Sparkle, Star } from "lucide-react";

export const Header = () => {
  return (
    <div className="text-center mb-16 relative">
      {/* Decorative elements */}
      <div className="absolute -top-10 right-1/4 transform rotate-12">
        <Star className="w-24 h-24 text-[#FF8133]/10" />
      </div>
      <div className="absolute top-0 left-1/4 transform -rotate-12">
        <Sparkle className="w-16 h-16 text-[#FF8133]/10" />
      </div>
      <div className="absolute bottom-0 right-1/3">
        <Rabbit className="w-12 h-12 text-[#FF8133]/10" />
      </div>
      
      <div>
        <h1 className="text-6xl font-bold mb-6 relative">
          <img 
            src="/uploads/0ca35f7c-d6a1-49eb-9a3e-bf2c2e7194c3.png"
            alt="SlinkyLayer" 
            className="h-[50px] mx-auto dark:block hidden object-contain"
          />
          <span className="text-[#FF8133] dark:hidden">
            SlinkyLayer
          </span>
          <div className="absolute -top-6 -right-6">
            <Sparkle className="w-8 h-8 text-[#FF8133] animate-pulse" />
          </div>
        </h1>
      </div>
      <p className="text-xl text-[#605F5B] max-w-2xl mx-auto mb-8 animate-fade-in delay-200 relative">
        Launch powerful AI trading agents across multiple blockchains with one click
        <div className="absolute -bottom-4 right-0">
          <Star className="w-6 h-6 text-[#FF8133]/20" />
        </div>
      </p>
    </div>
  );
};
