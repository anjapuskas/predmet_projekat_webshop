import React, { useRef } from 'react';
import styles from './ImageUploader.module.css';

const ImageUploader = ({ selectedImage, handleImageChange }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.container}>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
      <div className={styles.imageContainer} onClick={handleClick}>
        {selectedImage ? (
          <img
            src={`data:image/jpg;base64,${selectedImage}`}
            alt="Uploaded"
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>Select an Image</div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
