import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'; // Importing components from flowbite-react
import ReactQuill from 'react-quill'; // Importing ReactQuill for rich text editing
import 'react-quill/dist/quill.snow.css'; // Importing CSS for ReactQuill
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'; // Importing functions from firebase storage
import { app } from '../firebase'; // Importing firebase app configuration
import { useEffect, useState } from 'react'; // Importing hooks from React
import { CircularProgressbar } from 'react-circular-progressbar'; // Importing CircularProgressbar for showing upload progress
import 'react-circular-progressbar/dist/styles.css'; // Importing CSS for CircularProgressbar
import { useNavigate, useParams } from 'react-router-dom'; // Importing hooks from react-router-dom
import { useSelector } from 'react-redux'; // Importing useSelector hook from react-redux

export default function CreateClient() {
    const [file, setFile] = useState(null); // State for storing the file object
    const [imageUploadProgress, setImageUploadProgress] = useState(null); // State for tracking upload progress
    const [imageUploadError, setImageUploadError] = useState(null); // State for storing any error during image upload
    const [formData, setFormData] = useState({}); // State for storing form data
    const [name, setName] = useState('') // State for storing name
    const [chinesename, setChineseName] = useState('') // State for storing Chinese name

    const {clientId} = useParams() // Getting clientId from URL parameters

    const [publishError, setPublishError] = useState(null); // State for storing any error during form submission
  
    const navigate = useNavigate(); // Hook for navigating programmatically
    const { currentUser } = useSelector((state) => state.user); // Getting currentUser from Redux store

    useEffect(() => {
      try {
        const fetchClient = async () => {
          const res = await fetch(`/api/client/getclients?clientId=${clientId}`); // Fetching client data
          const data = await res.json(); // Parsing JSON response
          if (!res.ok) {
            console.log(data.message);
            setPublishError(data.message); // Setting publish error if response is not ok
            return;
          }
          if (res.ok) {
            setPublishError(null);
            setFormData(data.clients[0]); // Setting form data if response is ok
          }
        };
  
        fetchClient();
      } catch (error) {
        console.log(error.message);
      }
    }, [clientId]);

    const handleUpdloadImage = async () => {
        try {
          if (!file) {
            setImageUploadError('Please select an image'); // Setting error if no file is selected
            return;
          }
          setImageUploadError(null);
          const storage = getStorage(app);
          const fileName = new Date().getTime() + '-' + file.name; // Creating a unique file name
          const storageRef = ref(storage, fileName); // Creating a reference to the storage location
          const uploadTask = uploadBytesResumable(storageRef, file); // Starting the upload task
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Calculating upload progress
              setImageUploadProgress(progress.toFixed(0)); // Updating upload progress state
            },
            (error) => {
              setImageUploadError('Image upload failed'); // Setting error on upload failure
              setImageUploadProgress(null);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImageUploadProgress(null);
                setImageUploadError(null);
                setFormData({ ...formData, image: downloadURL }); // Updating form data with image URL
              });
            }
          );
        } catch (error) {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
          console.log(error);
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault(); // Preventing default form submission behavior
        try {
          const res = await fetch(`/api/client/updateclient/${formData._id}/${currentUser._id}`, {
            method: 'PUT', // Making a PUT request
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Sending form data as JSON
          });
          const data = await res.json(); // Parsing JSON response
          if (!res.ok) {
            setPublishError(data.message); // Setting publish error if response is not ok
            return; 
          }
          
          if (res.ok) {
            setPublishError(null);
            navigate(`/client/${data.slug}`); // Navigating to the client page on successful update
          }
        } catch (error) {
          setPublishError('Something went wrong'); // Setting error on catch
        }
      };
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update a client</h1>
      <form 
        className='flex flex-col gap-4' 
        onSubmit={handleSubmit}
     >
      <div>
        <TextInput
            type='text'
            placeholder='個案來源'
            required
            id='clientname'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, refferFrom: e.target.value }) // Updating form data on input change
            }
            value={formData.refferFrom}
          />
      </div>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
        
          <TextInput
            type='text'
            placeholder='Name'
            required
            id='clientname'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value }) // Updating form data on input change
            }
            value={formData.name}
          />
          <TextInput
            type='text'
            placeholder='Name'
            required
            id='chinesename'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, chinesename: e.target.value }) // Updating form data on input change
            }
            value={formData.chinesename}
          />
          <TextInput
            type='text'
            placeholder='ID Number'
            required
            id='clientid'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, idNum: e.target.value }) // Updating form data on input change
            }
            value={formData.idNum}
          />
          <TextInput
            type='date'
            placeholder='birthday'
            required
            id='clientname'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, birthday: e.target.value }) // Updating form data on input change
            }
            value={formData.birthday}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value }) // Updating form data on select change
            }
            value={formData.gender}
          >
            <option value=' '>Select a gender</option>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])} // Setting file on file input change
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUpdloadImage} // Handling image upload on button click
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`} // Displaying upload progress
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill
          theme='snow'
          placeholder='Write description of the client'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, description: value }); // Updating form data on text editor change
          }}
          value={formData.description}
        />
        <Button type='submit' gradientDuoTone='redToYellow'>
          Update
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError} // Displaying publish error if any
          </Alert>
        )}
      </form>
    </div>
  )
}
