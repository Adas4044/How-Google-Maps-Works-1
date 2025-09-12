import { Box, Typography, Fade, Button, IconButton } from "@mui/material";
import { ArrowForward, Close, SkipNext } from "@mui/icons-material";
import { useState, useEffect } from "react";

const GeoIntroduction = ({ event, onNext, onClose, onSkip }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (event) {
            const timer = setTimeout(() => {
                setVisible(true);
            }, 300);

            return () => {
                clearTimeout(timer);
            };
        } else {
            setVisible(false);
        }
    }, [event]);

    const handleNext = () => {
        setVisible(false);
        setTimeout(() => {
            onNext();
        }, 200);
    };

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => {
            onClose();
        }, 200);
    };

    const getPositionStyles = (position) => {
        const baseStyles = {
            position: 'fixed',
            zIndex: 10000,
        };

        switch (position) {
            case 'center':
                return {
                    ...baseStyles,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                };
            case 'bottom-left':
                return {
                    ...baseStyles,
                    bottom: '120px',
                    left: '20px'
                };
            case 'bottom-right':
                return {
                    ...baseStyles,
                    bottom: '120px',
                    right: '20px'
                };
            case 'top-center':
                return {
                    ...baseStyles,
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                };
            case 'top-right':
                return {
                    ...baseStyles,
                    top: '20px',
                    right: '20px'
                };
            default:
                return {
                    ...baseStyles,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                };
        }
    };

    if (!event) return null;

    const { dialogue, position, backdrop } = event;
    const isCenter = position === 'center';

    return (
        <>
            {backdrop && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        zIndex: 9999,
                        backdropFilter: 'blur(5px)',
                        pointerEvents: 'none'
                    }}
                />
            )}
            
            <div style={{...getPositionStyles(position), pointerEvents: 'auto'}}>
                <Fade in={visible} timeout={400}>
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: isCenter ? 'center' : 'flex-start',
                            position: 'relative',
                            pointerEvents: 'auto'
                        }}
                    >
                        <img 
                            src={`./pics/${event.characterImage || 'first.png'}`}
                            alt="Geo character"
                            style={{
                                height: isCenter ? '250px' : '150px',
                                width: 'auto',
                                marginRight: '15px',
                                filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.6))',
                                animation: 'float 3s ease-in-out infinite'
                            }}
                        />
                        
                        <Box
                            style={{
                                background: 'linear-gradient(135deg, rgba(70, 183, 128, 0.95) 0%, rgba(46, 204, 113, 0.90) 100%)',
                                borderRadius: '20px',
                                padding: '20px 24px',
                                maxWidth: isCenter ? '500px' : '350px',
                                position: 'relative',
                                boxShadow: '0 16px 50px rgba(70, 183, 128, 0.4), 0 8px 25px rgba(0,0,0,0.2)',
                                backdropFilter: 'blur(20px)',
                                border: '2px solid rgba(255,255,255,0.3)',
                                animation: 'slideInRight 0.6s ease-out both'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <IconButton
                                onClick={onSkip}
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    color: 'rgba(255,255,255,0.7)',
                                    padding: '4px',
                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                    borderRadius: '50%'
                                }}
                                size="small"
                            >
                                <SkipNext fontSize="small" />
                            </IconButton>

                            <Box
                                style={{
                                    position: 'absolute',
                                    left: '-10px',
                                    bottom: '30px',
                                    width: '0',
                                    height: '0',
                                    borderLeft: '10px solid transparent',
                                    borderRight: '10px solid rgba(70, 183, 128, 0.95)',
                                    borderTop: '10px solid transparent',
                                    borderBottom: '10px solid transparent'
                                }}
                            />
                            
                            <Typography
                                variant="h6"
                                style={{
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    marginBottom: '10px',
                                    fontSize: isCenter ? '1.3rem' : '1.1rem',
                                    paddingRight: '30px',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                                }}
                            >
                                {dialogue.title}
                            </Typography>
                            
                            <Typography
                                variant="body1"
                                style={{
                                    color: 'rgba(255,255,255,0.95)',
                                    lineHeight: '1.5',
                                    fontSize: isCenter ? '1.05rem' : '0.95rem',
                                    marginBottom: dialogue.actionText ? '12px' : '16px',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                                }}
                            >
                                {dialogue.message}
                            </Typography>

                            {dialogue.actionText && (
                                <Typography
                                    variant="body2"
                                    style={{
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: '0.85rem',
                                        fontStyle: 'italic',
                                        marginBottom: '16px',
                                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                                    }}
                                >
                                    {dialogue.actionText}
                                </Typography>
                            )}

                            <Box
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '8px'
                                }}
                            >
                                {dialogue.hasNext && (
                                    <Button
                                        onClick={handleNext}
                                        variant="contained"
                                        size="small"
                                        endIcon={<ArrowForward />}
                                        style={{
                                            background: 'rgba(255,255,255,0.2)',
                                            color: '#fff',
                                            textTransform: 'none',
                                            borderRadius: '25px',
                                            padding: '8px 20px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(255,255,255,0.3)';
                                            e.target.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(255,255,255,0.2)';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        Next
                                    </Button>
                                )}

                                {dialogue.isClosing && (
                                    <Button
                                        onClick={handleClose}
                                        variant="contained"
                                        size="small"
                                        endIcon={<Close />}
                                        style={{
                                            background: 'rgba(255,255,255,0.9)',
                                            color: '#2ECC71',
                                            textTransform: 'none',
                                            borderRadius: '25px',
                                            padding: '8px 20px',
                                            fontSize: '0.85rem',
                                            fontWeight: '700',
                                            border: '1px solid rgba(255,255,255,0.5)',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#fff';
                                            e.target.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(255,255,255,0.9)';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        Got it!
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </div>

            <style>
                {`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-8px); }
                    }
                    
                    @keyframes slideInRight {
                        0% {
                            opacity: 0;
                            transform: translateX(40px) scale(0.95);
                        }
                        100% {
                            opacity: 1;
                            transform: translateX(0) scale(1);
                        }
                    }
                `}
            </style>
        </>
    );
};

export default GeoIntroduction; 