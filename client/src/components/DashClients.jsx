import React from 'react'
import { Button, Select, TextInput,Table, Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector} from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function DashClients() {
  const {currentUser} = useSelector((state) => state.user)
  const [userClients, setUserClients] = useState([])
  // console.log(userClients);
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [clientIdToDelete, setClientIdToDelete] = useState('');

  // console.log(userClients);
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`/api/client/getclients?userId=${currentUser._id}`)
        const data = await res.json()
        if(res.ok) {
          setUserClients(data.clients)
          if(data.clients.length < 9){
            setShowMore(false)
          }
        }
        
      } catch (error) {
        console.log(error.message);
      }
    }
    if(currentUser.isAdmin) {
      fetchClients()
    }
  },[currentUser._id])

  const handleShowMore = async () => {
    const startIndex = userClients.length;
    try {
      const res = await fetch(`/api/client/getclients?userId=${currentUser._id}&&startIndex=${startIndex}`)
      const data = await res.json()
      if(res.ok) {
        setUserClients((prev)=> [...prev, ...data.clients])
        if (data.clients.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeleteClient = async () => {
    setShowModal(false);

    try {
      const res = await fetch(
        `/api/client/deleteclient/${clientIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserClients((prev) =>
          prev.filter((client) => client._id !== clientIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <div className='mb-4'>
      <form 
        // onSubmit={handleSubmit}
      >
        <TextInput
          type='text'
          placeholder='Search client...'
          rightIcon={AiOutlineSearch}
          className=' lg:inline'
          // value={searchTerm}
          // onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      </div>

      {currentUser.isAdmin && userClients.length > 0 ? (
        <>
          <Table hoverable className='shadow-md' >
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Gender</Table.HeadCell>
              <Table.HeadCell>Birthday</Table.HeadCell>
              <Table.HeadCell>updatedAt</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell><span>Edit</span></Table.HeadCell>
            </Table.Head>
            {
              userClients.map((client) => (
                <Table.Body className='divide-y' key={client._id}>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                    <Link className='font-medium text-gray-900 dark:text-white' to={`/client/${client.slug}`}>
                    {client.name}
                    </Link>
                  </Table.Cell>
                    <Table.Cell>
                    <Link className='font-medium text-gray-500 dark:text-white' to={`/client/${client.slug}`}>
                      <img
                        src={client.image}
                        alt={client.title}
                        className='w-20 h-10 object-cover bg-gray-500'
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{client.gender}</Table.Cell>
                  <Table.Cell>{client.birthday}</Table.Cell>
                  <Table.Cell>{new Date(client.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <span 
                      onClick={() => {
                        setShowModal(true)
                        setClientIdToDelete(client._id)
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className='text-teal-500 hover:underline' to={`/update-client/${client._id}`}>
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))
            }
          </Table>
          {
            showMore && (
              <button
                onClick={handleShowMore}
                className='w-full text-teal-500 self-center text-sm py-7'
              >
                Show more
              </button>
            )
          }
        </>
      ) : (
        <p>There is no clients yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this client?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteClient}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
