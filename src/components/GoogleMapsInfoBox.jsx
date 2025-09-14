import { Modal, Paper, Typography, IconButton, Box } from '@mui/material';
import { Close } from '@mui/icons-material';

const GoogleMapsInfoBox = ({ open, onClose }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Paper
                elevation={8}
                style={{
                    backgroundColor: '#4285F4',
                    color: '#fff',
                    padding: '32px',
                    borderRadius: '16px',
                    width: '500px',
                    height: '500px',
                    position: 'relative',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <IconButton
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        color: '#fff'
                    }}
                >
                    <Close />
                </IconButton>

                <Typography variant="h4" style={{ fontWeight: 'bold', marginBottom: '24px', color: '#fff' }}>
                    Google Maps
                </Typography>

                <Typography variant="h6" style={{ marginBottom: '16px', color: '#fff' }}>
                    Congratulations! You've mastered pathfinding algorithms!
                </Typography>

                <Typography variant="body1" style={{ marginBottom: '20px', lineHeight: 1.6, color: '#fff' }}>
                    Now you understand how Google Maps really works under the hood:
                </Typography>

                <Box component="ul" style={{ paddingLeft: '20px', margin: 0, flex: 1 }}>
                    <Typography component="li" style={{ marginBottom: '12px', color: '#fff' }}>
                        <strong>A* Algorithm:</strong> The core pathfinding engine that finds optimal routes
                    </Typography>
                    <Typography component="li" style={{ marginBottom: '12px', color: '#fff' }}>
                        <strong>Bidirectional Search:</strong> Searches from both start and end points for faster results
                    </Typography>
                    <Typography component="li" style={{ marginBottom: '12px', color: '#fff' }}>
                        <strong>Precomputed Highways:</strong> Lookup tables for major routes to answer queries instantly
                    </Typography>
                    <Typography component="li" style={{ marginBottom: '12px', color: '#fff' }}>
                        <strong>(Not Implemented): Real-time Traffic Data:</strong> Dynamic edge weights based on current conditions
                    </Typography>
                    <Typography component="li" style={{ marginBottom: '12px', color: '#fff' }}>
                        <strong>(Not Implemented): Machine Learning:</strong> Predicting traffic patterns and optimizing routes
                    </Typography>
                    <Typography component="li" style={{ marginBottom: '12px', color: '#fff' }}>
                        <strong>(Not Implemented): Weather Optimization:</strong> Predicting delays due to weather and other miscellaneous conditions.
                    </Typography>
                </Box>

                <Typography variant="body2" style={{ marginTop: '20px', fontStyle: 'italic', textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)' }}>
                      This project is based on and adapted from honzaap's original repository.
                      Made by Adam Kulikowski. Personal site: adamkulik.com
                </Typography>
            </Paper>
        </Modal>
    );
};

export default GoogleMapsInfoBox; 