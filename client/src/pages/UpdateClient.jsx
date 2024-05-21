import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate,useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';


export default function CreateClient() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [name, setName] = useState('')
    const [chinesename, setChineseName] = useState('')

    // console.log(formData);
    const {clientId} = useParams()

    const [publishError, setPublishError] = useState(null);
  
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
      try {
        const fetchClient = async () => {
          const res = await fetch(`/api/client/getclients?clientId=${clientId}`);
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
            setPublishError(data.message);
            return;
          }
          if (res.ok) {
            setPublishError(null);
            setFormData(data.clients[0]);
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
            setImageUploadError('Please select an image');
            return;
          }
          setImageUploadError(null);
          const storage = getStorage(app);
          const fileName = new Date().getTime() + '-' + file.name;
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, file);
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setImageUploadProgress(progress.toFixed(0));
            },
            (error) => {
              setImageUploadError('Image upload failed');
              setImageUploadProgress(null);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImageUploadProgress(null);
                setImageUploadError(null);
                setFormData({ ...formData, image: downloadURL });
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
        e.preventDefault();
        try {
          const res = await fetch(`/api/client/updateclient/${formData._id}/${currentUser._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (!res.ok) {
            setPublishError(data.message);
            return; 
          }
          
          if (res.ok) {
            setPublishError(null);
            navigate(`/client/${data.slug}`);
          }
        } catch (error) {
          setPublishError('Something went wrong');
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
              setFormData({ ...formData, refferFrom: e.target.value })
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
              setFormData({ ...formData, name: e.target.value })
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
              setFormData({ ...formData, chinesename: e.target.value })
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
              setFormData({ ...formData, idNum: e.target.value })
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
              setFormData({ ...formData, birthday: e.target.value })
            }
            value={formData.birthday}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
            value={formData.gender}
          >
            <option value='gender'>Select a gender</option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
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
            setFormData({ ...formData, description: value });
          }}
          value={formData.description}
        />
        <Button type='submit' gradientDuoTone='redToYellow'>
          Update
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  )
}
