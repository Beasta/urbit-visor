import Urbit from "@urbit/http-api";
import { UrbitVisorState } from "./types/types";
import { getStorage, decrypt, initStorage, storeCredentials, removeShip, setPopupPreference, reEncryptAll, savePassword, resetApp } from "./storage";
import { fetchAllPerms, connectToShip, grantPerms, revokePerms } from "./urbit";
import create from 'zustand';


export const useStore = create<UrbitVisorState>((set, get) => ({
    airlock: null,
    first: true,
    ships: [],
    cached_url: "",
    popupPreference: "modal",
    requestedPerms: null,
    selectedShip: null,
    activeShip: null,
    permissions: {},
    init: async () => {
        const res = await getStorage(["popup", "ships", "password", "permissions"]);
        set(state => ({ first: !("password" in res), popupPreference: res.popup || "modal", ships: res.ships || [], permissions: res.permissions || {}}))
    },
    setMasterPassword: async (password) => {
        await initStorage(password);
        set(state => ({ first: false }));
    },
    addShip: async (ship, url, code, pw) => {
        const creds = await storeCredentials(ship, url, code, pw);
        set(state => ({ selectedShip: creds }));
    },
    cacheURL: (string: string) => set(state => ({cached_url: string})),
    removeShip: async (ship) => {
        const ships = await removeShip(ship);
        set(state => { ships: ships });
    },
    selectShip: (ship) => set(state => ({ selectedShip: ship })),
    connectShip: async (url, ship) => {
        const airlock = await connectToShip(url, ship.shipName);
        set(state => ({ activeShip: ship, airlock: airlock }));
    },
    disconnectShip: () => {
        const airlock = (get() as any).airlock;
        airlock.reset();
        set(state => ({ activeShip: null, airlock: null }))
    },
    grantPerms: async (perms) => {
        const airlock = (get() as any).airlock;
        await grantPerms(airlock, perms);
        set(state => ({ requestedPerms: null }))
    },
    denyPerms: () => set(state => ({ requestedPerms: null })),
    removeWholeDomain: async (domain) => {
    },
    revokePerm: async (permRequest) => {
        const airlock = (get() as any).airlock;
        const res = await revokePerms(airlock.url, airlock.ship, permRequest);
        const perms = await fetchAllPerms(airlock.url);
        set(state => ({permissions: perms}))
    },
    loadPerms:  (permissions:any) => {
        set(state => ({permissions: permissions}))
    },
    changePopupPreference: async (preference) => {
        await setPopupPreference(preference);
        set(state => ({ popupPreference: preference }));
    },
    changeMasterPassword: async (oldPassword, password) => {
        await reEncryptAll(oldPassword, password);
        await savePassword(password);
    },
    resetApp: async () => await resetApp()
}))
