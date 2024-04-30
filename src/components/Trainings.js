import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

function Trainings() {
    const [trainings, setTrainings] = useState([]);
    const [filter, setFilter] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        axios.get('https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings')
            .then(response => {
                const formattedTrainings = response.data.map(training => ({
                    ...training,
                    customerName: training.customer ? `${training.customer.firstname} ${training.customer.lastname}` : 'Unknown Customer',
                    date: training.date ? dayjs(training.date).format('DD.MM.YYYY HH:mm') : ''
                }));
                setTrainings(formattedTrainings);
            })
            .catch(error => {
                console.error('Failed to fetch trainings:', error);
                setTrainings([]);
            });
    }, []);

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
        setTrainings(trainings.slice().sort((a, b) => {
            const valueA = a[field] || '';
            const valueB = b[field] || '';
            return (valueA < valueB ? -1 : 1) * (order === 'asc' ? 1 : -1);
        }));
    };

    const filteredTrainings = trainings.filter(training =>
        training.activity.toLowerCase().includes(filter.toLowerCase()) ||
        training.customerName.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <Paper>
            <TextField
                fullWidth
                label="Search Trainings"
                variant="outlined"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                style={{ margin: 16 }}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={() => handleSort('date')}>Date {sortField === 'date' && (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                            <TableCell onClick={() => handleSort('activity')}>Activity {sortField === 'activity' && (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                            <TableCell onClick={() => handleSort('duration')}>Duration (min) {sortField === 'duration' && (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                            <TableCell onClick={() => handleSort('customerName')}>Customer {sortField === 'customerName' && (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTrainings.map((training, index) => (
                            <TableRow key={index}>
                                <TableCell>{training.date}</TableCell>
                                <TableCell>{training.activity}</TableCell>
                                <TableCell>{training.duration}</TableCell>
                                <TableCell>{training.customerName}</TableCell>
                            </TableRow>
                        ))}
                        {filteredTrainings.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4}>No trainings to display.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default Trainings;
