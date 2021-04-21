import React, { useState } from "react";
import "firebase/firestore";
import User from "./User"
import { useFirestore } from "reactfire";
import "./Style.css";
import Selector from "../selector/Selector";

function Users({ users,crews, teams}) {
  

  return   (
    <div className="us">
          <h2>Users:</h2>
          <table style={{ direction: "rtl", width: '100%'}}>
            <thead>
              <tr>
                <th>שם</th>
                <th>קבוצה</th>
                <th>צוות</th>
                <th>נקודות</th>
                <th>תשובות</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item, index) => {
                return (
                  <User
                    key={item.id}
                    user={item}
                    id={item.id}
                    index={index}
                    crews={crews}
                    teams={teams}
                  />
                );
              })}
              <User key={33} crews={crews} teams={teams} isNewUser={true} />
            </tbody>
          </table>
        </div>
      
  )
}

export default Users;
