// src/components/CoursesList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCourseName, setSelectedCourseName] = useState(null);
  const [newCourse, setNewCourse] = useState({
    name: '',
  });
  const [editCourseId, setEditCourseId] = useState(null);
  const [editCourseName, setEditCourseName] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/v1/courses');
      setCourses(response.data);
    } catch (error) {
      setError(error);
      console.error('Erro ao buscar cursos:', error);
    }
  };

  const handleCreateCourse = async () => {
    try {
      const response = await axios.post('http://localhost:3000/v1/courses', newCourse);
      console.log('Curso criado:', response.data);
      setNewCourse({ name: '' });
      fetchCourses();
    } catch (error) {
      console.error('Erro ao criar curso:', error);
    }
  };

  const handleEditCourse = async (id, newName) => {
    try {
      const response = await axios.patch(`http://localhost:3000/v1/courses/${id}`, { name: newName });
      console.log('Curso editado:', response.data);
      fetchCourses();
      setEditCourseId(null);
      setEditCourseName('');
    } catch (error) {
      console.error('Erro ao editar curso:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/v1/courses/${id}`);
      console.log('Curso excluído:', id);
      fetchCourses();
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
    }
  };

  const handleViewStudents = async (courseId) => {
    try {
      const response = await axios.get('http://localhost:3000/v1/students');
      const filteredStudents = response.data.filter(student => student.course.id === courseId);
      setStudents(filteredStudents);
      const selectedCourse = courses.find(course => course.id === courseId);
      setSelectedCourseName(selectedCourse.name);
    } catch (error) {
      console.error('Erro ao buscar estudantes:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (error) {
    return <div>Erro ao buscar cursos: {error.message}</div>;
  }

  return (
    <div>
      <h2>Lista de Cursos</h2>
      <div className="mb-3">
        <input
          type="text"
          name="name"
          placeholder="Nome do Curso"
          value={newCourse.name}
          onChange={handleInputChange}
          className="form-control mr-2"
        />
        <button
          className="btn btn-primary btn-sm mr-2"
          onClick={handleCreateCourse}
        >
          Criar Curso
        </button>
      </div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome do Curso</th>
            <th>Ações</th>
            <th>Ver Estudantes</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>
                {editCourseId === course.id ? (
                  <input
                    type="text"
                    value={editCourseName}
                    onChange={(e) => setEditCourseName(e.target.value)}
                    className="form-control"
                  />
                ) : (
                  course.name
                )}
              </td>
              <td>
                {editCourseId === course.id ? (
                  <button
                    className="btn btn-success btn-sm mr-2"
                    onClick={() => handleEditCourse(course.id, editCourseName)}
                  >
                    Salvar
                  </button>
                ) : (
                  <button
                    className="btn btn-warning btn-sm mr-2"
                    onClick={() => {
                      setEditCourseId(course.id);
                      setEditCourseName(course.name);
                    }}
                  >
                    Editar
                  </button>
                )}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  Excluir
                </button>
              </td>
              <td>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleViewStudents(course.id)}
                >
                  Ver Estudantes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {selectedCourseName && (
        <div>
          <h2>Lista de Estudantes do Curso {selectedCourseName}</h2>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Nome do Estudante</th>
                <th>CPF</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.cpf}>
                  <td>{student.name}</td>
                  <td>{student.cpf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
