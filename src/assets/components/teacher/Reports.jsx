import React, { useEffect, useState } from 'react'
import SubCard  from '../ui/subcard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Loading = () => {
    return (
      <div className="flex justify-center items-center h-screen text-black dark:text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black dark:border-white"></div>
      </div>
    )
  }
  
  const Error = ({ error }) => {
    const navigate = useNavigate();
    return (
      <div className="flex justify-center flex-col items-center h-screen text-black dark:text-white text-2xl ">
        <div>{error}</div>
        <div>
          <button 
          onClick={() => {
            localStorage.clear();
            navigate("/signin")
          }}
          className="bg-purple-500 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl my-5"
          >Re-Login</button>
        </div>
      </div>
    )
  }
const Reports = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubjects = async () => {
          try {
            const response = await axios.get(`http://localhost:8080/api/subjects/subjects`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            });
            setSubjects(response.data);
          } catch (err) {
            setError("Failed to fetch subjects");
            console.error(err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchSubjects();
      }, []);
    
      if (loading) {
        return <Loading/>;
      }
    
      if (error) {
        return <Error error={error}/>;
      }


  return (
        <div className=" w-full md:mr-16 ">
            <div className='flex justify-between mb-4'>
            <p className="text-4xl font-semibold md:m-10 m-5 ">Generate Reports</p>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:mx-10 mx-5">
                {subjects.map((sub) => (
                    <SubCard key={sub.code} code={sub.code} name={sub.name}/>
                ))}
            </div>
        </div>
  )
}

export default Reports