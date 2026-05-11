import type { CardData } from '@/src/Interface/dashboard.interface';

import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Card, Grid, Avatar, Typography, CardContent, AvatarGroup } from '@mui/material';

import { cardInfo } from 'src/Interface/dashboard.interface';

import { Iconify } from 'src/components/iconify';


const DashboardCard: React.FC<CardData> = ({ title, icon, data, comparison, showAvatarGroup }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        if (title === 'Total Workforce') {
            navigate('/all-employee');

        } else if (title === 'Today Attendance') {
            navigate('/attendance');

        }else if (title === 'Late Arrivals') {
            navigate('/attendance');

        } else if (title === 'Absent Workforce') {
            navigate('/all-employee');

        } else if (title === 'On Leave') {
            navigate('/leaves');
        }else if (title === 'Out of Radius') {
            navigate('/all-employee');
        }
    };

    return (
        <Card sx={{ borderRadius: 2, width: '100%', height: '100%', cursor: 'pointer' }} onClick={handleCardClick}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Iconify icon={icon} />
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'right' }}>
                        <span style={{ color: 'green', fontWeight: 'bold' }}>{comparison}</span>
                    </Typography>
                </Box>
                <Typography variant="subtitle1" gutterBottom>{title}</Typography>
                <Typography variant="h3" sx={{ fontWeight: '500' }}>{data}</Typography>
                {showAvatarGroup && (
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <AvatarGroup max={4}>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                            <Avatar>+3</Avatar>
                        </AvatarGroup>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

const DashboardContent: React.FC = () => (
    <Grid container spacing={3}>
        {cardInfo.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} display="flex" justifyContent="center">
                <DashboardCard {...card} />
            </Grid>
        ))}
    </Grid>
);

export default DashboardContent;
