import React from "react";
import { Link } from "react-router-dom";
import "./loadable-page.scss";

const LoadablePage = () => {
  return (
    <div className="loadable-page">
      <Link to="/">Home</Link>
      <br></br>
      <div>This a page which can be dymanically imported into other pages</div>
    </div>
  );
};

export default LoadablePage;
