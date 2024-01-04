import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import "./App.css";
import CreateTask from "./components/CreateTask";
import ListTasks from "./components/ListTasks";
import { Toaster } from "react-hot-toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";

interface TaskType {
  id: string;
  name: string;
  status: string;
}

function App() {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster />
      <div className="app">
        <CreateTask tasks={tasks} setTasks={setTasks} />
        <ListTasks tasks={tasks} setTasks={setTasks} />
      </div>
    </DndProvider>
  );
}

export default App;
