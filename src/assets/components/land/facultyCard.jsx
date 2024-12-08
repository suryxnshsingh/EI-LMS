import React from 'react';

export default function Card({
    name,
    designation,
    employeeId,
    qualification,
    joining,
    phone,
    email,
    imgsrc
}) {
    return (
        <div className="relative shadow-slate-800 hover:shadow-none w-80 h-96 overflow-hidden shadow-md rounded-2xl group">
            <img
                src={imgsrc}
                loading="lazy"
                className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50 group-hover:blur-md"
                alt={name}
            />
            <div className='absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent'/>
            <div className="absolute inset-0 flex flex-col justify-between p-4 transition-all duration-300">
                <div className="transform translate-y-[480%] transition-transform duration-300 group-hover:translate-y-[160%] ml-2">
                    <h2 className="text-white text-2xl poppins-bold">{name}</h2>
                    <p className="text-white text-lg poppins-semibold">{designation}</p>
                </div>
                <div className="space-y-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 mb-2 ml-2">
                    <p className="text-white poppins-medium">Employee ID: {employeeId}</p>
                    <p className="text-white poppins-medium">Qualification: {qualification}</p>
                    <p className="text-white poppins-medium">Joining Date: {joining}</p>
                    <p className="text-white poppins-medium">Phone: {phone}</p>
                    <p className="text-white poppins-medium">Email: {email}</p>
                </div>
            </div>
        </div>
    );
}