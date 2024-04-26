import React from 'react'
import { Outlet, Navigate} from 'react-router-dom'
import {useSelector} from 'react-redux'

export default function OnlyAdminPrivateRoute() {
    const {currentUser} = useSelector((state) => state.user)
  return currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to='/sign-in'/>
}
