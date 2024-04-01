type RawData = [string, number, number]

type DataPoint = {
    key: string,
    name: string,
    lat: number,
    lng: number
}

const DataPoints: RawData[] = [
    ["Sensor 1", 33.941, -118.403],
    ["Sensor 2", 33.945, -118.412],
    ["Sensor 3", 33.949, -118.401]
]

const formatted: DataPoint[] = DataPoints.map(([name, lat, lng]) => ({
    name,
    lat,
    lng,
    key: JSON.stringify({ name, lat, lng }),
  }));

export default formatted