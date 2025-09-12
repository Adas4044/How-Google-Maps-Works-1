import { Button, Fade, Typography, Box, IconButton } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { PlayArrow, Explore, SkipNext } from "@mui/icons-material";

const IntroScreen = ({ onStart }) => {
    const [phase, setPhase] = useState('intro'); // 'intro', 'transition', 'complete'
    const [showContent, setShowContent] = useState(true);
    const [showSkipButton, setShowSkipButton] = useState(false);
    const [isSkipping, setIsSkipping] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.code === 'Space' && phase === 'transition' && !isSkipping) {
                e.preventDefault();
                handleSkipTransition();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [phase, isSkipping]);

    const handleStart = () => {
        setShowContent(false);
        setPhase('transition');
        
        if (videoRef.current) {
            videoRef.current.src = './videos/start.mp4';
            videoRef.current.loop = false;
            videoRef.current.play();
            
            setTimeout(() => {
                setShowSkipButton(true);
            }, 1000);
            
            videoRef.current.onended = () => {
                if (!isSkipping) {
                    setPhase('complete');
                    setTimeout(() => {
                        onStart();
                    }, 500);
                }
            };
        } else {
            setTimeout(() => {
                onStart();
            }, 2000);
        }
    };

    const handleSkipTransition = () => {
        setIsSkipping(true);
        setShowSkipButton(false);
        
        if (videoRef.current) {
            videoRef.current.pause();
        }
        
        setTimeout(() => {
            onStart();
        }, 300);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#111',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
            overflow: 'hidden'
        }}>
            <video
                ref={videoRef}
                autoPlay
                muted
                loop={phase === 'intro'}
                playsInline
                style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '120%',
                    height: '120%',
                    objectFit: 'cover',
                    zIndex: 1,
                    transform: 'scale(1.2)'
                }}
                onError={(e) => console.log('Video failed to load:', e)}
            >
                <source src="./videos/intro4.mp4" type="video/mp4" />
            </video>

            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)',
                zIndex: 1
            }} />

            <Fade in={showContent} timeout={500}>
                <Box
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        textAlign: 'center',
                        padding: '40px',
                        maxWidth: '800px'
                    }}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        style={{
                            color: '#fff',
                            fontWeight: '300',
                            fontSize: 'clamp(2rem, 5vw, 4rem)',
                            marginBottom: '40px',
                            textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                            lineHeight: '1.2',
                            letterSpacing: '1px'
                        }}
                    >
                        How does{' '}
                        <span style={{
                            background: 'linear-gradient(45deg, #4285F4, #34A853, #FBBC05, #EA4335)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold'
                        }}>
                            Google Maps
                        </span>{' '}
                        work?
                    </Typography>

                    <Button
                        onClick={handleStart}
                        variant="contained"
                        size="large"
                        startIcon={<Explore style={{ fontSize: '1.5rem' }} />}
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            fontSize: '1.3rem',
                            fontWeight: '600',
                            padding: '16px 40px',
                            borderRadius: '60px',
                            textTransform: 'none',
                            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            backdropFilter: 'blur(20px)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            display: showContent ? 'inline-flex' : 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-3px) scale(1.05)';
                            e.target.style.boxShadow = '0 20px 60px rgba(102, 126, 234, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0) scale(1)';
                            e.target.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
                        }}
                    >
                        <span style={{
                            background: 'linear-gradient(45deg, rgba(255,255,255,0.3), transparent)',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            animation: 'shimmer 2s infinite',
                            zIndex: 0
                        }} />
                        <span style={{ position: 'relative', zIndex: 1 }}>
                            Explore the Algorithm
                        </span>
                    </Button>
                </Box>
            </Fade>

            {phase === 'transition' && (
                <Fade in={showSkipButton && !isSkipping} timeout={500}>
                    <Box
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            zIndex: 3
                        }}
                    >
                        <IconButton
                            onClick={handleSkipTransition}
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: '#fff',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                padding: '12px'
                            }}
                            size="large"
                        >
                            <SkipNext />
                        </IconButton>
                        
                        <Typography
                            variant="caption"
                            style={{
                                position: 'absolute',
                                bottom: '-25px',
                                right: '0',
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.75rem',
                                textAlign: 'center',
                                width: '100%',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                            }}
                        >
                            Press SPACE
                        </Typography>
                    </Box>
                </Fade>
            )}

            <style>
                {`
                    @keyframes shimmer {
                        0% { left: -100%; }
                        50% { left: 100%; }
                        100% { left: 100%; }
                    }
                `}
            </style>
        </div>
    );
};

export default IntroScreen; 