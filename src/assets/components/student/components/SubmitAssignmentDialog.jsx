import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { X, Loader2 } from 'lucide-react';

const BASE_URL = 'http://localhost:8080';

const SubmitAssignmentDialog = ({ assignment, onClose }) => {
	const [file, setFile] = useState(null);
	const [note, setNote] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		if (!file) {
			alert('Please select a file to submit.');
			setLoading(false);
			return;
		}

		const studentId = Cookies.get('userId');
		if (!studentId) {
			alert('Invalid Student ID.');
			setLoading(false);
			return;
		}

		const formData = new FormData();
		formData.append('assignmentId', assignment.id);
		formData.append('studentId', studentId);
		formData.append('file', file);
		formData.append('note', note);

		axios.post(`${BASE_URL}/api/assignment/submit`, formData, {
			headers: {
				Authorization: `Bearer ${Cookies.get('token')}`
			}
		})
			.then(response => {
				alert('Submission successful.');
				onClose();
			})
			.catch(err => {
				setError(err.response?.data?.error || 'Submission failed.');
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
			<div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto transition">
				<div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700  px-4 py-2 mb-4">
					<h2 className="text-xl font-medium text-gray-800 dark:text-white">Submit Assignment</h2>
					<button onClick={onClose} className="p-2 rounded transition">
						<X className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white" />
					</button>
				</div>
				<form onSubmit={handleSubmit} className='p-4'>
					<div className="mb-4">
						<label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">File</label>
						<input 
							type="file" 
							id="file"
							onChange={e => setFile(e.target.files[0])} 
							required 
							className="mt-1 block w-full rounded-md shadow-sm p-2 bg-neutral-100 dark:bg-neutral-800 dark:text-gray-200 focus:outline-none focus:ring focus:border-blue-400"
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Note</label>
						<textarea
							id="note"
							value={note}
							onChange={e => setNote(e.target.value)}
							className="mt-1 block w-full rounded-md shadow-sm p-2 bg-neutral-100 dark:bg-neutral-800 dark:text-gray-200 focus:outline-none focus:ring focus:border-blue-400"
						/>
					</div>
					{error && (
						<div className="border px-4 py-3 rounded mb-4 bg-red-50 border-red-200 text-red-700 dark:bg-red-900 dark:border-red-800 dark:text-red-200">
							{error}
						</div>
					)}
					<div className="flex justify-end">
						<button
							type="submit"
							disabled={loading}
							className="inline-flex items-center justify-center w-full px-3 py-1.5 text-sm font-medium rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
						>
							{loading ? (
								<Loader2 className="h-4 w-4 mr-1 animate-spin" />
							) : (
								'Submit'
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SubmitAssignmentDialog;
