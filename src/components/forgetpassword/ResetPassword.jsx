import React,{useEffect,useState} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// import axios from "../config/axiosConfig.js";
import AxiosService from '../../utils/AxiosService.jsx';
import ApiRoutes from "../../utils/ApiRoutes.jsx";
import { Button, Spinner} from 'react-bootstrap';
import toast from 'react-hot-toast';
import './forgetpassword.css'
const ResetPassword = () => {
  const [loading, setLoading] = useState(true);
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string().required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Required"),
    }),

    onSubmit: async (values) => {
        const { newPassword } = values;
        const token = window.location.pathname.split("/").pop();
        console.log(token)
        try{
          setLoading(false);
            let res = await AxiosService.post(`${ApiRoutes.RESETPASSWORD.path}/${token}`,{newPassword},{
                authenticate:ApiRoutes.RESETPASSWORD.authenticate
            })
            if(res.status=200){
                toast.success(res.data.message);
                setTimeout(() => {
                    window.location.href = "/dashboard";
                  }, 2000);
            }
             else {
                    toast.error("Your link has expired")
                    window.location.href = "/dashboard";
                    setLoading(true)
                  }
        }
        catch(error){
            toast.error(error.res.data.message || error.message)
            setLoading(true)
        }
        },
      }); 

  return (
    <div  id='loginWrapper'>
       <div id='loginHeader'>
    <h2>Update New Password Here !!</h2>
  </div>
    <form onSubmit={formik.handleSubmit} id="formGroup">
      <label htmlFor="newPassword" id="formLabel">New Password</label>
      <input
      id="formControl"
        name="newPassword"
        type="password"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.newPassword}
      />
      {formik.touched.newPassword && formik.errors.newPassword ? (
        <div>{formik.errors.newPassword}</div>
      ) : null}

      <label htmlFor="confirmPassword" id="formLabel">Confirm Password</label>
      <input
         id="formControl"
        name="confirmPassword"
        type="password"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.confirmPassword}
      />
      {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
        <div>{formik.errors.confirmPassword}</div>
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

export default ResetPassword;
