import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const BudgetForm = () => {
  return (

    <div>
       
    <div className="position-relative w-100 vh-100 d-flex align-items-center justify-content-center bg-success bg-opacity-25 overflow-hidden">
      {/* Background Color Blobs */}
{/*
      <div className="container1 position-absolute" style={{ right: 0, top: "50%", transform: "translateY(-50%)" }}>
      <div className="circle d1" style={{ animationDelay: "-14s" }}></div>
      <div className="circle d2" style={{ animationDelay: "-13s" }}></div>
      <div className="circle d3" style={{ animationDelay: "-12s" }}></div>
      <div className="circle d1" style={{ animationDelay: "-11s" }}></div>
      <div className="circle d2" style={{ animationDelay: "-10s" }}></div>
      <div className="circle d3" style={{ animationDelay: "-9s" }}></div>
      <div className="circle d1" style={{ animationDelay: "-8s" }}></div>
      <div className="circle d2" style={{ animationDelay: "-7s" }}></div>
      <div className="circle d3" style={{ animationDelay: "-6s" }}></div>
      <div className="circle d1" style={{ animationDelay: "-5s" }}></div>
      <div className="circle d2" style={{ animationDelay: "-4s" }}></div>
      <div className="circle d3" style={{ animationDelay: "-3s" }}></div>
      <div className="circle d1" style={{ animationDelay: "-2s" }}></div>
      <div className="circle d2" style={{ animationDelay: "-1s" }}></div>
      <div className="circle d3" style={{ animationDelay: "0s" }}></div>
      
    </div>*/}
 {/*

      <div className="blob position-absolute" style={{ width: '18rem', height: '18rem', top: '2rem', left: '2rem' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 350">
          <path d="M156.4,339.5c31.8-2.5,59.4-26.8,80.2-48.5c28.3-29.5,40.5-47,56.1-85.1c14-34.3,20.7-75.6,2.3-111 c-18.1-34.8-55.7-58-90.4-72.3c-11.7-4.8-24.1-8.8-36.8-11.5l-0.9-0.9l-0.6,0.6c-27.7-5.8-56.6-6-82.4,3c-38.8,13.6-64,48.8-66.8,90.3c-3,43.9,17.8,88.3,33.7,128.8c5.3,13.5,10.4,27.1,14.9,40.9C77.5,309.9,111,343,156.4,339.5z"/>
        </svg>
      </div>
      
      
      <div className="blob position-absolute" style={{ width: '18rem', height: '18rem', top: '2rem', left: '2rem' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 350">
          <path d="M156.4,339.5c31.8-2.5,59.4-26.8,80.2-48.5c28.3-29.5,40.5-47,56.1-85.1c14-34.3,20.7-75.6,2.3-111 c-18.1-34.8-55.7-58-90.4-72.3c-11.7-4.8-24.1-8.8-36.8-11.5l-0.9-0.9l-0.6,0.6c-27.7-5.8-56.6-6-82.4,3c-38.8,13.6-64,48.8-66.8,90.3c-3,43.9,17.8,88.3,33.7,128.8c5.3,13.5,10.4,27.1,14.9,40.9C77.5,309.9,111,343,156.4,339.5z"/>
        </svg>
      </div>
      Irregular Blob SVG 
      <div className="blob position-absolute" style={{ width: '18rem', height: '18rem', top: '2rem', left: '2rem' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 350">
          <path d="M156.4,339.5c31.8-2.5,59.4-26.8,80.2-48.5c28.3-29.5,40.5-47,56.1-85.1c14-34.3,20.7-75.6,2.3-111 c-18.1-34.8-55.7-58-90.4-72.3c-11.7-4.8-24.1-8.8-36.8-11.5l-0.9-0.9l-0.6,0.6c-27.7-5.8-56.6-6-82.4,3c-38.8,13.6-64,48.8-66.8,90.3c-3,43.9,17.8,88.3,33.7,128.8c5.3,13.5,10.4,27.1,14.9,40.9C77.5,309.9,111,343,156.4,339.5z"/>
        </svg>
      </div>*/}


     {/* <div className="position-absolute rounded-circle bg-success bg-opacity-50" style={{ width: "18rem", height: "18rem", top: "2rem", left: "2rem", filter: "blur(50px)" }}></div>
      <div className="position-absolute rounded-circle bg-success bg-opacity-50" style={{ width: "20rem", height: "20rem", bottom: "2rem", right: "2rem", filter: "blur(50px)" }}></div>
      <div className="position-absolute rounded-circle bg-warning bg-opacity-50" style={{ width: "16rem", height: "16rem", bottom: "5rem", left: "10rem", filter: "blur(50px)" }}></div>
      */}
        {/* Centered Form */}

<div class="card1">
  <div class="container1">
    <div class="cloud front">
      <span class="left-front"></span>
      <span class="right-front"></span>
    </div>
    <span class="sun sunshine"></span>
    <span class="sun"></span>
    <div class="cloud back">
      <span class="left-back"></span>
      <span class="right-back"></span>
    </div>
  </div>

  <div class="card-header1">
    <span>Messadine, Susah<br/>Tunisia</span>
    <span>March 13</span>
  </div>

  <span class="temp">23°</span>

  <div class="temp-scale">
    <span>Celcius</span>
  </div>
</div>

        <div className="d-flex flex-column align-items-center justify-content-center text-center">
        <div className="mb-4">
          <div className="mx-auto mb-3 border rounded-circle d-flex align-items-center justify-content-center" style={{ width: "4rem", height: "4rem" }}>
            <span className="fs-1">😊</span>
          </div>
          <h1 className="fw-bold text-success">Welcome to Budgetly</h1>
          <p className="text-muted">We need a few of your details to ensure optimum service and accurate predictions!</p>
        </div>

        <div className="bg-white p-4 rounded-4 shadow-lg mx-auto" style={{ width: "22rem" }}>
          <form className="d-flex flex-column gap-3">
            <label className="text-dark">What is your monthly income?</label>
            <input type="text" className="form-control" />

            <label className="text-dark">What are your essential monthly expenses?</label>
            <input type="text" className="form-control" />

            <label className="text-dark">What are your inessential monthly expenses?</label>
            <input type="text" className="form-control" />

            <button className="btn btn-success mt-3">Submit</button>
          </form>
        </div>
      </div>
    </div></div>
  );
};

export default BudgetForm;