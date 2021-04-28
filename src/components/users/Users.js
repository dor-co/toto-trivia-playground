import React, { useState } from "react";
import "firebase/firestore";
import User from "./User"
import { useFirestore } from "reactfire";
import "./Style.css";
import Selector from "../selector/Selector";

function Users({ users,crews, teams}) {
  

  return   (
    <div className="us">
          <h2 style={{color: '#0d1336'}}>Users:</h2>
          <table style={{ border: '1px solid rgb(207, 207, 207)', direction: "rtl", width: '100%', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderCollapse: 'collapse'}}>
            <thead>
              <tr>
                <th className="thStyle">שם</th>
                <th className="thStyle">קבוצה</th>
                <th className="thStyle">צוות</th>
                <th className="thStyle">נקודות</th>
                <th className="thStyle">תשובות</th>
                <th className="thStyle">פעולות</th>
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
