import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCourseName, setSelectedCourseName] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null); // Novo estado para armazenar o ID do curso selecionado
  const [newCourse, setNewCourse] = useState({
    name: '',
  });
  const [editCourseId, setEditCourseId] = useState(null);
  const [editCourseName, setEditCourseName] = useState('');
  const [editStudentId, setEditStudentId] = useState(null);
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentCPF, setEditStudentCPF] = useState('');
  const [editStudentRegistration, setEditStudentRegistration] = useState('');
  const [newStudentCPF, setNewStudentCPF] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRegistration, setNewStudentRegistration] = useState('');

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
      setSelectedCourseId(courseId); // Armazena o ID do curso selecionado
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

  const handleCreateStudent = async () => {
    try {
      const response = await axios.post('http://localhost:3000/v1/students', {
        cpf: newStudentCPF,
        name: newStudentName,
        registration: newStudentRegistration,
        courseId: selectedCourseId // Use o ID do curso selecionado
      });
      console.log('Estudante criado:', response.data);
      setNewStudentCPF('');
      setNewStudentName('');
      setNewStudentRegistration('');
      fetchStudents(); // Atualize a lista de estudantes após a criação de um novo estudante
    } catch (error) {
      console.error('Erro ao criar estudante:', error);
    }
  };

  const handleEditStudent = async (cpf) => {
    try {
      const response = await axios.patch(`http://localhost:3000/v1/students/${cpf}`, {
        name: editStudentName,
        registration: editStudentRegistration
      });
      console.log('Estudante editado:', response.data);
      fetchStudents(); // Atualize a lista de estudantes após a edição de um estudante
      setEditStudentId(null);
      setEditStudentName('');
      setEditStudentCPF('');
      setEditStudentRegistration('');
    } catch (error) {
      console.error('Erro ao editar estudante:', error);
    }
  };

  const handleDeleteStudent = async (cpf) => {
    try {
      await axios.delete(`http://localhost:3000/v1/students/${cpf}`);
      console.log('Estudante excluído:', cpf);
      fetchStudents(); // Atualize a lista de estudantes após a exclusão de um estudante
    } catch (error) {
      console.error('Erro ao excluir estudante:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/v1/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Erro ao buscar estudantes:', error);
    }
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
                    onClick={() => setEditCourseId(course.id)}
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
      <h2>{selectedCourseName ? `Estudantes do Curso: ${selectedCourseName}` : 'Estudantes'}</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>CPF</th>
            <th>Nome</th>
            <th>Matrícula</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.cpf}>
              <td>
                {editStudentId === student.cpf ? (
                  <input
                    type="text"
                    value={editStudentCPF}
                    onChange={(e) => setEditStudentCPF(e.target.value)}
                    className="form-control"
                  />
                ) : (
                  student.cpf
                )}
              </td>
              <td>
                {editStudentId === student.cpf ? (
                  <input
                    type="text"
                    value={editStudentName}
                    onChange={(e) => setEditStudentName(e.target.value)}
                    className="form-control"
                  />
                ) : (
                  student.name
                )}
              </td>
              <td>
                {editStudentId === student.cpf ? (
                  <input
                    type="text"
                    value={editStudentRegistration}
                    onChange={(e) => setEditStudentRegistration(e.target.value)}
                    className="form-control"
                  />
                ) : (
                  student.registration
                )}
              </td>
              <td>
                {editStudentId === student.cpf ? (
                  <button
                    className="btn btn-success btn-sm mr-2"
                    onClick={() => handleEditStudent(student.cpf)}
                  >
                    Salvar
                  </button>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm mr-2"
                      onClick={() => {
                        setEditStudentId(student.cpf);
                        setEditStudentCPF(student.cpf);
                        setEditStudentName(student.name);
                        setEditStudentRegistration(student.registration);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteStudent(student.cpf)}
                    >
                      Excluir
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Criar Novo Estudante</h2>
      <div className="mb-3">
        <input
          type="text"
          name="newStudentCPF"
          placeholder="CPF do Estudante"
          value={newStudentCPF}
          onChange={(e) => setNewStudentCPF(e.target.value)}
          className="form-control mr-2"
        />
        <input
          type="text"
          name="newStudentName"
          placeholder="Nome do Estudante"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          className="form-control mr-2"
        />
        <input
          type="text"
          name="newStudentRegistration"
          placeholder="Matrícula do Estudante"
          value={newStudentRegistration}
          onChange={(e) => setNewStudentRegistration(e.target.value)}
          className="form-control mr-2"
        />
        <button
          className="btn btn-primary btn-sm"
          onClick={handleCreateStudent}
        >
          Criar Estudante
        </button>
      </div>
    </div>
  );
};

export default CoursesList;
