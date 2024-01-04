import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEdit } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { useDrag, useDrop } from "react-dnd";
import Modal from "./Modal";
import { v4 as uuidv4 } from 'uuid'; // Импорт uuid

interface TaskType {
  id: string;
  name: string;
  status: string;
}

const ListTasks: React.FC<{ tasks: TaskType[], setTasks: React.Dispatch<React.SetStateAction<TaskType[]>> }> = ({ tasks, setTasks }) => {
  const [todos, setTodos] = useState<TaskType[]>([]);
  const [inProgress, setInProgress] = useState<TaskType[]>([]);
  const [closed, setClosed] = useState<TaskType[]>([]);

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

const Section: React.FC<{ status: string, tasks: TaskType[], setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>, todos: TaskType[], inProgress: TaskType[], closed: TaskType[] }> = ({ status, tasks, setTasks, todos, inProgress, closed }) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "task",
      drop: (item: { id: string }) => addItemToSection(item.id, status),
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

  const addItemToSection = (id: string, status: string) => {
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

const Header: React.FC<{ text: string, count: number, status: string }> = ({ text, count, status }) => {
  let bgStyle: React.CSSProperties = {};

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

const Task: React.FC<{ task: TaskType, tasks: TaskType[], setTasks: React.Dispatch<React.SetStateAction<TaskType[]>> }> = ({ task, tasks, setTasks }) => {
  const [editedTaskName, setEditedTaskName] = useState<string>(task.name);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [draggingEnabled, setDraggingEnabled] = useState<boolean>(true);

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

  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTaskName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
