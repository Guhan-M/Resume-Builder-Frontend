import { useFormik } from "formik";
import * as Yup from "yup";
import AxiosService from "../../utils/AxiosService.jsx";
import ApiRoutes from "../../utils/ApiRoutes.jsx";
import toast from 'react-hot-toast'
import './forgetpassword.css'
import {Link} from 'react-router-dom'

const ForgetPassword = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (values) => {
    try{
        let res = await AxiosService.post(ApiRoutes.FORGETPASSWORD.path,values,{
            authenticate:ApiRoutes.FORGETPASSWORD.authenticate
        })
        if(res.status==200){
            toast.success("Email sent successfully,Check Your Email..");
             setTimeout(() => {
                    window.location.href = "/dashboard";
                  }, 1000);
        }
        else {
                toast.error("Email not found");
              }
    }
    catch(error){
        toast.error(error.response.data.message || error.message)
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
      <button  id="btnPrimary" type="submit">Submit</button>
    </form>
    </div>
  );
};

export default ForgetPassword;
