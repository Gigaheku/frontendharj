import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function AddCustomerDialog({ open, handleClose, saveCustomer }) {
    const [customer, setCustomer] = useState({
        firstname: '',
        lastname: '',
        streetaddress: '',
        postcode: '',
        city: '',
        email: '',
        phone: ''
    });

    const handleInputChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        saveCustomer(customer);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="firstname"
                    label="First Name"
                    fullWidth
                    variant="outlined"
                    value={customer.firstname}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="lastname"
                    label="Last Name"
                    fullWidth
                    variant="outlined"
                    value={customer.lastname}
                    onChange={handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="streetaddress"
                    label="Street Address"
                    fullWidth
                    variant="outlined"
                    value={customer.streetaddress}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="postcode"
                    label="Postcode"
                    fullWidth
                    variant="outlined"
                    value={customer.postcode}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="city"
                    label="City"
                    fullWidth
                    variant="outlined"
                    value={customer.city}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="email"
                    label="Email"
                    fullWidth
                    variant="outlined"
                    value={customer.email}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="phone"
                    label="Phone"
                    fullWidth
                    variant="outlined"
                    value={customer.phone}
                    onChange={handleInputChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddCustomerDialog;
