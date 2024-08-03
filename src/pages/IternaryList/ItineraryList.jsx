import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    TablePagination,
    IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { graphQLFetch } from '../../Api';

const ItineraryList = ({ itineraries, setItineraries }) => {
    const { user } = useAuth();
    const userId = user._id || user.sub;
    const navigate = useNavigate();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('updatedAt');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Updated sort function
    const sortedItineraries = itineraries.slice().sort((a, b) => {
        if (orderBy === 'updatedAt' || orderBy === 'createdAt') {
            return (order === 'asc' ? 1 : -1) * (new Date(a[orderBy]) - new Date(b[orderBy]));
        } else {
            return (order === 'asc' ? 1 : -1) * a[orderBy].localeCompare(b[orderBy]);
        }
    });

    const handleEdit = (itinerary) => {
        const initialDays = JSON.parse(itinerary.scheduleData);
        navigate("/app/schedule", { state: { initialDays, scheduleId: itinerary._id, itineraryName: itinerary.name } });
    };

    const handleDelete = async (itineraryId) => {
        console.log('Delete itinerary with ID:', itineraryId);
        const variables = { userId, itineraryId };
        const mutation = `
            mutation RemoveSchedule($userId: ID!, $itineraryId: ID!) {
                removeSchedule(userId: $userId, itineraryId: $itineraryId) {
                    success
                    message
                }
            }`;

        try {
            const response = await graphQLFetch(mutation, variables);
            if (response && response.removeSchedule && response.removeSchedule.success) {
                setItineraries(prevItineraries => prevItineraries.filter(itinerary => itinerary._id !== itineraryId));
                console.log(response.removeSchedule.message);
            } else {
                console.error("Failed to delete the itinerary:", response.removeSchedule.message);
            }
        } catch (error) {
            console.error("Error deleting the itinerary:", error);
        }
    };


    return (
        <TableContainer component={Paper} sx={{ margin: 'auto', maxWidth: 1200, overflow: 'hidden' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="left">
                            <TableSortLabel
                                active={orderBy === 'name'}
                                direction={order}
                                onClick={() => handleRequestSort('name')}
                            >
                                Name
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="center">
                            <TableSortLabel
                                active={orderBy === 'createdAt'}
                                direction={order}
                                onClick={() => handleRequestSort('createdAt')}
                            >
                                Created At
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="center">
                            <TableSortLabel
                                active={orderBy === 'updatedAt'}
                                direction={order}
                                onClick={() => handleRequestSort('updatedAt')}
                            >
                                Last Updated
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedItineraries
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((itinerary) => (
                            <TableRow key={itinerary._id}>
                                <TableCell component="th" scope="row" align='left'>{itinerary.name}</TableCell>
                                <TableCell align="center">{format(new Date(itinerary.createdAt), "PPPp")}</TableCell>
                                <TableCell align="center">{format(new Date(itinerary.updatedAt), "PPPp")}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => handleEdit(itinerary)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(itinerary._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[10, 15, 25]}
                component="div"
                count={itineraries.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>
    );
};

export default ItineraryList;
