import { useState, useEffect } from 'react';
import { Paper, Typography, Fade, Button, Box } from '@mui/material';
import { isMobileDevice } from '../helpers';

const InstructionBox = ({ show, onSelectRandomPoints }) => {
    const isMobile = isMobileDevice();
    
    return (
        <Fade in={show}>
            <Paper
                elevation={3}
                className="instruction-box"
                style={{
                    position: 'fixed',
                    bottom: '180px',
                    right: '20px',
                    zIndex: 1001,
                    backgroundColor: 'rgba(64, 65, 86, 0.95)',
                    color: '#fff',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    maxWidth: '280px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <div className="instruction-content">
                    <Typography variant="body2" style={{ fontSize: '14px', lineHeight: '1.4', textAlign: 'center', marginBottom: '8px' }}>
                        {isMobile ? (
                            <>Use the button below to select points</>
                        ) : (
                            <>
                                <strong>Left click</strong> for start point<br />
                                <strong>Right click</strong> for end point<br />
                                <span style={{ fontSize: '12px', opacity: 0.8 }}>or use the button below</span>
                            </>
                        )}
                    </Typography>
                    
                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            onClick={onSelectRandomPoints}
                            variant="contained"
                            size="small"
                            className="random-points-button"
                            style={{
                                backgroundColor: '#46B780',
                                color: '#fff',
                                textTransform: 'none',
                                fontSize: '12px',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                minWidth: 'auto'
                            }}
                        >
                            Select 2 Random Points
                        </Button>
                    </Box>
                </div>
            </Paper>
        </Fade>
    );
};

export default InstructionBox; 