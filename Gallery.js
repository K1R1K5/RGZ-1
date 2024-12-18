import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Typography, Box } from '@mui/material';
import Api from './components/API';
import VideoCard from './components/VideoCard';
import {useNavigate} from "react-router-dom";


function Gallery({ userProfile }) {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleVideoCardClick = (video) => {
        navigate(`/video-config/${video.id}`, { state: { video, userProfile } });
    };

    useEffect(() => {
        // Запрос к API для получения всех видео
        Api.get(`/videos/get_all_user_videos/${userProfile.username}`)
            .then((response) => {
                setVideos(response.data); // Обновляем state с полученными видео
                setLoading(false);
            })
            .catch((err) => {
                setError('Ошибка при загрузке видео.');
                setLoading(false);
            });
    }, [userProfile.username]);

    // Если идет загрузка, показываем индикатор
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    // Если есть ошибка
    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    // Если нет видео
    if (videos.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography>Нет доступных видео.</Typography>
            </Box>
        );
    }

    // Рендерим плитку видео
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', color: 'white'}}>
                Видео {userProfile.username}
            </Typography>
            <Grid container spacing={0}>
                {videos.map((video) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                        <VideoCard video={video} onClick={handleVideoCardClick} />
                    </Grid>
                ))}
            </Grid>
        </Box>

    );
}

export default Gallery;