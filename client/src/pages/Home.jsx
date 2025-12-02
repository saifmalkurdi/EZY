import HeroSection from "../components/sections/HeroSection";
import AILearningSection from "../components/sections/AILearningSection";
import SkillDevelopmentSection from "../components/sections/SkillDevelopmentSection";
import HowItWorksSection from "../components/sections/HowItWorksSection";
import PopularCoursesSection from "../components/sections/PopularCoursesSection";
import AchievementsSection from "../components/sections/AchievementsSection";
import TrainersSection from "../components/sections/TrainersSection";
import CertificationsSection from "../components/sections/CertificationsSection";
import CollaborationsSection from "../components/sections/CollaborationsSection";

export default function Home() {
  return (
    <div className="bg-white">
      <HeroSection />
      <div className="py-8">
        <AILearningSection />
      </div>
      <div className="py-8">
        <SkillDevelopmentSection />
      </div>
      <div className="py-8">
        <HowItWorksSection />
      </div>
      <div className="py-8">
        <PopularCoursesSection />
      </div>
      <div className="py-8">
        <AchievementsSection />
      </div>
      <div className="py-8">
        <TrainersSection />
      </div>
      <div className="py-8">
        <CertificationsSection />
      </div>
      <div className="py-8">
        <CollaborationsSection />
      </div>
    </div>
  );
}
