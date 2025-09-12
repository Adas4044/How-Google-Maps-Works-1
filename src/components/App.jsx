import Map from "./Map";
import IntroScreen from "./IntroScreen";
import GeoIntroduction from "./GeoIntroduction";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useEffect } from "react";
import { useTutorial } from "../hooks/useTutorial";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    const [showIntro, setShowIntro] = useState(true);
    const tutorial = useTutorial();

    useEffect(() => {
        // Always show intro for now to debug
        // const hasSeenIntro = localStorage.getItem("pathfinding_intro_seen");
        // if (hasSeenIntro) {
        //     setShowIntro(false);
        // }
    }, []);

    const handleStartApp = () => {
        localStorage.setItem("pathfinding_intro_seen", "true");
        setShowIntro(false);
        setTimeout(() => {
            tutorial.startTutorial();
        }, 500);
    };

    const handleShowIntro = () => {
        setShowIntro(true);
    };

    const handleResetTutorial = () => {
        tutorial.resetTutorial();
        tutorial.startTutorial();
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {showIntro ? (
                <IntroScreen onStart={handleStartApp} />
            ) : (
                <>
                    <Map 
                        onShowIntro={handleShowIntro}
                        onResetTutorial={handleResetTutorial}
                        tutorial={tutorial}
                    />
                    <GeoIntroduction 
                        event={tutorial.currentEvent}
                        onNext={tutorial.handleNext}
                        onClose={tutorial.handleClose}
                        onSkip={tutorial.skipTutorial}
                    />
                </>
            )}
        </ThemeProvider>
    );
}

export default App;