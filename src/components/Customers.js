import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [filter, setFilter] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        axios.get('https://customerrestservice-personaltraining.rahtiapp.fi/api/customers')
            .then(response => {
                const data = response.data._embedded ? response.data._embedded.customers : [];
                setCustomers(data);
            })
            .catch(error => {
                console.error('Failed to fetch customers:', error);
            });
    }, []);

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
        setCustomers(customers.slice().sort((a, b) => {
            const valueA = a[field] ? a[field].toLowerCase() : '';
            const valueB = b[field] ? b[field].toLowerCase() : '';
            return (valueA < valueB ? -1 : 1) * (order === 'asc' ? 1 : -1);
        }));
    };

    // Suodatuslogiikka
    const filteredCustomers = customers.filter(customer =>
        customer.firstname.toLowerCase().includes(filter.toLowerCase()) ||
        customer.lastname.toLowerCase().includes(filter.toLowerCase()) ||
        customer.email.toLowerCase().includes(filter.toLowerCase()) ||
        customer.phone.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <Paper>
            <TextField
                fullWidth
                label="Search Customers"
                variant="outlined"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                style={{ margin: 16 }}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={() => handleSort('firstname')}>First Name {sortField === 'firstname' && (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                            <TableCell onClick={() => handleSort('lastname')}>Last Name {sortField === 'lastname' && (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                            <TableCell onClick={() => handleSort('streetaddress')}>Address {sortField === 'streetaddress' && (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                            <TableCell onClick={() => handleSort('email')}>Email {sortField === 'email' && (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                            <TableCell onClick={() => handleSort('phone')}>Phone {sortField === 'phone' && (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCustomers.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell>{customer.firstname}</TableCell>
                                <TableCell>{customer.lastname}</TableCell>
                                <TableCell>{`${customer.streetaddress}, ${customer.postcode} ${customer.city}`}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>{customer.phone}</TableCell>
                            </TableRow>
                        ))}
                        {filteredCustomers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No customers to display.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default Customers;
