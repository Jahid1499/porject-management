import moment from "moment";
import { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import editImage from "../../assets/images/edit_button.svg";
import {
  useChangeStatusMutation,
  useDeleteProjectMutation,
} from "../../features/projects/projectsApi";
import { COLUMN_NAMES } from "./constants";

const MovableItem = ({
  name,
  index,
  currentColumnName,
  moveCardHandler,
  setItems,
  item: projectItem,
  border = false,
  editModal,
}) => {
  const { user: loggedInUser } = useSelector((state) => state.auth) || {};
  const { email: myEmail, avatar } = loggedInUser || {};
  const [deleteProject, { isSuccess: deleteSuccess }] =
    useDeleteProjectMutation();
  const [changeStatus] = useChangeStatusMutation();

  const { id, title, team, timestamp, creator } = projectItem || {};

  const changeItemColumn = (currentItem, columnName) => {
    setItems((prevState) => {
      return prevState.map((e) => {
        return {
          ...e,
          status: e.title === currentItem.name ? columnName : e.status,
        };
      });
    });

    if (columnName !== currentItem.currentColumnName) {
      changeStatus({
        id,
        data: {
          status: columnName,
        },
      });
    }
  };
  const ref = useRef(null);
  const [_, drop] = useDrop({
    accept: "Our first type",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCardHandler(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    item: { index, name, currentColumnName },
    type: "Our first type",
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        const { name } = dropResult;
        const { BACKLOG, READY, DOING, REVIEW, BLOCKED, DONE } = COLUMN_NAMES;

        switch (name) {
          case BACKLOG:
            changeItemColumn(item, BACKLOG);
            break;
          case READY:
            changeItemColumn(item, READY);
            break;
          case DOING:
            changeItemColumn(item, DOING);
            break;
          case REVIEW:
            changeItemColumn(item, REVIEW);
            break;
          case BLOCKED:
            changeItemColumn(item, BLOCKED);
            break;
          case DONE:
            changeItemColumn(item, DONE);
            break;
          default:
            break;
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));
  const { BACKLOG } = COLUMN_NAMES;

  const deleteHandler = (id, email) => {
    if (myEmail === email) {
      deleteProject(id);
    } else {
      swal(
        "Warning",
        "Sorry! This project creator only deleted this project!",
        "warning"
      );
    }
  };

  useEffect(() => {
    if (deleteSuccess) {
      swal("Success", "Successfully project deleted!", "success");
    }
  }, [deleteSuccess]);

  return (
    <>
      <div ref={ref} className="movable-item" style={{ opacity }}>
        <div
          className={`relative flex ${
            border && `border-2 border-indigo-600`
          } flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100`}
        >
          {currentColumnName === BACKLOG && (
            <>
              <button
                onClick={() => editModal(projectItem, creator.email)}
                className="absolute top-0 right-6 flex items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex"
              >
                <img src={editImage} alt="Edit project" title="Edit project" />
              </button>

              <button
                onClick={() => deleteHandler(id, creator.email)}
                className="absolute top-0 right-0 flex items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M 10.806641 2 C 10.289641 2 9.7956875 2.2043125 9.4296875 2.5703125 L 9 3 L 4 3 A 1.0001 1.0001 0 1 0 4 5 L 20 5 A 1.0001 1.0001 0 1 0 20 3 L 15 3 L 14.570312 2.5703125 C 14.205312 2.2043125 13.710359 2 13.193359 2 L 10.806641 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z"
                  ></path>
                </svg>
              </button>
            </>
          )}

          <span
            className={`flex items-center h-6 px-3 text-xs font-semibold capitalize text-${team.color}-500 bg-${team.color}-100 rounded-full`}
          >
            {team.name}
          </span>
          <h4 className="mt-3 text-sm font-medium">{title}</h4>
          <div className="flex items-center w-full mt-3 text-xs font-medium text-gray-400">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-gray-300 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-1 leading-none">
                {moment(timestamp).format("MMM DD")}
              </span>
            </div>
            <img
              className="w-6 h-6 ml-auto rounded-full"
              src={creator.avatar}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MovableItem;
