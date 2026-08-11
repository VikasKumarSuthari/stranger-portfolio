import React from 'react';
import HeroSection from '../components/Sections/HeroSection';
import AboutSection from '../components/Sections/AboutSection';
import ProjectGrid from '../components/Sections/ProjectGrid';
import ExperienceSection from '../components/Sections/ExperienceSection';
import AchievementsSection from '../components/Sections/AchievementsSection';
import GamesSection from '../components/Sections/GamesSection';
import ContactTerminal from '../components/Sections/ContactTerminal';

const Home = () => {
    return (
        <div className="flex flex-col w-full">
            <div id="hero">
                <HeroSection />
            </div>
            <div id="about">
                <AboutSection />
            </div>
            <div id="experience">
                <ExperienceSection />
            </div>
            <div id="projects">
                <ProjectGrid />
            </div>
            <div id="games">
                <GamesSection />
            </div>
            <div id="achievements">
                <AchievementsSection />
            </div>
            {/* The ContactTerminal component handles both #contact and #getintouch internally */}
            <ContactTerminal />
        </div>
    );
};

export default Home;
