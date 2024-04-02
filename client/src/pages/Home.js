import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Col, Row } from "antd";
import Fixer from "../components/Fixer";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import GoogleMapReact from "google-map-react";

import { UserOutlined, ToolOutlined } from "@ant-design/icons";

function Home() {
  const [fixers, setFixers] = useState([]);
  const [userLocation, setUserLocation] = useState(null); // State to store user's location
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/user/get-all-approved-fixers", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setFixers(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();

    // Get user's location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting user's location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    // Geocode fixers' pincode to get latitude and longitude
    const geocodeFixers = async () => {
      const promises = fixers.map(async (fixer) => {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${fixer.pincode}&key=AIzaSyDatXlefwOK7xEkhRQjmilT_e5qrEM-q04`
          );
          if (
            response.data.results &&
            response.data.results.length > 0 &&
            response.data.results[0].geometry &&
            response.data.results[0].geometry.location
          ) {
            const { lat, lng } = response.data.results[0].geometry.location;
            return { ...fixer, latitude: lat, longitude: lng };
          }
        } catch (error) {
          console.error("Error geocoding fixer:", error);
        }
        return fixer;
      });

      const updatedFixers = await Promise.all(promises);
      setFixers(updatedFixers);
    };

    geocodeFixers();
  }, [fixers]);

  return (
    <Layout>
      <Row gutter={20}>
        {/* Render map */}
        <div style={{ height: "500px", width: "100%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyDatXlefwOK7xEkhRQjmilT_e5qrEM-q04",
            }}
            center={
              userLocation
                ? { lat: userLocation.lat, lng: userLocation.lng }
                : { lat: 0, lng: 0 }
            }
            defaultZoom={13}
          >
            {/* Add marker for user's location */}
            {userLocation && (
              <UserMarker
                lat={userLocation.lat}
                lng={userLocation.lng}
                color="red"
              />
            )}

            {/* Add markers for fixers */}
            {fixers.map((fixer) => (
              <FixerMarker
                key={fixer.id}
                lat={fixer.latitude}
                lng={fixer.longitude}
                color="blue"
              />
            ))}
          </GoogleMapReact>
        </div>

        {/* Render fixers */}
        {fixers.map((fixer) => (
          <Col span={12} key={fixer.id}>
            <Fixer fixer={fixer} />
          </Col>
        ))}
      </Row>
    </Layout>
  );
}

// Marker component for user's location
const UserMarker = ({ color }) => (
  <UserOutlined style={{ color: color, fontSize: "24px" }} />
);

// Marker component for fixers' locations
const FixerMarker = ({ color }) => (
  <ToolOutlined style={{ color: color, fontSize: "24px" }} />
);

export default Home;
