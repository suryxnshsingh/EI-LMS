import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import SubmitAssignmentDialog from './SubmitAssignmentDialog';
import { ArchiveX, BadgeCheck, FileUp } from 'lucide-react';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

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
		"to-do": { label: "Accepting", class: "bg-blue-100 text-blue-800" },
		"to-do late": { label: "Accepting/Late", class: "bg-yellow-100 text-yellow-800" },
		"completed": { label: "Completed", class: "bg-green-100 text-green-800" },
		"late submission": { label: "Late Submission", class: "bg-red-100 text-red-800" },
		"missed": { label: "Missed", class: "bg-red-100 text-red-800" }
	};

	const downloadFile = (fileUrl) => {
		try {
			const filename = fileUrl.split('/').pop();
			window.open(`${BASE_URL}/api/assignment/download/${filename}`, '_blank');
		} catch (error) {
			console.error('Download error:', error);
		}
	};

	return (
		<div className="w-[85svw]">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{sortedAssignments.map(a => (
					<div key={a.id} className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 shadow rounded-lg p-6 hover:shadow-xl transition relative">
						<h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">{a.title}</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{a.description || 'No description available'}</p>
						<div className="text-xs text-gray-500 dark:text-gray-300 mb-3">
							{a.fileUrl ? (
								<button onClick={() => downloadFile(a.fileUrl)} className="text-blue-500 hover:underline">Download Assignment File</button>
							) : (
								<span>No file available</span>
							)}
						</div>
						<div className="text-xs text-gray-500 dark:text-gray-300 mb-3">
							Due: {new Date(a.dueDate).toLocaleString()}
						</div>
						{/* Display submission date/time if submission exists */}
						<div className="text-xs text-gray-500 dark:text-gray-300 mb-3">
							{a.submissions && a.submissions.length > 0 ? (
								<span>Submitted: {new Date(a.submissions[0].submissionDate).toLocaleString()}</span>
							) : (
								<span>No submission yet</span>
							)}
						</div>
						{(a.status === 'to-do' || a.status === 'to-do late') && (
							<button 
								onClick={() => { setSelectedAssignment(a); setShowDialog(true); }}
								className="inline-flex items-center justify-center w-full px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
							>
								<FileUp className="h-4 w-4 mr-1" />
								Submit
							</button>
						)}
						{a.status === 'completed' && (
							<button 
								className="inline-flex items-center justify-center w-full px-3 py-1.5 text-sm font-medium rounded-lg bg-green-600 text-white cursor-default"
								disabled
							>
								<BadgeCheck className="h-4 w-4 mr-1" />
								Submitted
							</button>
						)}
						{a.status === 'missed' && (
							<button 
								className="inline-flex items-center justify-center w-full px-3 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white cursor-default"
								disabled
							>
								<ArchiveX className="h-4 w-4 mr-1" />
								Missed
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