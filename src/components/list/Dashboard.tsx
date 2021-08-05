import * as React from "react";
import { useState, useEffect } from "react";
import Ship from "./Ship"
import { EncryptedShipCredentials } from "../../types/types";
import { useHistory } from "react-router-dom";
import "./list.css";

interface DashboardProps {
    ships: EncryptedShipCredentials[]
    select:  (ship: EncryptedShipCredentials) => void
    remove: (string: string) => void
}

export default function Dashboard(props: DashboardProps) {
    const history = useHistory();
    return (
        <div className="dashboard">
            <p>Your urbits</p>
            <div className="ship-list">
                {props.ships.map((ship) => {
                    return (
                    <Ship key={ship.shipName} ship={ship} select={props.select} remove={props.remove} />
                    )
                 })}
            </div>
            <button className="button add-more-button" onClick={()=> history.push("/add_ship")}>Add More</button>
        </div>
    )
}



// micmev-rapteb-fopsur-monsug
// magdec-sognev-somfed-baclux
