import L from 'leaflet';
import incidentMarker from '/images/incident.png';
import userMarker from '/images/user.png';
import meMarker from '/images/me.png';

export const incidentIcon = new L.Icon({
    iconUrl: incidentMarker,
    iconRetinaUrl: incidentMarker,
    popupAnchor:  [-0, -0],
    iconSize: [32,45],     
});
export const userIcon = new L.Icon({
    iconUrl: userMarker,
    iconRetinaUrl: userMarker,
    popupAnchor:  [-0, -0],
    iconSize: [32,45],     
});
export const meIcon = new L.Icon({
    iconUrl: meMarker,
    iconRetinaUrl: meMarker,
    popupAnchor:  [-0, -0],
    iconSize: [32,45],     
});
