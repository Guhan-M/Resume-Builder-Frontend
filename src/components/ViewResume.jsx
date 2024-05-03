import React, { useEffect, useRef, useState,useContext } from 'react';
import { useParams } from 'react-router-dom';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';
import { Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../App';
import { SiGmail } from "react-icons/si";
import { IoLocation } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { CiLink } from "react-icons/ci";
import { FaGithub } from "react-icons/fa";
import TopBar from '../components/TopBar';
import {userContext} from '../utils/UserContext'
import "./resume/formalresume3style.css"
import axios from 'axios';
import fs from 'fs';
  
function ViewResume() {
  let users = useContext(userContext)
  const pdfRef = useRef();
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);

  // https://www.npmjs.com/package/puppeteer?activeTab=readme
  
  const getData = async () => {
    try {
      let resume1 = await AxiosService.get(`${ApiRoutes.USERS.path}/${id}/getresumedata`, {
        authenticate: ApiRoutes.USERS.authenticate
      });
      let resume2 = await AxiosService.get(`${ApiRoutes.USERS.path}/${id}/viewresumedata2`, {
        authenticate: ApiRoutes.USERS.authenticate
      });
      let resume3 = await AxiosService.get(`${ApiRoutes.USERS.path}/${id}/viewresumedata3`, {
        authenticate: ApiRoutes.USERS.authenticate
      });


      if (resume1.status === 200 && resume2.status === 200 && resume3.status === 200) {
        const filteredresume1Data = resume1.data.users.filter(item => item.id === id);
        const filteredresume2data = resume2.data.users.filter(item => item.id === id);
        const filteredresume3data = resume3.data.users.filter(item => item.id === id);

        if (filteredresume1Data && filteredresume2data && filteredresume3data) {
          setData2(filteredresume2data);
          setData(filteredresume1Data);
          setData3(filteredresume3data)
        } else {
          setData([]);
          setData2([]);
          setData3([]);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message || error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);


  const deleteresume = async (e) => {
    try {
      if (e.length === 0) {
        throw new Error("No resume data available.");
      }
      let resumeid = e?.resumeid;
      if (!resumeid) {
        throw new Error("Resume ID not found.");
      }

      let ids = e?._id;
      if (!ids) {
        throw new Error("ID not found.");
      }

      const datas = {
        id: ids,
        resumeid: resumeid,
      };

      toast("Deleted request");
      let response = await AxiosService.delete(
        `${ApiRoutes.USERS.path}/${id}/deleteresume`,
        {
          data: datas,
          authenticate: ApiRoutes.USERS.authenticate,
        }
      );
      if (response && response.status === 200) {
        toast("Deleted");
        navigate(`/profile/${id}`);
        setData([]);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during deletion.");
    }
  };

  const generatePDF = async (elementId, e, i) => {
    console.log(elementId,e)
     try {
       navigate(`/ResumetoPdf/${e._id}`);
       toast("Give some time to generate PDF")
       // users.setCurrentData({ elementId, e, i });
       handleGeneratePDF(e._id);
       console.log('Current data set successfully.');
       // navigate(`/profile/${id}/viewresumedata`)
     } catch (error) {
       console.error('Error setting current data:', error);
     }
   };
 
   
   async function handleGeneratePDF(id) {
       try {
         const generatePDFResponse = await AxiosService.post(ApiRoutes.GENERATEPDF.path, JSON.stringify({id:id}), {
                 authenticate: ApiRoutes.GENERATEPDF.authenticate
               });
           if (generatePDFResponse.status === 201) {
               // Convert base64 PDF to a downloadable PDF file
               const base64Pdf = generatePDFResponse.data.base64Pdf;
               base64ToPdf(base64Pdf, 'generated_pdf.pdf');
               toast("PDF Download successfully !! ")
              navigate(`/profile/${id}`)
               console.log("PDF generated successfully", base64Pdf);
           } else {
               // Handle failure
               console.error("Failed to generate PDF.");
           }
       } catch (error) {
           // Handle error
           console.error('Error generating PDF:', error);
       }
   }
 function base64ToPdf(base64String, outputFileName) {
     // Decode base64 string
     const binaryPdf = atob(base64String);
 
     // Convert binary string to ArrayBuffer
     const pdfBuffer = new ArrayBuffer(binaryPdf.length);
     const pdfArray = new Uint8Array(pdfBuffer);
     for (let i = 0; i < binaryPdf.length; i++) {
         pdfArray[i] = binaryPdf.charCodeAt(i);
     }
 
     // Create a Blob from the ArrayBuffer
     const pdfBlob = new Blob([pdfArray], { type: 'application/pdf' });
 
     // Create a temporary link element
     const link = document.createElement('a');
     link.href = URL.createObjectURL(pdfBlob);
     link.download = outputFileName;
 
     // Append the link to the document body and trigger a click event
     document.body.appendChild(link);
     link.click();
 
     // Clean up
     document.body.removeChild(link);
     URL.revokeObjectURL(link.href);

 }
 
// const generatePDF = async (elementId, e, i) => {
//     console.log(elementId, e);
//     try {
//         navigate(`/ResumetoPdf/${e._id}`);
//             handleGeneratePDF(e._id);
//             console.log('Current data set successfully.');
//         // navigate(`/profile/${id}/viewresumedata`)
//     } catch (error) {
//         console.error('Error setting current data:', error);
//     }
//   };
//   async function handleGeneratePDF(id) {
//       try {
//         const generatePDFResponse = await AxiosService.post(ApiRoutes.GENERATEPDF.path, JSON.stringify({id:id}), {
//                 authenticate: ApiRoutes.GENERATEPDF.authenticate
//               });
//           if (generatePDFResponse.status === 201) {
//               // Convert base64 PDF to a downloadable PDF file
//               const base64Pdf = generatePDFResponse.data.base64Pdf;
//               base64ToPdf(base64Pdf, 'generated_pdf.pdf');
//               console.log("PDF generated successfully", base64Pdf);
//           } else {
//               // Handle failure
//               console.error("Failed to generate PDF.");
//           }
//       } catch (error) {
//           // Handle error
//           console.error('Error generating PDF:', error);
//       }
//   }
// function base64ToPdf(base64String, outputFileName) {
//     // Decode base64 string
//     const binaryPdf = atob(base64String);

//     // Convert binary string to ArrayBuffer
//     const pdfBuffer = new ArrayBuffer(binaryPdf.length);
//     const pdfArray = new Uint8Array(pdfBuffer);
//     for (let i = 0; i < binaryPdf.length; i++) {
//         pdfArray[i] = binaryPdf.charCodeAt(i);
//     }

//     // Create a Blob from the ArrayBuffer
//     const pdfBlob = new Blob([pdfArray], { type: 'application/pdf' });

//     // Create a temporary link element
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(pdfBlob);
//     link.download = outputFileName;

//     // Append the link to the document body and trigger a click event
//     document.body.appendChild(link);
//     link.click();

//     // Clean up
//     document.body.removeChild(link);
//     URL.revokeObjectURL(link.href);
// }
 
  

 
  console.log(data2)
  return (
    <>
      <TopBar />
      {data.length > 0 || data2.length > 0 || data3.length > 0 ? (
        <div key={`unique-${Date.now()}-${Math.floor(Math.random() * 1000)}`}>
          <div id="content1">
            <div className="bodyformstyle">
              {data.filter((e) => e.id === id).map((e, i) => (
                <div style={{ marginBottom: "5%" }} key={i}>
                  <div className="containerform" ref={pdfRef}>
                    <header className="formheaderstyle">
                      <h1 className="h1form">
                        {e.personalDetails.firstname} {e.personalDetails.lastname}
                      </h1>
                      <div className="contact-info">
                        <p className="pform">
                          <SiGmail /> &nbsp;
                          {e.personalDetails.email}
                        </p>
                        <p className="pform">
                          <FaPhoneAlt />&nbsp;
                          {e.personalDetails.mobile}
                        </p>
                        <p className="pform">
                          <IoLocation />&nbsp;
                          {e.personalDetails.address},&nbsp;{e.personalDetails.city},&nbsp;
                          {e.personalDetails.state},&nbsp;{e.personalDetails.zip}
                        </p>
                        <p className="pform">
                          <FaLinkedinIn />&nbsp;
                          {e.personalDetails.linkedin}, &nbsp;<FaGithub />&nbsp;{e.personalDetails.github},
                        </p>
                        <p className="pform">
                          <CiLink /> &nbsp;{e.personalDetails.portfolio}
                        </p>
                      </div>
                    </header>
                    <section className="section">
                      <h2 className="h2form">Objective</h2>
                      <p className="pform">
                      Motivated professional with a diverse skill set and a passion for [industry/field]. 
                      Seeking opportunities to contribute expertise, drive results, and grow within a dynamic organization.
                      </p>
                    </section>
                    <section className="section">
                      <h2 className="h2form">Skills</h2>
                      <ul className="uform">
                        {e.skills.map((skill, index) => (
                          <li className="liform" key={index}>
                            <i className="fas fa-check icon"></i>
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section className="section">
                      <h2 className="h2form">Education</h2>
                      {e.qualifications.map((qualification, index) => (
                        <div key={index}>
                          <h3 className="h3form">{qualification.CourseDetails}</h3>
                          <p className="pform">
                            {qualification.InstituteName},{qualification.Location}
                          </p>
                          <p className="pform" style={{ marginBottom: "2%" }}>
                            {qualification.StartYear}-{qualification.EndYear}
                          </p>
                        </div>
                      ))}
                    </section>
                    {e.jobs.length > 0 ? (
                      <section className="section">
                        <h2 className="h2form">Experience</h2>
                        {e.jobs.map((job, index) => (
                          <div key={index}>
                            <h3 className="h3form">{job.Jobtitle}</h3>
                            <p className="pform">{job.Employer},{job.Location}</p>
                            <p className="pform">
                              {job.StartYear}-{job.EndYear}
                            </p>
                          </div>
                        ))}
                      </section>
                    ) : null}
                    <footer className="footerform">
                      <p className="pform">Feel free to contact me for any further information.</p>
                    </footer>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", marginTop: "1%" }}>
                    <Button onClick={() => generatePDF("content1",e)}>Generate PDF</Button>
                    &nbsp;
                    <button className="btn btn-primary" onClick={() => deleteresume(e)}>
                      deleteresume
                    </button>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          </div>

          {/* Resume 2 */}
          <div>
            {data2.filter((e) => e.id === id).map((e, i) => (
              <div className="bodyformstyle" key={i}>
                {e.id === id ? (
                  <div className="containerresume2" ref={pdfRef} id="content2"
                    >
                    <div className="left-column">
                      <img src={`${API_URL}/images/${e.image}`} alt="Your Photo" className="photo" />
                      <div className="address">
                        <p className="pform">
                          <IoLocation />
                          {e.personalDetails.address}
                        </p>
                        <p className="pform">
                          <SiGmail />{e.personalDetails.email}
                        </p>
                        <p className="pform" style={{ marginBottom: "20%" }}>
                          <FaPhoneAlt />
                          {e.personalDetails.mobile}
                        </p>
                        <p className="pform">
                          <FaLinkedinIn />
                          <span style={{ fontSize: "15px" }}>{e.personalDetails.linkedin}</span>
                        </p>
                        <p className="pform">
                          <FaGithub />
                          <span style={{ fontSize: "15px" }}>{e.personalDetails.github}</span>
                        </p>
                        <p className="pform">
                          <CiLink />
                          <span style={{ fontSize: "15px" }}>{e.personalDetails.portfolio}</span>
                        </p>
                      </div>
                    </div>
                    <div className="right-column">
                      <header>
                        <h1 className="h1form" style={{ color: "black" }}>
                          {e.personalDetails.firstname} {e.personalDetails.lastname}
                        </h1>
                      </header>
                      <section className="section">
                        <h2 className="h2form">Objective</h2>
                        <p className="pform">
                        Motivated professional with a diverse skill set and a passion for [industry/field]. 
                        Seeking opportunities to contribute expertise, drive results, and grow within a dynamic organization.
                        </p>
                      </section>
                      <section className="section">
                        <h2 className="h2form">Skills</h2>
                        <ul className="uform">
                          {e.skills.map((skill, index) => (
                            <li className="liform" key={index}>
                              <i className="fas fa-check icon"></i>
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </section>
                      <section className="section">
                        <h2 className="h2form">Education</h2>
                        {e.qualifications.map((qualification, index) => (
                          <div key={index}>
                            <h3 className="h3form">{qualification.CourseDetails}</h3>
                            <p className="pform">
                              {qualification.InstituteName},{qualification.Location}
                            </p>
                            <p className="pform" style={{ marginBottom: "2%" }}>
                              {qualification.StartYear}-{qualification.EndYear}
                            </p>
                          </div>
                        ))}
                      </section>
                      {e.jobs.length > 0 ? (
                        <section className="section">
                          <h2 className="h2form">Experience</h2>
                          {e.jobs.map((job, index) => (
                            <div key={index}>
                              <h3 className="h3form">{job.Jobtitle}</h3>
                              <p className="pform">{job.Jobtitle}</p>
                              <p className="pform">
                                {job.StartYear}- {job.EndYear}
                              </p>
                            </div>
                          ))}
                        </section>
                      ) : null}
                      <footer className="footerall">
                        <p className="pform">Feel free to contact me for any further information.</p>
                      </footer>
                    </div>
                  </div>
                ) : (logout())}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "1%" }}>
                  <Button onClick={() => generatePDF("content2", e,`${API_URL}/images/${data2[0].image}`)}>Generate PDF</Button>
                  &nbsp;
                  <button className="btn btn-primary" onClick={() => deleteresume(e)}>
                    deleteresume
                  </button>
                </div>
                <hr />
              </div>
            ))}
          </div>
       
         {/* Resu<div>me 3 */}
         {data3.filter((e)=>e.id === id).map((e,i)=>(
           <div className="containerformbody">
           <div id="containerform">
           <div id="container3">
            <div id="header3">
        <div id="name-container3">
          <div id="name3"> {e.personalDetails.firstname} {e.personalDetails.lastname}</div>
          {/* <div id="job-title3">{}</div> */}
        </div>
        <div id="contact3">
          <h3>Contact</h3>
          <p>Email: {e.personalDetails.email}</p>
          <p>Phone: {e.personalDetails.mobile}</p>
          <p>Address:{e.personalDetails.address},&nbsp;{e.personalDetails.city},&nbsp;
                    {e.personalDetails.state},&nbsp;{e.personalDetails.zip}</p>
        </div>
      </div>
  
      <div id="objective3">
        <h4>Objective</h4>
        <p>To utilize my skills and expertise in web development to contribute effectively to the success of a dynamic and innovative company.</p>
      </div>
  
      <div id="skills3">
        <h4>Skills</h4>
        <ul>
        {e.skills.map((skill, index) => (
        <li className="dot" key={index}>
        <i className="fas fa-check icon"></i>
        {skill}</li>
        ))}
          {/* <li><span class="dot"></span> HTML5</li>
          <li><span class="dot"></span> CSS3</li>
          <li><span class="dot"></span> JavaScript</li> */}
        </ul>
      </div>

      {e.jobs.length > 0 ? (       
            <div >
                    <div id="sectiontitle3">Experience</div>
                     <div className="experience3">
                        {e.jobs.map((job, index) => (
                          <div key={index}>
                             <h4>{job.Jobtitle}r</h4>
                               <p>{job.Employer},{job.Location}</p>
                       <p> {job.StartYear}-{job.EndYear}</p>
                          </div>
                        ))}       
                        </div>
                        </div>
                    ) : null}
             
             <div id="sectiontitle3">Education</div>
             {e.qualifications.map((qualification, index) => (
                        <div className="education3"  key={index}>
                          <h4>{qualification.CourseDetails}</h4>
        <p> {qualification.InstituteName},{qualification.Location}</p>
        <p>  {qualification.StartYear}-{qualification.EndYear}</p>
                        </div>
                      ))} 
                      </div>
      
     
         <div style={{ display: "flex", justifyContent: "center", marginTop: "1%" }}>
         <Button onClick={() => generatePDF("content3",e)}>Generate PDF</Button>
         &nbsp;
         <button className="btn btn-primary" onClick={() => deleteresume(e)}>
           deleteresume
         </button>
       </div>
       </div>
         
         </div>
         ))}
       
       </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "15%",
            }}
          >
            <h1>Please create new Resume !!</h1>
            <Button variant="primary" onClick={() => navigate(`/profile/${id}`)}>
              Refresh
            </Button>
          </div>
        </>
      )}
    </>
  );
}

export default ViewResume;

