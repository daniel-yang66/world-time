import { useEffect, memo, useRef } from "react";
import mapboxgl from "mapbox-gl";

export default memo(function Map({ faveList, active }) {
  mapboxgl.accessToken = import.meta.env.VITE_TOKEN;

  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  const screenWidth = window.screen.width;

  const secondsPerRevolution = 80;
  const maxSpinZoom = 5;
  const slowSpinZoom = 3;
  let userInteracting = false;
  let spinEnabled = true;

  const spinGlobe = (globe) => {
    const zoom = globe.current.getZoom();
    if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
      let distancePerSecond = 360 / secondsPerRevolution;
      if (zoom > slowSpinZoom) {
        const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
        distancePerSecond *= zoomDif;
      }
      const center = globe.current.getCenter();
      center.lng -= distancePerSecond;
      globe.current.easeTo({ center, duration: 1000, easing: (n) => n });
    }
  };

  useEffect(() => {
    if (screenWidth <= 600 || map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/satellite-streets-v12`,
      center: [-98, 39],
      zoom: 1,
    });

    faveList.forEach((fave) => {
      const popup = new mapboxgl.Popup({
        offset: 15,
        closeButton: false,
        className: "popup",
        closeOnMove: false,
      }).setText(fave[0]);
      const pin = document.createElement("div");
      pin.className = "pin-marker";
      const marker1 = new mapboxgl.Marker(pin)
        .setLngLat([+fave[3], +fave[2]])
        .setPopup(popup)
        .addTo(map.current);

      markers.current.push(marker1);
    });

    map.current.on("load", () => {
      map.current.setFog({
        range: [0.8, 8],
        color: "#dc9f9f",
        "horizon-blend": 0.07,
        "high-color": "#245bde",
        "space-color": "#000000",
        "star-intensity": 0.15,
      });
      spinGlobe(map);

      map.current.on("mousedown", () => {
        userInteracting = true;
      });
      map.current.on("drag", () => {
        userInteracting = true;
      });

      map.current.on("moveend", () => {
        spinGlobe(map);
      });
    });
  }, []);

  useEffect(() => {
    if (screenWidth >= 600) {
      markers.current.forEach((marker) => {
        marker.remove();
      });
      markers.current = [];

      faveList.forEach((fave) => {
        const popup = new mapboxgl.Popup({
          offset: 15,
          closeButton: false,
          className: "popup",
          closeOnMove: false,
        }).setText(fave[0]);
        const pin = document.createElement("div");
        pin.className = "pin-marker";
        const marker2 = new mapboxgl.Marker(pin)
          .setLngLat([+fave[3], +fave[2]])
          .setPopup(popup)
          .addTo(map.current);

        markers.current.push(marker2);
      });
    }
  }, [faveList]);

  useEffect(() => {
    if (screenWidth <= 600) return;
    markers.current.forEach((marker) => {
      if (marker.getPopup().isOpen()) marker.togglePopup();
    });
    markers.current.forEach((marker) => {
      const markName = marker.getPopup()._content.innerHTML;
      if (markName === active) {
        marker.togglePopup();
      }
    });
  }, [active]);

  return (
    <>
      <div ref={mapContainer} className="map-container" />
    </>
  );
});
