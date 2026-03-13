// export const getMyLocation = () => {
//     navigator.geolocation.getCurrentPosition(async (pos) => {
//       const lat = pos.coords.latitude;
//       const lng = pos.coords.longitude;

//       setLatitude(lat);
//       setLongitude(lng);

//       const res = await axios.get(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//       );

//       setValue("locationDetails", res.data.display_name);
//     });
//   }