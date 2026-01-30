import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import DefaultInput from "../components/forms/DefaultInput";
import DefaultOptions from "../components/forms/DefaultOptions";

export default function AddGuard() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [formError, setFormError] = useState("");
  const { error, loading, fetchData } = useFetch();
  const [guard, setGuard] = useState({
    profileDetails: null,
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    shift: "",
    status: "active",
    role: "guard",
  });
  const [permissions, setPermissions] = useState({
    canScan: true,
    canViewAnalytics: false,
  });

  useEffect(() => {
    if (!formError) return;
    const timer = setTimeout(() => {
      setFormError("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [formError]);

  const handleProfilePic = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGuard({ ...guard, profileDetails: file });
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setGuard({ ...guard, profileDetails: null });
    }
  };

  const handleRegistration = async () => {
    const hasEmptyField = Object.values(guard).some(
      (value) => value === "" || value === undefined,
    );

    if (hasEmptyField) {
      setFormError("All fields must be filled");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guard.email)) {
      return setFormError("Invalid email address");
    }

    if (!/^[0-9]+$/.test(guard.phoneNo)) {
      return setFormError("Phone number must be numbers only");
    }

    const username =
      guard.firstName && guard.lastName
        ? guard.firstName[0].toLowerCase() +
          guard.lastName.toLowerCase() +
          Date.now()
        : "";

    const formData = new FormData();

    // Append guard data
    Object.entries(guard).forEach(([key, value]) => {
      if (key === "profileDetails" && value) {
        formData.append("profileDetails", value);
      } else if (key !== "profileDetails") {
        formData.append(key, value);
      }
    });

    formData.append("username", username);

    Object.entries(permissions).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const res = await fetchData("super-admin/add-user/avatars", {
      method: "POST",
      data: formData,
    });

    if (res) {
      navigate("/users");
    }
  };

  return (
    <div className=" w-full p-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-violet-500">
            Add Security Guard
          </h1>
          <p className="text-sm text-gray-500">
            Register a new security guard to the parking management system
          </p>
        </div>
        <div className="text-sm text-gray-500">Step 1 of 1</div>
      </header>
      {formError && (
        <div className="fixed bg-rose-500 text-sm text-white flex items-center justify-center py-4 px-2 top-2 left-1/2 -translate-x-1/2 rounded-md">
          <span>{formError}</span>
        </div>
      )}
      <form className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
        {/* Left: form inputs */}
        <section className="lg:col-span-2 bg-white rounded-xl pt-5 flex-1">
          {/* Guard Personal Information */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-gray-800">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DefaultInput
                label="First Name"
                onChange={(e) =>
                  setGuard({
                    ...guard,
                    firstName:
                      e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1),
                  })
                }
                value={guard.firstName}
                placeholder="William"
              />

              <DefaultInput
                label="Last Name"
                onChange={(e) =>
                  setGuard({
                    ...guard,
                    lastName:
                      e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1),
                  })
                }
                value={guard.lastName}
                placeholder="Gomez"
              />

              <DefaultInput
                label="Email Address"
                onChange={(e) =>
                  setGuard({
                    ...guard,
                    email: e.target.value,
                  })
                }
                value={guard.email}
                placeholder="william.gomez@gmail.com"
              />

              <DefaultInput
                label="Phone No."
                onChange={(e) =>
                  setGuard({
                    ...guard,
                    phoneNo:
                      e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1),
                  })
                }
                value={guard.phoneNo}
                placeholder="+63 912 345 8123"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex-1">
                <div className="text-sm text-gray-600 mb-2">
                  Profile photo (optional)
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center relative text-gray-400">
                    {preview ? (
                      <img
                        src={preview}
                        alt=""
                        className="h-full w-full rounded-md object-cover"
                      />
                    ) : (
                      <span>Preview</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePic}
                      className="h-full w-full absolute opacity-0"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Recommended: 300x300px, JPG/PNG
                </p>
              </label>
            </div>
          </section>

          {/* Assignment & Schedule */}
          <section className="space-y-4 pt-5 border-t border-gray-200 mt-5">
            <h2 className="text-lg font-medium text-gray-800">
              Assignment & Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DefaultOptions
                label="Work Shift"
                onChange={(e) => setGuard({ ...guard, shift: e.target.value })}
                placeholder={"Select work shift"}
                value={guard.shift}
                options={[
                  "Morning (6:00 AM - 2:00 PM)",
                  "Afternoon (2:00 PM - 10:00 PM)",
                  "Night (10:00 PM - 6:00 AM)",
                  "Flexible",
                ]}
              />
              <DefaultOptions
                label="Status"
                onChange={(e) => setGuard({ ...guard, status: e.target.value })}
                placeholder={"Select status"}
                value={guard.status}
                options={["active", "deactivate", "offline"]}
              />
            </div>
          </section>

          {/* Login Credentials */}
          <section className="pt-5 border-t border-gray-200 mt-5 space-y-5">
            <h2 className="text-lg font-medium text-gray-800">
              Login Credentials
            </h2>
            <p className="text-xs text-gray-500">
              Username will be auto-generated. Guard can set their password in
              the mobile app on first login.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col text-sm">
                <span className="text-gray-600">Username</span>
                <input
                  value={
                    guard.firstName && guard.lastName
                      ? guard.firstName[0].toLowerCase() +
                        guard.lastName.toLowerCase() +
                        Date.now()
                      : ""
                  }
                  disabled
                  placeholder="Auto-generated"
                  className="mt-2 px-3 py-2 ring rounded-md text-sm ring-gray-200 placeholder:text-gray-400 outline-none text-gray-700"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Format: first initial + last name (e.g., rsantos)
                </p>
              </label>

              <label className="flex flex-col text-sm">
                <span className="text-gray-600">
                  Email (can be used for login recovery)
                </span>
                <input
                  value={guard.email}
                  disabled
                  className="mt-2 px-3 py-2 ring rounded-md text-sm ring-gray-200 placeholder:text-gray-400 outline-none text-gray-700"
                />
              </label>
            </div>

            <div className="flex items-center gap-2 p-3 bg-violet-50 border border-violet-200 rounded-lg text-violet-500">
              <Info strokeWidth={1.5} size={18} />
              <div className="text-xs ">
                Guard will receive a welcome email with their username.
                Generated password can be viewed in the received email.
              </div>
            </div>
          </section>

          {/* Permissions */}
          <section className="space-y-4 pt-5 mt-5 border-gray-200 border-t">
            <h2 className="text-lg font-medium text-gray-800">Permissions</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setPermissions({
                      ...permissions,
                      canScan: e.target.checked,
                    })
                  }
                  defaultChecked
                  checked={permissions.canScan}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">
                  Can scan & verify QR codes (entry/exit)
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="rounded"
                  onChange={(e) =>
                    setPermissions({
                      ...permissions,
                      canViewAnalytics: e.target.checked,
                    })
                  }
                  checked={permissions.canViewAnalytics}
                />
                <span className="text-sm text-gray-700">
                  Can view parking analytics & reports
                </span>
              </label>
            </div>
          </section>
        </section>

        {/* Right: summary card & actions */}
        <aside className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4 self-start border border-gray-200">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-800">Summary</h3>
            <div className="text-xs text-gray-500">
              Review details before saving
            </div>

            <div className="mt-3 bg-gray-100 rounded-md p-3 text-sm space-y-2">
              <div>
                <span className="font-medium text-gray-700">Name:</span>{" "}
                {guard.firstName || "—"} {guard.lastName || ""}
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>{" "}
                {guard.email || "—"}
              </div>
              <div>
                <span className="font-medium text-gray-700">Phone No:</span>{" "}
                {guard.phoneNo || "—"}
              </div>
              <div>
                <span className="font-medium text-gray-700">Username:</span>{" "}
                {guard.firstName && guard.lastName
                  ? guard.firstName[0].toLowerCase() +
                    guard.lastName.toLowerCase() +
                    Date.now()
                  : "" || "—"}
              </div>
              <div>
                <span className="font-medium text-gray-700">Shift:</span>{" "}
                {guard.shift || "—"}
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    guard.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {guard.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <button
              disabled={loading || formError}
              onClick={handleRegistration}
              type="button"
              className={`${loading || formError ? "bg-gray-200 text-gray-400 hover:bg-gray-100 cursor-not-allowed" : "bg-violet-500 hover:bg-violet-500 text-white"} w-full text-white py-2 rounded-lg text-sm`}
            >
              {loading ? "Processing..." : "Create Guard Account"}
            </button>
            <button
              onClick={() => navigate("/users")}
              type="button"
              className="w-full border-2 border-gray-200 rounded-lg py-2 text-sm text-gray-400 hover:bg-gray-50"
            >
              Back
            </button>
            <p className="text-xs text-gray-400">
              After saving, the guard can log in using their credentials and
              start their assigned shift.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
