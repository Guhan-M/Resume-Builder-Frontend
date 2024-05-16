import React,{useEffect,useState} from "react";
import { Button,Spinner} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import {Link} from 'react-router-dom'
import toast from 'react-hot-toast';
import AxiosService from '../utils/AxiosService'
import ApiRoutes from "../utils/ApiRoutes";
import { useNavigate } from "react-router-dom";
import "./loginstyle.css"
function Login(){
const navigate = useNavigate()
const [loading, setLoading] = useState(true);

useEffect(()=>{
    sessionStorage.clear()
},[])

const handleLogin = async (e)=>{
    e.preventDefault()
    try{
        setLoading(false);
        let formData= new FormData(e.target)
        let data= Object.fromEntries(formData)
        console.log(data)
        if(data.email && data.password){
            let res = await AxiosService.post(ApiRoutes.LOGIN.path,data,{
                authenticate:ApiRoutes.LOGIN.authenticate
            })
            if(res.status==200){
                console.log(res)
                sessionStorage.setItem('token',res.data.token)
                sessionStorage.setItem('role',res.data.role)
                sessionStorage.setItem('name',res.data.name)
                sessionStorage.setItem('id',res.data.id)
                toast.success(res.data.message)
                if(res.data.role==='user')
                    navigate(`/profile/${res.data.id}`)
                    // profile + id send 
            }
        }
        else{
            toast.error("Input Email and Password")
        }
    }
    catch(error){
        toast.error(error.response.data.message || error.message)
    }
}

return <>

<div id='loginWrapper'>
  <div id='loginHeader'>
    <h2>Login Here</h2>
    <p  id='loginHeaderp'>New here? Don't worry <Link to='/signup'>Sign Up here</Link></p>
  </div>
  <Form onSubmit={handleLogin}>
    <Form.Group id="formGroup" className="mb-3">
      <Form.Label id="formLabel">Email address</Form.Label>
      <Form.Control id="formControl" type="email" placeholder="Enter email" name='email' />
    </Form.Group>

    <Form.Group id="formGroup" className="mb-3">
      <Form.Label id="formLabel">Password</Form.Label>
      <Form.Control id="formControl" type="password" placeholder="Password" name='password' />
    </Form.Group>
    {loading ? ( 
       <>
           <Button id="btnPrimary" variant="primary" type="submit">
          Submit
        </Button>
       </>
      ) : ( 
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
     <Link id='forgetstyle' to='/forgetpassword'>Forget Password</Link>
  </Form>
</div>
</>

}

export default Login 
