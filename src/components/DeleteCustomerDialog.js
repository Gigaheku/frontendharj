import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

function DeleteCustomerDialog({ open, onClose, onConfirm }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogContent>
                <DialogContentText>Are you sure you want to delete this customer?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm} color="secondary">Delete</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteCustomerDialog;