import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState,useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {useReactToPrint} from "react-to-print"

export default function ClientCvPage() {
  const { clientCvSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [clientCv, setClientCv] = useState(null);
    // console.log(clientCv);
    const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  useEffect(() => {
    const fetchClientCv = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/client/getclients?slug=${clientCvSlug}`);
        const data = await res.json();
        
        // console.log(data);
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setClientCv(data.clients[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchClientCv();
  }, [clientCvSlug]);



  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

    

  return (
    <main>
      <div ref={componentRef} className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h1 className='text-center '>履歷</h1>
        <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
          {clientCv && clientCv.name}
        </h1>
        <div className='flex justify-around'>
          <Link
              to={`/searchclient?gender=${clientCv && clientCv.gender}`}
              className='self-center'
          >
              <Button color='gray' pill size='xs'>
              {clientCv && clientCv.gender}
              </Button>
          </Link>
          <h2>Birthday: {clientCv && clientCv.birthday}</h2>
        </div>
        
        <img
          src={clientCv && clientCv.image}
          alt={clientCv && clientCv.name}
          className='mt-10 p-3 max-h-[600px] w-1/4 object-cover'
        />
        <div
          className='p-3 max-w-2xl mx-auto w-full post-content'
          dangerouslySetInnerHTML={{ __html: clientCv && clientCv.description }}
        ></div>
      {/* <button onClick={generatePDF}>PDF</button> */}
      </div>
      <div className='flex justify-center mb-10'>
        <button
        onClick={handlePrint}
        >
          生成 PDF
        </button>
      </div>

    </main>

  );
}