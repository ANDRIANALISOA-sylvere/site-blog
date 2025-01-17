import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';
import CreateClient from './pages/CreateClient';
import UpdateClient from './pages/UpdateClient'
import SearchClient from './pages/SearchClient';
import ClientPage from './pages/ClientPage'
import ClientCvPage from './pages/ClientCvPage'
import Forgot from './pages/Forgot';
import Reset from './pages/Reset';

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
    <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/search' element={<Search />} />
        <Route path='/forgot' element={<Forgot />} />
        <Route path='/resetpassword/:resetToken' element={<Reset />} />
        
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
          <Route path='/create-client' element={<CreateClient />} />
          <Route path='/update-client/:clientId' element={<UpdateClient />} />
          <Route path='/client/:clientSlug' element={<ClientPage />} />
          <Route path='/clientcv/:clientCvSlug' element={<ClientCvPage />} />
          <Route path='/searchclient' element={<SearchClient />} />
        </Route>
        {/* <Route path='/projects' element={<Projects />} /> */}
        <Route path='/post/:postSlug' element={<PostPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
