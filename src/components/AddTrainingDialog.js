import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


function AddTrainingDialog({ open, handleClose, saveTraining, customers }) {
    const [training, setTraining] = useState({
        date: new Date(),
        activity: '',
        duration: '',
        customer: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTraining(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setTraining(prev => ({ ...prev, date }));
    };

    const handleCustomerChange = (event) => {
        setTraining(prev => ({ ...prev, customer: event.target.value }));
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Training</DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Training Date"
                        value={training.date}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                    />
                </LocalizationProvider>
                <TextField
                    margin="dense"
                    name="activity"
                    label="Activity"
                    fullWidth
                    variant="outlined"
                    value={training.activity}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="duration"
                    label="Duration (min)"
                    fullWidth
                    variant="outlined"
                    value={training.duration}
                    onChange={handleInputChange}
                />
                <Select
                    value={training.customer}
                    onChange={handleCustomerChange}
                    fullWidth
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    variant="outlined"
                    margin="dense"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {customers.map((customer) => (
                        <MenuItem key={customer.id} value={customer.id}>
                            {customer.firstname} {customer.lastname}
                        </MenuItem>
                    ))}
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={() => saveTraining(training)}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddTrainingDialog;
