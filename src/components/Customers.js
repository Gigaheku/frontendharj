import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddCustomerDialog from './AddCustomerDialog';
import EditCustomerDialog from './EditCustomerDialog';
import DeleteCustomerDialog from './DeleteCustomerDialog';

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('');
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        fetchCustomers();
    }, []);
    
    const fetchCustomers = () => {
        setLoading(true);
        axios.get('https://customerrestservice-personaltraining.rahtiapp.fi/api/customers')
            .then(response => {
                console.log("API Response:", response.data);
                if (response.data._embedded && response.data._embedded.customers) {
                    const fetchedCustomers = response.data._embedded.customers.map(customer => ({
                        ...customer,
                        id: customer._links.self.href.split('/').pop()
                    }));
                    setCustomers(fetchedCustomers);
                } else {
                    console.error('No customers found in response');
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch customers:', error);
                setLoading(false);
            });
    };
    const handleSort = (field) => {
        const isAsc = sortField === field && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortField(field);
        setCustomers(customers.slice().sort((a, b) => {
            const aField = a[field].toLowerCase();
            const bField = b[field].toLowerCase();
            return (aField < bField ? -1 : 1) * (isAsc ? 1 : -1);
        }));
    };
    const filteredCustomers = customers.filter(customer =>
        customer.firstname.toLowerCase().includes(filter.toLowerCase()) ||
        customer.lastname.toLowerCase().includes(filter.toLowerCase()) ||
        customer.email.toLowerCase().includes(filter.toLowerCase()) ||
        customer.phone.toLowerCase().includes(filter.toLowerCase())
    );

    const handleOpenAddDialog = () => {
        setSelectedCustomer(null);
        setOpenDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenEditDialog = (customer) => {
        setSelectedCustomer(customer);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const handleSearchChange = (event) => {
        setFilter(event.target.value);
    };

    const saveCustomer = (customer) => {
        const method = customer.id ? 'put' : 'post';
        const url = customer.id
            ? `https://customerrestservice-personaltraining.rahtiapp.fi/api/customers/${customer.id}`
            : 'https://customerrestservice-personaltraining.rahtiapp.fi/api/customers';
        
        axios[method](url, customer)
            .then(() => {
                fetchCustomers();
                handleCloseAddDialog();
                handleCloseEditDialog();
            })
            .catch(error => {
                console.error('Failed to save the customer:', error);
            });
    };

    const openDeleteCustomerDialog = (customerId) => {
        const customer = customers.find(c => c.id === customerId);
        if (customer) {
            setSelectedCustomer(customer);
            setOpenDeleteDialog(true);
        } else {
            console.error('Customer not found with id:', customerId);
        }
    };
    

    const closeDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const confirmDeleteCustomer = () => {
        if (selectedCustomer && selectedCustomer.id) {
            axios.delete(`https://customerrestservice-personaltraining.rahtiapp.fi/api/customers/${selectedCustomer.id}`)
                .then(() => {
                    fetchCustomers();
                    closeDeleteDialog();
                })
                .catch(error => {
                    console.error('Failed to delete the customer:', error);
                });
        } else {
            console.error('Delete attempted on undefined customer id');
        }
    };

    return (
        <Paper>
            <TextField
                fullWidth
                label="Search Customers"
                variant="outlined"
                value={filter}
                onChange={handleSearchChange}
                style={{ marginBottom: 16 }}
            />
            <Button variant="contained" color="primary" onClick={handleOpenAddDialog}>
                Add New Customer
            </Button>
            {openDialog && <AddCustomerDialog open={openDialog} handleClose={handleCloseAddDialog} saveCustomer={saveCustomer} />}
            {openEditDialog && <EditCustomerDialog open={openEditDialog} handleClose={handleCloseEditDialog} customer={selectedCustomer} saveCustomer={saveCustomer} />}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell onClick={() => handleSort('firstname')}>First Name {sortField === 'firstname' && (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                            <TableCell onClick={() => handleSort('lastname')}>Last Name {sortField === 'lastname' && (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                            <TableCell onClick={() => handleSort('streetaddress')}>Address {sortField === 'streetaddress' && (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                            <TableCell onClick={() => handleSort('email')}>Email {sortField === 'email' && (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                            <TableCell onClick={() => handleSort('phone')}>Phone {sortField === 'phone' && (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">Loading...</TableCell>
                            </TableRow>
                        ) : (
                            filteredCustomers.map(customer => (
                                <TableRow key={customer.id}>
                                    <TableCell>{customer.firstname}</TableCell>
                                    <TableCell>{customer.lastname}</TableCell>
                                    <TableCell>{`${customer.streetaddress}, ${customer.postcode} ${customer.city}`}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                    <TableCell>
                                        <Button color="primary" onClick={() => handleOpenEditDialog(customer)}>Edit</Button>
                                        <Button color="secondary" onClick={() => openDeleteCustomerDialog(customer.id)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {openDeleteDialog && <DeleteCustomerDialog open={openDeleteDialog} onClose={closeDeleteDialog} onConfirm={confirmDeleteCustomer} />}
        </Paper>
    );
}

export default Customers;
