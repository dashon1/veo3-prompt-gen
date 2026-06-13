import Builder from './pages/Builder';
import Home from './pages/Home';
import Library from './pages/Library';
import Templates from './pages/Templates';
import Community from './pages/Community';
import Analytics from './pages/Analytics';
import Characters from './pages/Characters';
import PromptOptimizer from './pages/PromptOptimizer';
import Credits from './pages/Credits';
import PromptChains from './pages/PromptChains';
import BatchGenerator from './pages/BatchGenerator';
import AgentHub from './pages/AgentHub';
import AgentChat from './pages/AgentChat';
import VideoGeneration from './pages/VideoGeneration';
import Projects from './pages/Projects';
import Versions from './pages/Versions';
import ABTesting from './pages/ABTesting';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Storyboard from './pages/Storyboard';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Builder": Builder,
    "Home": Home,
    "Library": Library,
    "Templates": Templates,
    "Community": Community,
    "Analytics": Analytics,
    "Characters": Characters,
    "PromptOptimizer": PromptOptimizer,
    "Credits": Credits,
    "PromptChains": PromptChains,
    "BatchGenerator": BatchGenerator,
    "AgentHub": AgentHub,
    "AgentChat": AgentChat,
    "VideoGeneration": VideoGeneration,
    "Projects": Projects,
    "Versions": Versions,
    "ABTesting": ABTesting,
    "Dashboard": Dashboard,
    "Admin": Admin,
    "Storyboard": Storyboard,
}

export const pagesConfig = {
    mainPage: "Builder",
    Pages: PAGES,
    Layout: __Layout,
};