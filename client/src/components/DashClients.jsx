import React from 'react'
import { Button, Select, TextInput,Table, Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector,useDispatch} from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function DashClients() {
  const {currentUser} = useSelector((state) => state.user)
  const [userClients, setUserClients] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [clientIdToDelete, setClientIdToDelete] = useState('');
  const [searchClientTerm, setSearchClientTerm]=useState('')

  const [filteredClients, setFilteredClients] = useState([]);
  const [genderFilter, setGenderFilter] = useState('all');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`/api/client/getclients`)
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

  useEffect(() => {
    let clients = userClients;
    if (searchClientTerm) {
      clients = clients.filter((client) =>
        client.name.toLowerCase().includes(searchClientTerm.toLowerCase())
      );
    }
    if (genderFilter !== 'all') {
      clients = clients.filter((client) => client.gender === genderFilter);
    }
    setFilteredClients(clients);
  }, [searchClientTerm, userClients, genderFilter]);

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
    <form onSubmit={(e) => e.preventDefault()} className='mb-5'>
          <input
            type="text"
            value={searchClientTerm}
            onChange={(e) => setSearchClientTerm(e.target.value)}
            placeholder="Search Client..."
            className=' w-1/4 border disabled:cursor-not-allowed disabled:opacity-50  mr-5 border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm pr-10 rounded-lg'
          />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className='mr-5 w-1/8 border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg'
          >
            <option value="all">All Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <button type="submit">Enter</button>
    </form>
      {currentUser.isAdmin && filteredClients.length > 0 ? (
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
              filteredClients.map((client) => (
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
                  <Table.Cell>
                    <Link className='text-teal-500 hover:underline' to={`/clientcv/${client.slug}`}>
                      <span>CV</span>
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
