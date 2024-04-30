import logo from './logo.svg';
import CoursesList from './components/CoursesList2';
import './App.css';
import TasksTable from './components/TaskTable';
import Activities from './components/Activities';

function App() {
  return (
    <div className="container">
      <CoursesList />
      <TasksTable />
    </div>
  );
}

export default App;
