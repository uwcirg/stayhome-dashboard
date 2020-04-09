import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Demographics from './Demographics';
import CarePlan from "./CarePlan";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} timeout={350}/>;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

export default function ProfileDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  let {info} = props;
 
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTabValue(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const title = `Profile for ${info.email?info.email: '#'+info.id}`

  return (
    <div>
      <Button id="profilePlaceholderButton" variant="outlined" className="hide" color="primary" onClick={handleOpen}></Button>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              {title}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose} className="btn-primary">
              close
            </Button>
          </Toolbar>
        </AppBar>
        <Paper square>
          <Tabs
            value={tabValue}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleTabChange}
            aria-label="profile tabs"
            className="profile-tabs-container"
          >
            <Tab label="Demographics"/>
            <Tab label="Questionnaires" />
          </Tabs>
        </Paper>
        <TabPanel value={tabValue} index={0}>
          <Demographics info={info}></Demographics>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <CarePlan userId={info.id} />
        </TabPanel>
        <Box className="profile-footer"><Button variant="outlined" onClick={handleClose}>Back to Accounts List</Button></Box>
      </Dialog>
    </div>
  );
}
