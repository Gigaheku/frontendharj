import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

function EditCustomerDialog({ open, handleClose, customer, saveCustomer }) {
    const [editedCustomer, setEditedCustomer] = useState(customer);

    useEffect(() => {
        setEditedCustomer(customer);
    }, [customer]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedCustomer({ ...editedCustomer, [name]: value });
    };

    const handleSubmit = () => {
        saveCustomer(editedCustomer);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="firstname"
                    label="First Name"
                    fullWidth
                    variant="outlined"
                    value={editedCustomer.firstname}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="lastname"
                    label="Last Name"
                    fullWidth
                    variant="outlined"
                    value={editedCustomer.lastname}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="streetaddress"
                    label="Street Address"
                    fullWidth
                    variant="outlined"
                    value={editedCustomer.streetaddress}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="postcode"
                    label="Postcode"
                    fullWidth
                    variant="outlined"
                    value={editedCustomer.postcode}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="city"
                    label="City"
                    fullWidth
                    variant="outlined"
                    value={editedCustomer.city}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="email"
                    label="Email"
                    fullWidth
                    variant="outlined"
                    value={editedCustomer.email}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="phone"
                    label="Phone"
                    fullWidth
                    variant="outlined"
                    value={editedCustomer.phone}
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

export default EditCustomerDialog;
