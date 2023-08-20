import React, { useEffect, useState } from 'react';
import styles from './ProfileForm.module.css';
import { Button, Container, TextField, Typography } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { toast } from 'react-toastify';

import { profileAction, profileImageAction } from 'slices/userSlice';
import ImageUploader from 'components/Shared/ImageUploader';
import { useDispatch, useSelector } from 'react-redux';
import Navigation from 'components/Navigation/Navigation';

const ProfileForm = () => {
    const dispatch = useDispatch();
    const handleInputChange = (event) => {
        const { name, value } = event.target;
      };
    
    // @ts-ignore
    const user = useSelector((state) => state.user.user);
    const [date, setDate] = useState(null);
    const [isDateValid, setIsDateValid] = useState(false);
    const [isDateTouched, setIsDateTouched] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [picture, setPicture] = useState(null);
    const isSeller = user.userRole === 'SELLER';

    useEffect(() => {
        if (user.dateOfBirth) {
          setDate(new Date(user.dateOfBirth));
        }
      }, [user.dateOfBirth]);
    
    const dateChangeHandler = (value) => {
        setDate(value);
        setIsDateTouched(true);
        setIsDateValid(value < new Date());
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
        user.picture = file;
    };

    const handleSubmit = (event) => {
      const formData = new FormData(event.currentTarget);


      const firstName = formData.get('firstName');
      const lastName = formData.get('lastName');

      if(firstName.toString().trim().match(/\d+/g) || lastName.toString().trim().match(/\d+/g)) {
        toast.error('Numbers not allowed in the first name and last name fields', {
          position: 'top-center',
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: false,
        });
        return;
      }

        formData.append('pictureFile', picture);
        if(date) {
          formData.append('dateOfBirth', date.toUTCString())
        }
        event.preventDefault();

        
        // @ts-ignore
        dispatch(profileAction(formData));
    };
      
    return (
      <>
      <Navigation/>
      <Container className={styles.container}>
        <div className={styles.formContainer}>
          <Typography variant="h2" component="h2" className={styles.title}>
            Profile
          </Typography>
          <div className={styles.imageContainer}>
              {user.picture ? (
                <img
                  src={`data:image/jpg;base64,${user.picture}`}
                  alt="Uploaded"
                  className={styles.image}
                />
              ) : (
                <div className={styles.placeholder}>No image</div>
              )}
            </div>
          <form className={styles.form} onSubmit={handleSubmit}>

            <TextField
              margin="normal"
              className={styles.input}
              label="First Name"
              name="firstName"
              defaultValue={user.firstName}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              className={styles.input}
              label="Last Name"
              name="lastName"
              defaultValue={user.lastName}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              className={styles.input}
              label="Address"
              name="address"
              defaultValue={user.address}
              onChange={handleInputChange}
            />
            <TextField
              disabled
              margin="normal"
              className={styles.input}
              label="Status"
              name="status"
              defaultValue={user.userStatus}
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
                defaultValue={new Date(user.dateOfBirth || new Date())}
              />
            <div>
              <label>Change Picture:</label>
            <input type="file" accept="image/*" onChange={(e) => setPicture(e.target.files[0])} />
          </div>
            <Button
              type="submit"
              variant="contained"
              className={styles.button}
            >
              Update
            </Button>
          </form>
        </div>
      </Container>
    </>
  );
};

export default ProfileForm;

