import { createBrowserRouter } from 'react-router-dom'
import Main from '../layouts/Main'
import Home from '../pages/Home/Home'
import ErrorPage from '../pages/ErrorPage'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import RoomDetails from '../pages/RoomDetails/RoomDetails'
import DashboardLayout from '../layouts/DashboardLayout'
import Statistics from '../pages/Dashboard/Common/Statistics'
import MyListings from '../pages/Dashboard/Admin/MyListings'
import AddRoom from '../pages/Dashboard/Admin/AddRoom'
import Profile from '../pages/Dashboard/Common/Profile'
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers'
import PrivateRoute from './PrivateRoute'
import HostRoutes from './HostRoutes'
import AdminRoutes from './AdminRoutes'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/room/:id',
        element: <RoomDetails />,
      },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
  {
    path: 'dashboard',
    element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    children: [
      {
        index: true,
        element: <PrivateRoute><Statistics></Statistics></PrivateRoute>
      },
      {
        path: 'my-listings',
        element:
          <PrivateRoute>
            <HostRoutes>
              <MyListings></MyListings>
            </HostRoutes>
          </PrivateRoute>
      },
      {
        path: 'add-room',
        element:
          <PrivateRoute>
            <HostRoutes><AddRoom></AddRoom></HostRoutes>
          </PrivateRoute>

      },
      {
        path: 'manage-users',
        element:
          <PrivateRoute>
            <AdminRoutes>
              <ManageUsers></ManageUsers>
            </AdminRoutes>
          </PrivateRoute>
      },
      {
        path: 'profile',
        element: <PrivateRoute><Profile></Profile></PrivateRoute>
      },
    ]
  }
])
