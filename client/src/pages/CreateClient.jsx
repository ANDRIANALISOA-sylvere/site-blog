import { Alert, Button, FileInput, Select, TextInput,Label, Radio } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import React, { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import Select1 from 'react-select';

const drivingOptions = [
  { value: '貨櫃車 ', label: '貨櫃車' },
  { value: '大巴士 ', label: '大巴士' },
  { value: '巴士 ', label: '巴士' },
  { value: '貨車 ', label: '貨車' },
  { value: '小車 ', label: '小車' },
  { value: '電單車 ', label: '電單車' },
];


export default function CreateClient() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});

    const [selectedDrivingOption, setSelectedDrivingOption] = React.useState([]);
    
    const handleChange = (option) => {
      setSelectedDrivingOption(option);
      // 更新formData
      setFormData({ ...formData, drivingLicense: option.map(o => o.value) });
    };

    console.log(formData);
    const [publishError, setPublishError] = useState(null);
  
    const navigate = useNavigate();

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
          const res = await fetch('/api/client/createclient', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          // console.log(formData);
          const data = await res.json();
          console.log(data);
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
    <div className='p-3 px-6 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>申請表</h1>
      <form 
        className='flex flex-col gap-4' 
        onSubmit={handleSubmit}
     >
      <div className='flex flex-col justify-evenly sm:flex-row gap-4'>
          <div className='flex w-full'>
            <label className=' flex items-center justify-center'>個案來源：</label>
            <TextInput
              type='text'
              placeholder='康復處  重返廳  自行申請   機構'
              // required
              id='clientname'
              className='flex-1 '
              onChange={(e) =>
                setFormData({ ...formData, refferFrom: e.target.value })
              }
            />
          </div>
          <div className='flex w-full'>
            <label className=' flex items-center justify-center'>登記日期：</label>
            <TextInput
                type='date'
                placeholder='登記日期：'
                // required
                id='clientname'
                className='flex-1'
                onChange={(e) =>
                  setFormData({ ...formData, registrationDate: e.target.value })
                }
            />
        </div>
      </div>

      <div className='flex flex-col sm:flex-row justify-between gap-4'>
        <div className='flex sm:w-1/2'>
          <label className=' flex items-center justify-center'>轉介社工：</label>
          <TextInput
              type='text'
              placeholder='轉介社工：'
              // required
              id='clientname'
              className='flex-1'
              onChange={(e) =>
                setFormData({ ...formData, refferWorker: e.target.value })
              }
            /> 
        </div>
        <div className='flex sm:w-1/2'>
          <label className=' flex items-center justify-center'>轉介社工電話：</label>
          <TextInput
                type='text'
                placeholder='轉介社工電話：'
                // required
                id='clientname'
                className='flex-1'
                onChange={(e) =>
                  setFormData({ ...formData, refferWorkerTel: e.target.value })
                }
          />
        </div>
        
      </div>

      <p className='mt-4'>基本資料：</p>
      <div className='flex justify-between flex-col sm:flex-row gap-4'>
        <div className='flex w-full'>
        <label className=' flex items-center justify-center'>英文姓名：</label>
          <TextInput
            type='text'
            placeholder='English Name'
            required
            id='clientname'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        <div className='flex w-full'>
          <label className=' flex items-center justify-center'>中文姓名：</label>
          <TextInput
              type='text'
              placeholder='Chinese Name'
              required
              id='clientname'
              className='flex-1'
              onChange={(e) =>
                setFormData({ ...formData, chinesename: e.target.value })
              }
          />
        </div>
      </div>

      <div className='flex justify-between'>
          <div className='flex gap-4 items-center w-3/4 justify-between border-4 border-teal-500 border-dotted p-3'>
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
                <div className='w-6 h-16'>
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
              className='w-20 h-30 object-cover'
            />
          )}
        </div>

      <div className='flex justify-between flex-col sm:flex-row gap-4'>
          <div className='flex w-full'>
            <label className=' flex items-center justify-center'>身份證號碼：</label>
            <TextInput
                type='text'
                placeholder='ID Number'
                // required
                id='clientid'
                className='flex-1'
                onChange={(e) =>
                  setFormData({ ...formData, idNum: e.target.value })
                }
            />
          </div>
          <div className='flex w-full'>
            <label className=' flex items-center justify-center'>出生日期：</label>
            <TextInput
              type='date'
              placeholder='birthday'
              // required
              id='clientname'
              className='flex-1'
              onChange={(e) =>
                setFormData({ ...formData, birthday: e.target.value })
              }
            />
          </div>
        </div>

      
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full'>
            <label className=' flex items-center justify-center'>姓別：</label>
              <Select
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className='flex-1'
              >
                <option value='   '>Select a gender</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
              </Select>
          </div>
          <div className='flex w-full'>
            <label className=' flex items-center justify-center'>籍貫：</label>
            <TextInput
                type='text'
                placeholder='籍貫'
                // required
                id='clientname'
                className='flex-1'
                onChange={(e) =>
                  setFormData({ ...formData, birthplace: e.target.value })
                }
              />
          </div>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full'>
            <label className=' flex items-center justify-center'>身高：</label>
            <TextInput
                type='text'
                placeholder='身高'
                // required
                id='clientname'
                className='flex-1'
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
            />
          </div>
          <div className='flex w-full'>
              <label className=' flex items-center justify-center'>體重：</label>
              <TextInput
                  type='text'
                  placeholder='體重'
                  // required
                  id='clientname'
                  className='flex-1'
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                />
          </div>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row justify-between'>

          <div className='flex w-full'>
              <label className=' flex items-center justify-center'>身體是否健全：</label>
              <div className='flex-1'>
                <input
                  type='radio'
                  id='healthy'
                  name='body'
                  value='健全'
                  onChange={(e) =>
                    setFormData({ ...formData, body: e.target.value })
                  }
                />
                <label htmlFor='healthy' className='mr-2'>健全</label>
                <input
                  type='radio'
                  id='unhealthy'
                  name='body'
                  value='不健全'
                  onChange={(e) =>
                    setFormData({ ...formData, body: e.target.value })
                  }
                />
                <label htmlFor='unhealthy'>不健全</label>
              </div>
          </div>

          <div className='flex w-full'>
          <label className=' flex items-center justify-center'>紋身：</label>
          <div className='flex-1'>
                <input
                  type='radio'
                  id='healthy'
                  name='tattoo'
                  value='有紋身'
                  onChange={(e) =>
                    setFormData({ ...formData, tattoo: e.target.value })
                  }
                />
                <label htmlFor='healthy' className='mr-2'>有紋身</label>
                <input
                  type='radio'
                  id='unhealthy'
                  name='tattoo'
                  value='沒有紋身'
                  onChange={(e) =>
                    setFormData({ ...formData, tattoo: e.target.value })
                  }
                />
                <label htmlFor='unhealthy'>沒有紋身</label>
              </div>
          </div>
        </div>

        

        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full'>
              <label className=' flex items-center justify-center'>婚姻狀況：</label>
                <Select
                  onChange={(e) =>
                    setFormData({ ...formData, maritalStatus: e.target.value })
                  }
                  className='flex-1'
                >
                  <option value='不詳'>不詳</option>
                  <option value='已婚'>已婚</option>
                  <option value='未婚'>未婚</option>
                  <option value='同居'>同居</option>
                  <option value='喪偶'>喪偶</option>
                  <option value='分居或離婚'>分居或離婚</option>
                  
                </Select>
          </div>
          <div className='flex w-full'>
              <label className=' flex items-center justify-center'>與配偶關係：</label>
                <Select
                  onChange={(e) =>
                    setFormData({ ...formData, spousalRealationship: e.target.value })
                  }
                  className='flex-1'
                >
                  <option value='未知'>未知</option>
                  <option value='良好'>良好</option>
                  <option value='一般'>一般</option> 
                  <option value='惡劣'>惡劣</option> 
                </Select>
          </div>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full'>
              <label className=' flex items-center justify-center'>子女數目：</label>
              <TextInput
                type='text'
                placeholder='子女數目'
                // required
                id='clientname'
                className='flex-1'
                onChange={(e) =>
                  setFormData({ ...formData, NumofChildren: e.target.value })
                }
            />
          </div>
          <div className='flex w-full'>
              <label className=' flex items-center justify-center'>與父母關係：</label>
                <Select
                  onChange={(e) =>
                    setFormData({ ...formData, parentingRelationship: e.target.value })
                  }
                  className='flex-1'
                >
                  <option value='未知'>未知</option>
                  <option value='良好'>良好</option>
                  <option value='一般'>一般</option> 
                  <option value='惡劣'>惡劣</option> 
                </Select>
          </div>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row justify-between mt-4'>

          <div className='flex w-full'>
              <label className=' flex items-center justify-center'>犯罪記錄：</label>
              <div className='flex-1 flex items-center'>
                <input
                  type='radio'
                  id='criminal'
                  name='behavior'
                  value='有犯罪'
                  onChange={(e) =>
                    setFormData({ ...formData, criminalRecord: e.target.value })
                  }
                />
                <label htmlFor='criminal' className='mr-2'>有</label>
                <input
                  type='radio'
                  id='nonCriminal'
                  name='behavior'
                  value='沒有犯罪'
                  onChange={(e) =>
                    setFormData({ ...formData, criminalRecord: e.target.value })
                  }
                />
                <label htmlFor='nonCriminal'>沒有</label>
              </div>
          </div>

        <div className='flex w-full'>
          <label className=' flex items-center justify-center'>案件名稱：</label>
          <TextInput
              type='text'
              placeholder='案件名稱'
              // required
              id='clientname'
              className='flex-1'
              onChange={(e) =>
                setFormData({ ...formData, caseName: e.target.value })
              }
            /> 
        </div>
        </div>

        <div className='mb-4'>
          <label className=' flex '>案件詳情：</label>
          <ReactQuill
            theme='snow'
            placeholder='請填寫刑期、緩刑、假釋、感化令等年期'
            className='h-24 mb-12'
            // required
            onChange={(value) => {
              setFormData({ ...formData, caseDetail: value });
            }}
          />
        </div>

        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full sm:w-2/3'>
            <label className=' flex items-center justify-center '>住址：</label>
            <TextInput
                type='text'
                placeholder='住址'
                // required
                id='clientname'
                className='flex-1'
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
            />
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>電話：</label>
              <TextInput
                  type='text'
                  placeholder='電話'
                  // required
                  id='clientname'
                  className='flex-1'
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNum: e.target.value })
                  }
                />
          </div>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full sm:w-2/3'>
            <label className=' flex items-center justify-center '>電郵地址：</label>
            <TextInput
                type='text'
                placeholder='電郵地址'
                // required
                id='clientname'
                className='flex-1'
                onChange={(e) =>
                  setFormData({ ...formData, emailAddress: e.target.value })
                }
            />
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>微信：</label>
              <TextInput
                  type='text'
                  placeholder='微信'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, wechat: e.target.value })
                  }
                />
          </div>
        </div>

        <p className='mt-4'>學歷：</p>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full sm:w-2/3'>
            <label className=' flex items-center justify-center '>學校名稱：</label>
            <TextInput
                type='text'
                placeholder='學校名稱'
                // required
                id='clientname'
                className='flex-1'
                onChange={(e) =>
                  setFormData({ ...formData, school1: e.target.value })
                }
            />
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>教育程度：</label>
              <TextInput
                  type='text'
                  placeholder='教育程度'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, school1Sert: e.target.value })
                  }
                />
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>就讀期間：</label>
              <TextInput
                  type='text'
                  placeholder='就讀期間'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, school1date: e.target.value })
                  }
                />
          </div>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full sm:w-2/3'>
            <label className=' flex items-center justify-center '>學校名稱：</label>
            <TextInput
                type='text'
                placeholder='學校名稱'
                // required
                id='clientname'
                className='flex-1'
                onChange={(e) =>
                  setFormData({ ...formData, school2: e.target.value })
                }
            />
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>教育程度：</label>
              <TextInput
                  type='text'
                  placeholder='教育程度'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, school2Sert: e.target.value })
                  }
                />
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>就讀期間：</label>
              <TextInput
                  type='text'
                  placeholder='就讀期間'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, school2date: e.target.value })
                  }
                />
          </div>
        </div>

        <p className='mt-4'>工作經驗及要求：</p>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full sm:w-1/3 '>
            <label className=' flex items-center justify-center '>職稱：</label>
            <TextInput
                type='text'
                placeholder='職稱'
                // required
                id='clientname'
                className='flex-1'
                onChange={(e) =>
                  setFormData({ ...formData, post1name: e.target.value })
                }
            />
          </div>
          <div className='flex w-full sm:w-2/3 '>
              <label className=' flex items-center justify-center'>公司名稱：</label>
              <TextInput
                  type='text'
                  placeholder='公司名稱'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, post1company: e.target.value })
                  }
                />
          </div>
        </div>

        
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>薪金：</label>
              <TextInput
                  type='text'
                  placeholder='薪金'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, post1salary: e.target.value })
                  }
                />
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>起始年月：</label>
              <TextInput
                  type='text'
                  placeholder='起始年月'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, post1date: e.target.value })
                  }
                />
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>離職原因：</label>
              <TextInput
                  type='text'
                  placeholder='離職原因'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, post1reason: e.target.value })
                  }
                />
          </div>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row justify-between mt-4'>
          <div className='flex w-full sm:w-1/3 '>
            <label className=' flex items-center justify-center '>職稱：</label>
            <TextInput
                type='text'
                placeholder='職稱'
                // required
                id='clientname'
                className='flex-1'
                onChange={(e) =>
                  setFormData({ ...formData, post2name: e.target.value })
                }
            />
          </div>
          <div className='flex w-full sm:w-2/3 '>
              <label className=' flex items-center justify-center'>公司名稱：</label>
              <TextInput
                  type='text'
                  placeholder='公司名稱'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, post2company: e.target.value })
                  }
                />
          </div>
        </div>

        
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>薪金：</label>
              <TextInput
                  type='text'
                  placeholder='薪金'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, post2salary: e.target.value })
                  }
                />
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>起始年月：</label>
              <TextInput
                  type='text'
                  placeholder='起始年月'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, post2date: e.target.value })
                  }
                />
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>離職原因：</label>
              <TextInput
                  type='text'
                  placeholder='離職原因'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, post2reason: e.target.value })
                  }
                />
          </div>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row justify-between mt-4'>
          <div className='flex w-full sm:w-1/3 '>
            <label className=' flex items-center justify-center '>公開就業職位：</label>
            <TextInput
                type='text'
                placeholder='公開就業職位'
                // required
                id='clientname'
                className='flex-1'
                onChange={(e) =>
                  setFormData({ ...formData, employmentPost: e.target.value })
                }
            />
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>期望工作職位：</label>
              <TextInput
                  type='text'
                  placeholder='期望工作職位'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, expactEmploymentPost: e.target.value })
                  }
                />
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>期望薪資：</label>
              <TextInput
                  type='text'
                  placeholder='期望薪資'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, expactSalary: e.target.value })
                  }
                />
          </div>
        </div>

        <p className='mt-4'>個人才能：</p>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>專長：</label>
              <TextInput
                  type='text'
                  placeholder='專長'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, strengths: e.target.value })
                  }
                /> 
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>興趣：</label>
              <TextInput
                  type='text'
                  placeholder='興趣'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, interest: e.target.value })
                  }
                />
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>專業技術證書：</label>
              <TextInput
                  type='text'
                  placeholder='專業技術證書'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, skillSert: e.target.value })
                  }
                />
          </div>
        </div>


        <p className='mt-4'>語言能力：</p>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full sm:w-1/2 '>
              <label className=' flex items-center justify-center'>粵語：</label>
                <Select
                  onChange={(e) =>
                    setFormData({ ...formData, cantonese: e.target.value })
                  }
                  className='flex-1'
                >
                  <option value='未知'>未知</option>
                  <option value='熟悉'>熟悉</option>
                  <option value='一般'>一般</option>
                  <option value='略懂'>略懂</option> 
                  <option value='不懂'>不懂</option> 
                </Select>
          </div>
          <div className='flex w-full sm:w-1/2 '>
              <label className=' flex items-center justify-center'>國語：</label>
                <Select
                  onChange={(e) =>
                    setFormData({ ...formData, mandarin: e.target.value })
                  }
                  className='flex-1'
                >
                  <option value='未知'>未知</option>
                  <option value='熟悉'>熟悉</option>
                  <option value='一般'>一般</option>
                  <option value='略懂'>略懂</option> 
                  <option value='不懂'>不懂</option> 
                </Select>
          </div>
          
        </div>

        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full sm:w-1/2 '>
              <label className=' flex items-center justify-center'>英語：</label>
                <Select
                  onChange={(e) =>
                    setFormData({ ...formData, english: e.target.value })
                  }
                  className='flex-1'
                >
                  <option value='未知'>未知</option>
                  <option value='熟悉'>熟悉</option>
                  <option value='一般'>一般</option>
                  <option value='略懂'>略懂</option> 
                  <option value='不懂'>不懂</option> 
                </Select>
          </div>
          <div className='flex w-full sm:w-1/2 '>
              <label className=' flex items-center justify-center'>葡語：</label>
                <Select
                  onChange={(e) =>
                    setFormData({ ...formData, portuguese: e.target.value })
                  }
                  className='flex-1'
                >
                  <option value='未知'>未知</option>
                  <option value='熟悉'>熟悉</option>
                  <option value='一般'>一般</option>
                  <option value='略懂'>略懂</option> 
                  <option value='不懂'>不懂</option> 
                </Select>
          </div>
          
        </div>

        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>聽寫：</label>
                <Select
                  onChange={(e) =>
                    setFormData({ ...formData, listenAndWriting: e.target.value })
                  }
                  className='flex-1'
                >
                  <option value='未知'>未知</option>
                  <option value='熟悉'>熟悉</option>
                  <option value='一般'>一般</option>
                  <option value='略懂'>略懂</option> 
                  <option value='不懂'>不懂</option> 
                </Select>
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>速記：</label>
                <Select
                  onChange={(e) =>
                    setFormData({ ...formData, shorthand: e.target.value })
                  }
                  className='flex-1'
                >
                  <option value='未知'>未知</option>
                  <option value='熟悉'>熟悉</option>
                  <option value='一般'>一般</option>
                  <option value='略懂'>略懂</option> 
                  <option value='不懂'>不懂</option> 
                </Select>
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>中文輸入：</label>
                <Select
                  onChange={(e) =>
                    setFormData({ ...formData, chineseType: e.target.value })
                  }
                  className='flex-1'
                >
                  <option value='倉頡'>倉頡</option>
                  <option value='速成'>速成</option>
                  <option value='五筆'>五筆</option>
                  <option value='拼音'>拼音</option>
                </Select>
          </div>
          
        </div>

        <p className='mt-4'>文書處理：</p>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>聽寫：</label>
              <Select
                  onChange={(e) =>
                    setFormData({ ...formData, listenAndWriting: e.target.value })
                  }
                  className='flex-1'
                >
                  <option value='未知'>未知</option>
                  <option value='熟悉'>熟悉</option>
                  <option value='一般'>一般</option>
                  <option value='略懂'>略懂</option> 
                  <option value='不懂'>不懂</option> 
                </Select>
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>速記：</label>
              <Select
                  onChange={(e) =>
                    setFormData({ ...formData, shorthand: e.target.value })
                  }
                  className='flex-1'
                >
                  <option value='未知'>未知</option>
                  <option value='熟悉'>熟悉</option>
                  <option value='一般'>一般</option>
                  <option value='略懂'>略懂</option> 
                  <option value='不懂'>不懂</option> 
                </Select>
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>中文輸入：</label>
              <Select
                  onChange={(e) =>
                    setFormData({ ...formData, chineseType: e.target.value })
                  }
                  className='flex-1'
                >
                  <option value='未知'>未知</option>
                  <option value='熟悉'>熟悉</option>
                  <option value='一般'>一般</option>
                  <option value='略懂'>略懂</option> 
                  <option value='不懂'>不懂</option> 
                </Select>
          </div>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>Word：</label>
              <Select
                  onChange={(e) =>
                    setFormData({ ...formData, word: e.target.value })
                  }
                  className='flex-1'
                >
                  <option value='未知'>未知</option>
                  <option value='熟悉'>熟悉</option>
                  <option value='一般'>一般</option>
                  <option value='略懂'>略懂</option> 
                  <option value='不懂'>不懂</option> 
                </Select>
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>Excel：</label>
              <Select
                  onChange={(e) =>
                    setFormData({ ...formData, excel: e.target.value })
                  }
                  className='flex-1'
                >
                  <option value='未知'>未知</option>
                  <option value='熟悉'>熟悉</option>
                  <option value='一般'>一般</option>
                  <option value='略懂'>略懂</option> 
                  <option value='不懂'>不懂</option> 
                </Select>
          </div>
          <div className='flex w-full sm:w-1/3 '>
              <label className=' flex items-center justify-center'>PowerPoint：</label>
              <Select
                  onChange={(e) =>
                    setFormData({ ...formData, powerpoint: e.target.value })
                  }
                  className='flex-1'
                >
                  <option value='未知'>未知</option>
                  <option value='熟悉'>熟悉</option>
                  <option value='一般'>一般</option>
                  <option value='略懂'>略懂</option> 
                  <option value='不懂'>不懂</option> 
                </Select>
          </div>
        </div>

        <p className='mt-4'>其他：</p>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <div className='flex w-full '>
            <label className=' flex items-center justify-center'>駕駛執照：</label>
            <Select1
              isMulti
              value={selectedDrivingOption}
              onChange={handleChange}
              options={drivingOptions}
              className='flex-1'
            />
          </div>
          <div className='flex items-center w-full'>
              <label className=' flex items-center justify-center'>關於駕照的其他詳情：：</label>
              <TextInput
                  type='text'
                  placeholder='關於駕照的其他詳情'
                  // required
                  id='clientname'
                  className='flex-1' 
                  onChange={(e) =>
                    setFormData({ ...formData, drivingDetail: e.target.value })
                  }
                />
          </div>
              
          
        </div>
        
       
        <Button type='submit' gradientDuoTone='redToYellow'>
          確定
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