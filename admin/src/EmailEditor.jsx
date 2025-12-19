import React from "react";
import { Link } from "react-router-dom";

export default function EmailEditor() {
  //Verification Link Design
  // return (
  //   <div className="min-h-screen bg-white flex pt-5 justify-center px-4">
  //     <div className="w-full max-w-md bg-white flex flex-col items-center">
  //       {/* Logo */}
  //       <header className="flex gap-2 text-violet-500 items-center text-2xl font-bold mb-5">
  //         <svg
  //           version="1.1"
  //           id="Layer_1"
  //           xmlns="http://www.w3.org/2000/svg"
  //           xmlns:xlink="http://www.w3.org/1999/xlink"
  //           x="0px"
  //           y="0px"
  //           viewBox="0 0 612 792"
  //           enable-background="new 0 0 612 792"
  //           xml:space="preserve"
  //           className="h-8 w-8"
  //         >
  //           <g id="Layer_2_00000178924397466622186440000013772919066771020943_">
  //             <g>
  //               <path
  //                 fill="#8E51FF"
  //                 d="M9.9,106.6L9.9,106.6c0,28.4,23,51.4,51.4,51.4h314.3c4.3,0,8.6,0.5,12.7,1.6
  // 		c25.6,6.5,109.8,36.2,109.8,144c0,107.9-75.1,133.4-97.8,138.6c-3.7,0.9-7.4,1.2-11.2,1.2H61.3c-28.4,0-51.4,23-51.4,51.4l0,0
  // 		c0,28.4,23,51.4,51.4,51.4h334.7c4.7,0,9.3-0.6,13.9-1.9c33.6-9.6,171.4-59.5,192-236.4c0.4-3.2,0.4-6.3,0.2-9.5
  // 		c-2.2-31.6-22-199.2-193.4-241.8c-4-1-8.3-1.5-12.4-1.5H61.3C32.9,55.2,9.9,78.2,9.9,106.6z"
  //               />
  //               <path
  //                 fill="#8E51FF"
  //                 d="M9.9,293.6L9.9,293.6c0,27.2,22.1,49.3,49.3,49.3h246.2c27.2,0,49.3-22.1,49.3-49.3l0,0
  // 		c0-27.2-22.1-49.3-49.3-49.3H59.1C31.9,244.4,9.9,266.4,9.9,293.6z"
  //               />
  //               <path
  //                 fill="#8E51FF"
  //                 d="M61.3,634h241.9c28.4,0,51.4,23,51.4,51.4l0,0c0,28.4-23,51.4-51.4,51.4H61.3c-28.4,0-51.4-23-51.4-51.4
  // 		l0,0C9.9,657,32.9,634,61.3,634z"
  //               />
  //             </g>
  //           </g>
  //         </svg>
  //         <h1>ParkEase</h1>
  //       </header>
  //       {/* Success Message */}
  //       <h2 className="text-lg font-semibold text-green-600 mb-3">
  //         Email Verified Successfully
  //       </h2>
  //       <p className="text-sm text-gray-600 mb-5">
  //         Your email address has been successfully verified.
  //       </p>
  //       {/* Notice */}
  //       <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left text-sm text-yellow-800 mb-6 rounded-md">
  //         <p className="font-medium mb-1">Important:</p>
  //         <p>
  //           A temporary password has been automatically generated for your
  //           account. Please log in using this password and change it immediately
  //           to secure your account.
  //         </p>
  //       </div>
  //       {/* Action Button */}
  //       <Link
  //         to="/student/auth/login"
  //         className="flex justify-center w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-3 rounded-xl transition"
  //       >
  //         <p>Back in ParkEase app</p>
  //       </Link>
  //       {/* Footer */}
  //       <hr className="border-gray-200 mb-4" />

  //       <p className="text-xs text-gray-400 text-center">
  //         © 2025 ParkEase – URSC Motor Parking Management System
  //       </p>
  //     </div>
  //   </div>
  // );

  //Gmail Email Design
  // return (
  //   <div className="w-full h-full flex justify-center bg-gray-50 py-8 px-4">
  //     <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-sm text-gray-800">
  //       {/* Header */}
  //       <header className="flex items-center justify-center gap-2 text-violet-500 text-2xl font-bold mb-6">
  //         <svg
  //           viewBox="0 0 612 792"
  //           className="h-8 w-8"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <path
  //             fill="#8E51FF"
  //             d="M9.9,106.6c0,28.4,23,51.4,51.4,51.4h314.3c4.3,0,8.6,0.5,12.7,1.6
  //             c25.6,6.5,109.8,36.2,109.8,144c0,107.9-75.1,133.4-97.8,138.6
  //             c-3.7,0.9-7.4,1.2-11.2,1.2H61.3c-28.4,0-51.4,23-51.4,51.4
  //             c0,28.4,23,51.4,51.4,51.4h334.7c4.7,0,9.3-0.6,13.9-1.9
  //             c33.6-9.6,171.4-59.5,192-236.4c0.4-3.2,0.4-6.3,0.2-9.5
  //             C599.9,266,580.1,98.4,408.7,55.8c-4-1-8.3-1.5-12.4-1.5H61.3
  //             C32.9,55.2,9.9,78.2,9.9,106.6z"
  //           />
  //           <path
  //             fill="#8E51FF"
  //             d="M9.9,293.6c0,27.2,22.1,49.3,49.3,49.3h246.2
  //             c27.2,0,49.3-22.1,49.3-49.3c0-27.2-22.1-49.3-49.3-49.3H59.1
  //             C31.9,244.4,9.9,266.4,9.9,293.6z"
  //           />
  //           <path
  //             fill="#8E51FF"
  //             d="M61.3,634h241.9c28.4,0,51.4,23,51.4,51.4
  //             c0,28.4-23,51.4-51.4,51.4H61.3c-28.4,0-51.4-23-51.4-51.4
  //             C9.9,657,32.9,634,61.3,634z"
  //           />
  //         </svg>
  //         <h1>ParkEase</h1>
  //       </header>

  //       {/* Greeting */}
  //       <p className="text-sm mb-2">
  //         Hello <strong>Clarence</strong>,
  //       </p>

  //       <p className="text-sm leading-relaxed mb-5">
  //         Thank you for registering with <strong>ParkEase</strong>. To complete
  //         your account setup, please verify your email address by clicking the
  //         button below.
  //       </p>

  //       {/* CTA */}
  //       <div className="flex justify-center mb-6">
  //         <a
  //           href="#"
  //           className="inline-block bg-violet-500 hover:bg-violet-600 text-white font-semibold text-sm px-6 py-3 rounded-lg transition"
  //         >
  //           Verify Email Address
  //         </a>
  //       </div>

  //       {/* Security Info */}
  //       <p className="text-xs text-gray-500 leading-relaxed mb-6">
  //         This verification link is valid for{" "}
  //         <strong className="text-rose-500">3 hours</strong> and can only be
  //         used once. If you did not create this account, you may safely ignore
  //         this email.
  //       </p>

  //       <hr className="border-gray-200 mb-4" />

  //       {/* Footer */}
  //       <p className="text-xs text-gray-400 text-center">
  //         © 2025 ParkEase – URSC Motor Parking Management System
  //       </p>
  //     </div>
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins','Segoe_UI',Arial,Helvetica,sans-serif] text-gray-800">
      <div className="w-full px-4 py-8 box-border">
        <div className="max-w-[420px] mx-auto bg-white p-6">
          {/* Header */}
          <div className="text-center text-[22px] font-bold text-violet-500 mb-6">
            ParkEase
          </div>

          {/* Greeting */}
          <p className="text-sm mb-2">
            Hello <strong>Clarence</strong>,
          </p>

          <p className="text-sm leading-relaxed mb-5">
            Your student account has been successfully created in{" "}
            <strong>ParkEase – URSC Motor Parking Management System</strong>.
            Below are your account details.
          </p>

          {/* Account Details */}
          <div className="bg-gray-100 p-4 rounded-md text-sm mb-5">
            <p className="mb-2">
              <strong>Email:</strong> example@gmail.com
            </p>
            <p className="mb-2">
              <strong>Name:</strong> Clarence James
            </p>
            <p>
              <strong>Temporary Password:</strong>{" "}
              <span className="text-violet-500 font-semibold">JskERfc0</span>
            </p>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-[13px] text-yellow-800 mb-5 rounded">
            <strong>Important:</strong>
            <br />
            This is a temporary password. Please log in and change your password
            immediately to secure your account.
          </div>

          {/* CTA */}
          <div className="text-center mb-6">
            <a
              href="/login"
              className="inline-block bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold px-6 py-3 rounded-lg transition"
            >
              Log In to ParkEase
            </a>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            If you did not request this account, please ignore this email.
            <br />© 2025 ParkEase – URSC Motor Parking Management System
          </p>
        </div>
      </div>
    </div>
  );
}
