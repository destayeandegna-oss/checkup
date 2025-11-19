/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Camera, UserCheck, Users, Clock, Calendar, CheckCircle, XCircle, AlertCircle, Fingerprint, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function BiometricAttendanceSystem() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', department: 'Engineering', biometricId: 'BIO001', status: 'present' },
    { id: 2, name: 'Jane Smith', department: 'Marketing', biometricId: 'BIO002', status: 'present' },
    { id: 3, name: 'Mike Johnson', department: 'Sales', biometricId: 'BIO003', status: 'absent' },
    { id: 4, name: 'Sarah Williams', department: 'HR', biometricId: 'BIO004', status: 'present' },
    { id: 5, name: 'David Brown', department: 'Engineering', biometricId: 'BIO005', status: 'late' },
  ]);
  const [attendance, setAttendance] = useState([
    { id: 1, employeeId: 1, name: 'John Doe', checkIn: '09:00 AM', checkOut: '-', date: '2025-10-25', method: 'Fingerprint' },
    { id: 2, employeeId: 2, name: 'Jane Smith', checkIn: '08:55 AM', checkOut: '-', date: '2025-10-25', method: 'Face Recognition' },
    { id: 3, employeeId: 4, name: 'Sarah Williams', checkIn: '09:02 AM', checkOut: '-', date: '2025-10-25', method: 'Fingerprint' },
    { id: 4, employeeId: 5, name: 'David Brown', checkIn: '09:25 AM', checkOut: '-', date: '2025-10-25', method: 'Face Recognition' },
  ]);
  const [scanning, setScanning] = useState(false);
  const [scanType, setScanType] = useState('fingerprint');
  const [scanResult, setScanResult] = useState(null);
  const videoRef = useRef(null);

  const stats = {
    totalEmployees: employees.length,
    present: employees.filter(e => e.status === 'present').length,
    absent: employees.filter(e => e.status === 'absent').length,
    late: employees.filter(e => e.status === 'late').length,
  };

  const startBiometricScan = (type) => {
    setScanType(type);
    setScanning(true);
    setScanResult(null);

    if (type === 'face' && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
        })
        .catch(err => console.log('Camera access denied'));
    }

    setTimeout(() => {
      const randomEmployee = employees[Math.floor(Math.random() * employees.length)];
      const isCheckIn = !attendance.some(a => a.employeeId === randomEmployee.id && a.checkOut === '-');
      
      setScanResult({
        success: true,
        employee: randomEmployee,
        action: isCheckIn ? 'Check Out' : 'Check In',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      });

      if (isCheckIn) {
        setAttendance(prev => prev.map(a => 
          a.employeeId === randomEmployee.id && a.checkOut === '-'
            ? { ...a, checkOut: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
            : a
        ));
      } else {
        const newRecord = {
          id: attendance.length + 1,
          employeeId: randomEmployee.id,
          name: randomEmployee.name,
          checkIn: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          checkOut: '-',
          date: new Date().toISOString().split('T')[0],
          method: type === 'fingerprint' ? 'Fingerprint' : 'Face Recognition'
        };
        setAttendance(prev => [...prev, newRecord]);
        setEmployees(prev => prev.map(e => 
          e.id === randomEmployee.id ? { ...e, status: 'present' } : e
        ));
      }

      setScanning(false);
      
      if (type === 'face' && videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    }, 3000);
  };

  const closeScanResult = () => {
    setScanResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Biometric Attendance System</h1>
          <p className="text-gray-600">Secure and efficient employee attendance management</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('scan')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'scan'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Biometric Scan
          </button>
          <button
            onClick={() => setCurrentView('attendance')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'attendance'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Attendance Records
          </button>
          <button
            onClick={() => setCurrentView('employees')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'employees'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Employees
          </button>
        </div>

        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Employees</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalEmployees}</p>
                    </div>
                    <div className="bg-blue-100 rounded-full p-3">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Present Today</p>
                      <p className="text-3xl font-bold text-green-600 mt-2">{stats.present}</p>
                    </div>
                    <div className="bg-green-100 rounded-full p-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Absent Today</p>
                      <p className="text-3xl font-bold text-red-600 mt-2">{stats.absent}</p>
                    </div>
                    <div className="bg-red-100 rounded-full p-3">
                      <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Late Arrivals</p>
                      <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.late}</p>
                    </div>
                    <div className="bg-yellow-100 rounded-full p-3">
                      <AlertCircle className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {attendance.slice(-5).reverse().map(record => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 rounded-full p-2">
                          {record.method === 'Fingerprint' ? (
                            <Fingerprint className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Eye className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{record.name}</p>
                          <p className="text-sm text-gray-500">{record.method}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">{record.checkIn}</p>
                        <p className="text-xs text-gray-500">Check In</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Biometric Authentication</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <button
                  onClick={() => startBiometricScan('fingerprint')}
                  disabled={scanning}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-8 hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Fingerprint className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Fingerprint Scan</h3>
                  <p className="text-blue-100">Place finger on sensor</p>
                </button>

                <button
                  onClick={() => startBiometricScan('face')}
                  disabled={scanning}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-8 hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Face Recognition</h3>
                  <p className="text-purple-100">Look at the camera</p>
                </button>
              </div>

              {scanning && (
                <div className="text-center">
                  <div className="inline-block">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mb-4"
                    />
                  </div>
                  <p className="text-lg font-medium text-gray-700">
                    {scanType === 'fingerprint' ? 'Scanning fingerprint...' : 'Recognizing face...'}
                  </p>
                  {scanType === 'face' && (
                    <div className="mt-4 max-w-md mx-auto">
                      <video ref={videoRef} autoPlay className="w-full rounded-lg" />
                    </div>
                  )}
                </div>
              )}

              {scanResult && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                  onClick={closeScanResult}
                >
                  <motion.div
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    className="bg-white rounded-lg p-8 max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-center">
                      <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
                      <p className="text-gray-600 mb-4">{scanResult.action} recorded</p>
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-500 mb-1">Employee</p>
                        <p className="text-lg font-bold text-gray-800">{scanResult.employee.name}</p>
                        <p className="text-sm text-gray-600">{scanResult.employee.department}</p>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">Time</p>
                          <p className="text-lg font-bold text-gray-800">{scanResult.time}</p>
                        </div>
                      </div>
                      <button
                        onClick={closeScanResult}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentView === 'attendance' && (
            <motion.div
              key="attendance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Attendance Records</h2>
                <p className="text-gray-600 mt-1">Today: {new Date().toLocaleDateString()}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendance.map(record => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{record.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.checkIn}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.checkOut}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="flex items-center space-x-2">
                            {record.method === 'Fingerprint' ? (
                              <Fingerprint className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Eye className="w-4 h-4 text-purple-600" />
                            )}
                            <span className="text-sm text-gray-700">{record.method}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {currentView === 'employees' && (
            <motion.div
              key="employees"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Employee Directory</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biometric ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map(employee => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{employee.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.biometricId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            employee.status === 'present'
                              ? 'bg-green-100 text-green-800'
                              : employee.status === 'absent'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default BiometricAttendanceSystem;