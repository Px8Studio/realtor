import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ listings }) => {
  // Netherlands default center (Amsterdam)
  const netherlandsCenter = [
    parseFloat(process.env.REACT_APP_MAP_CENTER_LAT) || 52.3676,
    parseFloat(process.env.REACT_APP_MAP_CENTER_LNG) || 4.9041
  ];

  return (
    <MapContainer
      center={netherlandsCenter}
      zoom={8} // Good zoom level for Netherlands
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {listings.map((listing) => (
        <Marker key={listing.id} position={[listing.lat, listing.lng]}>
          <Popup>
            <div>
              <h3>{listing.name}</h3>
              <p>€{listing.price?.toLocaleString('nl-NL')}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
