import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function CreateEmployee({ id, register }) {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [salary, setSalary] = useState("");
    const [bonus, setBonus] = useState("");
    const [department, setDepartment] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [isUpdateForm, setisUpdateForm] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity, setToastSeverity] = useState("error");

    const url = "http://localhost:5103/api/Employee";

    useEffect(() => {
        const getUpdateUser = async () => {
            if (id) {
                const updateUrl = url + `/${id}`;
                const token = localStorage.getItem('token');
                const resp = await axios.get(updateUrl, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                const employee = resp.data;
                setFirstname(employee.firstName);
                setLastname(employee.lastName);
                setEmail(employee.email);
                setPhone(employee.phone);
                setDepartment(employee.department);
                setPassword(employee.password);
                setConfirm(employee.confirm);
                setSalary(employee?.salary?.baseSalary || 0);
                setBonus(employee?.salary?.bonus || 0);
                setisUpdateForm(true);
            }
        };
        getUpdateUser();
    }, [id]);

    const submitLogin = async (event) => {
        event.preventDefault();
        if (password !== confirm) {
            setPasswordError(true);
            setToastMessage("Passwords do not match");
            setToastSeverity("error");
            setToastOpen(true);
            return;
        }
        if (phone.length < 9 || phone.length > 11) {
            setToastMessage("Phone number must be between 9 and 11 digits");
            setToastSeverity("error");
            setToastOpen(true);
            return;
        }
        if (salary < 0 || bonus < 0) {
            setToastMessage("salary and bonus can not be less than zero");
            setToastSeverity("error");
            setToastOpen(true);
            return
        }
        const data = {
            firstName: firstname,
            lastName: lastname,
            email,
            phone,
            department,
            password,
            baseSalary: salary,
            bonus
        };
        try {
            const token = localStorage.getItem('token');
            if (token) setAuthToken(token);
            const resp = !isUpdateForm
                ? await axios.post(url, data, {
                      headers: {
                          'Authorization': 'Bearer ' + token
                      }
                  })
                : await axios.put(url + `/${id}`, data, {
                      headers: {
                          'Authorization': 'Bearer ' + token
                      }
                  });
            if (resp.status >= 200 && resp.status < 300) {
                window.location.replace('/');
            }
        } catch (e) {
            setToastMessage(`Could not ${isUpdateForm ? 'update' : 'create'} user. Reason: ${e.message}`);
            setToastSeverity("error");
            setToastOpen(true);
        }
    };

    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setToastOpen(false);
    };

    const handleCancel = () => {
        window.location.replace('/');
    };

    return (
        <div className="h-screen bg-slate-300 flex justify-center items-center">
            <div className="lg:w-2/5 md:w-1/2 w-2/3">
                <form className="bg-white p-10 rounded-lg shadow-lg min-w-full" onSubmit={submitLogin}>
                    {!isUpdateForm ? (
                        <h1 className="text-center text-2xl mb-6 text-gray-600 font-bold font-sans">Create Employee</h1>
                    ) : (
                        <h1 className="text-center text-2xl mb-6 text-gray-600 font-bold font-sans">Update Employee</h1>
                    )}
                    <div className="flex space-x-14" id="firstname__lastname">
                        <div>
                            <label className="text-gray-800 font-semibold block my-3 text-md" htmlFor="firstname">Firstname</label>
                            <input className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none" type="text" name="firstname" id="firstname" placeholder="Firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-gray-800 font-semibold block my-3 text-md" htmlFor="lastname">Lastname</label>
                            <input className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none" type="text" name="lastname" id="lastname" placeholder="Lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                        </div>
                    </div>
                    
                    <div className="flex space-x-14" id="phone__department">
                    <div>
                        <label className="text-gray-800 font-semibold block my-3 text-md" htmlFor="phone">Phone</label>
                        <input className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none" type="text" name="phone" id="phone" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-gray-800 font-semibold block my-3 text-md" htmlFor="department">Department</label>
                        <div className="relative">
                            <select className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none appearance-none pr-10" name="department" id="department" value={department} onChange={(e) => setDepartment(e.target.value)}>
                                <option value="" disabled>Select Department</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="engineering">Engineering</option>
                                <option value="food & waste">Food & Waste</option>
                                <option value="management">Management</option>
                            </select>
                            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div>
                        <label className="text-gray-800 font-semibold block my-3 text-md" htmlFor="salary">Salary</label>
                        <input className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none" type="text" name="salary" id="salary" placeholder="salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-gray-800 font-semibold block my-3 text-md" htmlFor="bonus">Bonus</label>
                        <input className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none" type="text" name="bonus" id="bonus" placeholder="bonus" value={bonus} onChange={(e) => setBonus(e.target.value)} />
                    </div>
                    
                    <div>
                        <label className="text-gray-800 font-semibold block my-3 text-md" htmlFor="email">Email</label>
                        <input className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none" type="email" name="email" id="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-gray-800 font-semibold block my-3 text-md" htmlFor="password">Password</label>
                        <input className={`w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none ${passwordError ? 'border-red-500' : ''}`} type="password" name="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-gray-800 font-semibold block my-3 text-md" htmlFor="confirm">Confirm password</label>
                        <input className={`w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none ${passwordError ? 'border-red-500' : ''}`} type="password" name="confirm" id="confirm" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                    </div>
                    {passwordError && <p className="text-red-500 text-sm mt-1">Passwords do not match</p>}
                    {isUpdateForm ? <button type="submit" className="w-full mt-6 bg-indigo-600 rounded-lg px-4 py-2 text-lg text-white tracking-wide font-semibold font-sans">Update</button> : <button type="submit" className="w-full mt-6 bg-indigo-600 rounded-lg px-4 py-2 text-lg text-white tracking-wide font-semibold font-sans">Create</button>}
                    {isUpdateForm && (
                        <button type="button" className="w-full mt-6 bg-white border border-black rounded-lg px-4 py-2 text-lg text-black tracking-wide font-semibold font-sans" onClick={handleCancel}>
                            Cancel
                        </button>
                    )}
                </form>
            </div>
            <Snackbar open={toastOpen} autoHideDuration={3000} onClose={handleCloseToast}>
                <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default CreateEmployee;
