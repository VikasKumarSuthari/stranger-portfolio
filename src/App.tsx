import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './components/Audio/SoundManager';
import GlobalLayout from './components/Layout/GlobalLayout';
import Navbar from './components/Navigation/Navbar';
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';

import PageTracker from './components/Analytics/PageTracker';

function App() {
    return (
        <ThemeProvider>
            <SoundProvider>
                <Router>
                    <PageTracker />
                    <GlobalLayout>
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/blog" element={<BlogList />} />
                            <Route path="/blog/:slug" element={<BlogPost />} />
                        </Routes>
                    </GlobalLayout>
                </Router>
            </SoundProvider>
        </ThemeProvider>
    );
}

export default App;
