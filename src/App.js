import { Check, Close } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Card,
  CardActions,
  Checkbox,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';



const theme = createTheme({
  palette: {
    primary: {
      main: '#657ef7',
    },
    background: {
      default: '#f9f9f9',
    },
  },
  // Other theme settings like typography, breakpoints, etc.
});

// Use styled API for creating styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  color: theme.palette.common.white,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: theme.shadows[1],
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

const ActionButtonContainer = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  color: theme.palette.text.secondary,
  alignItems: 'center',
  justifyContent: 'center',
  width: 30,
  height: 30,
  backgroundColor: '#e0e0e0', // Gray background
  borderRadius: '15%', // Circular border
  margin: theme.spacing(1),
}));

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Load tasks from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Function to add a new task
  const addTask = () => {
    if (!newTask.trim()) return; // Prevent adding empty tasks
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask(''); // Clear input field after adding
  };

  // Function to delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Function to toggle task completion
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };


  // Function to edit a task
  const startEdit = (id) => {
    setEditId(id);
    const taskToEdit = tasks.find((task) => task.id === id);
    setEditText(taskToEdit.text);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  const saveEdit = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text: editText } : task)));
    setEditId(null);
    setEditText('');
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') {
      return task.completed;
    } else if (filter === 'active') {
      return !task.completed;
    }
    return true;
  });

  // Function to handle the filter change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Function to handle the search change
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  // Filter tasks based on the search query
  const searchedTasks = filteredTasks.filter(task =>
    task.text.toLowerCase().includes(search.toLowerCase())
  );




  return (
    <ThemeProvider theme={theme}>
      <StyledContainer maxWidth="sm">
        <Typography variant="h4" style={{ marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
          TODO LIST
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Add New Task"
            variant="outlined"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            style={{ marginRight: '1rem', boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)' }}
          />
          <StyledButton
            variant="contained"
            onClick={addTask}
          >
            Add Task
          </StyledButton>
        </Box>


        <Select
          value={filter}
          onChange={handleFilterChange}
          fullWidth
          style={{ marginTop: '1rem', marginBottom: '2rem', boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)' }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>


        <TextField
          fullWidth
          label="Search Tasks 🔍"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          style={{ marginBottom: '2rem', boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)' }}
        />

        <List>
          {searchedTasks.map((task) => (
            <StyledCard key={task.id} variant="outlined">
              {editId === task.id ? (
                <ListItem style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                  />
                  <CardActions>
                    <IconButton edge="end" aria-label="save" onClick={() => saveEdit(task.id)}>
                      <Check />
                    </IconButton>
                    <IconButton edge="end" aria-label="cancel" onClick={cancelEdit}>
                      <Close />
                    </IconButton>
                  </CardActions>
                </ListItem>
              ) : (
                <ListItem
                  secondaryAction={
                    <CardActions>

                      <ActionButtonContainer edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
                        <DeleteIcon />
                      </ActionButtonContainer>
                      <ActionButtonContainer edge="end" aria-label="edit" onClick={() => startEdit(task.id)}>
                        <EditIcon />
                      </ActionButtonContainer>
                    </CardActions>
                  }
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={task.completed}
                      tabIndex={-1}
                      disableRipple
                      onChange={() => toggleComplete(task.id)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={task.text}
                    style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                  />
                </ListItem>
              )}
            </StyledCard>
          ))}
        </List>
      </StyledContainer>
    </ThemeProvider>
  );
}

export default App;
