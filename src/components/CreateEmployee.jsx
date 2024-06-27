import axios from 'axios';
import React, { useEffect, useState } from 'react'

function CreateEmployee({ id }) {
    const [firstname,setFirstname]=useState(""); 
    const [lastname, setLastname]=useState("");
    const [email, setEmail]=useState("");
    const [phone, setPhone]=useState("");
    const [department, setDepartment]=useState("");
    const [password, setPassword]=useState("");
    const [confirm, setConfirm]=useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [isUpdateForm, setisUpdateForm] = useState(false);
    const [authToken, setAuthToken] = useState(null);

    const url = "http://localhost:5103/api/Employee";

    useEffect(()=> {
        const getUpdateUser = async () => {
            if (id) {
                const updateUrl = url + `/${id}`;
                const token = localStorage.getItem('token');
                const resp = await axios.get(updateUrl, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                const employee = resp.data;
                setFirstname(employee.firstName)
                setLastname(employee.lastName)
                setEmail(employee.email)
                setPhone(employee.phone)
                setDepartment(employee.department)
                setPassword(employee.password)
                setConfirm(employee.confirm);
                setisUpdateForm(true);
            }
        }
        getUpdateUser()
    }, [id])

    const submitLogin = async (event) => {
        event.preventDefault();
        if (password !== confirm) {
            setPasswordError(true);
            return;
        }
        const data = {
            firstName: firstname,
            lastName: lastname,
            email,
            phone,
            department,
            password
        }
        try {
            const token = localStorage.getItem('token');
            !!token ? setAuthToken(token) : null;
            const resp = !isUpdateForm ? await axios.post(url, data, { headers: {
                'Authorization': 'Bearer ' + token
            }}): await axios.put(url + `/${id}`, data, { headers: {
                'Authorization': 'Bearer ' + token
            }});
            if (resp.status >= 200 && resp.status < 300) {
                window.location.replace('/')
            }
        } catch(e) {
            console.log(`could not ${isUpdateForm ? 'login' : 'update' } user reason: ${e.message}`)
        }
    }

    return (
        <div className="h-screen bg-slate-300 flex justify-center items-center">
            <div className="lg:w-2/5 md:w-1/2 w-2/3">
                <form className="bg-white p-10 rounded-lg shadow-lg min-w-full" onSubmit={submitLogin}>
                    { !isUpdateForm ? <h1 className="text-center text-2xl mb-6 text-gray-600 font-bold font-sans">Create Employee</h1> : <h1 className="text-center text-2xl mb-6 text-gray-600 font-bold font-sans">Update Employee</h1> }
                    <div>
                        <label className="text-gray-800 font-semibold block my-3 text-md" htmlFor="firstname">Firstname</label>
                        <input className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none" type="text" name="firstname" id="firstname" placeholder="Firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-gray-800 font-semibold block my-3 text-md" htmlFor="lastname">Lastname</label>
                        <input className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none" type="text" name="lastname" id="lastname" placeholder="Lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-gray-800 font-semibold block my-3 text-md" htmlFor="phone">Phone</label>
                        <input className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none" type="text" name="phone" id="phone" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-gray-800 font-semibold block my-3 text-md" htmlFor="department">Department</label>
                        <input className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none" type="text" name="department" id="department" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-gray-800 font-semibold block my-3 text-md" htmlFor="email">Email</label>
                        <input className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none" type="text" name="email" id="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
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
                </form>
            </div>
        </div>
    );
}

export default CreateEmployee