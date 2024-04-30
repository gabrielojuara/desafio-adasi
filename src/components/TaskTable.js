import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TasksList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState('');
  const [error, setError] = useState(null);
  const [newActivityDate, setNewActivityDate] = useState('');
  const [newActivityScheduledStart, setNewActivityScheduledStart] = useState('');
  const [newActivityScheduledEnd, setNewActivityScheduledEnd] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudentCpf, setSelectedStudentCpf] = useState('');
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchStudents();
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

  const handleCreateActivityClick = (taskId) => {
    setSelectedTaskId(taskId);
  };

  const handleActivityDateChange = (e) => {
    setNewActivityDate(e.target.value);
  };

  const handleActivityScheduledStartChange = (e) => {
    setNewActivityScheduledStart(e.target.value);
  };

  const handleActivityScheduledEndChange = (e) => {
    setNewActivityScheduledEnd(e.target.value);
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/v1/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Erro ao buscar estudantes:', error);
    }
  };

  const handleStudentChange = (e) => {
    setSelectedStudentCpf(e.target.value);
  };

  const handleCreateActivity = async () => {
    try {
      const newActivity = {
        studentCpf: selectedStudentCpf,
        date: newActivityDate,
        scheduledStart: newActivityScheduledStart,
        scheduledEnd: newActivityScheduledEnd,
        taskIds: [selectedTaskId],
      };
      const response = await axios.post('http://localhost:3000/v1/activities', newActivity);
      console.log('Atividade criada:', response.data);
      fetchTasks();
      fetchActivities(); // Atualiza a lista de atividades automaticamente
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
    }
  };

  const handleViewActivities = async (taskId) => {
    try {
      const response = await axios.get('http://localhost:3000/v1/activities');
      const filteredActivities = response.data.filter(activity => activity.tasks.some(task => task.id === taskId));
      setActivities(filteredActivities);
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:3000/v1/activities');
      setActivities(response.data);
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
    }
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
                  className="btn btn-danger btn-sm mr-2"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Excluir
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleCreateActivityClick(task.id)}
                >
                  Criar Atividade
                </button>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleViewActivities(task.id)}
                >
                  Ver Atividades
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedTaskId && (
        <div>
          <h2>Criar Atividade</h2>
          <div className="mb-3">
            <label htmlFor="activityDate">Data:</label>
            <input
              type="datetime-local"
              id="activityDate"
              value={newActivityDate}
              onChange={handleActivityDateChange}
              className="form-control mr-2"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="activityScheduledStart">Início Agendado:</label>
            <input
              type="datetime-local"
              id="activityScheduledStart"
              value={newActivityScheduledStart}
              onChange={handleActivityScheduledStartChange}
              className="form-control mr-2"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="activityScheduledEnd">Fim Agendado:</label>
            <input
              type="datetime-local"
              id="activityScheduledEnd"
              value={newActivityScheduledEnd}
              onChange={handleActivityScheduledEndChange}
              className="form-control mr-2"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="studentCpf">Selecionar Estudante:</label>
            <select
              id="studentCpf"
              value={selectedStudentCpf}
              onChange={handleStudentChange}
              className="form-control mr-2"
            >
              <option value="">Selecione um CPF</option>
              {students.map(student => (
                <option key={student.cpf} value={student.cpf}>
                  {student.name} - {student.cpf}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleCreateActivity}
          >
            Criar Atividade
          </button>
        </div>
      )}
      <h2>Lista de Atividades</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Início Agendado</th>
            <th>Fim Agendado</th>
            <th>Estudante</th>
            <th>Tarefa</th>
          </tr>
        </thead>
        <tbody>
          {activities.map(activity => (
            <tr key={activity.id}>
              <td>{activity.id}</td>
              <td>{activity.date}</td>
              <td>{activity.scheduledStart}</td>
              <td>{activity.scheduledEnd}</td>
              <td>{activity.student.name}</td>
              <td>{activity.tasks.map(task => task.name).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksList;
