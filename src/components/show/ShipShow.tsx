import * as React from "react";
import {useState} from "react";
import Sigil from "../ui/svg/Sigil"
import { useHistory } from "react-router-dom";
import Spinner from "../ui/svg/Spinner";
import Urbit from "@urbit/http-api";
import * as CryptoJS from "crypto-js";
import { EncryptedShipCredentials } from "../../types";
import "./show.css"
import {processName} from "../../utils"
declare const window: any;


interface ShipProps{
    ship: EncryptedShipCredentials,
  }

export default function Ship(props: ShipProps) {
    const [pw, setPw] = useState("");
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const spinner =  <Spinner width="24" height="24" innerColor="white" outerColor="black" />
    const displayName = processName(props.ship.shipName);
    const history = useHistory();
    function connect(){
        console.log('oh hai')
    }
    async function testScry(){
        setError("");
       const url = CryptoJS.AES.decrypt(props.ship.encryptedShipURL, pw).toString(CryptoJS.enc.Utf8);
       if(url.length){
         setLoading(true);
         const airlock = new Urbit(url, "");
         const res = await airlock.scry({app: "graph-store", path: "/keys"});
         console.log(res);
         setLoading(false);
       } else{
         setError("wrong password")
       }
    //    const response = await fetch(`${url}/~/scry/graph-store/keys.json`, this.fetchOptions);

    }
    async function testPoke(){
        setError("");
        const url = CryptoJS.AES.decrypt(props.ship.encryptedShipURL, pw).toString(CryptoJS.enc.Utf8);
        if(url.length){
          setLoading(true);
          const airlock = new Urbit(url, "");
          console.log(airlock)
          airlock.ship = props.ship.shipName;
          airlock.verbose = true;
          const poke = await airlock.poke({ app: 'hood', mark: 'helm-hi', json: 'opening airlock' })
          console.log(poke);
          setLoading(false);
        } else{
          setError("wrong password")
        }

    }
    async function testSubscribe(){
        setError("");
    console.log('subscribing')
    const url = CryptoJS.AES.decrypt(props.ship.encryptedShipURL, pw).toString(CryptoJS.enc.Utf8);
       if(url.length){
         setLoading(true);
         const airlock = new Urbit(url, "");
         console.log(airlock)
         airlock.ship = props.ship.shipName;
         airlock.verbose = true;
         const res = await airlock.subscribe({app: "graph-store", path: "/updates"});
         console.log(res);
         setLoading(false);
       } else{
         setError("wrong password")
       }
    }

      return (
          <div className="ship">
              <div className="data">
              <Sigil size={78} patp={props.ship.shipName} />
              <p onClick={connect} className="shipname">~{displayName}</p>
              </div>
              <div className="buttons">
                  <input onChange={(e)=>setPw(e.currentTarget.value)} type="password" placeholder="password" />
                  <button onClick={testScry}>Test Scry</button>
                  <button onClick={testPoke}>Test Poke</button>
                  <button onClick={testSubscribe}>Test Subscribe</button>
                  <div className="spinner">
                  {loading && spinner}
                  </div>
                  <p className="errorMessage">{error}</p>
              </div>
              <div className="sse-consumer">

              </div>
          </div>
      )
  }