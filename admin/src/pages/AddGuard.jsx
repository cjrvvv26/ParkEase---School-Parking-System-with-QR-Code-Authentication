import React, { useState } from "react";

export default function AddGuard() {
  const [guard, setGuard] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    assignedArea: "",
    shift: "",
    status: "active",
  });

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

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

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
        {/* Left: form inputs */}
        <section className="lg:col-span-2 bg-white rounded-xl pt-5 flex-1">
          {/* Guard Personal Information */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-gray-800">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col text-sm">
                <span className="text-gray-600">First name</span>
                <input
                  value={guard.firstName}
                  onChange={(e) =>
                    setGuard({ ...guard, firstName: e.target.value })
                  }
                  placeholder="Rafael"
                  className="mt-2 px-3 py-2 border rounded-md text-sm"
                />
              </label>

              <label className="flex flex-col text-sm">
                <span className="text-gray-600">Last name</span>
                <input
                  value={guard.lastName}
                  onChange={(e) =>
                    setGuard({ ...guard, lastName: e.target.value })
                  }
                  placeholder="Santos"
                  className="mt-2 px-3 py-2 border rounded-md text-sm"
                />
              </label>

              <label className="flex flex-col text-sm">
                <span className="text-gray-600">Email</span>
                <input
                  value={guard.email}
                  onChange={(e) =>
                    setGuard({ ...guard, email: e.target.value })
                  }
                  placeholder="rafael.santos@school.edu.ph"
                  className="mt-2 px-3 py-2 border rounded-md text-sm"
                />
              </label>

              <label className="flex flex-col text-sm">
                <span className="text-gray-600">Phone</span>
                <input
                  value={guard.phone}
                  onChange={(e) =>
                    setGuard({ ...guard, phone: e.target.value })
                  }
                  placeholder="+63 912 345 6789"
                  className="mt-2 px-3 py-2 border rounded-md text-sm"
                />
              </label>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex-1">
                <div className="text-sm text-gray-600 mb-2">
                  Profile photo (optional)
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                    Preview
                  </div>
                  <input type="file" accept="image/*" className="text-sm" />
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
              <label className="flex flex-col text-sm">
                <span className="text-gray-600">Work shift</span>
                <select
                  value={guard.shift}
                  onChange={(e) =>
                    setGuard({ ...guard, shift: e.target.value })
                  }
                  className="mt-2 px-3 py-2 border rounded-md text-sm bg-white"
                >
                  <option value="">Select shift</option>
                  <option value="morning">Morning (6:00 AM - 2:00 PM)</option>
                  <option value="afternoon">
                    Afternoon (2:00 PM - 10:00 PM)
                  </option>
                  <option value="night">Night (10:00 PM - 6:00 AM)</option>
                  <option value="flexible">Flexible</option>
                </select>
              </label>

              <label className="flex flex-col text-sm">
                <span className="text-gray-600">Status</span>
                <select
                  value={guard.status}
                  onChange={(e) =>
                    setGuard({ ...guard, status: e.target.value })
                  }
                  className="mt-2 px-3 py-2 border rounded-md text-sm bg-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-leave">On Leave</option>
                </select>
              </label>
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
                  value={credentials.username}
                  disabled
                  placeholder="Auto-generated"
                  className="mt-2 px-3 py-2 border rounded-md text-sm bg-gray-50"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Format: first initial + last name (e.g., rsantos)
                </p>
              </label>

              <label className="flex flex-col text-sm">
                <span className="text-gray-600">
                  Email (for login recovery)
                </span>
                <input
                  value={guard.email}
                  disabled
                  className="mt-2 px-3 py-2 border rounded-md text-sm bg-gray-50"
                />
              </label>
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 .84.835l-.841 8.415a.75.75 0 0 0 1.485.054l.823-8.415a.75.75 0 0 1 .84-.835l.041.02M9 9.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              <div className="text-xs text-blue-700">
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
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-gray-700">
                  Can scan & verify QR codes (entry/exit)
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-gray-700">
                  Can mark parking spots (available/occupied)
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-700">
                  Can view parking analytics & reports
                </span>
              </label>
            </div>
          </section>

          {/* Notes */}
          <section className="pt-5 border-gray-200 mt-5 border-t">
            <label className="flex flex-col text-sm">
              <span className="text-gray-600">Notes (internal)</span>
              <textarea
                placeholder="Any special notes about this guard..."
                className="mt-2 px-3 py-2 border rounded-md text-sm h-32 resize-none"
              />
            </label>
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
              <div>
                <span className="font-medium text-gray-700">Username:</span>{" "}
                {credentials.username || "—"}
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <button
              type="button"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg text-sm"
              // onClick: wire to submit handler
            >
              Create Guard Account
            </button>
            <button
              type="button"
              className="w-full border rounded-lg py-2 text-sm text-gray-700 hover:bg-gray-50"
              // onClick: reset or cancel
            >
              Cancel
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
