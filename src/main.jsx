import React, { useEffect, useState, StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Review from './Review.jsx';
import Cards from './animationbg/cards.jsx';
import Dorgrid from './animationbg/dorgrid.jsx';
import HeroAnimation from './HeroAnimation.jsx';
import Fire from './animationbg/fire.jsx';
import TexttoParticle from './animationbg/TexttoParticle.jsx';
import HorizontalLine from './animationbg/horizontalline.jsx';
import Portfolio from './portfolio.jsx';
import Story from "./animationbg/story.jsx"
import { Scroll } from 'lucide-react';
import ScrollBasedStory from './ScrollBasedStory.jsx';
import HowWeDo from './HowWeDo.jsx';
import NewDashboardPage from './animationbg/NewDashboardPage.jsx';
import CardSection from './CardSection.jsx';
import LogoAnimation from './animationbg/LogoAnima.jsx';
import TrainIntro from './TrainIntro.jsx';
import AniLoader from "./AniLoader.jsx"
import { preloadMetroAssets } from "./MetroTransition.jsx";
const rootEl = document.getElementById('root');

const MainApp = () => {
  const [loaderFinished, setLoaderFinished] = useState(false);
  const [metroAssetsReady, setMetroAssetsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    preloadMetroAssets()
      .catch((error) => {
        console.error("Metro assets failed to preload", error);
      })
      .finally(() => {
        if (isMounted) setMetroAssetsReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const syncBodyCursor = () => {
      const shouldHideCursor =
        document.body.classList.contains('is-ani-loader-active') ||
        document.body.classList.contains('is-metro-intro-active') ||
        document.body.classList.contains('is-metro-outro-active');

      document.body.style.cursor = shouldHideCursor ? 'none' : '';
      window.dispatchEvent(new Event("cursor-visibility-change"));
    };

    if (!loaderFinished) {
      document.body.classList.add('is-ani-loader-active');
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.classList.remove('is-ani-loader-active');
      document.body.style.overflow = '';
    }

    syncBodyCursor();

    return () => {
      document.body.classList.remove('is-ani-loader-active');
      syncBodyCursor();
    };
  }, [loaderFinished]);

  return (
    <>
      {!loaderFinished && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000000000, pointerEvents: 'auto', cursor: 'none' }}>
          <AniLoader
            allowComplete={metroAssetsReady}
            onComplete={() => setLoaderFinished(true)}
          />
        </div>
      )}
      <App />
    </>
  );
};

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp/>} />
        <Route path="/horizontal-line" element={<LogoAnimation/>} />
        <Route path="/train-intro" element={<TrainIntro/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
