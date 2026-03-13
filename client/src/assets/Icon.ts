import L from 'leaflet';
import low from '/images/lowIncident.png';
import medium from '/images/mediumIncident.png';
import high from '/images/highIncident.png';
import critical from '/images/criticalIncident.png';
import userMarker from '/images/user.png';
import meMarker from '/images/me.png';

export const lowIncidentIcon = new L.Icon({
    iconUrl: low,
    iconRetinaUrl: low,
    popupAnchor:  [-0, -0],
    iconSize: [32,45],     
});
export const mediumIncidentIcon = new L.Icon({
    iconUrl: medium,
    iconRetinaUrl: medium,
    popupAnchor:  [-0, -0],
    iconSize: [32,45],     
});
export const highIncidentIcon = new L.Icon({
    iconUrl: high,
    iconRetinaUrl: high,
    popupAnchor:  [-0, -0],
    iconSize: [32,45],     
});
export const criticalIncidentIcon = new L.Icon({
    iconUrl: critical,
    iconRetinaUrl: critical,
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
