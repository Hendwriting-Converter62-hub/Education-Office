
import React, { useState, useEffect } from 'react';
import { User, UserRole, Form, Submission, School, Upazila, SubmissionStatus } from './types.ts';
import { mockUsers, mockForms, mockSchools, mockUpazilas } from './mockData.ts';
import Layout from './components/Layout.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import UpazilaDashboard from './components/UpazilaDashboard.tsx';
import SchoolDashboard from './components/SchoolDashboard.tsx';
import AuthScreen from './components/AuthScreen.tsx';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [forms, setForms] = useState<Form[]>(mockForms);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [schools, setSchools] = useState<School[]>(mockSchools);
  const [upazilas, setUpazilas] = useState<Upazila[]>(mockUpazilas);
  const [isLoading, setIsLoading] = useState(true);

  // Persistence (Simulation)
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('edu_users');
      if (savedUsers) setUsers(JSON.parse(savedUsers));

      const savedSubmissions = localStorage.getItem('edu_submissions');
      if (savedSubmissions) setSubmissions(JSON.parse(savedSubmissions));
      
      const savedForms = localStorage.getItem('edu_forms');
      if (savedForms) setForms(JSON.parse(savedForms));

      const savedUpazilas = localStorage.getItem('edu_upazilas');
      if (savedUpazilas) setUpazilas(JSON.parse(savedUpazilas));

      const savedSchools = localStorage.getItem('edu_schools');
      if (savedSchools) setSchools(JSON.parse(savedSchools));

      const savedUser = localStorage.getItem('edu_current_user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    } catch (e) {
      console.error("Local storage error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) localStorage.setItem('edu_users', JSON.stringify(users));
  }, [users, isLoading]);

  useEffect(() => {
    if (!isLoading) localStorage.setItem('edu_submissions', JSON.stringify(submissions));
  }, [submissions, isLoading]);

  useEffect(() => {
    if (!isLoading) localStorage.setItem('edu_forms', JSON.stringify(forms));
  }, [forms, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      if (currentUser) {
        localStorage.setItem('edu_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('edu_current_user');
      }
    }
  }, [currentUser, isLoading]);

  const handleLogin = (email: string, password?: string) => {
    const user = users.find(u => u.email === email || u.mobile === email);
    if (user) {
      if (user.password === password) {
        setCurrentUser(user);
      } else {
        alert('ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।');
      }
    } else {
      alert('ব্যবহারকারী পাওয়া যায়নি!');
    }
  };

  const handleSignUp = (newUser: User) => {
    if (users.some(u => u.email === newUser.email)) {
      alert('এই ইমেইল ইতিপূর্বে ব্যবহার করা হয়েছে।');
      return;
    }
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const saveSubmission = (submission: Submission) => {
    setSubmissions(prev => {
      const idx = prev.findIndex(s => s.formId === submission.formId && s.schoolId === submission.schoolId);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = submission;
        return next;
      }
      return [...prev, submission];
    });
  };

  const updateSubmissionStatus = (id: string, status: SubmissionStatus) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  if (isLoading) return null;

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} onSignUp={handleSignUp} upazilas={upazilas} />;
  }

  const currentUpazila = upazilas.find(u => u.id === currentUser.upazilaId);
  const currentSchool = schools.find(s => s.id === currentUser.schoolId);

  return (
    <Layout 
      user={currentUser} 
      onLogout={handleLogout} 
      onUpdateProfile={handleUpdateProfile}
      upazilaName={currentUpazila?.name}
      schoolName={currentSchool?.name}
      schoolIpemis={currentSchool?.ipemisCode}
      availableUpazilas={upazilas}
    >
      {currentUser.role === UserRole.ADMIN && (
        <AdminDashboard 
          forms={forms} 
          setForms={setForms} 
          schools={schools} 
          upazilas={upazilas} 
          users={users}
          setUsers={setUsers}
        />
      )}
      {currentUser.role === UserRole.UPAZILA && (
        <UpazilaDashboard 
          user={currentUser} 
          forms={forms} 
          setForms={setForms}
          submissions={submissions}
          schools={schools}
          onUpdateStatus={updateSubmissionStatus}
          onUpdateSubmission={saveSubmission}
        />
      )}
      {currentUser.role === UserRole.SCHOOL && (
        <SchoolDashboard 
          user={currentUser} 
          forms={forms} 
          submissions={submissions}
          onSaveSubmission={saveSubmission}
        />
      )}
    </Layout>
  );
};

export default App;
