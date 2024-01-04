import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { useDrag, useDrop } from "react-dnd";
import Modal from "./Modal";

const ListTasks = ({ tasks, setTasks }) => {
  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [closed, setClosed] = useState([]);

  useEffect(() => {
    const fTodos = tasks.filter((task) => task.status === "todo");
    const fInProgress = tasks.filter((task) => task.status === "inprogress");

    const fClosed = tasks.filter((task) => task.status === "closed");

    setTodos(fTodos);
    setInProgress(fInProgress);
    setClosed(fClosed);
  }, [tasks]);

  const statuses = ["todo", "inprogress", "closed"];

  return (
    <div className="tasks-list">
      {statuses.map((status, index) => (
        <Section
          key={index}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          todos={todos}
          inProgress={inProgress}
          closed={closed}
        />
      ))}
    </div>
  );
};

export default ListTasks;

const Section = ({ status, tasks, setTasks, todos, inProgress, closed }) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "task",
      drop: (item) => addItemToSection(item.id, status),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [status]
  );

  let text = "Todo";
  let tasksToMap = todos;

  if (status === "inprogress") {
    text = "In Progress";
    tasksToMap = inProgress;
  }

  if (status === "closed") {
    text = "Closed";
    tasksToMap = closed;
  }

  const addItemToSection = (id, status) => {
    setTasks((prev) => {
      const updatedTasks = prev.map((t) => {
        if (t.id === id) {
          return { ...t, status: status };
        }
        return t;
      });
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      toast("Task status changed", { icon: "🔄️" });
      return updatedTasks;
    });
  };

  const filteredTasks = tasks.filter((task) => task.status === status);

  return (
    <div
      ref={drop}
      className="list-header"
      style={isOver ? { background: "rgba(128, 128, 128, 0.5)" } : {}}
    >
      <Header text={text} count={tasksToMap.length} status={status} />
      {filteredTasks.length > 0 &&
        filteredTasks.map((task) => (
          <Task key={task.id} task={task} tasks={tasks} setTasks={setTasks} />
        ))}
    </div>
  );
};

const Header = ({ text, count, status }) => {
  let bgStyle = {};

  if (status === "inprogress") {
    bgStyle.background = "red";
  } else if (status === "closed") {
    bgStyle.background = "green";
  }

  return (
    <div>
      <div className="list-text" style={bgStyle}>
        {text}
        <div className="list-count">{count}</div>
      </div>
    </div>
  );
};

const Task = ({ task, tasks, setTasks }) => {
  const [editedTaskName, setEditedTaskName] = useState(task.name);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggingEnabled, setDraggingEnabled] = useState(true);


  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const openModal = () => {
    setIsModalOpen(true);
    setDraggingEnabled(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDraggingEnabled(true);
  };

  const handleTaskNameChange = (e) => {
    setEditedTaskName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editedTaskName.length < 3) {
      return toast.error("A task must have more than 3 characters");
    }
    if (editedTaskName.length > 100) {
      return toast.error("A task must not be more than 100 characters");
    }

    const updatedTasks = tasks.map((t) => {
      if (t.id === task.id) {
        return { ...t, name: editedTaskName };
      }
      return t;
    });
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    toast("Task updated", { icon: "📝" });
    setIsModalOpen(false);
  };

  const handleClickRemove = () => {
    const filteredTasks = tasks.filter((t) => t.id !== task.id);
    setTasks(filteredTasks);
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
    toast("Task removed", { icon: "☠️" });
  };

  return (
    <div ref={drag} className="list-li" draggable={draggingEnabled}>
      <div>{task.name}</div>
      <div className="list-btns">
        <button className="list-edit">
          <FontAwesomeIcon icon={faEdit} onClick={openModal} />
        </button>
        <button className="list-remove">
          <FontAwesomeIcon icon={faTimes} onClick={handleClickRemove} />
        </button>
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <form onSubmit={handleSubmit} className="form-edit">
              <h2 className="form-title">Enter your task name</h2>
              <input
                type="text"
                value={editedTaskName}
                onChange={handleTaskNameChange}
                className="form-input"
              />
              <button type="submit" className="form-submit">
                Update Task
              </button>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};
