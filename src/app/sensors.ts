type RawData = [string, number, number, number]

type DataPoint = {
    key: string,
    name: string,
    lat: number,
    lng: number,
    timestamp: number
}

const DataPoints: RawData[] = [
    ["Sensor 1", 33.941, -118.403, Date.now()],
    ["Sensor 2", 33.945, -118.412, Date.now() - 1000 * 2],
    ["Sensor 3", 33.949, -118.401, 1712289936585]
]

const formatted: DataPoint[] = DataPoints.map(([name, lat, lng, timestamp]) => ({
    name,
    lat,
    lng,
    timestamp,
    key: JSON.stringify({ name, lat, lng}),
  }));




export default formatted