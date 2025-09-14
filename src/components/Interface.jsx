import { Button, IconButton, Typography, Snackbar, Alert, CircularProgress, Fade, Tooltip, Drawer, MenuItem, Select, InputLabel, FormControl, Menu, Backdrop, Stepper, Step, StepLabel } from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { PlayArrow, Settings, Movie, Pause, Replay } from "@mui/icons-material";
import Slider from "./Slider";
import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { INITIAL_COLORS, LOCATIONS } from "../config";
import { arrayToRgb, rgbToArray } from "../helpers";

const Interface = forwardRef(({ canStart, started, animationEnded, playbackOn, time, maxTime, settings, colors, loading, timeChanged, cinematic, placeEnd, changeRadius, changeAlgorithm, setPlaceEnd, setCinematic, setSettings, setColors, startPathfinding, toggleAnimation, clearPath, changeLocation, showIntroScreen, algorithmUnlock, onShowGoogleMaps }, ref) => {
    const [sidebar, setSidebar] = useState(false);
    const [snack, setSnack] = useState({
        open: false,
        message: "",
        type: "error",
    });
    const [showTutorial, setShowTutorial] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [helper, setHelper] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const menuOpen = Boolean(menuAnchor);
    const helperTime = useRef(4800);
    const rightDown = useRef(false);
    const leftDown = useRef(false);

    // Use the algorithm unlock system to determine enabled algorithms
    const enabledAlgorithms = algorithmUnlock?.unlockedAlgorithms || ['bfs'];

    const handleAlgorithmSelect = (algorithmId) => {
        if (enabledAlgorithms.includes(algorithmId)) {
            if (algorithmId === 'google-maps') {
                if (onShowGoogleMaps) {
                    onShowGoogleMaps();
                }
            } else {
                changeAlgorithm(algorithmId);
                algorithmUnlock?.handleAlgorithmClick(algorithmId);
            }
        }
    };

    // Expose showSnack to parent from ref
    useImperativeHandle(ref, () => ({
        showSnack(message, type = "error") {
            setSnack({ open: true, message, type });
        },
    }));
      
    function closeSnack() {
        setSnack({...snack, open: false});
    }

    function closeHelper() {
        setHelper(false);
    }

    function handleTutorialChange(direction) {
        if(activeStep >= 2 && direction > 0) {
            setShowTutorial(false);
            return;
        }
        
        setActiveStep(Math.max(activeStep + direction, 0));
    }

    // Start pathfinding or toggle playback
    function handlePlay() {
        if(!canStart) return;
        if(!started && time === 0) {
            startPathfinding();
            return;
        }
        toggleAnimation();
    }
    
    function closeMenu() {
        setMenuAnchor(null);
    }

    window.onkeydown = e => {
        if(e.code === "ArrowRight" && !rightDown.current && !leftDown.current && (!started || animationEnded)) {
            rightDown.current = true;
            toggleAnimation(false, 1);
        }
        else if(e.code === "ArrowLeft" && !leftDown.current && !rightDown.current && animationEnded) {
            leftDown.current = true;
            toggleAnimation(false, -1);
        }
    };

    window.onkeyup = e => {
        if(e.code === "Escape") setCinematic(false);
        else if(e.code === "Space") {
            e.preventDefault();
            handlePlay();
        }
        else if(e.code === "ArrowRight" && rightDown.current) {
            rightDown.current = false;
            toggleAnimation(false, 1);
        }
        else if(e.code === "ArrowLeft" && animationEnded && leftDown.current) {
            leftDown.current = false;
            toggleAnimation(false, 1);
        }
        else if(e.code === "KeyR" && (animationEnded || !started)) clearPath();
    };

    // Show cinematic mode helper
    useEffect(() => {
        if(!cinematic) return;
        setHelper(true);
        setTimeout(() => {
            helperTime.current = 2500;
        }, 200);
    }, [cinematic]);

    useEffect(() => {
        if(localStorage.getItem("path_sawtutorial")) return;
        setShowTutorial(true);
        localStorage.setItem("path_sawtutorial", true);
    }, []);

    return (
        <>
            <div className={`nav-top ${cinematic ? "cinematic" : ""}`}>
                <div className="side slider-container">
                    <Typography id="speed-slider" gutterBottom>
                        Animation speed
                    </Typography>
                    <Slider min={1} max={30} value={settings.speed} onChange={e => { setSettings({...settings, speed: Number(e.target.value)}); }} className="slider" aria-labelledby="speed-slider" />
                </div>
                <IconButton disabled={!canStart} onClick={handlePlay} style={{ backgroundColor: "#46B780", width: 60, height: 60 }} size="large">
                    {(!started || animationEnded && !playbackOn) 
                        ? <PlayArrow style={{ color: "#fff", width: 26, height: 26 }} fontSize="inherit" />
                        : <Pause style={{ color: "#fff", width: 26, height: 26 }} fontSize="inherit" />
                    }
                </IconButton>
                <div className="side">
                    <Button disabled={!animationEnded && started} onClick={clearPath} style={{ color: "#fff", backgroundColor: "#404156", paddingInline: 30, paddingBlock: 7 }} variant="contained">Clear path</Button>
                </div>
            </div>

            <div className={`nav-right ${cinematic ? "cinematic" : ""}`}>
                <Tooltip title="Open settings">
                    <IconButton onClick={() => {setSidebar(true);}} style={{ backgroundColor: "#2A2B37", width: 36, height: 36 }} size="large">
                        <Settings style={{ color: "#fff", width: 24, height: 24 }} fontSize="inherit" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Cinematic mode">
                    <IconButton className="btn-cinematic" onClick={() => {setCinematic(!cinematic);}} style={{ backgroundColor: "#2A2B37", width: 36, height: 36 }} size="large">
                        <Movie style={{ color: "#fff", width: 24, height: 24 }} fontSize="inherit" />
                    </IconButton>
                </Tooltip>
            </div>

            <div className="loader-container">
                <Fade
                    in={loading}
                    style={{
                        transitionDelay: loading ? "50ms" : "0ms",
                    }}
                    unmountOnExit
                >
                    <CircularProgress color="inherit" />
                </Fade>
            </div>

            <Snackbar 
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }} 
                open={snack.open} 
                autoHideDuration={4000} 
                onClose={closeSnack}>
                <Alert 
                    onClose={closeSnack} 
                    severity={snack.type} 
                    style={{ width: "100%", color: "#fff" }}
                >
                    {snack.message}
                </Alert>
            </Snackbar>

            <Snackbar 
                anchorOrigin={{ vertical: "top", horizontal: "center" }} 
                open={helper} 
                autoHideDuration={helperTime.current} 
                onClose={closeHelper}
            >
                <div className="cinematic-alert">
                    <Typography fontSize="18px"><b>Cinematic mode</b></Typography>
                    <Typography>Use keyboard shortcuts to control animation</Typography>
                    <Typography>Press <b>Escape</b> to exit</Typography>
                </div>
            </Snackbar>

            <div className="mobile-controls">
                <Button onClick={() => {setPlaceEnd(!placeEnd);}} style={{ color: "#fff", backgroundColor: "#404156", paddingInline: 30, paddingBlock: 7 }} variant="contained">
                    {placeEnd ? "placing end node" : "placing start node"}
                </Button>
            </div>

            {/* Algorithm selection bar - bottom center for quick selection */}
            <div className="algo-bar">
                <Tooltip title="BFS">
                    <Button
                        onClick={() => handleAlgorithmSelect("bfs")}
                        disabled={(!animationEnded && started) || !enabledAlgorithms.includes('bfs')}
                        variant={settings.algorithm === "bfs" ? "contained" : "outlined"}
                        style={{ 
                            backgroundColor: settings.algorithm === "bfs" ? "#46B780" : enabledAlgorithms.includes('bfs') ? "#404156" : "#2a2a2a", 
                            color: enabledAlgorithms.includes('bfs') ? "#fff" : "#666", 
                            textTransform: "none", 
                            padding: "0 16px", 
                            minWidth: 120, 
                            height: 44, 
                            borderRadius: 22,
                            opacity: enabledAlgorithms.includes('bfs') ? 1 : 0.5
                        }}
                    >
                        BFS
                    </Button>
                </Tooltip>

                <Tooltip title="DFS">
                    <Button
                        onClick={() => handleAlgorithmSelect("dfs")}
                        disabled={(!animationEnded && started) || !enabledAlgorithms.includes('dfs')}
                        variant={settings.algorithm === "dfs" ? "contained" : "outlined"}
                        style={{ 
                            backgroundColor: settings.algorithm === "dfs" ? "#46B780" : enabledAlgorithms.includes('dfs') ? "#404156" : "#2a2a2a", 
                            color: enabledAlgorithms.includes('dfs') ? "#fff" : "#666", 
                            textTransform: "none", 
                            padding: "0 16px", 
                            minWidth: 120, 
                            height: 44, 
                            borderRadius: 22,
                            opacity: enabledAlgorithms.includes('dfs') ? 1 : 0.5
                        }}
                    >
                        DFS
                    </Button>
                </Tooltip>

                <Tooltip title="Bidirectional BFS">
                    <Button
                        onClick={() => handleAlgorithmSelect("bidirectional")}
                        disabled={(!animationEnded && started) || !enabledAlgorithms.includes('bidirectional')}
                        variant={settings.algorithm === "bidirectional" ? "contained" : "outlined"}
                        style={{ 
                            backgroundColor: settings.algorithm === "bidirectional" ? "#46B780" : enabledAlgorithms.includes('bidirectional') ? "#404156" : "#2a2a2a", 
                            color: enabledAlgorithms.includes('bidirectional') ? "#fff" : "#666", 
                            textTransform: "none", 
                            padding: "0 16px", 
                            minWidth: 170, 
                            height: 44, 
                            borderRadius: 22,
                            opacity: enabledAlgorithms.includes('bidirectional') ? 1 : 0.5
                        }}
                    >
                        Bidirectional BFS
                    </Button>
                </Tooltip>

                <Tooltip title="Greedy">
                    <Button
                        onClick={() => handleAlgorithmSelect("greedy")}
                        disabled={(!animationEnded && started) || !enabledAlgorithms.includes('greedy')}
                        variant={settings.algorithm === "greedy" ? "contained" : "outlined"}
                        style={{ 
                            backgroundColor: settings.algorithm === "greedy" ? "#46B780" : enabledAlgorithms.includes('greedy') ? "#404156" : "#2a2a2a", 
                            color: enabledAlgorithms.includes('greedy') ? "#fff" : "#666", 
                            textTransform: "none", 
                            padding: "0 16px", 
                            minWidth: 140, 
                            height: 44, 
                            borderRadius: 22,
                            opacity: enabledAlgorithms.includes('greedy') ? 1 : 0.5
                        }}
                    >
                        Greedy
                    </Button>
                </Tooltip>

                <Tooltip title="A*">
                    <Button
                        onClick={() => handleAlgorithmSelect("astar")}
                        disabled={(!animationEnded && started) || !enabledAlgorithms.includes('astar')}
                        variant={settings.algorithm === "astar" ? "contained" : "outlined"}
                        style={{ 
                            backgroundColor: settings.algorithm === "astar" ? "#46B780" : enabledAlgorithms.includes('astar') ? "#404156" : "#2a2a2a", 
                            color: enabledAlgorithms.includes('astar') ? "#fff" : "#666", 
                            textTransform: "none", 
                            padding: "0 16px", 
                            minWidth: 140, 
                            height: 44, 
                            borderRadius: 22,
                            opacity: enabledAlgorithms.includes('astar') ? 1 : 0.5
                        }}
                    >
                        A*
                    </Button>
                </Tooltip>

                <Tooltip title="Bidirectional A*">
                    <Button
                        onClick={() => handleAlgorithmSelect("bidirectional-astar")}
                        disabled={(!animationEnded && started) || !enabledAlgorithms.includes('bidirectional-astar')}
                        variant={settings.algorithm === "bidirectional-astar" ? "contained" : "outlined"}
                        style={{ 
                            backgroundColor: settings.algorithm === "bidirectional-astar" ? "#46B780" : enabledAlgorithms.includes('bidirectional-astar') ? "#404156" : "#2a2a2a", 
                            color: enabledAlgorithms.includes('bidirectional-astar') ? "#fff" : "#666", 
                            textTransform: "none", 
                            padding: "0 16px", 
                            minWidth: 170, 
                            height: 44, 
                            borderRadius: 22,
                            opacity: enabledAlgorithms.includes('bidirectional-astar') ? 1 : 0.5
                        }}
                    >
                        Bidirectional A*
                    </Button>
                </Tooltip>

                <Tooltip title="A* + Lookup Table">
                    <Button
                        onClick={() => handleAlgorithmSelect("bidirectional-astar-lookup")}
                        disabled={(!animationEnded && started) || !enabledAlgorithms.includes('bidirectional-astar-lookup')}
                        variant={settings.algorithm === "bidirectional-astar-lookup" ? "contained" : "outlined"}
                        style={{ 
                            backgroundColor: settings.algorithm === "bidirectional-astar-lookup" ? "#46B780" : enabledAlgorithms.includes('bidirectional-astar-lookup') ? "#404156" : "#2a2a2a", 
                            color: enabledAlgorithms.includes('bidirectional-astar-lookup') ? "#fff" : "#666", 
                            textTransform: "none", 
                            padding: "0 16px", 
                            minWidth: 200, 
                            height: 44, 
                            borderRadius: 22,
                            opacity: enabledAlgorithms.includes('bidirectional-astar-lookup') ? 1 : 0.5
                        }}
                    >
                        A* + Lookup Table
                    </Button>
                </Tooltip>

                <Tooltip title="Google Maps">
                    <Button
                        onClick={() => handleAlgorithmSelect("google-maps")}
                        disabled={!enabledAlgorithms.includes('google-maps')}
                        variant="outlined"
                        style={{ 
                            backgroundColor: enabledAlgorithms.includes('google-maps') ? "#4285F4" : "#2a2a2a", 
                            color: enabledAlgorithms.includes('google-maps') ? "#fff" : "#666", 
                            textTransform: "none", 
                            padding: "0 16px", 
                            minWidth: 150, 
                            height: 44, 
                            borderRadius: 22,
                            opacity: enabledAlgorithms.includes('google-maps') ? 1 : 0.5,
                            border: enabledAlgorithms.includes('google-maps') ? "2px solid #4285F4" : "1px solid #666"
                        }}
                    >
                        Google Maps
                    </Button>
                </Tooltip>
            </div>

            <Backdrop
                open={showTutorial}
                onClick={e => {if(e.target.classList.contains("backdrop")) setShowTutorial(false);}}
                className="backdrop"
            >
                <div className="tutorial-container">
                    <Stepper activeStep={activeStep}>
                        <Step>
                            <StepLabel>Basic controls</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Playback controls</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Changing settings</StepLabel>
                        </Step>
                    </Stepper>
                    <div className="content">
                        <h1>Map Pathfinding Visualizer</h1>
                        {activeStep === 0 && <div>
                            <p>
                                <b>Controls:</b> <br/>
                                <b>Left button:</b> Place start node <br/>
                                <b>Right button:</b> Place end node <br/>
                            </p>
                            <p>The end node must be placed within the shown radius.</p>
                        </div>}
                        {activeStep === 1 && <div>
                            <p>
                                To start the visualization, press the <b>Start Button</b> or press <b>Space</b>.<br/>
                                A playback feature is available after the algorithm ends.
                            </p>
                        </div>}
                        {activeStep === 2 && <div>
                            <p>
                                You can customize the settings of the animation in the <b>Settings Sidebar</b>. <br/>
                                Try to keep the area radius only as large as you need it to be. <br/>
                                Anything above <b>10km</b> is considered experimental, if you run into performance issues, stop the animation and clear the path.
                            </p>
                        </div>}
                    </div>
                    <div className="controls">
                        <Button onClick={() => {setShowTutorial(false);}}
                            className="close" variant="outlined" style={{ borderColor: "#9f9f9f", color: "#9f9f9f", paddingInline: 15 }}
                        >
                            Close
                        </Button>
                        <Button onClick={() => {handleTutorialChange(-1);}}
                            variant="outlined" style={{ borderColor: "#9f9f9f", color: "#9f9f9f", paddingInline: 18 }}
                        >
                                Back
                        </Button>
                        <Button onClick={() => {handleTutorialChange(1);}}
                            variant="contained" style={{ backgroundColor: "#46B780", color: "#fff", paddingInline: 30, fontWeight: "bold" }}
                        >
                            {activeStep >= 2 ? "Finish" : "Next"}
                        </Button>
                    </div>
                </div>
            </Backdrop>

            <Drawer
                className={`side-drawer ${cinematic ? "cinematic" : ""}`}
                anchor="left"
                open={sidebar}
                onClose={() => {setSidebar(false);}}
            >
                <div className="sidebar-container">

                    <FormControl variant="filled">
                        <InputLabel style={{ fontSize: 14 }} id="algo-select">Algorithm</InputLabel>
                        <Select
                            labelId="algo-select"
                            value={settings.algorithm}
                            onChange={e => {handleAlgorithmSelect(e.target.value);}}
                            required
                            style={{ backgroundColor: "#404156", color: "#fff", width: "100%", paddingLeft: 1 }}
                            inputProps={{MenuProps: {MenuListProps: {sx: {backgroundColor: "#404156"}}}}}
                            size="small"
                            disabled={!animationEnded && started}
                        >
                            <MenuItem value={"bfs"} disabled={!enabledAlgorithms.includes('bfs')}>BFS</MenuItem>
                            <MenuItem value={"dfs"} disabled={!enabledAlgorithms.includes('dfs')}>DFS</MenuItem>
                            <MenuItem value={"bidirectional"} disabled={!enabledAlgorithms.includes('bidirectional')}>Bidirectional BFS</MenuItem>
                            <MenuItem value={"greedy"} disabled={!enabledAlgorithms.includes('greedy')}>Greedy</MenuItem>
                            <MenuItem value={"astar"} disabled={!enabledAlgorithms.includes('astar')}>A*</MenuItem>
                            <MenuItem value={"bidirectional-astar"} disabled={!enabledAlgorithms.includes('bidirectional-astar')}>Bidirectional A*</MenuItem>
                            <MenuItem value={"bidirectional-astar-lookup"} disabled={!enabledAlgorithms.includes('bidirectional-astar-lookup')}>A* + Lookup Table</MenuItem>
                            <MenuItem value={"google-maps"} disabled={!enabledAlgorithms.includes('google-maps')}>Google Maps</MenuItem>
                        </Select>
                    </FormControl>

                    <div>
                        <Button
                            id="locations-button"
                            aria-controls={menuOpen ? "locations-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={menuOpen ? "true" : undefined}
                            onClick={(e) => {setMenuAnchor(e.currentTarget);}}
                            variant="contained"
                            disableElevation
                            style={{ backgroundColor: "#404156", color: "#fff", textTransform: "none", fontSize: 16, paddingBlock: 8, justifyContent: "start" }}
                        >
                            Locations
                        </Button>
                        <Menu
                            id="locations-menu"
                            anchorEl={menuAnchor}
                            open={menuOpen}
                            onClose={() => {setMenuAnchor(null);}}
                            MenuListProps={{
                                "aria-labelledby": "locations-button",
                                sx: {
                                    backgroundColor: "#404156"
                                }
                            }}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                        >
                            {LOCATIONS.map(location => 
                                <MenuItem key={location.name} onClick={() => {
                                    closeMenu();
                                    changeLocation(location);
                                }}>{location.name}</MenuItem>
                            )}
                        </Menu>
                    </div>

                    <div className="side slider-container">
                        <Typography id="area-slider" >
                            Area radius: {settings.radius}km ({(settings.radius / 1.609).toFixed(1)}mi)
                        </Typography>
                        <Slider disabled={started && !animationEnded} min={2} max={20} step={1} value={settings.radius} onChangeCommited={() => { changeRadius(settings.radius); }} onChange={e => { setSettings({...settings, radius: Number(e.target.value)}); }} className="slider" aria-labelledby="area-slider" style={{ marginBottom: 1 }} 
                            marks={[
                                {
                                    value: 2,
                                    label: "2km"
                                },
                                {
                                    value: 20,
                                    label: "20km"
                                }
                            ]} 
                        />
                    </div>

                    <div className="side slider-container">
                        <Typography id="playback-slider" >
                            Animation playback
                        </Typography>
                        <Slider disabled={!animationEnded} value={animationEnded ? time : maxTime} min={animationEnded ? 0 : -1} max={maxTime} onChange={(e) => {timeChanged(Number(e.target.value));}} className="slider" aria-labelledby="playback-slider" style={{ marginBottom: 1 }} />
                    </div>

                    <div className="styles-container">
                        <Typography style={{ color: "#A8AFB3", textTransform: "uppercase", fontSize: 14 }} >
                            Styles
                        </Typography>
                        
                        <div>
                            <Typography id="start-fill-label" >
                                Start node fill color
                            </Typography>
                            <div className="color-container">
                                <MuiColorInput value={arrayToRgb(colors.startNodeFill)} onChange={v => {setColors({...colors, startNodeFill: rgbToArray(v)});}} aria-labelledby="start-fill-label" style={{ backgroundColor: "#404156" }} />
                                <IconButton onClick={() => {setColors({...colors, startNodeFill: INITIAL_COLORS.startNodeFill});}} style={{ backgroundColor: "transparent" }} size="small">
                                    <Replay style={{ color: "#fff", width: 20, height: 20 }} fontSize="inherit" />
                                </IconButton>
                            </div>
                        </div>

                        <div>
                            <Typography id="start-border-label" >
                                Start node border color
                            </Typography>
                            <div className="color-container">
                                <MuiColorInput value={arrayToRgb(colors.startNodeBorder)} onChange={v => {setColors({...colors, startNodeBorder: rgbToArray(v)});}} aria-labelledby="start-border-label" style={{ backgroundColor: "#404156" }} />
                                <IconButton onClick={() => {setColors({...colors, startNodeBorder: INITIAL_COLORS.startNodeBorder});}} style={{ backgroundColor: "transparent" }} size="small">
                                    <Replay style={{ color: "#fff", width: 20, height: 20 }} fontSize="inherit" />
                                </IconButton>
                            </div>
                        </div>

                        <div>
                            <Typography id="end-fill-label" >
                                End node fill color
                            </Typography>
                            <div className="color-container">
                                <MuiColorInput value={arrayToRgb(colors.endNodeFill)} onChange={v => {setColors({...colors, endNodeFill: rgbToArray(v)});}} aria-labelledby="end-fill-label" style={{ backgroundColor: "#404156" }} />
                                <IconButton onClick={() => {setColors({...colors, endNodeFill: INITIAL_COLORS.endNodeFill});}} style={{ backgroundColor: "transparent" }} size="small">
                                    <Replay style={{ color: "#fff", width: 20, height: 20 }} fontSize="inherit" />
                                </IconButton>
                            </div>
                        </div>

                        <div>
                            <Typography id="end-border-label" >
                                End node border color
                            </Typography>
                            <div className="color-container">
                                <MuiColorInput value={arrayToRgb(colors.endNodeBorder)} onChange={v => {setColors({...colors, endNodeBorder: rgbToArray(v)});}} aria-labelledby="end-border-label" style={{ backgroundColor: "#404156" }} />
                                <IconButton onClick={() => {setColors({...colors, endNodeBorder: INITIAL_COLORS.endNodeBorder});}} style={{ backgroundColor: "transparent" }} size="small">
                                    <Replay style={{ color: "#fff", width: 20, height: 20 }} fontSize="inherit" />
                                </IconButton>
                            </div>
                        </div>

                        <div>
                            <Typography id="path-label" >
                                Path color
                            </Typography>
                            <div className="color-container">
                                <MuiColorInput value={arrayToRgb(colors.path)} onChange={v => {setColors({...colors, path: rgbToArray(v)});}} aria-labelledby="path-label" style={{ backgroundColor: "#404156" }} />
                                <IconButton onClick={() => {setColors({...colors, path: INITIAL_COLORS.path});}} style={{ backgroundColor: "transparent" }} size="small">
                                    <Replay style={{ color: "#fff", width: 20, height: 20 }} fontSize="inherit" />
                                </IconButton>
                            </div>
                        </div>

                        <div>
                            <Typography id="route-label" >
                                Shortest route color
                            </Typography>
                            <div className="color-container">
                                <MuiColorInput value={arrayToRgb(colors.route)} onChange={v => {setColors({...colors, route: rgbToArray(v)});}} aria-labelledby="route-label" style={{ backgroundColor: "#404156" }} />
                                <IconButton onClick={() => {setColors({...colors, route: INITIAL_COLORS.route});}} style={{ backgroundColor: "transparent" }} size="small">
                                    <Replay style={{ color: "#fff", width: 20, height: 20 }} fontSize="inherit" />
                                </IconButton>
                            </div>
                        </div>
                    </div>

                    <div className="shortcuts-container">
                        <Typography style={{ color: "#A8AFB3", textTransform: "uppercase", fontSize: 14 }} >
                            Shortcuts
                        </Typography>

                        <div className="shortcut">
                            <p>SPACE</p>
                            <p>Start/Stop animation</p>
                        </div>
                        <div className="shortcut">
                            <p>R</p>
                            <p>Clear path</p>
                        </div>
                        <div className="shortcut">
                            <p>Arrows</p>
                            <p>Animation playback</p>
                        </div>
                        <Button onClick={() => {setActiveStep(0);setShowTutorial(true);}}
                            variant="contained" style={{ backgroundColor: "#404156", color: "#fff", marginBottom: "8px" }}
                        >
                            Show tutorial
                        </Button>
                        
                        {showIntroScreen && (
                            <Button onClick={showIntroScreen}
                                variant="contained" style={{ backgroundColor: "#46B780", color: "#fff" }}
                            >
                                Show intro
                            </Button>
                        )}
                        
                        <Button onClick={() => {
                            algorithmUnlock?.resetProgress();
                        }}
                            variant="contained" style={{ backgroundColor: "#667eea", color: "#fff" }}
                        >
                            Reset Progress
                        </Button>
                        
                        <Button onClick={() => {
                            algorithmUnlock?.unlockAllAlgorithms();
                        }}
                            variant="contained" style={{ backgroundColor: "#ff6b6b", color: "#fff" }}
                        >
                            Unlock All Algorithms
                        </Button>
                    </div>
                </div>
            </Drawer>


        </>
    );
});

Interface.displayName = "Interface";

export default Interface;
