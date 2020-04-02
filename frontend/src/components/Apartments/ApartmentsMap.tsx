import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  LoadScript,
  InfoWindow
} from "@react-google-maps/api";

import { IApartment } from "../../types/apartment";
import { GOOGLE_MAPS_KEY } from "../../utils/environment";

const ApartmentsMap = ({ apartments }: { apartments: IApartment[] }) => {
  const [opened, setOpened] = useState(-1);

  return (
    <div className="map_ctn">
      <LoadScript id="apt-map" googleMapsApiKey={GOOGLE_MAPS_KEY}>
        <GoogleMap
          zoom={7}
          center={{
            lat: apartments[0]?.latitude,
            lng: apartments[0]?.longitude
          }}
          mapContainerStyle={{ width: "100%", height: "100%" }}
        >
          {apartments.map(ap => (
            <Marker
              onClick={() => setOpened(ap.id!)}
              clickable={true}
              key={ap.id}
              position={{ lat: ap.latitude, lng: ap.longitude }}
              title={ap.name}
            >
              {ap.id === opened && (
                <InfoWindow position={{ lat: ap.latitude, lng: ap.longitude }}>
                  <div>
                    <h2>{ap.name}</h2>
                    <p>{ap.description}</p>
                    <strong>{`Realtor: ${ap.realtor?.name} - ${ap.realtor?.phone}`}</strong>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default ApartmentsMap;
