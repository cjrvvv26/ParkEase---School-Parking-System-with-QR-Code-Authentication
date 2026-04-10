import React, { useState, useEffect } from 'react';
import DefaultInput from '../components/forms/DefaultInput';
import useFetch from '../hooks/useFetch';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Info } from 'lucide-react';
import useDark from '../hooks/useDark';

export default function AddFaculty() {
  const navigate = useNavigate();
  const [generatedMotorcycle, setGeneratedMotorcycle] = useState({});
  const [showGeneratedSection, setShowGeneratedSection] = useState(false);
  const [preview, setPreview] = useState(null);
  const { error, setError, loading, fetchData } = useFetch();
  const { dark, border } = useDark();
  const [faculty, setFaculty] = useState({
    profileDetails: null,
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    role: 'faculty',
  });

  const [motor, setMotor] = useState({
    plateNo: '',
    model: '',
    brand: '',
    color: '',
  });

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleProfileDetails = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaculty({ ...faculty, profileDetails: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFaculty({ ...faculty, profileDetails: null });
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

  const handleRegistration = async (e) => {
    e.preventDefault();
    const hasEmptyValue = Object.values({ ...faculty, ...motor }).some(
      (f) => !f,
    );

    if (hasEmptyValue) {
      return setError('All fields must be filled.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(faculty.email)) {
      return setError('Invalid email format. Please try again!');
    }

    if (!/^\d{11}$/.test(faculty.phoneNo)) {
      return setError('Phone number must be exactly 11 digits.');
    }

    const formData = new FormData();

    const username =
      faculty.firstName && faculty.lastName
        ? faculty.firstName[0].toLowerCase() +
          faculty.lastName.toLowerCase() +
          Date.now()
        : '';

    formData.append('username', username);

    Object.entries({ ...faculty, ...motor }).forEach(([key, value]) => {
      if (key === 'profileDetails' && value) {
        formData.append('profileDetails', value);
      } else if (key !== 'profileDetails') {
        formData.append(key, value);
      }
    });

    const res = await fetchData('/super-admin/add-user/avatars', {
      method: 'POST',
      data: formData,
    });

    if (res) {
      return navigate('/users', { replace: true });
    }

    setError(res.error);
  };

  return (
    <div className='p-5'>
      <header className='flex items-center justify-between'>
        <div>
          <Link to={'/users'} className='flex items-center text-blue-500 hover:opacity-80 cursor-pointer'>
            <ChevronLeft strokeWidth={1.5} size={18} />
            <span>Users</span>
          </Link>
          <h1 className={`text-3xl font-bold ${dark ? 'text-gray-100' : 'text-gray-700'}`}>Add Faculty</h1>
          <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Register Faculty Staff and their motor vehicle for campus parking</p>
        </div>
        <div className='text-sm text-gray-500'>Step 1 of 1</div>
      </header>

      {error && (
        <div className='fixed bg-rose-500 text-sm text-white flex items-center justify-center py-4 px-2 top-2 left-1/2 -translate-x-1/2 rounded-md'>
          <span>{error}</span>
        </div>
      )}
      <form
        onSubmit={handleRegistration}
        className='grid grid-cols-1 lg:grid-cols-3 gap-6'
      >
        {/* Left: form inputs */}
        <div className='lg:col-span-2 pt-5 space-y-6'>
          {/* faculty Basic Information */}
          <section className='space-y-4'>
            <h2 className='text-lg font-medium'>
              Faculty Staff Basic Information
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <DefaultInput
                label='First name'
                onChange={(e) =>
                  setFaculty({ ...faculty, firstName: e.target.value })
                }
                value={
                  faculty.firstName.charAt(0).toUpperCase() +
                  faculty.firstName.slice(1)
                }
                placeholder='Juan'
              />
              <DefaultInput
                label='Middle name'
                onChange={(e) =>
                  setFaculty({ ...faculty, middleName: e.target.value })
                }
                value={
                  faculty.middleName.charAt(0).toUpperCase() +
                  faculty.middleName.slice(1)
                }
                placeholder='Reyes'
              />

              <DefaultInput
                label='Last name'
                onChange={(e) =>
                  setFaculty({ ...faculty, lastName: e.target.value })
                }
                value={
                  faculty.lastName.charAt(0).toUpperCase() +
                  faculty.lastName.slice(1)
                }
                placeholder='Tamayo'
              />

              <DefaultInput
                label='Phone No.'
                onChange={(e) =>
                  setFaculty({ ...faculty, phoneNo: e.target.value })
                }
                value={faculty.phoneNo}
                placeholder='0912 345 6789'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <DefaultInput
                label='Email'
                onChange={(e) =>
                  setFaculty({ ...faculty, email: e.target.value })
                }
                value={faculty.email.toLowerCase()}
                placeholder='example@gmail.com'
              />
            </div>
            <div className='flex items-center gap-4'>
              <label className='flex-1'>
                <div className='text-sm text-gray-700 mb-2'>
                  Faculty Staff photo (optional)
                </div>
                <div className='flex items-center gap-3'>
                  <div className='h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 overflow-hidden'>
                    <img
                      src={preview}
                      alt=''
                      className='h-full w-full  object-cover'
                    />
                  </div>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleProfileDetails}
                    className='text-sm'
                  />
                </div>
                <p className='text-xs text-gray-400 mt-2'>
                  Recommended: 300x300px, JPG/PNG
                </p>
              </label>
            </div>
            <div className='flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-500'>
              <Info strokeWidth={1.5} size={18} />
              <div className='text-xs '>
                Faculty will receive a welcome email with their username.
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
                  setMotor({ ...motor, plateNo: e.target.value })
                }
                value={motor.plateNo.toUpperCase()}
                placeholder='ABC 1234'
              />

              <DefaultInput
                label='Brand'
                onChange={(e) => setMotor({ ...motor, brand: e.target.value })}
                value={
                  motor.brand.charAt(0).toUpperCase() + motor.brand.slice(1)
                }
                placeholder='Honda'
              />
              <DefaultInput
                label='Model'
                onChange={(e) => setMotor({ ...motor, model: e.target.value })}
                value={
                  motor.model.charAt(0).toUpperCase() + motor.model.slice(1)
                }
                placeholder='Wave 125'
              />
              <DefaultInput
                label='Color'
                onChange={(e) => setMotor({ ...motor, color: e.target.value })}
                value={
                  motor.color.charAt(0).toUpperCase() + motor.color.slice(1)
                }
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
              <div><span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Name:</span> {faculty.firstName || '—'} {faculty.lastName || ''}</div>
              <div><span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Username:</span> {faculty.firstName && faculty.lastName ? faculty.firstName[0].toLowerCase() + faculty.lastName.toLowerCase() + Date.now() : ''}</div>
              <div><span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Email:</span> {faculty.email || '—'}</div>
              <div><span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>phoneNo:</span> {faculty.phoneNo || '—'}</div>
              <div><span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>plateNo:</span> {motor.plateNo || '—'}</div>
            </div>
          </div>

          <div className='mt-auto flex flex-col space-y-3'>
            <input
              type='submit'
              disabled={loading}
              className='w-full cursor-pointer bg-blue-500 hover:bg-blue-400 text-white py-2 rounded-lg text-sm'
              value={loading ? 'Processing...' : 'Register'}
            />
            <Link
              to={'/users'}
              disabled={loading}
              className='w-full text-center border-2 border-gray-200 rounded-lg py-2 text-sm text-gray-400 hover:bg-gray-50'
            >
              Back
            </Link>
            <p className='text-xs text-gray-400'>
              After saving, the system will generate a QR code for the motor and
              link it to the faculty account.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
