import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

const SubmitAssignmentDialog = ({ assignment, onClose }) => {
	const [file, setFile] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		// Check if a file is selected
		if (!file) {
			alert('Please select a file to submit.');
			return;
		}
		const studentId = Cookies.get('userId');
			// Updated alert for invalid student ID
		if (!studentId) {
			alert('Invalid Student ID.');
			return;
		}
		const formData = new FormData();
		formData.append('assignmentId', assignment.id);
		formData.append('studentId', studentId);
		formData.append('file', file);
		axios.post(`${BASE_URL}/api/assignment/submit`, formData, {
			headers: {
				Authorization: `Bearer ${Cookies.get('token')}`
				// let Axios set 'Content-Type' automatically for FormData
			}
		})
				.then(response => {
					// Log and show success notification
					console.log('Submission successful:', response.data);
					alert('Submission successful.');
					// Optionally notify parent to refresh assignments status here
					onClose();
				})
			.catch(err => {
				console.error(err);
				// Show server error message if available
				alert(err.response?.data?.error || 'Submission failed.');
			});
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-filter backdrop-blur-sm">
			<div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-lg">
				<h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Submit Assignment</h2>
				<form onSubmit={handleSubmit}>
					<input 
						type="file" 
						onChange={e => setFile(e.target.files[0])} 
						required 
						className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:border-blue-400"
					/>
					<button
						type="submit"
						className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
					>
						Submit
					</button>
				</form>
				<button 
					onClick={onClose} 
					className="mt-4 w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default SubmitAssignmentDialog;
