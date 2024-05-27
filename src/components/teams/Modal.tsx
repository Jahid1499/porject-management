import { ChangeEvent, useState } from "react";

const init = {
  name: "",
  description: "",
  color: "",
};

const Modal = ({ modalHandler, submitHandler }) => {
  const [formData, setFormData] = useState(init);
  const { name, color, description } = formData || {};

  const [error, setError] = useState(init);

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmitHandler = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (name === "") {
      setError({
        ...error,
        name: "Team name is required",
      });
    } else {
      setError({
        ...error,
        name: "",
      });
    }

    if (formData.color === "") {
      setError({
        ...error,
        color: "Color name is required",
      });
    } else {
      setError({
        ...error,
        color: "",
      });
    }

    if (formData.description === "") {
      setError({
        ...error,
        description: "Description is required",
      });
    } else {
      setError({
        ...error,
        description: "",
      });
    }

    if (name || description || color) {
      submitHandler(formData);
      setFormData({ ...init });
      setError({ ...init });
    }
  };

  const handleClose = () => {
    setFormData({ ...init });
    setError({ ...init });
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
                Team form
              </h3>
              <form className="space-y-6" onSubmit={onSubmitHandler}>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    onChange={(e) => onChangeHandler(e)}
                    value={name}
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Please enter team name"
                    required
                  />
                  {error?.name && (
                    <label className="text-xs text-red-400">
                      {error?.name}
                    </label>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="description"
                    onChange={(e) => onChangeHandler(e)}
                    value={description}
                    name="description"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  ></textarea>
                  {error?.description && (
                    <label className="text-xs text-red-400">
                      {error?.description}
                    </label>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="color"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Color <span className="text-red-400">*</span>{" "}
                    <span className="text-gray-400 text-xs">
                      (Ex: ember, yellow, lime, green, emerald, teal, sky, blue,
                      indigo, violet, purple, fuchsia, rose)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="color"
                    onChange={(e) => onChangeHandler(e)}
                    value={color}
                    id="color"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Please enter color name"
                    required
                  />
                  {error?.color && (
                    <label className="text-xs text-red-400">
                      {error?.color}
                    </label>
                  )}
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

export default Modal;
