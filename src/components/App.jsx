import Map from "./Map";
import IntroScreen from "./IntroScreen";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useEffect } from "react";
import { Analytics } from '@vercel/analytics/react';

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    const [showIntro, setShowIntro] = useState(true);

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
    };

    const handleShowIntro = () => {
        setShowIntro(true);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {showIntro ? (
                <IntroScreen onStart={handleStartApp} />
            ) : (
                <Map onShowIntro={handleShowIntro} />
            )}
            <Analytics />
        </ThemeProvider>
    );
}

export default App;