import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, MenuItem, Select } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddTrainingDialog from './AddTrainingDialog';
import DeleteTrainingDialog from './DeleteTrainingDialog';

function Trainings() {
    const [trainings, setTrainings] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [filter, setFilter] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState(null);

    useEffect(() => {
        fetchTrainings();
        fetchCustomers();
    }, []);

    const fetchTrainings = () => {
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
            });
    };

    const fetchCustomers = () => {
        axios.get('https://customerrestservice-personaltraining.rahtiapp.fi/api/customers')
            .then(response => {
                const fetchedCustomers = response.data._embedded.customers.map(customer => ({
                    ...customer,
                    id: customer._links.self.href.split('/').pop(),
                    fullName: `${customer.firstname} ${customer.lastname}`
                }));
                setCustomers(fetchedCustomers);
            })
            .catch(error => {
                console.error('Failed to fetch customers:', error);
            });
    };
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

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
    };

    const saveTraining = (training) => {
        axios.post('https://customerrestservice-personaltraining.rahtiapp.fi/addTraining', training)
            .then(() => {
                fetchTrainings();
                handleCloseAddDialog();
            })
            .catch(error => {
                console.error('Failed to save training:', error);
            });
    };

    const openDeleteDialog = (trainingId) => {
        setSelectedTraining(trainingId);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    const confirmDelete = () => {
        axios.delete(`https://customerrestservice-personaltraining.rahtiapp.fi/deleteTraining/${selectedTraining}`)
            .then(() => {
                fetchTrainings();
                closeDeleteDialog();
            })
            .catch(error => {
                console.error('Failed to delete training:', error);
            });
    };

    const filteredTrainings = trainings.filter(training =>
        training.activity.toLowerCase().includes(filter.toLowerCase()) ||
        training.customerName.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <Paper>
            <Button variant="contained" color="primary" onClick={handleOpenAddDialog}>
                Add Training
            </Button>
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
                            <TableCell>Customer</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTrainings.map((training, index) => (
                            <TableRow key={index}>
                                <TableCell>{training.date}</TableCell>
                                <TableCell>{training.activity}</TableCell>
                                <TableCell>{training.duration}</TableCell>
                                <TableCell>{training.customerName}</TableCell>
                                <TableCell>
                                    <Button color="secondary" onClick={() => openDeleteDialog(training.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredTrainings.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5}>No trainings to display.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {openAddDialog && <AddTrainingDialog open={openAddDialog} handleClose={handleCloseAddDialog} saveTraining={saveTraining} customers={customers} />}
            {isDeleteDialogOpen && <DeleteTrainingDialog open={isDeleteDialogOpen} handleClose={closeDeleteDialog} handleConfirm={confirmDelete} />}
        </Paper>
    );
}

export default Trainings;
