import { Link } from 'react-router-dom'; // Import Link component from react-router-dom for navigation
import CallToAction from '../components/CallToAction'; // Import CallToAction component from components folder
import { useEffect, useState } from 'react'; // Import useEffect and useState hooks from React
import PostCard from '../components/PostCard'; // Import PostCard component from components folder

export default function Home() {
  const [posts, setPosts] = useState([]); // Initialize state for posts with an empty array

  useEffect(() => {
    const fetchPosts = async () => { // Define an asynchronous function to fetch posts
      const res = await fetch('/api/post/getPosts?limit=5'); // Fetch posts with a limit of 5 from the API
      const data = await res.json(); // Convert the response to JSON
      setPosts(data.posts); // Update the posts state with the fetched data
    };
    fetchPosts(); // Call the fetchPosts function when the component mounts
  }, []); // Empty dependency array means this effect runs only once after the initial render
  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Article</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          View all articles
        </Link>
      </div>
      {/* <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div> */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7 '>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6 '>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4 justify-center'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} /> // Map through posts and render a PostCard for each post
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}