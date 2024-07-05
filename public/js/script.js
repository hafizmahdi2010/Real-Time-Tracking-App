const socket = io();

console.log("running..");

if (navigator.geolocation) {
  navigator.geolocation.watchPosition((position) => {
    let { latitude, longitude } = position.coords;
    socket.emit("send-location", { latitude, longitude });
  }, (err) => {
    console.log(err);
  },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
};

const map = L.map("map").setView([0, 0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: "CodeWithMahdi"
}).addTo(map);

const markers = {};

socket.on("location-message", (message) => {
  const { id, username, url } = message;
  const icon = L.icon({
    iconUrl: url,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
  });
  const marker = L.marker([message.latitude, message.longitude], { icon });
  marker.addTo(map);
});

socket.on("receive-location", (message) => {
  const { id, latitude, longitude } = message;
  map.setView([latitude, longitude]);
  if (markers[id]) {
    markers[id].setLatLan([latitude, longitude]);
  }
  else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", () => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
})