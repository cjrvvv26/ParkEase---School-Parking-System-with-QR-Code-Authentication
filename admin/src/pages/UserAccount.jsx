import { EyeIcon, PencilIcon } from "lucide-react";
import DefaultInput from "../components/forms/DefaultInput";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import DefaultOptions from "../components/forms/DefaultOptions";
import { useParams } from "react-router-dom";
import axios from "../utils/axiosConfig";

export default function UserAccount() {
  const { id } = useParams();
  const { loading, fetchData } = useFetch();
  const [userLoad, setUserLoad] = useState(false);
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [onlyRead, setOnlyRead] = useState(true);
  const [generatedMotorcycle, setGeneratedMotorcycle] = useState({});
  const [showGeneratedSection, setShowGeneratedSection] = useState(false);
  const [motor, setMotor] = useState({
    plateNo: "",
    model: "",
    brand: "",
    color: "",
  });

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

  useEffect(() => {
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
    const motorData = await fetchData("/motor/image", {
      method: "POST",
      data: inputMotorData,
    });
    setGeneratedMotorcycle(motorData);
  };

  if (userLoad) {
    return (
      <div className="items-center justify-center h-full w-full">
        <span className="border-t-2 border-t-violet-500 animate-spin h-12 w-12 rounded-full"></span>
      </div>
    );
  }

  return (
    <>
      {/* Header Page */}
      <header className="flex justify-between px-5 pt-5 items-center">
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl">User Account Details</h1>
          <p className="text-gray-400">Manage and view user account</p>
        </div>
        <button
          onClick={() => {
            if (onlyRead) {
              return setOnlyRead(false);
            }
            setOnlyRead(true);
            setUser(originalUser);
          }}
          className="flex gap-1 items-center text-gray-400 hover:text-violet-500"
        >
          {onlyRead ? (
            <>
              <PencilIcon strokeWidth={1.5} className="size-4" /> Edit
            </>
          ) : (
            <>
              <EyeIcon strokeWidth={1.5} className="size-4" /> View
            </>
          )}
        </button>
      </header>

      {user && (
        <form className="flex flex-col gap-6 px-5">
          {/* Personal Information */}
          <section className="flex flex-col w-full gap-3 border-b border-gray-200 pb-5">
            <h1 className="text-gray-700 font-medium text-base">
              Personal Information
            </h1>
            <div className="flex gap-5 w-full">
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <img
                    src={user.profileDetails.url}
                    alt="Profile"
                    className="w-40 h-40 rounded-full border-4 border-violet-500 object-cover"
                  />
                  <span className="h-3 w-3 rounded-full bg-green-500 absolute z-10 bottom-0 right-0"></span>
                </div>
                {!onlyRead && (
                  <button className="rounded-md text-white hover:bg-violet-400 bg-violet-500 duration-100 py-2 w-full">
                    Change Photo
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-4 w-[70%]">
                <div className="grid grid-cols-3 gap-5">
                  <DefaultInput
                    label={"First Name"}
                    value={user.name.firstName}
                    onlyRead={onlyRead}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        name: { ...user.name, firstName: e.target.value },
                      })
                    }
                  />
                  <DefaultInput
                    label={"Middle Name"}
                    value={user.name?.middleName}
                    onlyRead={onlyRead}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        name: { ...user.name, middleName: e.target.value },
                      })
                    }
                  />
                  <DefaultInput
                    label={"Last Name"}
                    value={user.name.lastName}
                    onlyRead={onlyRead}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        name: { ...user.name, lastName: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-5">
                  <DefaultInput
                    label={"Phone No."}
                    value={user.phoneNo}
                    onlyRead={onlyRead}
                    type="number"
                    onChange={(e) =>
                      setUser({
                        ...user,
                        phoneNo: e.target.value,
                      })
                    }
                  />
                  <DefaultInput
                    label={"Email"}
                    value={user.email}
                    onlyRead={true}
                  />
                  <DefaultInput
                    label={"Student No"}
                    value={user?.studentNo}
                    onlyRead={true}
                  />
                </div>
                <div className="grid grid-cols-3 gap-5">
                  {onlyRead ? (
                    <>
                      <DefaultInput
                        label={"Course"}
                        value={user?.course}
                        onlyRead={true}
                      />
                      <DefaultInput
                        label={"Year Level"}
                        value={user?.yearLevel}
                        onlyRead={true}
                      />
                      <DefaultInput
                        label={"Status"}
                        value={
                          user?.status.charAt(0).toUpperCase() +
                          user?.status.slice(1)
                        }
                        onlyRead={true}
                      />
                    </>
                  ) : (
                    <>
                      <DefaultOptions
                        label={"Course"}
                        value={user?.course}
                        placeholder={"Select Course"}
                        options={["BEEd", "BSIT", "BTLEd", "BT-AUTO"]}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            course: e.target.value,
                          })
                        }
                      />
                      <DefaultOptions
                        label={"Year Level"}
                        value={user?.yearLevel}
                        placeholder={"Select Year Level"}
                        options={["1st", "2nd", "3rd", "4th"]}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            yearLevel: e.target.value,
                          })
                        }
                      />
                      <DefaultOptions
                        label={"Status"}
                        value={
                          user?.status.charAt(0).toUpperCase() +
                          user?.status.slice(1)
                        }
                        placeholder={"Update Status"}
                        options={["Active", "Deactivate"]}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            status: e.target.value,
                          })
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
          <section className="flex flex-col w-full gap-3 border-b border-gray-200">
            <h1 className="text-gray-700 font-medium text-base">
              Motorcycle Information
            </h1>
            {/* AI Motor Image Generates Section */}
            {showGeneratedSection && (
              <>
                {!loading ? (
                  <div className="flex flex-col w-[60%] gap-2 ">
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
                  <div className="flex flex-col gap-2 w-[60%]">
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
            <div className="flex gap-5 w-full">
              <div className="flex flex-col gap-4 w-[70%]">
                <div className="grid grid-cols-3 gap-5">
                  <DefaultInput
                    label={"Plate number"}
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
                    placeholder={"ABC 123"}
                    onlyRead={onlyRead}
                  />
                  <DefaultInput
                    label={"Brand"}
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
                    placeholder="Honda"
                  />
                </div>
                <div className="grid grid-cols-3 gap-5">
                  <DefaultInput
                    label={"Model"}
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
                    placeholder="Wave 125"
                  />
                  <DefaultInput
                    label={"Color"}
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
                    placeholder="Black"
                  />
                </div>
                <button
                  disabled={
                    !user?.motorDetails?.brand &&
                    user?.motorDetails?.color &&
                    user?.motorDetails?.model
                  }
                  onClick={fetchMotorDetails}
                  type="button"
                  className={`py-2 w-[calc(35%-25px)] mt-2 rounded-md ${
                    user?.motorDetails?.brand &&
                    user?.motorDetails?.color &&
                    user?.motorDetails?.model
                      ? "bg-violet-500 text-white hover:bg-violet-600"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  Search Motorcycle
                </button>
              </div>
            </div>
          </section>
        </form>
      )}
    </>
  );
}
