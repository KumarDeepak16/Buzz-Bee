import React from "react";
import "./Loader.css";
function Loader() {
  return (
    /* From Uiverse.io */
    <div className=" h-screen flex justify-center items-center bg-slate-900">
      <div className="honeycomb">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loader;
