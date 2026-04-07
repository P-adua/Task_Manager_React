import { useState, useEffect } from "react";
import "./index.css";
import "./App.css";

function App() {
  const [input, setInput] = useState("");

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleAddTask() {
    if (input.trim() === "") return;

    const newTask = {
      text: input,
      completed: false,
      isEditing: false,
    };

    setTasks([...tasks, newTask]);
    setInput("");
  }

  function handleDeleteTask(indexToRemove) {
    const newTasks = tasks.filter((_, index) => index !== indexToRemove);
    setTasks(newTasks);
  }

  function handleToggleTask(indexToToggle) {
    const updatedTasks = tasks.map((task, index) => {
      if (index === indexToToggle) {
        return {
          ...task,
          completed: !task.completed,
        };
      }

      return task;
    });

    setTasks(updatedTasks);
  }

  function handleEditTask(indexToEdit) {
    const updatedTasks = tasks.map((task, index) => {
      if (index === indexToEdit) {
        return {
          ...task,
          isEditing: true,
        };
      }

      return task;
    });

    setTasks(updatedTasks);
  }

  function handleSaveTask(indexToSave, newText) {
    if (newText.trim() === "") return;

    const updatedTasks = tasks.map((task, index) => {
      if (index === indexToSave) {
        return {
          ...task,
          text: newText,
          isEditing: false,
        };
      }

      return task;
    });

    setTasks(updatedTasks);
  }

  return (
    <div className="container">
      <h1 className="title">Task Manager</h1>

      <div className="task-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTask();
            }
          }}
          placeholder="Digite uma tarefa..."
        />

        <button onClick={handleAddTask}>Adicionar</button>
      </div>

      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index} className={task.completed ? "completed" : ""}>
            {task.isEditing ? (
              <EditTask
                task={task}
                onSave={(newText) => handleSaveTask(index, newText)}
              />
            ) : (
              <>
                <span onClick={() => handleToggleTask(index)}>
                  {task.text}
                </span>

                <div className="task-actions">
                  <button onClick={() => handleEditTask(index)}>Editar</button>
                  <button onClick={() => handleDeleteTask(index)}>❌</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EditTask({ task, onSave }) {
  const [editedText, setEditedText] = useState(task.text);

  return (
    <div className="edit-task">
      <input
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSave(editedText);
          }
        }}
      />
      <button onClick={() => onSave(editedText)}>Salvar</button>
    </div>
  );
}

export default App;