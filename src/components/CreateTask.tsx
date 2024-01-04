import { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";



const CreateTask = ({ tasks, setTasks }) => {
  const [task, setTask] = useState({
    id: "",
    name: "",
    status: "todo",
  });

  console.log(task);

  const handleSubmit = (e) => {
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

    toast.success("Task created")
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
      <button className="btn">Create</button>
    </form>
  );
};

export default CreateTask;
