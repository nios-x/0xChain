
 https://api.tomtom.com
get
/traffic/services/{versionNumber}/incidentDetails
Traffic Incident Details v5


post
/traffic/services/{versionNumber}/incidentDetails
Traffic Incident Details v5


get
/traffic/map/{versionNumber}/tile/incidents/{style}/{zoom}/{x}/{y}.{format}
Traffic Raster Incident Tiles


get
/traffic/map/{versionNumber}/tile/incidents/{zoom}/{x}/{y}.{format}
Traffic Vector Incident Tiles   


get
/traffic/services/{versionNumber}/incidentViewport/{boundingBox}/{boundingZoom}/{overviewBox}/{overviewZoom}/{copyright}/{contentType}
Traffic Incident Viewport

Traffic Flow


get
/traffic/services/{versionNumber}/flowSegmentData/{style}/{zoom}/{format}
Flow Segment Data


get
/traffic/map/{versionNumber}/tile/flow/{style}/{zoom}/{x}/{y}.{format}
Raster Flow Tiles


get
/traffic/map/{versionNumber}/tile/flow/{type}/{zoom}/{x}/{y}.{format}
Vector Flow Tiles



const input = "pat";

fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=YOUR_API_KEY`)
  .then(res => res.json())
  .then(data => console.log(data.predictions));