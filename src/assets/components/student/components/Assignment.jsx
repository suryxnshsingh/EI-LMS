import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import SubmitAssignmentDialog from './SubmitAssignmentDialog';

const BASE_URL = 'http://localhost:8080';

const Assignment = () => {
	const { courseId } = useParams();
	const [assignments, setAssignments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showDialog, setShowDialog] = useState(false);
	const [selectedAssignment, setSelectedAssignment] = useState(null);

	useEffect(() => {
		axios.get(`${BASE_URL}/api/assignment/course/${courseId}`, {
			headers: { Authorization: `Bearer ${Cookies.get('token')}` },
			params: { studentId: Cookies.get('userId') }
		})
			.then(res => {
				const now = new Date();
				const processed = res.data.map(assignment => {
					const dueDate = new Date(assignment.dueDate);
					let status = '';
					if (assignment.submissions && assignment.submissions.length > 0) {
						const submission = assignment.submissions[0];
						// Compare submission date with dueDate
						status = new Date(submission.submissionDate).getTime() > dueDate.getTime() 
							? 'late submission' 
							: 'completed';
					} else {
							// If no submission exists, check if assignment is closed for submissions
							status = assignment.acceptingSubmissions === false 
								? 'missed' 
								: (now > dueDate ? 'to-do late' : 'to-do');
					}
					return { ...assignment, status };
				});
				setAssignments(processed);
			})
			.catch(err => console.error(err))
			.finally(() => setLoading(false));
	}, [courseId]);

	if (loading) {
		return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
	}

	// Remove grouping and instead sort assignments by status to place alike together
	const statusOrder = { "to-do": 0, "to-do late": 1, "late submission": 2, "completed": 3, "missed": 4 };
	const sortedAssignments = [...assignments].sort((a, b) => (statusOrder[a.status] ?? 5) - (statusOrder[b.status] ?? 5));

	// Sticker details for each status
	const stickerDetails = {
		"to-do": { label: "To Do", class: "bg-blue-100 text-blue-800" },
		"to-do late": { label: "To Do/Late", class: "bg-yellow-100 text-yellow-800" },
		"completed": { label: "Completed", class: "bg-green-100 text-green-800" },
		"late submission": { label: "Late Submission", class: "bg-red-100 text-red-800" },
		"missed": { label: "Missed", class: "bg-gray-100 text-gray-800" }
	};

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Student Assignments</h1>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{sortedAssignments.map(a => (
					<div key={a.id} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-xl transition relative">
						<h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">{a.title}</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{a.description}</p>
						<div className="text-xs text-gray-500 dark:text-gray-300 mb-3">
							Due: {new Date(a.dueDate).toLocaleString()}
						</div>
						{/* Display submission date/time if submission exists */}
						{a.submissions && a.submissions.length > 0 && (
							<div className="text-xs text-gray-500 dark:text-gray-300 mb-3">
								Submitted: {new Date(a.submissions[0].submissionDate).toLocaleString()}
							</div>
						)}
						{(a.status === 'to-do' || a.status === 'to-do late') && (
							<button 
								onClick={() => { setSelectedAssignment(a); setShowDialog(true); }}
								className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
							>
								Submit
							</button>
						)}
						<div className="absolute top-2 right-2">
							<span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${stickerDetails[a.status]?.class || 'bg-gray-100 text-gray-800'}`}>
								{stickerDetails[a.status]?.label || a.status}
							</span>
						</div>
					</div>
				))}
			</div>
			{showDialog && (
				<SubmitAssignmentDialog
					assignment={selectedAssignment}
					onClose={() => { setShowDialog(false); setSelectedAssignment(null); }}
				/>
			)}
		</div>
	);
};

export default Assignment;