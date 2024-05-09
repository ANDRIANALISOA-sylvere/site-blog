import React from 'react'
import { Button, Select, TextInput,Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector} from 'react-redux'


export default function DashClients() {
  const {currentUser} = useSelector((state) => state.user)
  const [userClients, setUserClients] = useState([])
  console.log(userClients);
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`/api/client/getclients?userId=${currentUser._id}`)
        const data = await res.json()
        if(res.ok) {
          setUserClients(data.clients)
        }
        
      } catch (error) {
        console.log(error.message);
      }
    }
    if(currentUser.isAdmin) {
      fetchClients()
    }
  },[currentUser._id])

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <div>
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
                  <Table.Cell><span className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span></Table.Cell>
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
        </>
      ) : (
        <p>There is no clients yet!</p>
      )}
    </div>
  )
}
