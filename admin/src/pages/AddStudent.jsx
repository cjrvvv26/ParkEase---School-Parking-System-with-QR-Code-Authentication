import React, { useState } from "react";
import DefaultInput from "../components/forms/DefaultInput";
import DefaultOptions from "../components/forms/DefaultOptions";
import axios from "../utils/axiosConfig";
import useFetch from "../hooks/useFetch";

export default function AddStudent() {
  const [checkMotorycleBtn, toggleCheckMotorcycleBtn] = useState(true);
  const [generatedMotorcycle, setGeneratedMotorcycle] = useState({});
  const [showGeneratedSection, setShowGeneratedSection] = useState(false);
  const [preview, setPreview] = useState(null);
  const { error, loading, fetchData } = useFetch();
  const [student, setStudent] = useState({
    profileDetails: null,
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    studentNo: "",
    course: "",
    yearLevel: "",
    email: "",
    phoneNo: "",
    role: "student",
  });

  const [motor, setMotor] = useState({
    plate: "",
    type: "",
    brand: "",
    color: "",
  });

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
    if (!motor.brand || !motor.color || !motor.type) return;
    setShowGeneratedSection(true);
    const inputMotorData = {
      brand: motor.brand,
      model: motor.type,
      color: motor.color,
    };
    const motorData = await fetchData("/motor/image", {
      method: "POST",
      data: inputMotorData,
    });
    setGeneratedMotorcycle(motorData);
  };

  const handleRegistration = async () => {
    setStudent({
      ...student,
      username:
        student.firstName && student.lastName
          ? student.firstName[0].toLowerCase() +
            student.lastName.toLowerCase() +
            Date.now()
          : "",
    });
    const data = { ...student, ...motor };
    const res = await fetchData("super-admin/add-user", {
      method: "POST",
      data,
    });
    console.log(res);
  };

  return (
    <div className="p-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-violet-500">Add Student</h1>
          <p className="text-sm text-gray-500">
            Register student and their motor vehicle for campus parking
          </p>
        </div>
        <div className="text-sm text-gray-500">Step 1 of 1</div>
      </header>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: form inputs */}
        <div className="lg:col-span-2 pt-5 space-y-6">
          {/* Student Basic Information */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium">Student Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DefaultInput
                label="First name"
                onChange={(e) =>
                  setStudent({ ...student, firstName: e.target.value })
                }
                value={student.firstName}
                placeholder="Juan"
              />
              <DefaultInput
                label="Middle name"
                onChange={(e) =>
                  setStudent({ ...student, middleName: e.target.value })
                }
                value={student.middleName}
                placeholder="Reyes"
              />

              <DefaultInput
                label="Last name"
                onChange={(e) =>
                  setStudent({ ...student, lastName: e.target.value })
                }
                value={student.lastName}
                placeholder="Tamayo"
              />

              <DefaultInput
                label="Student ID"
                onChange={(e) =>
                  setStudent({ ...student, studentNo: e.target.value })
                }
                value={student.studentNo}
                placeholder="C2025-00001"
              />

              <DefaultOptions
                label="Course"
                onChange={(e) =>
                  setStudent({ ...student, course: e.target.value })
                }
                value={student.course}
                placeholder={"Select Course"}
                options={["BEEd", "BSIT", "BTLEd", "BT-AUTO"]}
              />

              <DefaultOptions
                label="Year level"
                onChange={(e) =>
                  setStudent({ ...student, yearLevel: e.target.value })
                }
                placeholder={"Select Year Level"}
                value={student.yearLevel}
                options={["1st", "2nd", "3rd", "4th"]}
              />

              <DefaultInput
                label="Email"
                onChange={(e) =>
                  setStudent({ ...student, email: e.target.value })
                }
                value={student.email}
                placeholder="example@gmail.com"
              />

              <DefaultInput
                label="Phone No."
                onChange={(e) =>
                  setStudent({ ...student, phoneNo: e.target.value })
                }
                value={student.phoneNo}
                placeholder="+63 912 345 6789"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex-1">
                <div className="text-sm text-gray-700 mb-2">
                  Student photo (optional)
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 overflow-hidden">
                    <img src={preview} alt="" className="h-full w-full" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePic}
                    className="text-sm"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Recommended: 300x300px, JPG/PNG
                </p>
              </label>
            </div>
          </section>

          {/* Motor Information */}
          <section className="space-y-4 pt-4 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">
              Motor / Vehicle Details
            </h2>
            {/* AI Motor Image Generates Section */}
            {showGeneratedSection && (
              <>
                {!loading ? (
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="100"
                        height="100"
                        viewBox="0 0 50 50"
                        fill="currentColor"
                        className="size-5 text-violet-500"
                      >
                        <path d="M22.462 11.035l2.88 7.097c1.204 2.968 3.558 5.322 6.526 6.526l7.097 2.88c1.312.533 1.312 2.391 0 2.923l-7.097 2.88c-2.968 1.204-5.322 3.558-6.526 6.526l-2.88 7.097c-.533 1.312-2.391 1.312-2.923 0l-2.88-7.097c-1.204-2.968-3.558-5.322-6.526-6.526l-7.097-2.88c-1.312-.533-1.312-2.391 0-2.923l7.097-2.88c2.968-1.204 5.322-3.558 6.526-6.526l2.88-7.097C20.071 9.723 21.929 9.723 22.462 11.035zM39.945 2.701l.842 2.428c.664 1.915 2.169 3.42 4.084 4.084l2.428.842c.896.311.896 1.578 0 1.889l-2.428.842c-1.915.664-3.42 2.169-4.084 4.084l-.842 2.428c-.311.896-1.578.896-1.889 0l-.842-2.428c-.664-1.915-2.169-3.42-4.084-4.084l-2.428-.842c-.896-.311-.896-1.578 0-1.889l2.428-.842c1.915-.664 3.42-2.169 4.084-4.084l.842-2.428C38.366 1.805 39.634 1.805 39.945 2.701z"></path>
                      </svg>
                      <h1 className="text-gray-700 font-semibold">
                        Image fetched from external website •{" "}
                        {generatedMotorcycle.corrected?.search_query}
                      </h1>
                    </div>
                    <div className="flex gap-5 h-50">
                      <img
                        src={generatedMotorcycle.imageUrl}
                        alt={generatedMotorcycle.imageUrl}
                        className="h-auto w-64 object-contain rounded-xl"
                      />
                      <div className="flex flex-col h-full justify-between flex-1">
                        <div className="truncate">
                          <p className="text-gray-700 indent-7 text-wrap line-clamp-6">
                            {generatedMotorcycle.corrected?.information}
                          </p>
                        </div>
                        <div className="w-full">
                          <a
                            target="_blank"
                            href={`${generatedMotorcycle.imageUrl}`}
                            className="flex items-center gap-2 text-blue-500 text-xs italic"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                              />
                            </svg>
                            <span className="truncate block w-full max-w-96">
                              {generatedMotorcycle.imageUrl}
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Skeleton Loader
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="100"
                        height="100"
                        viewBox="0 0 50 50"
                        fill="currentColor"
                        className="size-5 text-violet-500 animate-pulse"
                      >
                        <path d="M22.462 11.035l2.88 7.097c1.204 2.968 3.558 5.322 6.526 6.526l7.097 2.88c1.312.533 1.312 2.391 0 2.923l-7.097 2.88c-2.968 1.204-5.322 3.558-6.526 6.526l-2.88 7.097c-.533 1.312-2.391 1.312-2.923 0l-2.88-7.097c-1.204-2.968-3.558-5.322-6.526-6.526l-7.097-2.88c-1.312-.533-1.312-2.391 0-2.923l7.097-2.88c2.968-1.204 5.322-3.558 6.526-6.526l2.88-7.097C20.071 9.723 21.929 9.723 22.462 11.035zM39.945 2.701l.842 2.428c.664 1.915 2.169 3.42 4.084 4.084l2.428.842c.896.311.896 1.578 0 1.889l-2.428.842c-1.915.664-3.42 2.169-4.084 4.084l-.842 2.428c-.311.896-1.578.896-1.889 0l-.842-2.428c-.664-1.915-2.169-3.42-4.084-4.084l-2.428-.842c-.896-.311-.896-1.578 0-1.889l2.428-.842c1.915-.664 3.42-2.169 4.084-4.084l.842-2.428C38.366 1.805 39.634 1.805 39.945 2.701z"></path>
                      </svg>
                      <span className="text-gray-400 animate-pulse font-semibold">
                        AI is searching...
                      </span>
                    </div>

                    <div className="flex gap-5 h-50">
                      <span className="h-full w-64 animate-pulse rounded-xl bg-gray-100"></span>
                      <div className="flex flex-col h-full justify-between flex-1">
                        <div className="flex flex-col">
                          <span className="animate-pulse bg-gray-100 h-5 w-full rounded-md mb-2"></span>
                          <span className="animate-pulse bg-gray-100 h-5 w-5/6 rounded-md mb-2"></span>
                          <span className="animate-pulse bg-gray-100 h-5 w-4/6 rounded-md mb-2"></span>
                          <span className="animate-pulse bg-gray-100 h-5 w-3/6 rounded-md mb-2"></span>
                        </div>
                        <span className="animate-pulse bg-gray-100 h-5 w-5/6 rounded-md mb-2"></span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DefaultInput
                label="Plate number"
                onChange={(e) => setMotor({ ...motor, plate: e.target.value })}
                value={motor.plate}
                placeholder="ABC 1234"
              />

              <DefaultInput
                label="Brand"
                onChange={(e) => setMotor({ ...motor, brand: e.target.value })}
                value={motor.brand}
                placeholder="Honda"
              />
              <DefaultInput
                label="Model"
                onChange={(e) => setMotor({ ...motor, type: e.target.value })}
                value={motor.type}
                placeholder="Wave 125"
              />
              <DefaultInput
                label="Color"
                onChange={(e) => setMotor({ ...motor, color: e.target.value })}
                value={motor.color}
                placeholder="Black"
              />
              <button
                disabled={!(motor.brand && motor.color && motor.type)}
                onClick={fetchMotorDetails}
                type="button"
                className={`py-2 rounded-md ${
                  motor.brand && motor.color && motor.type
                    ? "bg-violet-500 text-white hover:bg-violet-600"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                Search Motorcycle
              </button>
            </div>
          </section>
        </div>

        {/* Right: summary card & actions */}
        <aside className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4 self-start">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-800">Summary</h3>
            <div className="text-xs text-gray-500">
              Review details before saving
            </div>

            <div className="mt-3 bg-gray-100 rounded-md p-3 text-sm space-y-2">
              <div>
                <span className="font-medium text-gray-700">Name:</span>{" "}
                {student.firstName || "—"} {student.lastName || ""}
              </div>
              <div>
                <span className="font-medium text-gray-700">Username:</span>{" "}
                {student.firstName && student.lastName
                  ? student.firstName[0].toLowerCase() +
                    student.lastName.toLowerCase() +
                    Date.now()
                  : ""}
              </div>
              <div>
                <span className="font-medium text-gray-700">Student ID:</span>{" "}
                {student.studentNo || "—"}
              </div>

              <div>
                <span className="font-medium text-gray-700">Course:</span>{" "}
                {student.course || "—"}
              </div>
              <div>
                <span className="font-medium text-gray-700">Year level:</span>{" "}
                {student.yearLevel || "—"}
              </div>
              <div>
                <span className="font-medium text-gray-700">Plate:</span>{" "}
                {motor.plate || "—"}
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <button
              onClick={handleRegistration}
              type="button"
              className="w-full bg-violet-700 hover:bg-violet-700 text-white py-2 rounded-lg text-sm"
              // onClick: wire to submit handler
            >
              Register
            </button>
            <button
              type="button"
              className="w-full border rounded-lg py-2 text-sm text-gray-700 hover:bg-gray-50"
              // onClick: reset or cancel
            >
              Back
            </button>
            <p className="text-xs text-gray-400">
              After saving, the system will generate a QR code for the motor and
              link it to the student account.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
