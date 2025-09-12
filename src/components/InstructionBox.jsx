import { useState, useEffect } from 'react';
import { Paper, Typography, Fade } from '@mui/material';

const InstructionBox = ({ show }) => {
    return (
        <Fade in={show}>
            <Paper
                elevation={3}
                style={{
                    position: 'fixed',
                    bottom: '180px',
                    right: '20px',
                    zIndex: 1001,
                    backgroundColor: 'rgba(64, 65, 86, 0.95)',
                    color: '#fff',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    maxWidth: '250px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <Typography variant="body2" style={{ fontSize: '14px', lineHeight: '1.4', textAlign: 'center' }}>
                    <strong>Left click</strong> for start point<br />
                    <strong>Right click</strong> for end point
                </Typography>
            </Paper>
        </Fade>
    );
};

export default InstructionBox; 