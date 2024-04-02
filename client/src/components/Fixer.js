import React from "react";
import { useNavigate } from "react-router-dom";

function Fixer({ fixer }) {
  const navigate = useNavigate();
  return (
    <div
      className="card p-2 cursor-pointer"
      onClick={() => navigate(`/book-appointment/${fixer._id}`)}
    >
      <h1 className="card-title">
        {fixer.firstName} {fixer.lastName}
      </h1>
      <hr />
      <p>
        <b>Phone Number : </b>
        {fixer.phoneNumber}
      </p>
      <p>
        <b>Address : </b>
        {fixer.address}
      </p>
      <p>
        <b>Fee per Visit : </b>
        {fixer.feePerCunsultation}
      </p>
      <p>
        <b>Timings : </b>
        {fixer.timings[0]} - {fixer.timings[1]}
      </p>
    </div>
  );
}

export default Fixer;
