import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

function DeleteTrainingDialog({ open, handleClose, handleConfirm }) {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this training? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} color="secondary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteTrainingDialog;
