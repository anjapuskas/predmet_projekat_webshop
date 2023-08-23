import React from 'react';
import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import Geocode from "react-geocode";
import Navigation from 'components/Navigation/Navigation';
import { useDateField } from '@mui/x-date-pickers/DateField/useDateField';
import { useDispatch, useSelector } from 'react-redux';
import { approveOrderAction, ordersMapAction } from 'slices/orderSlice';

const MapForm = () => {
    const dispatch = useDispatch();
    const customIcon = new Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
      iconSize: [35, 35]
    });
    const position = [45.261330846985175, 19.840184400392857];
    const [ordersPositions, setOrdersPositions] = useState([]);
    const markersData = useSelector((state) => state.order.markersData);


    Geocode.setApiKey('AIzaSyD8b6aASNskogzBZy2ZhGdNumhhtEMePFg');
    Geocode.setLanguage("en");
    Geocode.setRegion("rs");

    const createClusterCustomIcon = function (cluster) {
        // @ts-ignore
        return new divIcon({
          html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
          className: "custom-marker-cluster",
          iconSize: point(33, 33, true)
        });
      };

      useEffect(() => {
        // @ts-ignore
        dispatch(ordersMapAction());
      }, []);

      const handleApprove = (orderId) => {

        // @ts-ignore
        dispatch(approveOrderAction(orderId));
      };

     return(
        <>
        <Navigation />
        <MapContainer  
// @ts-ignore
        center={position}  scrollWheelZoom={true} zoom={12} style={{ width: "100vw", height: "100vh" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
      >
        {markersData && markersData.length !== 0 && markersData.map((order) => (
          !order.approved && (
          <Marker key={order.id} position={[order.lat, order.lon]} icon={customIcon}>
            <Popup>
                <Typography>Address: {order.address}</Typography>
                <Typography>Comment: {order.comment}</Typography>
                <Typography>Price: {order.price}$</Typography>
                <Typography>Status: {order.status ? "Approved" : "Pending"}</Typography>
                {!order.approved && (
                <Button variant="outlined" color="secondary" onClick={() => handleApprove(order.id)}>
                  Approve
                </Button>     
              )} 
                </Popup>
          </Marker>)
        ))}
              </MarkerClusterGroup>

    </MapContainer>
        </>
     );
}

export default MapForm