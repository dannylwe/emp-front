import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeTable = () => {
    const navigate = useNavigate();
    const [employeeData, setEmployeeData]=useState([]);
    const [authToken, setAuthToken] = useState(null);
    const [csvData, setcsvData] = useState(null);

    const onClickCreate = () => {
        navigate('/employee/new');
    };

    const downloadCsv = async () => {
        const url = `http://localhost:5103/api/Employee/export`;
        try {
            const resp  = await axios.get(url, { headers: {
                'Authorization': 'Bearer ' + authToken
            }});
            if (resp.status == 200) {
                setcsvData(resp.data);
                const url = window.URL.createObjectURL(new Blob([resp.data])) 
                const link = document.createElement('a')
                link.href = url;
                link.setAttribute('download', "csvFile.csv");
                document.body.appendChild(link);
                link.click();
                link.remove();
                setcsvData(null);
            }
        } catch (e) {
            console.error(`could not download csv because ${e.message}`)
        }
    }

    const handleUpdate = (id) => {
        navigate(`/employee/${id}`);
      };

    const handleDelete = async (id) => {
        const url = `http://localhost:5103/api/Employee/${id}`;
        try {
          const response = await axios.delete(url, { headers: {
            'Authorization': 'Bearer ' + authToken
        }});
          if (response.status === 204) {
            setEmployeeData(employeeData.filter(row => row.id !== id));
          }
        } catch (error) {
          console.error('Error deleting employee:', error);
        }
      };

    useEffect(()=> {
        async function getEmployeeData () {
            const token = localStorage.getItem('token');
            !!token ? setAuthToken(token) : null;
            const url = 'http://localhost:5103/api/Employee';
            try {
                const resp = await axios.get(url, { headers: {
                    'Authorization': 'Bearer ' + token
                }})
                if (resp.status == 200) {
                    setEmployeeData(resp.data)
                }
            } catch (e) {
                console.error(`can not get list of employees reason ${e.message}`)
            }
        }
        getEmployeeData();
    }, []);

  return (
    <React.Fragment>
        <div className="flex">
        <div>
            <button
                className="bg-green-500 text-white py-1 px-2 rounded mr-2"
                onClick={onClickCreate}
                >
                Create Employee
            </button>
        </div>
        <div>
            <button
                className="bg-teal-600 text-white py-1 px-2 rounded mr-2"
                onClick={downloadCsv}
                >
                Download Csv
            </button>
        </div>
        </div>
        
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="employee table">
            <TableHead>
            <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Action</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {employeeData.map((row) => (
                <TableRow key={row.id}>
                <TableCell sx={{ width: 50 }}>{row.id}</TableCell>
                <TableCell sx={{ width: 120 }}>{row.firstName}</TableCell>
                <TableCell sx={{ width: 120 }}>{row.lastName}</TableCell>
                <TableCell sx={{ width: 90 }}>{row.email}</TableCell>
                <TableCell sx={{ width: 120 }}>{row.phone}</TableCell>
                <TableCell sx={{ width: 120 }}>{row.department}</TableCell>
                <TableCell sx={{ width: 90 }}>{row.salary !== null ? row.salary : 'N/A'}</TableCell>
                <TableCell>
                    <button
                    className="bg-red-500 text-white py-1 px-2 rounded mr-2"
                    onClick={() => handleDelete(row.id)}
                    >
                    Delete
                    </button>
                    <button
                        className="bg-blue-500 text-white py-1 px-2 rounded"
                        onClick={() => handleUpdate(row.id)}
                    >
                    Update
                    </button>
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
