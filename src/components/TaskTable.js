import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TasksList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/v1/tasks');
      setTasks(response.data);
    } catch (error) {
      setError(error);
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const handleCreateTask = async () => {
    try {
      const response = await axios.post('http://localhost:3000/v1/tasks', { name: newTaskName });
      console.log('Tarefa criada:', response.data);
      setNewTaskName('');
      fetchTasks();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  const handleEditTask = async (taskId, newName) => {
    try {
      const response = await axios.patch(`http://localhost:3000/v1/tasks/${taskId}`, { name: newName });
      console.log('Tarefa editada:', response.data);
      setEditTaskId(null);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/v1/tasks/${taskId}`);
      console.log('Tarefa excluída:', taskId);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewTaskName(e.target.value);
  };

  const handleEditInputChange = (e) => {
    setEditTaskName(e.target.value);
  };

  const handleEditClick = (taskId, taskName) => {
    setEditTaskId(taskId);
    setEditTaskName(taskName);
  };

  if (error) {
    return <div>Erro ao buscar tarefas: {error.message}</div>;
  }

  return (
    <div>
      <h2>Lista de Tarefas</h2>
      <div className="mb-3">
        <input
          type="text"
          name="name"
          placeholder="Nome da Tarefa"
          value={newTaskName}
          onChange={handleInputChange}
          className="form-control mr-2"
        />
        <button
          className="btn btn-primary btn-sm"
          onClick={handleCreateTask}
        >
          Criar Tarefa
        </button>
      </div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome da Tarefa</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>
                {editTaskId === task.id ? (
                  <input
                    type="text"
                    value={editTaskName}
                    onChange={handleEditInputChange}
                    className="form-control"
                  />
                ) : (
                  task.name
                )}
              </td>
              <td>
                {editTaskId === task.id ? (
                  <button
                    className="btn btn-success btn-sm mr-2"
                    onClick={() => handleEditTask(task.id, editTaskName)}
                  >
                    Salvar
                  </button>
                ) : (
                  <button
                    className="btn btn-warning btn-sm mr-2"
                    onClick={() => handleEditClick(task.id, task.name)}
                  >
                    Editar
                  </button>
                )}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksList;
