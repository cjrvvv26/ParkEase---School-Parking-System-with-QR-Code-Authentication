import {
  ChevronLeft,
  CircleUserRound,
  EyeIcon,
  PencilIcon,
} from 'lucide-react';
import DefaultInput from '../components/forms/DefaultInput';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import DefaultOptions from '../components/forms/DefaultOptions';
import { Link, useParams } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function UserAccount() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, fetchData } = useFetch();
  const [userLoad, setUserLoad] = useState(false);
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [originalUser, setOriginalUser] = useState(null);
  const [onlyRead, setOnlyRead] = useState(true);
  const [generatedMotorcycle, setGeneratedMotorcycle] = useState({});
  const [showGeneratedSection, setShowGeneratedSection] = useState(false);
  const [preview, setPreview] = useState(null);
  const [profile, setProfile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    // Validate name fields
    if (!user.name?.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!user.name?.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (
      (user.role === 'student' || user.role === 'faculty') &&
      !user.name?.middleName?.trim()
    ) {
      errors.middleName = 'Middle name is required';
    }

    // Validate phone number
    if (!user.phoneNo?.trim()) {
      errors.phoneNo = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(user.phoneNo.replace(/\D/g, ''))) {
      errors.phoneNo = 'Phone number must be at least 10 digits';
    }

    if (!user.status) {
      errors.status = 'Status is required';
    }

    // Validate student-specific fields
    if (user.role === 'student' || user.role === 'faculty') {
      if (user.role === 'student') {
        if (!user.course) {
          errors.course = 'Course is required';
        }
        if (!user.yearLevel) {
          errors.yearLevel = 'Year level is required';
        }
      }

      // Validate motorcycle details
      if (!user.motorDetails?.plateNo?.trim()) {
        errors.plateNo = 'Plate number is required';
      } else if (!/^[A-Z0-9\s]{3,}$/.test(user.motorDetails.plateNo)) {
        errors.plateNo = 'Invalid plate number format';
      }

      if (!user.motorDetails?.brand?.trim()) {
        errors.brand = 'Motorcycle brand is required';
      }
      if (!user.motorDetails?.model?.trim()) {
        errors.model = 'Motorcycle model is required';
      }
      if (!user.motorDetails?.color?.trim()) {
        errors.color = 'Motorcycle color is required';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const ErrorMessage = ({ field }) => {
    if (!validationErrors[field]) return null;
    return (
      <p className='text-red-500 text-xs mt-1'>{validationErrors[field]}</p>
    );
  };

  const getUserInformation = async () => {
    try {
      setUserLoad(true);
      const res = await axios.get(`user/${id}`);

      if (res) {
        setUser(res.data.user);
        setOriginalUser(res.data.user);
      }
      console.log(res.data);
    } catch (error) {
      console.log(error.response.data);
    } finally {
      setUserLoad(false);
    }
  };

  const getAllCourses = async () => {
    const data = await fetchData('/course/', {
      method: 'GET',
    });

    if (data.message === 'Success') {
      return setCourses(data.courses);
    }
  };

  useEffect(() => {
    getAllCourses();
    getUserInformation();
  }, []);

  const fetchMotorDetails = async () => {
    if (
      !user?.motorDetails?.brand ||
      !user?.motorDetails?.color ||
      !user?.motorDetails?.model
    )
      return;
    setShowGeneratedSection(true);
    const inputMotorData = {
      brand: user?.motorDetails?.brand,
      model: user?.motorDetails?.model,
      color: user?.motorDetails?.color,
    };
    const motorData = await fetchData('/motor/image', {
      method: 'POST',
      data: inputMotorData,
    });
    setGeneratedMotorcycle(motorData);
  };

  const handleProfile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(file);
        setPreview(reader.result);
      };
      return reader.readAsDataURL(file);
    }
    setProfile(null);
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();

      const userData = {
        role: user.role,
        name: user.name,
        phoneNo: user.phoneNo,
        status: user.status,
        ...((user.role === 'student' || user.role === 'faculty') && {
          motorDetails: user.motorDetails,
        }),
        ...(user.role === 'student' && {
          course: user.course,
          yearLevel: user.yearLevel,
          payment: user.payment,
        }),
        ...(user.role === 'guard' && {
          permissions: user.permissions,
        }),
      };

      formData.append('user', JSON.stringify(userData));

      if (profile) {
        formData.append('profileDetails', profile);
      }

      formData.append(
        'existingProfileDetails',
        JSON.stringify(user.profileDetails),
      );
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await fetchData(`user/${user._id}`, {
        method: 'PATCH',
        data: formData,
      });
      console.log(res);

      if (res) {
        alert('User information updated successfully!');
        navigate('/users');
      }
    } catch (error) {
      alert(error);
    }
  };

  if (userLoad) {
    return (
      <div className='items-center justify-center h-full w-full'>
        <span className='border-t-2 border-t-violet-500 animate-spin h-12 w-12 rounded-full'></span>
      </div>
    );
  }

  return (
    <>
      {/* Header Page */}
      <header className='flex justify-between px-5 pt-5 items-center'>
        <div className='flex flex-col'>
          <Link
            to={'/users'}
            className='flex items-center text-violet-500 hover:opacity-80 cursor-pointer'
          >
            <ChevronLeft strokeWidth={1.5} size={18} />
            <span>Users</span>
          </Link>
          <h1 className='font-bold text-3xl'>User Account Details</h1>
          <p className='text-gray-400'>Manage and view user account</p>
        </div>
        <button
          onClick={() => {
            if (onlyRead) {
              return setOnlyRead(false);
            }
            setOnlyRead(true);
            setPreview(null);
            setValidationErrors({});
            setProfile(null);
            setUser(originalUser);
          }}
          className='flex gap-1 items-center text-gray-400 hover:text-violet-500'
        >
          {onlyRead ? (
            <>
              <PencilIcon strokeWidth={1.5} className='size-4' /> Edit
            </>
          ) : (
            <>
              <EyeIcon strokeWidth={1.5} className='size-4' /> View
            </>
          )}
        </button>
      </header>

      {user && (
        <form className='flex flex-col gap-6 px-5'>
          {/* Personal Information */}
          <section className='flex flex-col w-full gap-3 border-b border-gray-200 pb-5'>
            <h1 className='text-gray-700 font-medium text-base'>
              Personal Information
            </h1>
            <div className='flex gap-5 w-full'>
              <div className='flex flex-col gap-3'>
                <div className='relative'>
                  {onlyRead ? (
                    user.profileDetails?.url ? (
                      <img
                        src={user.profileDetails?.url}
                        alt='Profile'
                        className='w-40 h-40 rounded-full border-4 border-violet-500 object-cover'
                      />
                    ) : (
                      <CircleUserRound
                        className='text-gray-400'
                        strokeWidth={1}
                        size={160}
                      />
                    )
                  ) : user.profileDetails?.url ? (
                    <img
                      src={preview || user.profileDetails?.url}
                      alt='Profile'
                      className='w-40 h-40 rounded-full border-4 border-violet-500 object-cover'
                    />
                  ) : (
                    <CircleUserRound
                      className='text-gray-400'
                      strokeWidth={1}
                      size={160}
                    />
                  )}
                  <span
                    className={`${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'} h-3 w-3 rounded-full absolute z-10 bottom-0 right-0`}
                  ></span>
                </div>
                {!onlyRead && (
                  <button className='rounded-md relative text-white hover:bg-violet-400 bg-violet-500 duration-100 py-2 w-full'>
                    <input
                      type='file'
                      name=''
                      accept='image/*'
                      id=''
                      onChange={handleProfile}
                      className='absolute opacity-0 h-full w-full'
                    />
                    Change Photo
                  </button>
                )}
              </div>
              <div className='flex flex-col gap-4 w-[70%]'>
                <div className='grid grid-cols-3 gap-5'>
                  <div>
                    <DefaultInput
                      label={'First Name'}
                      value={user.name.firstName}
                      onlyRead={onlyRead}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          name: { ...user.name, firstName: e.target.value },
                        })
                      }
                    />
                    <ErrorMessage field='firstName' />
                  </div>
                  {(user.role === 'student' || user.role === 'faculty') && (
                    <div>
                      <DefaultInput
                        label={'Middle Name'}
                        value={user.name?.middleName}
                        onlyRead={onlyRead}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            name: { ...user.name, middleName: e.target.value },
                          })
                        }
                      />
                      <ErrorMessage field='middleName' />
                    </div>
                  )}
                  <div>
                    <DefaultInput
                      label={'Last Name'}
                      value={user.name.lastName}
                      onlyRead={onlyRead}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          name: { ...user.name, lastName: e.target.value },
                        })
                      }
                    />
                    <ErrorMessage field='lastName' />
                  </div>
                  {user.role === 'guard' && (
                    <div>
                      <DefaultInput
                        label={'Phone No.'}
                        value={user.phoneNo}
                        onlyRead={onlyRead}
                        type='number'
                        onChange={(e) =>
                          setUser({
                            ...user,
                            phoneNo: e.target.value,
                          })
                        }
                      />
                      <ErrorMessage field='phoneNo' />
                    </div>
                  )}
                </div>
                <div className='grid grid-cols-3 gap-5'>
                  {user.role === 'student' && (
                    <div>
                      <DefaultInput
                        label={'Phone No.'}
                        value={user.phoneNo}
                        onlyRead={onlyRead}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            phoneNo: e.target.value,
                          })
                        }
                      />
                      <ErrorMessage field='phoneNo' />
                    </div>
                  )}
                  <DefaultInput
                    label={'Email'}
                    value={user.email}
                    onlyRead={true}
                  />
                  {user.role === 'faculty' &&
                    (onlyRead ? (
                      <DefaultInput
                        label={'Status'}
                        value={
                          user?.status.charAt(0).toUpperCase() +
                          user?.status.slice(1)
                        }
                        onlyRead={true}
                      />
                    ) : (
                      <div>
                        <DefaultOptions
                          label={'Status'}
                          value={
                            user?.status.charAt(0).toUpperCase() +
                            user?.status.slice(1)
                          }
                          placeholder={'Update Status'}
                          options={['Active', 'Deactivate']}
                          onChange={(e) =>
                            setUser({
                              ...user,
                              status: e.target.value.toLowerCase(),
                            })
                          }
                        />
                        <ErrorMessage field='status' />
                      </div>
                    ))}
                  {user.role === 'student' && (
                    <DefaultInput
                      label={'Student No'}
                      value={user?.studentNo}
                      onlyRead={true}
                    />
                  )}
                  {user.role === 'guard' &&
                    (onlyRead ? (
                      <DefaultInput
                        label={'Status'}
                        value={
                          user?.status.charAt(0).toUpperCase() +
                          user?.status.slice(1)
                        }
                        onlyRead={true}
                      />
                    ) : (
                      <DefaultOptions
                        label={'Status'}
                        value={
                          user?.status.charAt(0).toUpperCase() +
                          user?.status.slice(1)
                        }
                        placeholder={'Update Status'}
                        options={['Active', 'Deactivate']}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            status: e.target.value.toLowerCase(),
                          })
                        }
                      />
                    ))}
                </div>
                <div className='grid grid-cols-3 gap-5'>
                  {onlyRead ? (
                    <>
                      {user.role === 'student' && (
                        <>
                          <DefaultInput
                            label={'Course'}
                            value={user?.course?.name}
                            onlyRead={true}
                          />
                          <DefaultInput
                            label={'Year Level'}
                            value={user?.yearLevel}
                            onlyRead={true}
                          />
                        </>
                      )}
                      {user.role === 'student' && (
                        <DefaultInput
                          label={'Status'}
                          value={
                            user?.status.charAt(0).toUpperCase() +
                            user?.status.slice(1)
                          }
                          onlyRead={true}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      {user.role === 'student' && (
                        <>
                          <div>
                            <DefaultOptions
                              label={'Course'}
                              value={user?.course?.name}
                              placeholder={'Select Course'}
                              options={courses.map((c) => c.name)}
                              onChange={(e) => {
                                const selectedCourse = courses.find(
                                  (c) => c.name === e.target.value,
                                );
                                setUser({
                                  ...user,
                                  course: selectedCourse,
                                });
                              }}
                            />
                            <ErrorMessage field='course' />
                          </div>
                          <div>
                            <DefaultOptions
                              label={'Year Level'}
                              value={user?.yearLevel}
                              placeholder={'Select Year Level'}
                              options={['1st', '2nd', '3rd', '4th']}
                              onChange={(e) =>
                                setUser({
                                  ...user,
                                  yearLevel: e.target.value,
                                })
                              }
                            />
                            <ErrorMessage field='yearLevel' />
                          </div>
                        </>
                      )}
                      {user.role === 'student' && (
                        <div>
                          <DefaultOptions
                            label={'Status'}
                            value={
                              user?.status.charAt(0).toUpperCase() +
                              user?.status.slice(1)
                            }
                            placeholder={'Update Status'}
                            options={['Active', 'Deactivate']}
                            onChange={(e) =>
                              setUser({
                                ...user,
                                status: e.target.value.toLowerCase(),
                              })
                            }
                          />
                          <ErrorMessage field='status' />
                        </div>
                      )}
                    </>
                  )}
                </div>
                {user.role === 'student' && (
                  <div className='grid grid-cols-3 gap-5'>
                    {onlyRead ? (
                      <DefaultInput
                        label={'Payment Status'}
                        value={user.payment.isPaid ? 'Paid Already' : 'Not Yet'}
                        onlyRead={true}
                      />
                    ) : (
                      <DefaultOptions
                        label={'Payment Status'}
                        value={user.payment.isPaid ? 'Paid Already' : 'Not Yet'}
                        placeholder={'Update Status'}
                        options={['Paid Already', 'Not Yet']}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            payment: {
                              ...user.payment,
                              isPaid:
                                e.target.value === 'Paid Already'
                                  ? true
                                  : false,
                            },
                          })
                        }
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
          {user.role !== 'guard' ? (
            <section className='flex flex-col w-full gap-3 border-b border-gray-200 pb-10'>
              <h1 className='text-gray-700 font-medium text-base'>
                Motorcycle Information
              </h1>
              {/* AI Motor Image Generates Section */}
              {showGeneratedSection && (
                <>
                  {!loading ? (
                    <div className='flex flex-col w-[60%] gap-2 '>
                      <div className='flex gap-2 items-center'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          x='0px'
                          y='0px'
                          width='100'
                          height='100'
                          viewBox='0 0 50 50'
                          fill='currentColor'
                          className='size-5 text-violet-500'
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
                    <div className='flex flex-col gap-2 w-[60%]'>
                      <div className='flex gap-2 items-center'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          x='0px'
                          y='0px'
                          width='100'
                          height='100'
                          viewBox='0 0 50 50'
                          fill='currentColor'
                          className='size-5 text-violet-500 animate-pulse'
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
              <div className='flex gap-5 w-full'>
                <div className='flex flex-col gap-4 w-[70%]'>
                  <div className='grid grid-cols-3 gap-5'>
                    <div>
                      <DefaultInput
                        label={'Plate number'}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            motorDetails: {
                              ...user.motorDetails,
                              plateNo: e.target.value.toUpperCase(),
                            },
                          })
                        }
                        value={user?.motorDetails?.plateNo}
                        placeholder={'ABC 123'}
                        onlyRead={onlyRead}
                      />
                      <ErrorMessage field='plateNo' />
                    </div>
                    <div>
                      <DefaultInput
                        label={'Brand'}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            motorDetails: {
                              ...user.motorDetails,
                              brand:
                                e.target.value.charAt(0).toUpperCase() +
                                e.target.value.slice(1),
                            },
                          })
                        }
                        value={user?.motorDetails?.brand}
                        onlyRead={onlyRead}
                        placeholder='Honda'
                      />
                      <ErrorMessage field='brand' />
                    </div>
                  </div>
                  <div className='grid grid-cols-3 gap-5'>
                    <div>
                      <DefaultInput
                        label={'Model'}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            motorDetails: {
                              ...user.motorDetails,
                              model:
                                e.target.value.charAt(0).toUpperCase() +
                                e.target.value.slice(1),
                            },
                          })
                        }
                        value={user?.motorDetails?.model}
                        onlyRead={onlyRead}
                        placeholder='Wave 125'
                      />
                      <ErrorMessage field='model' />
                    </div>
                    <div>
                      <DefaultInput
                        label={'Color'}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            motorDetails: {
                              ...user.motorDetails,
                              color:
                                e.target.value.charAt(0).toUpperCase() +
                                e.target.value.slice(1),
                            },
                          })
                        }
                        value={user?.motorDetails?.color}
                        onlyRead={onlyRead}
                        placeholder='Black'
                      />
                      <ErrorMessage field='color' />
                    </div>
                  </div>
                  <button
                    disabled={
                      user?.motorDetails?.brand &&
                      user?.motorDetails?.color &&
                      user?.motorDetails?.model
                    }
                    onClick={fetchMotorDetails}
                    type='button'
                    className={`py-2 w-[calc(35%-25px)] mt-2 rounded-md ${
                      user?.motorDetails?.brand &&
                      user?.motorDetails?.color &&
                      user?.motorDetails?.model
                        ? 'bg-violet-500 text-white hover:bg-violet-600'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    Search Motorcycle
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <section className='flex flex-col w-full gap-3 border-b border-gray-200 pb-10'>
              <h1 className='text-gray-700 font-medium text-base'>
                Permissions
              </h1>
              <div className='space-y-2'>
                <label className='flex items-center gap-3'>
                  {!onlyRead ? (
                    <>
                      <input
                        type='checkbox'
                        onChange={(e) =>
                          setUser({
                            ...user,
                            permissions: {
                              ...user.permissions,
                              canScan: e.target.checked,
                            },
                          })
                        }
                        defaultChecked
                        checked={user.permissions.canScan}
                        className='rounded'
                      />
                      <span className='text-sm text-gray-700'>
                        Can scan & verify QR codes (entry/exit)
                      </span>
                    </>
                  ) : (
                    <p>
                      {user.permissions.canScan
                        ? 'Can scan & verify QR codes (entry/exit).'
                        : 'Not allowed to scan & verify QR codes (entry/exit).'}
                    </p>
                  )}
                </label>
                <label className='flex items-center gap-3'>
                  {!onlyRead ? (
                    <>
                      <input
                        type='checkbox'
                        className='rounded'
                        onChange={(e) =>
                          setUser({
                            ...user,
                            permissions: {
                              ...user.permissions,
                              canViewAnalytics: e.target.checked,
                            },
                          })
                        }
                        checked={user.permissions.canViewAnalytics}
                      />
                      <span className='text-sm text-gray-700'>
                        Can view parking analytics & reports
                      </span>
                    </>
                  ) : (
                    <p>
                      {user.permissions.canViewAnalytics
                        ? 'Can view parking analytics & reports.'
                        : 'Not allowed to view parking analytics & reports.'}
                    </p>
                  )}
                </label>
              </div>
            </section>
          )}
          {!onlyRead && (
            <div className='flex items-center py-5 gap-5'>
              <button
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();

                  setPreview(null);
                  setProfile(null);
                  setOnlyRead(true);
                  setValidationErrors({});
                  setUser(originalUser);
                }}
                className='ring ring-gray-400 hover:opacity-80 text-gray-400 rounded-md py-2 px-5'
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleUpdateInfo}
                className={`${loading && 'cursor-not-allowed'} bg-violet-500 hover:opacity-80 text-white rounded-md py-2 px-5`}
              >
                {loading ? '...Updating' : 'Save'}
              </button>
            </div>
          )}
        </form>
      )}
    </>
  );
}
