import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SubDash = () => {
  const { subjectCode } = useParams();
  const [create, setCreate] = useState(false);
  const [schema, setSchema] = useState(false);
  return (
    <div className=" w-full min-h-screen h-full pb-20 poppins">
      {create && <AddStudentPopup setCreate={setCreate} subjectCode={subjectCode} />}
      {schema && <AddExamSchema setSchema={setSchema} subjectCode={subjectCode} />}
      <div>
        <h1 className='text-3xl font-bold dark:text-white pt-10 text-center'>{subjectCode}</h1>
        <div className='md:flex justify-center grid grid-cols-2 mx-5 gap-5 pt-5 '>
        <button 
          className='px-4 py-2 text-white border-2 border-neutral-200 dark:border-neutral-700 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 transition-colors duration-800'
          onClick={() => setSchema(true)}
          >
            Define Exam Schema
          </button>
          <button 
          className='px-4 py-2 text-white border-2 border-neutral-200 dark:border-neutral-700 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 transition-colors duration-800'
          onClick={() => setCreate(true)}
          >
            Add Student
          </button>
          <button className='px-4 py-2 text-white border-2 border-neutral-200 dark:border-neutral-700 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 transition-colors duration-800'
          onClick={() => downloadExcel(subjectCode)}>
            Overall Report
          </button>  
          <button className='px-4 py-2 text-white border-2 border-neutral-200 dark:border-neutral-700 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 transition-colors duration-800'
          onClick={() => downloadMST1(subjectCode)}>
            MST1
          </button>  
          <button className='px-4 py-2 text-white border-2 border-neutral-200 dark:border-neutral-700 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 transition-colors duration-800'
          onClick={() => downloadMST2(subjectCode)}>
            MST2
          </button>  
          <button className='px-4 py-2 text-white border-2 border-neutral-200 dark:border-neutral-700 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 transition-colors duration-800'
          onClick={() => downloadExcelEnd(subjectCode)}>
            EndSem
          </button>  
          <button className='px-4 py-2 text-white border-2 border-neutral-200 dark:border-neutral-700 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 transition-colors duration-800'
          onClick={() => downloadCOSheet(subjectCode)}>
            CO Analysis
          </button> 
        </div>
        <List subjectCode={subjectCode}/>
      </div>
    </div>
  )
}

