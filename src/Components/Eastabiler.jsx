import React from "react";
import "./Estabiler.css";

const team = [
  {
    name: "SHRI ARIF MOHAMMED KHAN",
    title: "H. E. Chief Patron-cum-Governor of Bihar",
    image: "/assets/governor bihar.jpg",
  },
  {
    name: "PROF. GANESH MAHTO",
    title: "Hon'ble President",
    university: "Bihar Mathematical Society",
    image: "/assets/president bms.jpg",
  },
  {
    name: "Retd. Prof. D. N. Singh",
    title: "General Secretary",
    university: "Bihar Mathematical Society",
    image: "/assets/general secretary bms.jpg",
  },
];

export default function Estabiler() {
  return (
    <div className="estabiler-container">
      <div className="estabiler-grid">
        {team.map((member, index) => (
          <div key={index} className="estabiler-card">
            <img
              src={member.image}
              alt={member.name}
              className="estabiler-image"
            />
            <h3 className="estabiler-name">{member.name}</h3>
            <p className="estabiler-title">{member.title}</p>
            {member.university && (
              <p className="estabiler-university">{member.university}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}