import React,{useEffect,useState} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AxiosService from "../../utils/AxiosService.jsx";
import ApiRoutes from "../../utils/ApiRoutes.jsx";
import toast from 'react-hot-toast'
import './forgetpassword.css'
import {Link} from 'react-router-dom'
import { Button, Spinner} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (values) => {
    try{
        setLoading(false);
        let res = await AxiosService.post(ApiRoutes.FORGETPASSWORD.path,values,{
            authenticate:ApiRoutes.FORGETPASSWORD.authenticate
        })
        if(res.status==200){
            toast.success("Email sent successfully, Kindly check Mail for update password");
            navigate(`/login`)
        }
        else {
                toast.error("Email not found");
                setLoading(true)
              }
    }
    catch(error){
        toast.error(error.response.data.message || error.message)
        setLoading(true)
    }
    },
  });

  return (
    <div id='loginWrapper'>
        <div id='loginHeader'>
    <h2>Forget Password</h2>
    <p>We’ll send a Link to this email, if it matches an existing account.</p>
  </div>
    <form onSubmit={formik.handleSubmit}  id="formGroup">
      <label htmlFor="mail" id="formLabel">Email</label>
      <input
       id="formControl"
        // id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email ? (
        <div>{formik.errors.email}</div>
      ) : null}
 {loading ? ( 
       <>
          <Button  id="btnPrimary" type="submit">Submit </Button>
       </>
      ) : ( 
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </form>
    </div>
  );
};

export default ForgetPassword;