// Separate List component with its own state management
const List = ({ subjectCode }) => {
  // Declare all state variables at the beginning of the component
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define the fetch function
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/operation/sheets?subjectCode=${subjectCode}`);
        setSheets(response.data);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sheets:', err);
        setError(err.response?.data?.error || 'Failed to fetch sheets');
      }
    };

    if (subjectCode) {
      fetchData();
    }
  }, [subjectCode]);

  if (loading) {
    return (
      <div className="m-4 p-3 bg-[#F5F5F5] dark:bg-neutral-800 rounded-lg mt-8 flex justify-center items-center">
        <div className="dark:text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 p-3 bg-[#F5F5F5] dark:bg-neutral-800 rounded-lg mt-8">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="m-4 md:mr-20 p-3 bg-[#F5F5F5] dark:bg-neutral-900 rounded-lg mt-8 border-[1px] dark:border-neutral-700">
      <div className="relative overflow-x-auto mx-2">
      <table className="w-full text-sm text-left rtl:text-right text-neutral-900 ">
        <thead className="text-gray-700 dark:text-white uppercase bg-grey-500 ">
          <tr className="rounded-lg">
            <th scope="col" className="px-6 py-3 text-lg">Enrollment No.</th>
            <th scope="col" className="px-6 py-3 text-lg">Name</th>

            {/* Main columns for MST1 and MST2 with sub-columns */}
            <th scope="col" colSpan="3" className="px-6 py-3 text-lg">MST1</th>
            <th scope="col" colSpan="3" className="px-6 py-3 text-lg">MST2</th>

            <th scope="col" className="px-6 py-3 text-lg">Ass / Quiz</th>

            {/* Main column for Endsem with sub-columns */}
            <th scope="col" colSpan="5" className="px-6 py-3 text-lg">Endsem</th>
          </tr>
          <tr className="rounded-lg">
            {/* Sub-columns for Enrollment No. */}
          <th scope="col" className="px-6 py-3 "></th>
          <th scope="col" className="px-6 py-3"></th>
            {/* Sub-columns for MST1 */}
            <th scope="col" className="px-6 py-3">Q1</th>
            <th scope="col" className="px-6 py-3">Q2</th>
            <th scope="col" className="px-6 py-3">Q3</th>

            {/* Sub-columns for MST2 */}
            <th scope="col" className="px-6 py-3">Q1</th>
            <th scope="col" className="px-6 py-3">Q2</th>
            <th scope="col" className="px-6 py-3">Q3</th>

            {/* Sub-columns for Ass / Quiz */}
            <th scope="col" className="px-6 py-3"></th>
            {/* Sub-columns for Endsem */}
            <th scope="col" className="px-6 py-3">Q1</th>
            <th scope="col" className="px-6 py-3">Q2</th>
            <th scope="col" className="px-6 py-3">Q3</th>
            <th scope="col" className="px-6 py-3">Q4</th>
            <th scope="col" className="px-6 py-3">Q5</th>
          </tr>
        </thead>
        <tbody>
          {sheets.length === 0 ? (
            <tr className="bg-white border-[1px] dark:bg-black dark:text-gray-300">
              <td colSpan="14" className="px-6 py-4 text-center">
                No students found
              </td>
            </tr>
          ) : (
            sheets.map((sheet) => (
              <tr key={sheet.id} className="bg-white border-[1px] dark:border-neutral-700  dark:bg-black dark:text-gray-300">
                <td className="px-6 py-3">{sheet.id}</td>
                <td className="px-6 py-3">{sheet.name}</td>

                {/* MST1 Sub-columns */}
                <td className="px-6 py-3">{sheet.MST1_Q1 ?? '-'}</td>
                <td className="px-6 py-3">{sheet.MST1_Q2 ?? '-'}</td>
                <td className="px-6 py-3">{sheet.MST1_Q3 ?? '-'}</td>

                {/* MST2 Sub-columns */}
                <td className="px-6 py-3">{sheet.MST2_Q1 ?? '-'}</td>
                <td className="px-6 py-3">{sheet.MST2_Q2 ?? '-'}</td>
                <td className="px-6 py-3">{sheet.MST2_Q3 ?? '-'}</td>

                <td className="px-6 py-3">{sheet.Quiz_Assignment ?? '-'}</td>

                {/* Endsem Sub-columns */}
                <td className="px-6 py-3">{sheet.EndSem_Q1 ?? '-'}</td>
                <td className="px-6 py-3">{sheet.EndSem_Q2 ?? '-'}</td>
                <td className="px-6 py-3">{sheet.EndSem_Q3 ?? '-'}</td>
                <td className="px-6 py-3">{sheet.EndSem_Q4 ?? '-'}</td>
                <td className="px-6 py-3">{sheet.EndSem_Q5 ?? '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};



const AddExamSchema = ({ setSchema, subjectCode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subjectCode,
    mst1: { Q1: '', Q2: '', Q3: '' }, // Keep the structure but initialize with empty strings
    mst2: { Q1: '', Q2: '', Q3: '' }, // Keep the structure but initialize with empty strings
    Quiz_Assignment: [], // Store the quiz assignments here
  });
  const [error, setError] = useState('');

  // Handle change for dropdowns
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the corresponding mst1 or mst2 based on the input name
    if (name.startsWith('MST1_')) {
      const question = name.split('_')[1]; // Extract Q1, Q2, or Q3
      setFormData((prevData) => ({
        ...prevData,
        mst1: { ...prevData.mst1, [question]: value }, // Update the specific question
      }));
    } else if (name.startsWith('MST2_')) {
      const question = name.split('_')[1];
      setFormData((prevData) => ({
        ...prevData,
        mst2: { ...prevData.mst2, [question]: value }, // Update the specific question
      }));
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    const updatedQuizAssignment = formData.Quiz_Assignment.includes(value)
      ? formData.Quiz_Assignment.filter((co) => co !== value)
      : [...formData.Quiz_Assignment, value];

    setFormData((prevData) => ({ ...prevData, Quiz_Assignment: updatedQuizAssignment }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data according to your specified structure
    const dataToSubmit = {
      subjectCode: formData.subjectCode,
      mst1: {
        Q1: formData.mst1.Q1,
        Q2: formData.mst1.Q2,
        Q3: formData.mst1.Q3,
      },
      mst2: {
        Q1: formData.mst2.Q1,
        Q2: formData.mst2.Q2,
        Q3: formData.mst2.Q3,
      },
      quizAssignment: formData.Quiz_Assignment, // Make sure this is sent correctly
    };

    console.log('Data to Submit:', dataToSubmit); // Debug log to check the final form data

    try {
      const response = await axios.post(`http://localhost:8080/api/operation/co-form`, dataToSubmit);
      alert('Form submitted successfully!');
      console.log(response.data);
      setSchema(false); // Optionally close the form
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit the form. Please try again.');
    }
  };

  return (
    <div className="fixed h-full w-full flex items-center justify-center rounded-tl-2xl z-50 poppins-regular backdrop-brightness-50 dark:backdrop-brightness-50 backdrop-blur-sm">
      <form className="max-w-md w-1/3 mx-auto bg-white dark:bg-black rounded-xl p-2 border-2 border-neutral-300 dark:border-neutral-700" onSubmit={handleSubmit}>
        <div className="p-4">
          <div className="flex justify-end text-white cursor-pointer" onClick={() => setSchema(false)}>
            ❌
          </div>

          {/* MST1 Schema */}
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">MST 1 Schema</h3>
          <div className="mb-4 flex gap-4">
            {['Q1', 'Q2', 'Q3'].map((question, index) => (
              <div key={index} className="mb-3">
                <label htmlFor={`MST1_${question}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white ml-2">
                  {question}
                </label>
                <select
                  id={`MST1_${question}`}
                  name={`MST1_${question}`} // Ensure name matches what you handle in handleChange
                  value={formData.mst1[question]} // Use the correct state property
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="">Select CO</option> {/* Default empty option */}
                  {['CO1', 'CO2', 'CO3', 'CO4', 'CO5'].map((co, idx) => (
                    <option key={idx} value={co}>{co}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* MST2 Schema */}
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">MST 2 Schema</h3>
          <div className="mb-4 flex gap-4">
            {['Q1', 'Q2', 'Q3'].map((question, index) => (
              <div key={index} className="mb-3">
                <label htmlFor={`MST2_${question}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white ml-2">
                  {question}
                </label>
                <select
                  id={`MST2_${question}`}
                  name={`MST2_${question}`} // Ensure name matches what you handle in handleChange
                  value={formData.mst2[question]} // Use the correct state property
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="">Select CO</option> {/* Default empty option */}
                  {['CO1', 'CO2', 'CO3', 'CO4', 'CO5'].map((co, idx) => (
                    <option key={idx} value={co}>{co}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Quiz/Assignment Schema */}
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Quiz/Assignment</h3>
          <div className="mb-4 flex">
            {['CO1', 'CO2', 'CO3', 'CO4', 'CO5'].map((co, index) => (
              <div key={index} className="flex items-center mb-2 mr-6">
                <input
                  id={`quiz-${co}`}
                  name="Quiz_Assignment"
                  type="checkbox"
                  value={co}
                  checked={formData.Quiz_Assignment.includes(co)}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor={`quiz-${co}`}
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {co}
                </label>
              </div>
            ))}
          </div>

          {error && <div className="text-red-500 mb-3">{error}</div>}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white border-2 border-neutral-200 dark:border-neutral-700 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 transition-colors duration-800"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

 
const AddStudentPopup = ({ setCreate, subjectCode }) => {
  const navigate = useNavigate();
    const [formData, setFormData] = useState({
      id: '',
      subjectCode,
      name: '',
      MST1_Q1: 0,
      MST1_Q2: 0,
      MST1_Q3: 0,

      MST2_Q1: 0,
      MST2_Q2: 0,
      MST2_Q3: 0,

      Quiz_Assignment: 0,

      EndSem_Q1: 0,
      EndSem_Q2: 0,
      EndSem_Q3: 0,
      EndSem_Q4: 0,
      EndSem_Q5: 0,
    });
    const [error, setError] = useState('');
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
  
      try {
        const response = await axios.post(`http://localhost:8080/api/operation/submit-form`, formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Student added:', response.data);
        setCreate(false);  // Close popup on success
        navigate(0);
      } catch (err) {
        console.error('Error adding student:', err);
        setError(err.response?.data?.error || 'Failed to add student. Please try again.');
      }
    };
  
    return (
      <div className="absolute h-screen w-full flex items-center justify-center z-50 poppins-regular backdrop-blur-md backdrop-brightness-50">
        <form className="w-1/2 mx-auto bg-white dark:bg-black rounded-xl p-2 border-2 border-neutral-300 dark:border-neutral-700" onSubmit={handleSubmit}>
          <div className="p-4">
            <div className="flex justify-end text-white cursor-pointer" onClick={() => setCreate(false)}>
              <div>❌</div>
            </div>
            <div className='grid grid-cols-2 gap-6'>
            <div className="mb-4">
              <label htmlFor="id" className="block mb-2 dark:text-white text-lg font-semibold">Enrollment Number</label>
              <input
                type="text"
                name="id"
                id="id"
                value={formData.id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 dark:text-white text-lg font-semibold">Student Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"
              />
            </div>
  
            {/* MST1 Field */}  
            <div>
            <div className='block mb-2 dark:text-white text-lg font-semibold'> MID SEMESTER EXAM - 1 MARKS</div>
            <div className='flex gap-3'>
              <div className="mb-4">
                <label htmlFor="MST1_Q1" className="block mb-2 ml-2 dark:text-white">Q1</label>
                <input
                  type="number"
                  name="MST1_Q1"
                  id="MST1_Q1"
                  value={formData.MST1_Q1}
                  onChange={handleChange}
                  required
                  className="w-full mx-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="MST1_Q2" className="block mb-2 ml-2 dark:text-white">Q2</label>
                <input
                  type="number"
                  name="MST1_Q2"
                  id="MST1_Q2"
                  value={formData.MST1_Q2}
                  onChange={handleChange}
                  required
                  className="w-full mx-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"
                />
              </div>
            <div className="mb-4">
                <label htmlFor="MST1_Q3" className="block mb-2 ml-2 dark:text-white">Q3</label>
                <input
                  type="number"
                  name="MST1_Q3"
                  id="MST1_Q3"
                  value={formData.MST1_Q3}
                  onChange={handleChange}
                  required
                  className="w-full mx-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            </div>
  
                      {/* MST2 Field */}  
            <div>
            <div className='block mb-2 dark:text-white text-lg font-semibold'> MID SEMESTER EXAM - 2 MARKS</div>
            <div className='flex gap-3'>
              <div className="mb-4">
                <label htmlFor="MST2_Q1" className="block mb-2 ml-2 dark:text-white">Q1</label>
                <input
                  type="number"
                  name="MST2_Q1"
                  id="MST2_Q1"
                  value={formData.MST2_Q1}
                  onChange={handleChange}
                  required
                  className="w-full mx-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="MST2_Q2" className="block mb-2 ml-2 dark:text-white">Q2</label>
                <input
                  type="number"
                  name="MST2_Q2"
                  id="MST2_Q2"
                  value={formData.MST2_Q2}
                  onChange={handleChange}
                  required
                  className="w-full mx-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"
                />
              </div>
            <div className="mb-4">
                <label htmlFor="MST2_Q3" className="block mb-2 ml-2 dark:text-white">Q3</label>
                <input
                  type="number"
                  name="MST2_Q3"
                  id="MST2_Q3"
                  value={formData.MST2_Q3}
                  onChange={handleChange}
                  required
                  className="w-full mx-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            </div>
  
            {/* Assignment/Quiz (AssQuiz) Field */}
            
            <div className="mb-4 mt-8">
              <label htmlFor="Quiz_Assignment" className="block mb-2 dark:text-white text-lg font-semibold">Assignment / Quiz</label>
              <input
                type="number"
                name="Quiz_Assignment"
                id="Quiz_Assignment"
                value={formData.Quiz_Assignment}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"
              />
            </div>
  
            {/* Endsem Field */}
            <div>
            <div className='block mb-2 dark:text-white text-lg font-semibold'> END SEMESTER EXAM MARKS</div>
            <div className='flex gap-1'>
              <div className="mb-4">
                <label htmlFor="Endsem_Q1" className="block mb-2 dark:text-white">Q1</label>
                <input
                  type="number"
                  name="EndSem_Q1"
                  id="EndSem_Q1"
                  value={formData.EndSem_Q1}
                  onChange={handleChange}
                  required
                  className="w-full mr-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="Endsem_Q2" className="block mb-2 dark:text-white">Q2</label>
                <input
                  type="number"
                  name="EndSem_Q2"
                  id="EndSem_Q2"
                  value={formData.EndSem_Q2}
                  onChange={handleChange}
                  required
                  className="w-full mr-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="Endsem_Q3" className="block mb-2 dark:text-white">Q3</label>
                <input
                  type="number"
                  name="EndSem_Q3"
                  id="EndSem_Q3"
                  value={formData.EndSem_Q3}
                  onChange={handleChange}
                  required
                  className="w-full mr-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="Endsem_Q4" className="block mb-2 dark:text-white">Q4</label>
                <input
                  type="number"
                  name="EndSem_Q4"
                  id="EndSem_Q4"
                  value={formData.EndSem_Q4}
                  onChange={handleChange}
                  required
                  className="w-full mr-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="Endsem_Q5" className="block mb-2 dark:text-white">Q5</label>
                <input
                  type="number"
                  name="EndSem_Q5"
                  id="EndSem_Q5"
                  value={formData.EndSem_Q5}
                  onChange={handleChange}
                  required
                  className="w-full mr-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            </div>
  
            {error && <div className="text-red-500 mb-3">{error}</div>}
            </div>
            <button type="submit" className="w-full px-4 py-2 mt-2 text-white border-2 border-neutral-200 dark:border-neutral-700 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 transition-colors duration-800">
              Submit
            </button>
          
        </div>
        </form>
      </div>
    );
  };

  const downloadExcel = (subjectCode) => {
    axios.get(`http://localhost:8080/api/operation/download-sheets?subjectCode=${subjectCode}`, {
      responseType: 'blob', // Important to set response type as blob for file download
    })
    .then((response) => {
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sheets.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch((error) => {
      console.error('Error downloading the Excel sheet:', error);
    });
  };

  const downloadMST1 = (subjectCode) => {
    axios.get(`http://localhost:8080/api/operation/downloadmst1/${subjectCode}`, {
      responseType: 'blob', // Important to set response type as blob for file download
    })
    .then((response) => {
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sheets.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch((error) => {
      console.error('Error downloading the Excel sheet:', error);
    });
  };

  const downloadMST2 = (subjectCode) => {
    axios.get(`http://localhost:8080/api/operation/downloadmst2/${subjectCode}`, {
      responseType: 'blob', // Important to set response type as blob for file download
    })
    .then((response) => {
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sheets.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch((error) => {
      console.error('Error downloading the Excel sheet:', error);
    });
  };

  const downloadExcelEnd = (subjectCode) => {
    axios.get(`http://localhost:8080/api/operation/end-excel/${subjectCode}`, {
      responseType: 'blob',
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student_co_data.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch((error) => {
      console.error('Error downloading the Excel sheet:', error);
    });
  };

  const downloadCOSheet = (subjectCode) => {
    axios.get(`http://localhost:8080/api/operation/generate-co-attainment/${subjectCode}`, {
      responseType: 'blob',
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student_co_data.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch((error) => {
      console.error('Error downloading the Excel sheet:', error);
    });
  };

export default SubDash;