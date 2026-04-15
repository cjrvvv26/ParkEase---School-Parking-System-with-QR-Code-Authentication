import React, { useState, useEffect } from 'react';
import DefaultInput from '../components/forms/DefaultInput';
import DefaultOptions from '../components/forms/DefaultOptions';
import useFetch from '../hooks/useFetch';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Info } from 'lucide-react';
import useDark from '../hooks/useDark';

export default function AddStudent() {
  const [courses, setCourses] = useState([]);
  const [generatedMotorcycle, setGeneratedMotorcycle] = useState({});
  const [showGeneratedSection, setShowGeneratedSection] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const { error, loading, fetchData } = useFetch();
  const { dark, border, input, card, cardInner } = useDark();
  const [student, setStudent] = useState({
    profileDetails: null,
    firstName: '',
    middleName: '',
    lastName: '',
    studentNo: '',
    course: '',
    yearLevel: '',
    email: '',
    phoneNo: '',
    role: 'student',
  });

  const [fieldErrors, setFieldErrors] = useState({ email: '', phoneNo: '' });

  const validateEmail = (val) => {
    if (!val) return '';
    return /^[^\s@]+@gmail\.com$/.test(val) ? '' : 'Email must be a valid @gmail.com address.';
  };

  const validatePhone = (val) => {
    if (!val) return '';
    if (!val.startsWith('09')) return 'Phone number must start with 09.';
    if (!/^\d{11}$/.test(val)) return 'Phone number must be exactly 11 digits.';
    return '';
  };

  const [motor, setMotor] = useState({
    plateNo: '',
    model: '',
    brand: '',
    color: '',
  });

  useEffect(() => {
    const getAllCourses = async () => {
      const data = await fetchData('/course/', {
        method: 'GET',
      });
      setCourses(data.courses);
    };

    getAllCourses();
  }, []);

  useEffect(() => {
    if (!formError) return;

    const timer = setTimeout(() => {
      setFormError(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [formError]);

  const handleProfilePic = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudent({ ...student, profileDetails: file });
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setStudent({ ...student, profileDetails: null });
    }
  };

  const fetchMotorDetails = async () => {
    if (!motor.brand || !motor.color || !motor.model) return;
    setShowGeneratedSection(true);
    const inputMotorData = {
      brand: motor.brand,
      model: motor.model,
      color: motor.color,
    };
    const motorData = await fetchData('/motor/image', {
      method: 'POST',
      data: inputMotorData,
    });
    setGeneratedMotorcycle(motorData);
  };

  const handleRegistration = async () => {
    const { profileDetails, ...requiredStudentFields } = student;
    const hasEmptyField =
      Object.values(requiredStudentFields).some((v) => !v) ||
      Object.values(motor).some((v) => !v);

    if (hasEmptyField) {
      setFormError('All fields must be filled');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
      return setFormError('Invalid email address');
    }

    if (!/^\d{11}$/.test(student.phoneNo)) {
      return setFormError('Phone number must be exactly 11 digits.');
    }

    const username =
      student.firstName && student.lastName
        ? student.firstName[0].toLowerCase() +
          student.lastName.toLowerCase() +
          Date.now()
        : '';

    const formData = new FormData();

    // Append student data
    Object.entries(student).forEach(([key, value]) => {
      if (key === 'profileDetails' && value) {
        formData.append('profileDetails', value);
      } else if (key !== 'profileDetails') {
        formData.append(key, value);
      }
    });

    formData.append('username', username);

    // Append motor data
    Object.entries(motor).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const res = await fetchData('super-admin/add-user/avatars', {
      method: 'POST',
      data: formData,
    });
    console.log(res);

    if (res) {
      return navigate('/users', { replace: true });
    }
    setFormError(res.error);
  };

  return (
    <div className='p-5 relative'>
      <header className='flex items-center justify-between'>
        <div>
          <Link to={'/users'} className='flex items-center text-blue-500 hover:opacity-80 cursor-pointer'>
            <ChevronLeft strokeWidth={1.5} size={18} />
            <span>Users</span>
          </Link>
          <h1 className={`text-3xl font-bold ${dark ? 'text-gray-100' : 'text-gray-700'}`}>Add Student</h1>
          <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Register student and their motor vehicle for campus parking</p>
        </div>
        <div className='text-sm text-gray-500'>Step 1 of 1</div>
      </header>
      {(formError || error) && (
        <div className='fixed bg-rose-500 text-sm text-white flex items-center justify-center py-4 px-2 top-2 left-1/2 -translate-x-1/2 rounded-md'>
          <span>{formError || error}</span>
        </div>
      )}
      <form className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left: form inputs */}
        <div className='lg:col-span-2 pt-5 space-y-6'>
          <section className='space-y-4'>
            <h2 className='text-lg font-medium'>Student Basic Information</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <DefaultInput
                label='First name'
                onChange={(e) =>
                  setStudent({
                    ...student,
                    firstName:
                      e.target.value.replace(/[^a-zA-Z\s]/g, '').charAt(0).toUpperCase() +
                      e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(1),
                  })
                }
                value={student.firstName}
                placeholder='Juan'
              />
              <DefaultInput
                label='Middle name'
                onChange={(e) =>
                  setStudent({
                    ...student,
                    middleName:
                      e.target.value.replace(/[^a-zA-Z\s]/g, '').charAt(0).toUpperCase() +
                      e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(1),
                  })
                }
                value={student.middleName}
                placeholder='Reyes'
              />

              <DefaultInput
                label='Last name'
                onChange={(e) =>
                  setStudent({
                    ...student,
                    lastName:
                      e.target.value.replace(/[^a-zA-Z\s]/g, '').charAt(0).toUpperCase() +
                      e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(1),
                  })
                }
                value={student.lastName}
                placeholder='Tamayo'
              />

              <DefaultInput
                label='Student ID'
                onChange={(e) =>
                  setStudent({
                    ...student,
                    studentNo:
                      e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1),
                  })
                }
                value={student.studentNo}
                placeholder='C2025-00001'
              />

              <DefaultOptions
                label='Course'
                onChange={(e) =>
                  setStudent({ ...student, course: e.target.value })
                }
                value={student.course}
                placeholder={'Select Course'}
                options={courses.map((c) => c.name)}
              />

              <DefaultOptions
                label='Year level'
                onChange={(e) =>
                  setStudent({ ...student, yearLevel: e.target.value })
                }
                placeholder={'Select Year Level'}
                value={student.yearLevel}
                options={['1st', '2nd', '3rd', '4th']}
              />

              <div className='flex flex-col gap-1'>
                <DefaultInput
                  label='Email'
                  onChange={(e) => {
                    setStudent({ ...student, email: e.target.value });
                    setFieldErrors((p) => ({ ...p, email: validateEmail(e.target.value) }));
                  }}
                  value={student.email}
                  placeholder='example@gmail.com'
                />
                {fieldErrors.email && <p className='text-xs text-red-500'>{fieldErrors.email}</p>}
              </div>

              <div className='flex flex-col gap-1'>
                <DefaultInput
                  label='Phone No.'
                  onChange={(e) => {
                    setStudent({ ...student, phoneNo: e.target.value });
                    setFieldErrors((p) => ({ ...p, phoneNo: validatePhone(e.target.value) }));
                  }}
                  value={student.phoneNo}
                  placeholder='09XX XXX XXXX'
                />
                {fieldErrors.phoneNo && <p className='text-xs text-red-500'>{fieldErrors.phoneNo}</p>}
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <label className='flex-1'>
                <div className='text-sm text-gray-700 mb-2'>
                  Student photo (optional)
                </div>
                <div className='flex items-center gap-3'>
                  <div className='h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center relative text-gray-400'>
                    {preview ? (
                      <img
                        src={preview}
                        alt=''
                        className='h-full w-full rounded-md object-cover'
                      />
                    ) : (
                      <span>Preview</span>
                    )}
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleProfilePic}
                      className='h-full w-full absolute opacity-0'
                    />
                  </div>
                </div>
                <p className='text-xs text-gray-400 mt-2'>
                  Recommended: 300x300px, JPG/PNG
                </p>
              </label>
            </div>
            <div className='flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-500'>
              <Info strokeWidth={1.5} size={18} />
              <div className='text-xs '>
                Student will receive a welcome email with their username.
                Generated password can be viewed in the received email.
              </div>
            </div>
          </section>

          <section className={`space-y-4 pt-4 border-t ${border}`}>
            <h2 className={`text-lg font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>Motor / Vehicle Details</h2>
            {/* AI Motor Image Generates Section */}
            {showGeneratedSection && (
              <>
                {!loading ? (
                  <div className='flex flex-col gap-2 w-full'>
                    <div className='flex gap-2 items-center'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        x='0px'
                        y='0px'
                        width='100'
                        height='100'
                        viewBox='0 0 50 50'
                        fill='currentColor'
                        className='size-5 text-blue-500'
                      >
                        <path d='M22.462 11.035l2.88 7.097c1.204 2.968 3.558 5.322 6.526 6.526l7.097 2.88c1.312.533 1.312 2.391 0 2.923l-7.097 2.88c-2.968 1.204-5.322 3.558-6.526 6.526l-2.88 7.097c-.533 1.312-2.391 1.312-2.923 0l-2.88-7.097c-1.204-2.968-3.558-5.322-6.526-6.526l-7.097-2.88c-1.312-.533-1.312-2.391 0-2.923l7.097-2.88c2.968-1.204 5.322-3.558 6.526-6.526l2.88-7.097C20.071 9.723 21.929 9.723 22.462 11.035zM39.945 2.701l.842 2.428c.664 1.915 2.169 3.42 4.084 4.084l2.428.842c.896.311.896 1.578 0 1.889l-2.428.842c-1.915.664-3.42 2.169-4.084 4.084l-.842 2.428c-.311.896-1.578.896-1.889 0l-.842-2.428c-.664-1.915-2.169-3.42-4.084-4.084l-2.428-.842c-.896-.311-.896-1.578 0-1.889l2.428-.842c1.915-.664 3.42-2.169 4.084-4.084l.842-2.428C38.366 1.805 39.634 1.805 39.945 2.701z'></path>
                      </svg>
                      <h1 className='text-gray-700 font-semibold'>
                        Image fetched from external website •{' '}
                        {generatedMotorcycle.corrected?.search_query}
                      </h1>
                    </div>
                    <div className='flex gap-5 h-50'>
                      <img
                        src={generatedMotorcycle.imageUrl}
                        alt={generatedMotorcycle.imageUrl}
                        className='h-auto w-64 object-contain rounded-xl'
                      />
                      <div className='flex flex-col h-full justify-between flex-1'>
                        <div className='truncate'>
                          <p className='text-gray-700 indent-7 text-wrap line-clamp-6'>
                            {generatedMotorcycle.corrected?.information}
                          </p>
                        </div>
                        <div className='w-full'>
                          <a
                            target='_blank'
                            href={`${generatedMotorcycle.imageUrl}`}
                            className='flex items-center gap-2 text-blue-500 text-xs italic'
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className='size-4'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418'
                              />
                            </svg>
                            <span className='truncate block w-full max-w-96'>
                              {generatedMotorcycle.imageUrl}
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Skeleton Loader
                  <div className='flex flex-col gap-2 w-full'>
                    <div className='flex gap-2 items-center'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        x='0px'
                        y='0px'
                        width='100'
                        height='100'
                        viewBox='0 0 50 50'
                        fill='currentColor'
                        className='size-5 text-blue-500 animate-pulse'
                      >
                        <path d='M22.462 11.035l2.88 7.097c1.204 2.968 3.558 5.322 6.526 6.526l7.097 2.88c1.312.533 1.312 2.391 0 2.923l-7.097 2.88c-2.968 1.204-5.322 3.558-6.526 6.526l-2.88 7.097c-.533 1.312-2.391 1.312-2.923 0l-2.88-7.097c-1.204-2.968-3.558-5.322-6.526-6.526l-7.097-2.88c-1.312-.533-1.312-2.391 0-2.923l7.097-2.88c2.968-1.204 5.322-3.558 6.526-6.526l2.88-7.097C20.071 9.723 21.929 9.723 22.462 11.035zM39.945 2.701l.842 2.428c.664 1.915 2.169 3.42 4.084 4.084l2.428.842c.896.311.896 1.578 0 1.889l-2.428.842c-1.915.664-3.42 2.169-4.084 4.084l-.842 2.428c-.311.896-1.578.896-1.889 0l-.842-2.428c-.664-1.915-2.169-3.42-4.084-4.084l-2.428-.842c-.896-.311-.896-1.578 0-1.889l2.428-.842c1.915-.664 3.42-2.169 4.084-4.084l.842-2.428C38.366 1.805 39.634 1.805 39.945 2.701z'></path>
                      </svg>
                      <span className='text-gray-400 animate-pulse font-semibold'>
                        AI is searching...
                      </span>
                    </div>

                    <div className='flex gap-5 h-50'>
                      <span className='h-full w-64 animate-pulse rounded-xl bg-gray-100'></span>
                      <div className='flex flex-col h-full justify-between flex-1'>
                        <div className='flex flex-col'>
                          <span className='animate-pulse bg-gray-100 h-5 w-full rounded-md mb-2'></span>
                          <span className='animate-pulse bg-gray-100 h-5 w-5/6 rounded-md mb-2'></span>
                          <span className='animate-pulse bg-gray-100 h-5 w-4/6 rounded-md mb-2'></span>
                          <span className='animate-pulse bg-gray-100 h-5 w-3/6 rounded-md mb-2'></span>
                        </div>
                        <span className='animate-pulse bg-gray-100 h-5 w-5/6 rounded-md mb-2'></span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <DefaultInput
                label='Plate No.'
                onChange={(e) =>
                  setMotor({ ...motor, plateNo: e.target.value.toUpperCase() })
                }
                value={motor.plateNo}
                placeholder='ABC 1234'
              />

              <DefaultInput
                label='Brand'
                onChange={(e) => {
                  const v = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  setMotor({ ...motor, brand: v.charAt(0).toUpperCase() + v.slice(1) });
                }}
                value={motor.brand}
                placeholder='Honda'
              />
              <DefaultInput
                label='Model'
                onChange={(e) =>
                  setMotor({
                    ...motor,
                    model:
                      e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1),
                  })
                }
                value={motor.model}
                placeholder='Wave 125'
              />
              <DefaultInput
                label='Color'
                onChange={(e) => {
                  const v = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  setMotor({ ...motor, color: v.charAt(0).toUpperCase() + v.slice(1) });
                }}
                value={motor.color}
                placeholder='Black'
              />
              <button
                disabled={!(motor.brand && motor.color && motor.model)}
                onClick={fetchMotorDetails}
                type='button'
                className={`py-2 rounded-md ${
                  motor.brand && motor.color && motor.model
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                Search Motorcycle
              </button>
            </div>
          </section>
        </div>

        <aside className={`rounded-xl shadow-sm border p-6 flex flex-col gap-4 self-start ${dark ? 'bg-[#2f2f2f] border-[#3a3a3a]' : 'bg-white border-gray-200'}`}>
          <div className='space-y-2'>
            <h3 className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>Summary</h3>
            <div className='text-xs text-gray-500'>Review details before saving</div>
            <div className={`mt-3 rounded-md p-3 text-sm space-y-2 ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-100'}`}>
              <div><span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Name:</span> {student.firstName || '—'} {student.lastName || ''}</div>
              <div><span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Username:</span> {student.firstName && student.lastName ? student.firstName[0].toLowerCase() + student.lastName.toLowerCase() + Date.now() : ''}</div>
              <div><span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Student ID:</span> {student.studentNo || '—'}</div>
              <div><span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Course:</span> {student.course || '—'}</div>
              <div><span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Year level:</span> {student.yearLevel || '—'}</div>
              <div><span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Plate:</span> {motor.plateNo || '—'}</div>
            </div>
          </div>

          <div className='mt-auto space-y-3'>
            <button
              disabled={loading || formError}
              onClick={handleRegistration}
              type='button'
              className={`${loading || formError ? 'bg-gray-200 text-gray-400 hover:bg-gray-100 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-500 text-white'} w-full text-white py-2 rounded-lg text-sm`}
            >
              {loading ? 'Processing...' : 'Register'}
            </button>
            <button
              onClick={() => navigate('/users')}
              type='button'
              disabled={loading}
              className='w-full border-2 text-gray-400 border-gray-200 rounded-lg py-2 text-sm hover:bg-gray-50'
            >
              Back
            </button>
            <p className='text-xs text-gray-400'>
              After saving, the system will generate a QR code for the motor and
              link it to the student account.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
