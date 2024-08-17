import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Grid,
  Paper,
  IconButton,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  InputBase
} from '@mui/material';
import { Menu as MenuIcon, Add as AddIcon, Refresh as RefreshIcon, Timeline as TimelineIcon, Search as SearchIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Create a theme with a primary color of sky blue
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { paper: '#e0f7fa' }, // Sky blue background for the sidebar
  },
  typography: { fontFamily: 'Roboto, Arial, sans-serif' },
});

// Initial data setup
const initialData = {
  categories: [
    {
      id: 1,
      name: "CSPM Executive Dashboard",
      widgets: [
        {
          id: 1,
          name: "Cloud Accounts",
          type: "circular",
          data: [
            { name: 'Connected', value: 70 },
            { name: 'Not Connected', value: 30 },
          ],
        },
        {
          id: 2,
          name: "Cloud  Risk Assessment",
          type: "circular",
          data: [
            { name: 'Failed', value: 10 },
            { name: 'Warning', value: 30 },
            { name: 'Not Available', value: 20 },
            { name: 'Passed', value: 40 },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "CWPP Dashboard",
      widgets: [
        {
          id: 3,
          name: "Top 5 Namespaces Specific Alerts",
          type: "bar",
          data: [
            { name: 'Alert 1', value: 400 },
            { name: 'Alert 2', value: 300 },
            { name: 'Alert 3', value: 300 },
            { name: 'Alert 4', value: 200 },
            { name: 'Alert 5', value: 100 },
          ],
        },
      ],
    },
  ],
};

// Colors for different statuses
const statusColors = {
  'Connected': '#4caf50', // Green
  'Not Connected': '#f44336', // Red
  'Failed': '#f44336', // Red
  'Warning': '#ff9800', // Orange
  'Not Available': '#9e9e9e', // Grey
  'Passed': '#4caf50', // Green
};

// Colors for different alerts
const alertColors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

const Dashboard = () => {
  const [data, setData] = useState(initialData);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [widgetName, setWidgetName] = useState('');
  const [widgetType, setWidgetType] = useState('circular');
  const [widgetData, setWidgetData] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddWidget = () => {
    if (selectedCategoryId === null) return;

    const newWidget = {
      id: Date.now(), // Unique ID for the widget
      name: widgetName,
      type: widgetType,
      data: Array.isArray(widgetData) ? widgetData : [], // Ensure data is an array
    };

    const updatedCategories = data.categories.map((category) => {
      if (category.id === selectedCategoryId) {
        return {
          ...category,
          widgets: [...category.widgets, newWidget],
        };
      }
      return category;
    });
    setData({ ...data, categories: updatedCategories });
    handleCloseDialog();
  };

  const handleRemoveWidget = (categoryId, widgetId) => {
    const updatedCategories = data.categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          widgets: category.widgets.filter((widget) => widget.id !== widgetId),
        };
      }
      return category;
    });
    setData({ ...data, categories: updatedCategories });
  };

  const handleOpenDialog = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setWidgetName('');
    setWidgetType('circular');
    setWidgetData([]);
  };

  const handleWidgetDataChange = (index, field, value) => {
    const updatedData = [...widgetData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setWidgetData(updatedData);
  };

  const handleAddDataEntry = () => {
    setWidgetData([...widgetData, { name: '', value: '' }]);
  };

  const handleRemoveDataEntry = (index) => {
    const updatedData = widgetData.filter((_, i) => i !== index);
    setWidgetData(updatedData);
  };

  const handleRefresh = () => {
    setData(initialData); // Reset data to initial state
  };

  const renderCircularProgress = (widget) => {
    const data = Array.isArray(widget.data) ? widget.data : [];
    
    if (!data.length) {
      return (
        <Box sx={{ p: 2, bgcolor: theme.palette.background.paper, borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>{widget.name}</Typography>
          <Typography variant="body1">No data available</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ p: 2, bgcolor: theme.palette.background.paper, borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>{widget.name}</Typography>
        <PieChart width={320} height={320}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill={theme.palette.primary.main}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={statusColors[entry.name] || alertColors[index % alertColors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Box>
    );
  };

  const renderBarChart = (widget) => {
    const data = Array.isArray(widget.data) ? widget.data : [];

    return (
      <Box sx={{ p: 2, bgcolor: theme.palette.background.paper, borderRadius: 1 }}>
        <Typography variant="h6">{widget.name}</Typography>
        <BarChart width={290} height={280} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill={theme.palette.primary.main} />
        </BarChart>
      </Box>
    );
  };

  // Filter categories based on the search term
  const filteredCategories = data.categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Drawer
          variant="persistent"
          open={sidebarOpen}
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              bgcolor: '#e0f7fa', // Sky blue color for the sidebar
              color: '#000', // Black text color for the sidebar
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {filteredCategories.map((category) => (
                <ListItem button key={category.id} onClick={() => handleOpenDialog(category.id)}>
                  <ListItemText primary={category.name} sx={{ color: '#000' }} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
          <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleSidebar}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                 Dashboard
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#e0f7fa', borderRadius: 1 }}>
                <SearchIcon sx={{ color: '#000' }} />
                <InputBase
                  placeholder="Search…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ ml: 1, flex: 1 }}
                />
              </Box>
              <IconButton color="inherit" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
              <IconButton color="inherit" onClick={handleOpenDialog}>
                <AddIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box
  sx={{
    width: '60%',
    bgcolor: '#dc004e', 
    py: 2, // Add some vertical padding
    display: 'flex',
    justifyContent: 'center',
    color: 'WHITE',
    // marginLeft:'0%',
  
  }}
>
  <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
    <Typography variant="h5" noWrap component="div"   >
      CNAPP DASHBOARD
    </Typography>
  </Box>
</Box>
          <Toolbar />
        
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {filteredCategories.map((category) => (
                <Grid item xs={12} key={category.id}>


                  <Typography variant="h4" gutterBottom>
                    {category.name}
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ ml: 2 }}
                      onClick={() => handleOpenDialog(category.id)}
                    >
                      Add Widget
                    </Button>
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {category.widgets.map((widget) => (
                      <Grid item xs={12} sm={6} md={4} key={widget.id}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                          {widget.type === 'circular' ? renderCircularProgress(widget) : renderBarChart(widget)}
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleRemoveWidget(category.id, widget.id)}
                          >
                            Remove Widget
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Add Widget</DialogTitle>
          <DialogContent>
            <InputLabel>Widget Name</InputLabel>
            <TextField
              autoFocus
              margin="dense"
              label="Widget Name"
              fullWidth
              variant="outlined"
              value={widgetName}
              onChange={(e) => setWidgetName(e.target.value)}
            />
            <InputLabel>Widget Type</InputLabel>
            <Select
              value={widgetType}
              onChange={(e) => setWidgetType(e.target.value)}
              fullWidth
              margin="dense"
            >
              <MenuItem value="circular">Circular Progress</MenuItem>
              <MenuItem value="bar">Bar Chart</MenuItem>
            </Select>
            <InputLabel>Widget Data</InputLabel>
            {widgetData.map((dataEntry, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <TextField
                  margin="dense"
                  label={`Name ${index + 1}`}
                  fullWidth
                  variant="outlined"
                  value={dataEntry.name || ''}
                  onChange={(e) => handleWidgetDataChange(index, 'name', e.target.value)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  margin="dense"
                  label={`Value ${index + 1}`}
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={dataEntry.value || ''}
                  onChange={(e) => handleWidgetDataChange(index, 'value', parseInt(e.target.value))}
                />
                {/* <Button variant="contained" color="error" onClick={() => handleRemoveDataEntry(index)}>
                  Remove
                </Button> */}
                
              </Box>
            ))}
            <Button variant="contained" color="primary" onClick={handleAddDataEntry}>
              Add Data Entry
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddWidget} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;