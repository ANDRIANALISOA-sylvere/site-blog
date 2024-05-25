import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useReactToPrint } from "react-to-print"

export default function ClientCvPage() {
  const { clientCvSlug } = useParams(); // Retrieve the client CV slug from URL parameters
  const [loading, setLoading] = useState(true); // State to handle loading status
  const [error, setError] = useState(false); // State to handle error status
  const [clientCv, setClientCv] = useState(null); // State to store client CV data
    // console.log(clientCv);
    const componentRef = useRef(); // Reference to the component for printing
  const handlePrint = useReactToPrint({
    content: () => componentRef.current, // Function to get the component to print
  });


  useEffect(() => {
    const fetchClientCv = async () => {
      try {
        setLoading(true); // Start loading
        const res = await fetch(`/api/client/getclients?slug=${clientCvSlug}`); // Fetch client CV data
        const data = await res.json();
        
        // console.log(data);
        if (!res.ok) {
          setError(true); // Set error if response is not OK
          setLoading(false); // Stop loading
          return;
        }
        if (res.ok) {
          setClientCv(data.clients[0]); // Set client CV data
          setLoading(false); // Stop loading
          setError(false); // Clear error
        }
      } catch (error) {
        setError(true); // Set error on exception
        setLoading(false); // Stop loading
      }
    };
    fetchClientCv();
  }, [clientCvSlug]); // Effect dependencies



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