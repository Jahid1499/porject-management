import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import {
  useAddProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from "../../features/projects/projectsApi";
import { useGetTeamsQuery } from "../../features/teams/teamsApi";
import Template from "../templete/Template";
import Column from "./Column";
import EditModal from "./EditModal";
import Modal from "./Modal";
import MovableItem from "./MovableItem";
import { COLUMN_NAMES } from "./constants";

const Projects = () => {
  const { user: loggedInUser } = useSelector((state) => state.auth) || {};
  const { email: myEmail, avatar } = loggedInUser || {};
  const {
    data: teams,
    isLoading,
    isError,
    error,
  } = useGetTeamsQuery(myEmail) || {};
  const { data: projects } = useGetProjectsQuery({});
  const [addProject, { isSuccess }] = useAddProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const { BACKLOG, READY, DOING, REVIEW, BLOCKED, DONE } = COLUMN_NAMES;
  const { search } = useSelector((state) => state.filters);

  const [isOpen, setIsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [items, setItems] = useState(null);

  const [editData, setEditData] = useState({});

  let result = [];
  if (search && projects) {
    result = projects.filter((project) =>
      project.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  const checkBorder = (title) => {
    const res = result?.find((project) => project.title === title);
    if (res) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (projects?.length > 0) {
      setItems(projects);
    }
  }, [projects]);

  useEffect(() => {
    if (isSuccess) {
      swal("Success!", "Successfully project added!", "success");
    }
  }, [isSuccess]);

  const modalHandler = () => {
    setIsOpen((prev) => !prev);
  };

  const submitHandler = (data) => {
    const { title, team } = data;
    setIsOpen((prev) => !prev);
    addProject({
      creator: {
        avatar,
        email: myEmail,
      },
      team,
      title,
      status: BACKLOG,
      timestamp: new Date().getTime(),
    });
  };
  const editHandler = (projectItem, email) => {
    if (myEmail === email) {
      setEditData(projectItem);
      setEditModalOpen((prev) => !prev);
    } else {
      swal(
        "Warning",
        "Sorry! This project creator only edit this project!",
        "warning"
      );
    }
  };

  const cancelEditHandler = () => {
    setEditModalOpen((prev) => !prev);
  };

  const updateProjectHandler = (data) => {
    console.log(data);
    const { title, editedTeam, color, id } = data;
    updateProject({
      id,
      data: {
        title,
        team: editedTeam,
        color,
      },
    });
    setEditModalOpen((prev) => !prev);
  };

  const moveCardHandler = (dragIndex, hoverIndex) => {
    const dragItem = items[dragIndex];
    if (dragItem) {
      setItems((prevState) => {
        const coppiedStateArray = JSON.parse(JSON.stringify(prevState));
        const prevItem = coppiedStateArray.splice(hoverIndex, 1, dragItem);
        coppiedStateArray.splice(dragIndex, 1, prevItem[0]);
        return coppiedStateArray;
      });
    }
  };

  const returnItemNumberForColumn = (columnName) => {
    return items?.filter((item) => item.status === columnName).length;
  };

  const returnItemsForColumn = (columnName) => {
    return items
      ?.filter((item) => item.status === columnName)
      .map((item, index) => {
        return (
          <MovableItem
            border={checkBorder(item.title)}
            item={item}
            key={item.id}
            name={item.title}
            currentColumnName={item.status}
            setItems={setItems}
            index={index}
            moveCardHandler={moveCardHandler}
            editModal={editHandler}
          />
        );
      });
  };

  return (
    <Template searchOption={true}>
      <div className="px-10 mt-6">
        <h1 className="text-2xl font-bold">Project Board</h1>
      </div>

      {!isOpen && (
        <div className="flex flex-grow px-10 mt-4 space-x-6 overflow-auto">
          <DndProvider backend={HTML5Backend}>
            {/*Backlog section start*/}
            <Column
              modalHandler={modalHandler}
              totalItem={returnItemNumberForColumn(BACKLOG)}
              title={BACKLOG}
              className="backlog-column"
            >
              {returnItemsForColumn(BACKLOG)}
            </Column>
            {/*Backlog section end*/}

            {/*Ready section start*/}
            <Column
              totalItem={returnItemNumberForColumn(READY)}
              title={READY}
              className="ready-column"
            >
              {returnItemsForColumn(READY)}
            </Column>
            {/*Ready section end*/}

            {/*Doing section start*/}
            <Column
              totalItem={returnItemNumberForColumn(DOING)}
              title={DOING}
              className="doing-column"
            >
              {returnItemsForColumn(DOING)}
            </Column>
            {/*Doing section end*/}

            {/*Review section start*/}
            <Column
              totalItem={returnItemNumberForColumn(REVIEW)}
              title={REVIEW}
              className="review-column"
            >
              {returnItemsForColumn(REVIEW)}
            </Column>
            {/*Review section end*/}

            {/*Blocked section start*/}
            <Column
              totalItem={returnItemNumberForColumn(BLOCKED)}
              title={BLOCKED}
              className="blocked-column"
            >
              {returnItemsForColumn(BLOCKED)}
            </Column>
            {/*Blocked section end*/}

            {/*Done section start*/}
            <Column
              totalItem={returnItemNumberForColumn(DONE)}
              title={DONE}
              className="done-column"
            >
              {returnItemsForColumn(DONE)}
            </Column>
            {/*Done section end*/}
          </DndProvider>
        </div>
      )}

      {isOpen && (
        <Modal
          modalHandler={modalHandler}
          teams={teams}
          submitHandler={submitHandler}
        />
      )}
      {editModalOpen && (
        <EditModal
          submitHandler={updateProjectHandler}
          data={editData}
          cancelEditHandler={cancelEditHandler}
          teams={teams}
        />
      )}
      <div className="flex-shrink-0 w-6"></div>
    </Template>
  );
};

export default Projects;
