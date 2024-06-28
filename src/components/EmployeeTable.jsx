import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FiMoreVertical } from 'react-icons/fi';
import { BiLogOut } from 'react-icons/bi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

const EmployeeTable = () => {
    const navigate = useNavigate();
    const [employeeData, setEmployeeData] = useState([]);
    const [authToken, setAuthToken] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const onClickCreate = () => {
        navigate('/employee/new');
    };

    const downloadCsv = async () => {
        const url = `http://localhost:5103/api/Employee/export`;
        try {
            const resp = await axios.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                },
                responseType: 'blob',
            });
            if (resp.status === 200) {
                const url = window.URL.createObjectURL(new Blob([resp.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'csvFile.csv');
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        } catch (e) {
            console.error(`Could not download csv because ${e.message}`);
        }
    };

    const handleUpdate = (id) => {
        navigate(`/employee/${id}`);
    };

    const handleDelete = async (id) => {
        const url = `http://localhost:5103/api/Employee/${id}`;
        try {
            const response = await axios.delete(url, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                },
            });
            if (response.status === 204) {
                setEmployeeData(employeeData.filter((row) => row.id !== id));
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const handleClick = (event, employee) => {
        setAnchorEl(event.currentTarget);
        setSelectedEmployee(employee);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedEmployee(null);
    };

    const handleMenuClick = (action) => {
        if (action === 'update') {
            handleUpdate(selectedEmployee.id);
        } else if (action === 'delete') {
            handleDelete(selectedEmployee.id);
        }
        handleClose();
    };

    const handleLogout = () => {
        // Implement logout logic here, e.g., clear token from localStorage
        localStorage.removeItem('token');
        navigate('/login'); // Redirect to login page after logout
    };

    useEffect(() => {
        async function getEmployeeData() {
            const token = localStorage.getItem('token');
            if (token) setAuthToken(token);
            const url = 'http://localhost:5103/api/Employee';
            try {
                const resp = await axios.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                });
                if (resp.status === 200) {
                    setEmployeeData(resp.data);
                }
            } catch (e) {
                console.error(`Cannot get list of employees reason: ${e.message}`);
            }
        }
        getEmployeeData();
    }, []);

    return (
        <React.Fragment>
            <div className="flex mb-4 justify-between items-center">
                <div>
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded mr-2 hover:bg-green-600"
                        onClick={onClickCreate}
                    >
                        Create Employee
                    </button>
                    <button
                        className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700"
                        onClick={downloadCsv}
                    >
                        Download Csv
                    </button>
                </div>
                <div>
                    <Tooltip title="Logout" arrow>
                        <IconButton onClick={handleLogout} className="bg-red-600 text-white rounded-full">
                            <BiLogOut />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            

            <TableContainer component={Paper} className="shadow-lg rounded-lg">
                <Table sx={{ minWidth: 650 }} aria-label="employee table">
                    <TableHead className="bg-indigo-200">
                        <TableRow>
                            <TableCell className="text-gray-700 font-semibold">ID</TableCell>
                            <TableCell className="text-gray-700 font-semibold">First Name</TableCell>
                            <TableCell className="text-gray-700 font-semibold">Last Name</TableCell>
                            <TableCell className="text-gray-700 font-semibold">Email</TableCell>
                            <TableCell className="text-gray-700 font-semibold">Phone</TableCell>
                            <TableCell className="text-gray-700 font-semibold">Department</TableCell>
                            <TableCell className="text-gray-700 font-semibold">Salary</TableCell>
                            <TableCell className="text-gray-700 font-semibold"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employeeData.map((row, index) => (
                            <TableRow key={row.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.firstName}</TableCell>
                                <TableCell>{row.lastName}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.phone}</TableCell>
                                <TableCell>{row.department}</TableCell>
                                <TableCell>{row.salary !== null ? row.salary.baseSalary : 'N/A'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(event) => handleClick(event, row)}>
                                        <FiMoreVertical />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                        PaperProps={{
                                            style: {
                                                backgroundColor: 'white',
                                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                                            },
                                        }}
                                    >
                                        <MenuItem
                                            onClick={() => handleMenuClick('update')}
                                            className="hover:bg-gray-100"
                                        >
                                            Update
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => handleMenuClick('delete')}
                                            className="hover:bg-gray-100"
                                        >
                                            Delete
                                        </MenuItem>
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
};

export default EmployeeTable;
