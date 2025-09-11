import { Paper, Typography, List, ListItem, ListItemText, Chip, Box, Collapse, IconButton } from "@mui/material";
import { ExpandMore, ExpandLess, Hub, Route } from "@mui/icons-material";
import { useState } from "react";

const LookupTablePanel = ({ lookupTable, visible }) => {
    const [expanded, setExpanded] = useState(false);
    
    if (!visible || !lookupTable || !lookupTable.computed) {
        return null;
    }

    const stats = lookupTable.getStats();

    const handleToggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <Paper 
            elevation={3}
            style={{
                position: 'fixed',
                left: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 300,
                maxHeight: '70vh',
                overflow: 'hidden',
                backgroundColor: '#2A2B37',
                color: '#fff',
                zIndex: 1000,
                borderRadius: 8
            }}
        >
            <Box sx={{ p: 2, borderBottom: '1px solid #404156' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                        <Hub color="primary" />
                        <Typography variant="h6" style={{ color: '#46B780' }}>
                            Lookup Table
                        </Typography>
                    </Box>
                    <IconButton onClick={handleToggleExpanded} size="small" style={{ color: '#fff' }}>
                        {expanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </Box>
                
                <Box display="flex" gap={1} mt={1}>
                    <Chip 
                        label={`${stats.hubNodes} Hubs`}
                        size="small"
                        style={{ backgroundColor: '#404156', color: '#fff' }}
                        icon={<Hub style={{ color: '#46B780' }} />}
                    />
                    <Chip 
                        label={`${stats.precomputedRoutes} Routes`}
                        size="small"
                        style={{ backgroundColor: '#404156', color: '#fff' }}
                        icon={<Route style={{ color: '#46B780' }} />}
                    />
                </Box>
            </Box>

            <Collapse in={expanded}>
                <Box sx={{ maxHeight: '50vh', overflow: 'auto' }}>
                    {stats.routes.length > 0 ? (
                        <List dense>
                            {stats.routes.slice(0, 20).map((route, index) => (
                                <ListItem key={route.key} divider>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Route style={{ color: '#46B780', fontSize: 16 }} />
                                                <Typography variant="body2" style={{ color: '#fff' }}>
                                                    Route {index + 1}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Box mt={0.5}>
                                                <Typography variant="caption" style={{ color: '#A8AFB3' }}>
                                                    Distance: {route.distance}
                                                </Typography>
                                                <br />
                                                <Typography variant="caption" style={{ color: '#A8AFB3' }}>
                                                    Nodes: {route.pathLength}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))}
                            {stats.routes.length > 20 && (
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" style={{ color: '#A8AFB3', fontStyle: 'italic' }}>
                                                ... and {stats.routes.length - 20} more routes
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            )}
                        </List>
                    ) : (
                        <Box p={2}>
                            <Typography variant="body2" style={{ color: '#A8AFB3', textAlign: 'center' }}>
                                No precomputed routes found
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Collapse>

            {!expanded && (
                <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="caption" style={{ color: '#A8AFB3' }}>
                        Click to expand route details
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default LookupTablePanel; 