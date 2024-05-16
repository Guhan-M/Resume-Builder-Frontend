import React,{useEffect,useState} from "react";
import { Button,Spinner} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import {Link} from 'react-router-dom'
import toast from 'react-hot-toast';
import AxiosService from '../utils/AxiosService'
import ApiRoutes from "../utils/ApiRoutes";
import { useNavigate } from "react-router-dom";
import './signupstyle.css'
function Signup(){
const navigate = useNavigate();
const [loading, setLoading] = useState(true);

useEffect(()=>{
    sessionStorage.clear()
    // when new come to this page first clear the sessionstorage
},[])

const handleSignup = async (e)=>{
    e.preventDefault()
    try{
        setLoading(false);
        let formData= new FormData(e.target)
        let data= Object.fromEntries(formData) 
        console.log(data)
        if(data.email && data.password && data.name){
         
            let res = await AxiosService.post(ApiRoutes.SIGNUP.path,data,{
                authenticate:ApiRoutes.SIGNUP.authenticate
            })
            if(res.status==201){
                toast.success(res.data.message)
                navigate("/login")
            }
        }
        else{
            toast.error("Input Name,Email and Password")
            setLoading(true);
        }
    }
    catch(error){
        toast.error(error.response.data.message || error.message)
        setLoading(true);
    }
}

return <>
<div id='loginWrapper'>
    <div id='loginHeader'>
      <h2>Singup Here</h2>
      <p>Already have a account ?  <Link to='/login'>Login here</Link></p>
    </div>
    <Form onSubmit={handleSignup}>

    <Form.Group id="formGroup" className="mb-3">
        <Form.Label id="formLabel">Name</Form.Label>
        <Form.Control id="formControl"type="text" placeholder="Enter Name" name='name'/>
      </Form.Group>

      <Form.Group  id="formGroup" className="mb-3">
        <Form.Label id="formLabel">Email address</Form.Label>
        <Form.Control  id="formControl" type="email" placeholder="Enter email" name='email'/>
      </Form.Group>

      <Form.Group id="formGroup"  className="mb-3">
        <Form.Label id="formLabel">Password</Form.Label>
        <Form.Control id="formControl"  type="password" placeholder="Password" name='password'/>
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
    </Form>
  </div>
</>

}

export default Signup 
