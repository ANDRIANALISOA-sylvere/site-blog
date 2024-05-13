import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';


export default function ClientPage() {
  const { clientSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/client/getclients?slug=${clientSlug}`);
        const data = await res.json();
        // console.log(data);
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setClient(data.clients[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchClient();
  }, [clientSlug]);



  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
      {client && client.chinesename}{client && client.name} 
      </h1>
      <div className='flex justify-around'>
        <div className='flex'>
          <h3>姓別：</h3>
          <p>{client && client.gender}</p>
        </div>
        
        <h2>Birthday: {client && client.birthday}</h2>
      </div>
      
      <img
        src={client && client.image}
        alt={client && client.name}
        className='mt-10 p-3 max-h-[600px] w-1/4 object-cover'
      />
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: client && client.description }}
      ></div>
    </main>
  );
}