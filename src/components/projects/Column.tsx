import { useDrop } from "react-dnd";
import { COLUMN_NAMES } from "./constants";
const Column = ({ children, className, title, totalItem, modalHandler }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "Our first type",
    drop: () => ({ name: title }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    /*canDrop: (item) => {
            return true;
           /!* const { BACKLOG, READY, DOING, REVIEW, BLOCKED, DONE} = COLUMN_NAMES;
            const { currentColumnName } = item;
            return (
                currentColumnName === title || (currentColumnName === READY && title === DOING) || (currentColumnName === DOING && (title === READY || title === REVIEW)) ||
                (currentColumnName === REVIEW && (title === DOING || title === DONE)) || (currentColumnName === DONE && title === REVIEW) || (currentColumnName === BACKLOG && (title === BLOCKED || title === REVIEW)) || (currentColumnName === BACKLOG && (title === DOING || title === DONE))
            );*!/
        }*/
  });

  const getBackgroundColor = () => {
    if (isOver) {
      if (canDrop) {
        return "rgb(188,251,255)";
      } else if (!canDrop) {
        return "rgb(255,188,188)";
      }
    } else {
      return "";
    }
  };

  const { BACKLOG } = COLUMN_NAMES;

  return (
    <>
      <div
        className={`flex flex-col flex-shrink-0 w-72 ${className}`}
        ref={drop}
        style={{ backgroundColor: getBackgroundColor() }}
      >
        <div className="flex items-center flex-shrink-0 h-10 px-2">
          <span className="block text-sm font-semibold">{title}</span>
          <span className="flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30">
            {totalItem}
          </span>

          {title === BACKLOG && (
            <button
              onClick={() => modalHandler()}
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
          )}
        </div>
        <div className="flex flex-col pb-2 overflow-auto">{children}</div>
      </div>
    </>
  );
};

export default Column;
