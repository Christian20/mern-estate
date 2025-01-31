import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  // Firebase Stoarge Rules:
  // allow read;
  // allow write: if 
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  const handleFileUpload = async (file) => {
    setFileUploadError(false); // reset error when a new upload starts
    setFilePercentage(0); // reset percentage when a new upload starts

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setFilePercentage(progress);
      },
      (error) => {
        setFileUploadError(true);
        setFilePercentage(0); // reset on failure

      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL });
          });
      }
    );
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileUploadError(false); // reset error on new selection
      setFilePercentage(0); // reset percentage on new selection
      setFile(selectedFile);
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]); // trigger upload when file changes

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input 
          onChange={handleFileChange} 
          type='file' 
          ref={fileRef} 
          hidden 
          accept='image/*' 
        />
        <img 
          onClick={() => fileRef.current.click()} 
          src={formData.avatar || currentUser.avatar} 
          alt='profile' 
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' 
        />
        <p className='text-sm self-center'>
          { fileUploadError ? (
            <span className='text-red-700'>Error uploading file</span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className='text-slate-700'>Uploading... {filePercentage}%</span>
          ) : filePercentage === 100 && !fileUploadError ? (
            <span className='text-green-700'>File uploaded</span>)
            : (
              ''
          )}
        </p>
        <input 
          type='text' 
          placeholder='username' 
          id='username' 
          className='border p-3 rounded-lg' 
          value={currentUser.name} 
        />
        <input 
          type='email' 
          placeholder='email' 
          id='email' 
          className='border p-3 rounded-lg' 
          value={currentUser.email} 
        />
        <input 
          type='password' 
          placeholder='password' 
          id='password' 
          className='border p-3 rounded-lg' 
          value={currentUser.password} 
        />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
