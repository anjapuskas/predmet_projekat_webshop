import React, { useState } from 'react';
import styles from './RegistrationForm.module.css';
import { Button, Container, Link, TextField, Typography, Select, MenuItem, FormControlLabel, RadioGroup, FormLabel, Radio } from '@mui/material';
import { DatePicker, DesktopDatePicker } from '@mui/x-date-pickers';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { registerAction } from 'slices/userSlice';
import { useNavigate } from 'react-router';

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registered = useSelector((state) => state.user.registered);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  };

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [date, setDate] = useState(null);
  const [isDateValid, setIsDateValid] = useState(false);
  const [isDateTouched, setIsDateTouched] = useState(false);
  const [userRole, setUserRole] = useState('SELLER');
  const [picture, setPicture] = useState(null);

  const dateChangeHandler = (value) => {
    setDate(value);
    setIsDateTouched(true);
    setIsDateValid(value < new Date());
  };

  const handleUserRoleChange = (event) => {
    setUserRole(event.target.value);
  };

  const handleSubmit = (event) => {
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username');
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    const passwordRepeat = formData.get('passwordRepeat');
    const address = formData.get('address');
    formData.append('pictureFile', picture);
    if(date) {
      formData.append('dateOfBirth', date.toUTCString())
    }
    formData.append('userRole', userRole);
    

    if (
      username == null ||
      firstName == null ||
      lastName == null ||
      email == null ||
      password == null ||
      passwordRepeat == null
    ) {
      return;
    }

    event.preventDefault();

    if(firstName.toString().trim().match(/\d+/g) || lastName.toString().trim().match(/\d+/g)) {
      toast.error('Numbers not allowed in the first name and last name fields', {
        position: 'top-center',
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
      });
      return;
    }

    if( !userRole || (!(userRole === 'BUYER' || userRole === 'SELLER'))) {
      toast.error('Please choose a role', {
        position: 'top-center',
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
      });
      return;
    }

    if (password.length < 8) {
      toast.error('Password needs to be at least 8 characters long', {
        position: 'top-center',
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
      });
      return;
    }

    if (password !== passwordRepeat) {
      toast.error('Passwords do not match', {
        position: 'top-center',
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
      });
      return;
    }

    // @ts-ignore
    dispatch(registerAction(formData))
    if(registered) {
      navigate('/login');
    }
  };

  return (
    <Container className={styles.container}>
      <div className={styles.formContainer}>
        <Typography variant="h2" component="h2" className={styles.title}>
          Registration Form
        </Typography>
        <form className={styles.form} onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            className={styles.input}
            label="Username"
            name="username"
            required
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            className={styles.input}
            label="First Name"
            name="firstName"
            required
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            className={styles.input}
            label="Last Name"
            name="lastName"
            required
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            type='email'
            className={styles.input}
            label="Email"
            name="email"
            required
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            className={styles.input}
            label="Password"
            name="password"
            type="password"
            required
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            className={styles.input}
            label="Repeat Password"
            name="passwordRepeat"
            type="password"
            required
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            className={styles.input}
            label="Address"
            name="address"
            onChange={handleInputChange}
          />
          <DesktopDatePicker
            format="dd/MM/yyyy"
            // @ts-ignore
            fullWidth
            disableFuture
            label="Birthday"
            error={isDateTouched && !isDateValid}
            onChange={(value) => dateChangeHandler(new Date(value))}
          />
          <FormLabel id='RoleLabel'>User Role</FormLabel>
          <RadioGroup
            aria-labelledby='RoleLabel'
            defaultValue='1'
            value={userRole}
            onChange={handleUserRoleChange}
          >
            <FormControlLabel value='SELLER' control={<Radio />} label='Seller' />
            <FormControlLabel value='BUYER' control={<Radio />} label='Buyer' />
          </RadioGroup>
          <div>
            <label>Picture:</label>
            <input type="file" accept="image/*" onChange={(e) => setPicture(e.target.files[0])} />
          </div>

          <Button type="submit" variant="contained" className={styles.button}>
            Register
          </Button>
        </form>
        <div className={styles.registrationLink}>
          <Typography variant="body1" component="span">
            Already have an account?{' '}
          </Typography>
          <Link href="/login" className={styles.link}>
            Login here
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default RegistrationForm;
