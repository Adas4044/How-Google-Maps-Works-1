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
                        backdropFilter: 'blur(5px)'
                    }}
                />
            )}
            
            <div style={getPositionStyles(position)}>
                <Fade in={visible} timeout={400}>
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: isCenter ? 'center' : 'flex-start',
                            position: 'relative'
                        }}
                    >
                        <img 
                            src="./pics/first.png" 
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
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 100%)',
                                borderRadius: '16px',
                                padding: '20px 24px',
                                maxWidth: isCenter ? '500px' : '350px',
                                position: 'relative',
                                boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                                backdropFilter: 'blur(20px)',
                                border: '2px solid rgba(255,255,255,0.5)',
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
                                    color: '#95a5a6',
                                    padding: '4px'
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
                                    borderRight: '10px solid rgba(255,255,255,0.95)',
                                    borderTop: '10px solid transparent',
                                    borderBottom: '10px solid transparent'
                                }}
                            />
                            
                            <Typography
                                variant="h6"
                                style={{
                                    color: '#2c3e50',
                                    fontWeight: 'bold',
                                    marginBottom: '10px',
                                    fontSize: isCenter ? '1.3rem' : '1.1rem',
                                    paddingRight: '30px'
                                }}
                            >
                                {dialogue.title}
                            </Typography>
                            
                            <Typography
                                variant="body1"
                                style={{
                                    color: '#34495e',
                                    lineHeight: '1.5',
                                    fontSize: isCenter ? '1.05rem' : '0.95rem',
                                    marginBottom: dialogue.actionText ? '12px' : '16px'
                                }}
                            >
                                {dialogue.message}
                            </Typography>

                            {dialogue.actionText && (
                                <Typography
                                    variant="body2"
                                    style={{
                                        color: '#7f8c8d',
                                        fontSize: '0.85rem',
                                        fontStyle: 'italic',
                                        marginBottom: '16px'
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
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: '#fff',
                                            textTransform: 'none',
                                            borderRadius: '20px',
                                            padding: '6px 16px',
                                            fontSize: '0.85rem'
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
                                            background: 'linear-gradient(135deg, #46B780 0%, #2ECC71 100%)',
                                            color: '#fff',
                                            textTransform: 'none',
                                            borderRadius: '20px',
                                            padding: '6px 16px',
                                            fontSize: '0.85rem'
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