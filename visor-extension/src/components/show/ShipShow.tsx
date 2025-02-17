import * as React from "react";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import Sigil from "../ui/svg/Sigil";
import Spinner from "../ui/svg/Spinner";

import { EncryptedShipCredentials, Messaging } from "@dcspark/uv-core";
import { loginToShip } from "../../urbit";
import { decrypt } from "../../storage";
import { whatShip, getIcon, processName } from "../../utils";
import Permissions from "../perms/Permissions";
import { motion } from "framer-motion";
import locationIcon from "../../icons/location-icon.svg";

import "./show.css";
import ManagerFooter from "./ManageFooter";
import ConnectFooter from "./ConnectFooter";

declare const window: any;

interface ShipProps {
  saveActive?: (ship: EncryptedShipCredentials, url: string) => void;
  setThemPerms?: (pw: string) => void;
}

export default function ShipShow(props: ShipProps) {
  const dummyShip: EncryptedShipCredentials = {
    shipName: "~sampel-palnet",
    encryptedShipCode: "",
    encryptedShipURL: "http://localhost",
  };
  const history = useHistory();
  const [ship, setShip] = useState(dummyShip);
  const [activeURL, setActiveURL] = useState("");
  const [active, setActive] = useState(dummyShip);
  const [shipURL, setURL] = useState("");
  const [showPerms, setShowPerms] = useState(false);
  const { patp }: any = useParams();
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmString, setConfirmString] = useState("");
  const [confirmAction, setConfirmAction] = useState("connect");

  const displayName = processName(ship.shipName);
  const shipname =
    whatShip(ship.shipName) === "moon" ? (
      <h1 className="ship-data-name">
        <span>~{displayName.slice(0, -14)}</span>
        <span>{displayName.slice(-14)}</span>
      </h1>
    ) : (
      <h1 className="ship-data-name">
        <span>~{displayName}</span>
      </h1>
    );
  useEffect(() => {
    let isMounted = true;
    Messaging.sendToBackground({ action: "cache_form_url", data: { url: "" } });
    Messaging.sendToBackground({ action: "get_ships" }).then((res) => {
      if (isMounted) {
        setShowPerms(false);
        const s = res.ships.find(
          (ur: EncryptedShipCredentials) => ur.shipName == patp
        );
        setShip(s);
        setActive(res.active);
        if (res.airlock) setActiveURL(res.airlock.url);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [patp]);

  window.onkeypress = function (e: any) {
    if (e.key == "Enter" && ship.shipName !== active?.shipName) {
      if (confirmAction === "connect") connect();
      else if (confirmAction === "perms") gotoPerms();
      else if (confirmAction === "home") gotoHome();
    }
  };

  async function reconnect(url: string): Promise<void> {
    const code = decrypt(ship.encryptedShipCode, pw);
    setLoading(true);
    loginToShip(url, code)
      .then((res) => {
        if (res.statusText == "missing") {
          setError("Could Not Connect");
          setLoading(false);
        } else connect();
      })
      .catch((err) => {
        setError("Could Not Connect");
        setLoading(false);
      });
  }

  async function connect(): Promise<void> {
    setError("");
    if (pw === "") {
      setError("Password Cannot Be Empty");
      return;
    }
    const url = decrypt(ship.encryptedShipURL, pw);
    if (url.length) {
      setLoading(true);
      Messaging.sendToBackground({
        action: "connect_ship",
        data: { url: url, ship: ship },
      })
        .then((res) => {
          if (res) setActive(ship), setShowPasswordInput(false);
          else setError("Could Not Connect");
          setLoading(false);
        })
        .catch((err) => {
          if (err.message == "Failed to PUT channel") reconnect(url);
          else setError("Could Not Connect");
          setLoading(false);
        });
    } else setError("Wrong Password"), setLoading(false);
  }
  function disconnect(): void {
    Messaging.sendToBackground({ action: "disconnect_ship" }).then((res) => {
      setActive(null);
      setShowPasswordInput(false);
      history.push("/ship_list");
    });
  }

  const connectButton = (
    <button className="single-button" onClick={confirmConnect}>
      Connect
    </button>
  );
  const disconnectButton = (
    <button
      onClick={disconnect}
      className="single-button connect-button red-bg"
    >
      Disconnect
    </button>
  );

  const connectionButton =
    ship.shipName == active?.shipName ? disconnectButton : connectButton;

  const spinner = (
    <div className="spinner">
      <Spinner width="24" height="24" innerColor="white" outerColor="black" />
    </div>
  );

  function canGo() {
    return active?.shipName === ship.shipName && activeURL;
  }

  function confirmConnect() {
    setShowPasswordInput(true);
    setConfirmString("Connect To Your Ship");
    setConfirmAction("connect");
  }
  function confirmPerms() {
    if (canGo()) {
      setURL(activeURL);
      setShowPerms(true);
    } else {
      setShowPasswordInput(true);
      setConfirmString("Show Granted Permissions");
      setConfirmAction("perms");
    }
  }
  function confirmHome() {
    if (canGo()) chrome.tabs.create({ url: activeURL });
    else {
      setShowPasswordInput(true);
      setConfirmString("Go To Your Urbit Home");
      setConfirmAction("home");
    }
  }

  function gotoHome() {
    setError("");
    const url = decrypt(ship.encryptedShipURL, pw);
    if (url.length) {
      chrome.tabs.create({ url: url });
    } else {
      setError("Wrong Password");
    }
  }
  function gotoPerms() {
    setError("");
    const url = decrypt(ship.encryptedShipURL, pw);
    if (url.length) {
      setURL(url);
      setShowPerms(true);
    } else {
      setError("Wrong Password");
    }
  }
  function gotoDashboard() {
    chrome.tabs.create({ url: "https://urbitdashboard.com" });
  }

  if (!showPerms)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="ship-show flex-grow-wrapper"
      >
        <div>
          <div className="ship-data">
            <Sigil size={140} patp={ship.shipName} />
            {shipname}
          </div>
          {/* <div className="ship-information">
            <div className="vertical">
              <span className="value">1075</span>
              <p className="label">contacts</p>
            </div>
            <div className="vertical">
              <span className="value">20</span>
              <p className="label">groups</p>
            </div>
            <div className="vertical">
              <span className="value">6</span>
              <p className="label">channels</p>
            </div>
          </div> */}
          <div className="flex">
            <div className="ship-location vertical">
              <div className="flex">
                <img src={locationIcon} className="ship-info-icon" />
                <p className="value">mars</p>
              </div>
              <p className="label">Location</p>
            </div>
            <div className="separator" />
            <div className="ship-type vertical">
              <div className="flex">
                <img src={getIcon(ship.shipName)} className="ship-info-icon" />
                <p className="value">{whatShip(ship.shipName)}</p>
              </div>
              <p className="label">Type</p>
            </div>
          </div>
        </div>
        <div className="block-footer">
          {showPasswordInput ? (
            <ConnectFooter
              error={error}
              setPw={setPw}
              confirmString={confirmString}
            >
              {confirmAction === "connect" && (
                <button onClick={connect} className="single-button">
                  {loading ? spinner : "Confirm"}
                </button>
              )}
              {confirmAction === "perms" && (
                <button onClick={gotoPerms} className="single-button">
                  Confirm
                </button>
              )}
              {confirmAction === "home" && (
                <button onClick={gotoHome} className="single-button">
                  Confirm
                </button>
              )}
            </ConnectFooter>
          ) : (
            <ManagerFooter
              confirmPerms={confirmPerms}
              gotoDashboard={gotoDashboard}
              confirmHome={confirmHome}
            >
              {connectionButton}
            </ManagerFooter>
          )}
        </div>
      </motion.div>
    );
  else return <Permissions ship={ship} shipURL={shipURL} />;
}
