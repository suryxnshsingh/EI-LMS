import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Calendar, Building, Clock, Save, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Electronics and Instrumentation',
    position: 'Head of Department',
    joining: '2018-07-15',
    office: 'EI-201',
    officeHours: 'Mon-Fri, 10:00 AM - 5:00 PM'
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // For demo purposes, we'll load from cookies and add some mock data
    const firstName = Cookies.get('firstName') || 'John';
    const lastName = Cookies.get('lastName') || 'Doe';
    const email = Cookies.get('userEmail') || 'john.doe@example.com';

    setProfile({
      ...profile,
      firstName,
      lastName,
      email
    });
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    // Simulating an API call
    setTimeout(() => {
      // Update cookies with new name
      Cookies.set('firstName', profile.firstName);
      Cookies.set('lastName', profile.lastName);
      setUpdating(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900 dark:text-white" />
      </div>
    );
  }

  return (
    <div className="w-full m-4 md:m-10">
      <div className="container p-4 space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-4xl font-semibold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your personal information and preferences
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-16">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-200 flex items-center justify-center text-4xl font-bold mb-4">
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold text-white">{profile.firstName} {profile.lastName}</h2>
              <p className="text-blue-100">{profile.position}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    readOnly
                    className="pl-10 block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 bg-gray-50 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="pl-10 block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-neutral-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Department Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Position</p>
                    <p>{profile.position}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Department</p>
                    <p>{profile.department}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Joining Date</p>
                    <p>{new Date(profile.joining).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Office</p>
                    <p>{profile.office}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 md:col-span-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Office Hours</p>
                    <p>{profile.officeHours}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
