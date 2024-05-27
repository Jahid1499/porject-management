import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import {
  useAddTeamMutation,
  useGetTeamsQuery,
} from "../../features/teams/teamsApi";
import Template from "../templete/Template";
import Error from "../ui/Error";
import Modal from "./Modal";
import Team from "./Team";

const TeamList = () => {
  const { user: loggedInUser } = useSelector((state) => state.auth) || {};
  const { email: myEmail } = loggedInUser || {};

  const {
    data: teams,
    isLoading,
    isError,
    error,
  } = useGetTeamsQuery(myEmail) || {};

  const [addTeam, { isSuccess }] = useAddTeamMutation();

  const [isOpen, setIsOpen] = useState(false);

  const modalHandler = () => {
    setIsOpen((prev) => !prev);
  };

  const submitHandler = (data) => {
    const { color, name, description } = data;
    setIsOpen((prev) => !prev);
    addTeam({
      name,
      participants: myEmail,
      color: color.toLowerCase(),
      description,
      timestamp: new Date().getTime(),
    });
  };

  useEffect(() => {
    if (isSuccess) {
      swal("Success!", "Team successfully added!", "success");
    }
  }, [isSuccess]);

  let content = null;
  if (isLoading) {
    content = <div className="m-2 text-center">Loading...</div>;
  } else if (!isLoading && isError) {
    content = (
      <li className="m-2 text-center">
        <Error message={error?.data} />
      </li>
    );
  } else if (!isLoading && !isError && teams?.length === 0) {
    content = <li className="m-2 text-center">No team found!</li>;
  } else if (!isLoading && !isError && teams?.length > 0) {
    content = teams.map((team) => <Team key={team.id} {...team} />);
  }

  return (
    <Template>
      <div className="px-10 mt-6 flex justify-between">
        <h1 className="text-2xl font-bold">Teams</h1>
        <button
          onClick={modalHandler}
          className="flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
        </button>
      </div>
      {!isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 px-10 mt-4 gap-6 overflow-auto">
          {content}
        </div>
      )}

      {isOpen && (
        <Modal modalHandler={modalHandler} submitHandler={submitHandler} />
      )}
    </Template>
  );
};

export default TeamList;
