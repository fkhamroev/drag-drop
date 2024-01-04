import React, { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

interface Task {
  id: string;
  name: string;
  status: string;
}

interface CreateTaskProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const CreateTask: React.FC<CreateTaskProps> = ({ tasks, setTasks }) => {
  const [task, setTask] = useState<Task>({
    id: "",
    name: "",
    status: "todo",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (task.name.length < 3)
      return toast.error("A task must have more than 3 characters");
    if (task.name.length > 100)
      return toast.error("A task must not be more than 100 characters");

    setTasks((prev) => {
      const list = [...prev, task];
      localStorage.setItem("tasks", JSON.stringify(list));
      return list;
    });

    toast.success("Task created");
    setTask({
      id: "",
      name: "",
      status: "todo",
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        value={task.name}
        onChange={(e) => {
          setTask({ ...task, id: uuidv4(), name: e.target.value });
        }}
      />
      <button type="submit" className="btn">
        Create
      </button>
    </form>
  );
};

export default CreateTask;
 