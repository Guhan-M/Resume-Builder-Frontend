import React, { useEffect, useState } from 'react';
import AxiosService from '../../utils/AxiosService';
import ApiRoutes from '../../utils/ApiRoutes';
import toast from 'react-hot-toast';
import useLogout from '../../hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Spinner} from 'react-bootstrap';
import { HiArrowSmRight } from "react-icons/hi";
import './Dashboardstyle.css'; // Import CSS file for styling

function Dashboard() {
  let [data, setData] = useState([]);
  let navigate = useNavigate();
  let logout = useLogout();
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      let res = await AxiosService.get(`${ApiRoutes.DASHBOARD.path}`, {
        authenticate: ApiRoutes.DASHBOARD.authenticate
      });
      if (res.status === 200) {
        setData(res.data.users);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response.data.message || error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div>
        {/* Navigation */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
          <div className="container px-4">
            <a className="navbar-brand"> <i className="fa-solid fa-hashtag" style={{ color: "white" }}></i> Resume Builder</a>
            <Button variant="success" onClick={() => navigate("/login")} className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">Login</Button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><Button variant='success' onClick={() => navigate("/login")}><i className="fa-solid fa-right-to-bracket" style={{ fontSize: "20px", marginRight: "8px", color: 'white' }} />Login</Button></li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Header */}
        <header className="bg-primary bg-gradient text-white" style={{ paddingTop: "60px",height:"60vh" }}>
          <div className="container px-4 text-center" style={{ paddingTop: "90px" }}>
            <h1 className="fw-bolder">Welcome to Resume Builder </h1>
            <p className="lead">Feel free to customize this template with your personal information and design preference</p>
            <a className="btn btn-lg btn-light" onClick={() => navigate("/login")}>Get Start !</a>
          </div>
        </header>

        <h2 style={{ textAlign: "center", marginBottom: "2rem", marginTop: "5rem" }}>Explore Our Resume Templates</h2>
        {loading ? ( 
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : ( 
        <>
        {/* Resume Templates */}
        <div className="template-container">
          {data.map((e, i) => (
            <div key={i} className="template-card">
              <Card style={{ width: '300px', margin: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                <Card.Img variant="top" src={e.image} style={{ borderRadius: '10px 10px 0 0', height: '200px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title>{e.title}</Card.Title>
                  <Card.Text>{e.content}</Card.Text>
                  <Button variant="primary" onClick={() => navigate("/login")} style={{ borderRadius: '5px', marginTop: '10px' }}>Start <HiArrowSmRight /></Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
        </>
      )
          }
        {/* About section */}
        <section id="about">
          <div className="container px-4">
            <div className="row gx-4 justify-content-center">
              <div className="col-lg-8">
                <h2>About Our Resume Builder</h2>
                <p className="lead">Welcome to our resume builder platform! Our service is designed to help you create professional resumes quickly and easily. Here are some key features:</p>
                <ul>
                  <li>Easy-to-use interface for crafting your resume</li>
                  <li>Customizable templates to suit various industries and job roles</li>
                  <li>Step-by-step guidance to ensure you include all relevant information</li>
                  <li>Option to save your progress and come back later</li>
                  <li>Download your resume in (PDF)</li>
                </ul>
                <p>Whether you're a recent graduate entering the job market or an experienced professional looking to update your resume, our platform is here to assist you in showcasing your skills and experiences effectively.</p>
              </div>
            </div>
          </div>
        </section>


{/* Services section */}
<section className="bg-light" id="services">
  <div className="containerfluid px-4">
    <div className="row gx-4 justify-content-center">
      <div className="col-lg-8">
        <h2>Resume Builder Features</h2>
        <p className="lead">Our resume builder platform offers a range of features to help you create professional resumes with ease. Here's what we provide:</p>
        <ul className="service-list">
          <li className="service-item">
            <i className="fas fa-users service-icon"></i>
            <span>User-friendly interface for easy resume creation</span>
          </li>
          <li className="service-item">
            <i className="fas fa-list-ol service-icon"></i>
            <span>Step-by-step guidance throughout the resume-building process</span>
          </li>
          <li className="service-item">
            <i className="fas fa-file-alt service-icon"></i>
            <span>Ability to add and format sections such as education, work experience, skills, and more</span>
          </li>
          <li className="service-item">
            <i className="fas fa-link service-icon"></i>
            <span>Option to import existing resumes or LinkedIn profiles</span>
          </li>
          <li className="service-item">
            <i className="fas fa-eye service-icon"></i>
            <span>Preview functionality to visualize your resume before finalizing</span>
          </li>
          <li className="service-item">
            <i className="fas fa-download service-icon"></i>
            <span>Download your resume in PDF</span>
          </li>
          <li className="service-item">
            <i className="fas fa-cloud service-icon"></i>
            <span>Secure cloud storage to save and access your resumes from anywhere</span>
          </li>
          <li className="service-item">
            <i className="fas fa-comments service-icon"></i>
            <span>Regular updates and improvements based on user feedback</span>
          </li>
        </ul>
        <p>With our resume builder, you can create polished and professional resumes that stand out to employers and recruiters.</p>
      </div>
    </div>
  </div>
</section>

        {/* Footer */}
        <footer className="py-5 bg-dark">
          <div className="container px-4"><p className="m-0 text-center text-white">Copyright &copy; Your Website 2023</p></div>
        </footer>
      </div>
    </>
  );
}

export default Dashboard;
