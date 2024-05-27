import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetUserQuery } from "../../features/users/usersApi";

const init = {
  members: [],
};

const MemberModal = ({ modalHandler, submitHandler, participants }) => {
  const [formData, setFormData] = useState(init);

  useEffect(() => {
    const member = participants.split("-");
    setFormData({
      ...formData,
      members: [...member],
    });
  }, [participants]);

  const { user: loggedInUser } = useSelector((state) => state.auth) || {};
  const { email: myEmail } = loggedInUser || {};

  const { data: users } = useGetUserQuery({});

  //   const userList = users?.filter(
  //     (user: { email: any }) => user.email !== myEmail
  //   );
  const userList = users?.filter((user) => user.email !== myEmail);

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (formData.members.includes(value)) {
      const updateMember = formData.members.filter(
        (member) => member !== value
      );
      setFormData({
        ...formData,
        members: [...updateMember],
      });
    } else {
      setFormData({
        ...formData,
        members: [...formData.members, value],
      });
    }
  };

  const onSubmitHandler = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    submitHandler(formData.members);
    setFormData({ ...init });
  };

  const handleClose = () => {
    setFormData({ ...init });
    modalHandler();
  };

  return (
    <>
      <div
        id="authentication-modal"
        // tabIndex="-1"
        aria-hidden="true"
        className="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40 overflow-y-auto overflow-x-hidden w-full"
      >
        <div className="relative p-4 w-full max-w-md h-full mx-auto my-auto pt-20">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              onClick={modalHandler}
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              data-modal-toggle="authentication-modal"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span onClick={handleClose} className="sr-only">
                Close modal
              </span>
            </button>

            <div className="py-6 px-6 lg:px-8">
              <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                Add member
              </h3>
              <p className="mb-3 font-medium">
                My email: <span className="text-green-400">{myEmail}</span>
              </p>
              <form className="space-y-6" onSubmit={onSubmitHandler}>
                <div>
                  <label
                    htmlFor="countries"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                  >
                    Chose member
                  </label>
                  <select
                    value={formData.members}
                    multiple
                    onChange={(e) => handleSelect(e)}
                    id="countries"
                    className="bg-gray-50 border focus:border-blue-500 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option>Select one</option>
                    {userList &&
                      userList.length > 0 &&
                      userList.map((user) => (
                        <option
                          key={user.id}
                          selected={formData.members.includes(user.email)}
                          value={user.email}
                        >
                          {user.name}
                        </option>
                      ))}
                    {userList?.length === 0 && <span>No user found</span>}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Submit form
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberModal;
