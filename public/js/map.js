mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: "map",
    center: listing.geometry.coordinates,
    zoom: 10,
});

console.log(listing.geometry.coordinates);

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({
            offset: 25,
        }).setHTML(`<i>${listing.title}</i>`)
    )
    .addTo(map);