import React from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import AppRoutes from './utils/AppRoutes'
export const API_URL = 'https://resume-builder-backend-aap4.onrender.com'
import './index.css'
function App() {
  const router= createBrowserRouter(AppRoutes)
  return <>
  <RouterProvider router={router}/>
  </>
}
export default App
