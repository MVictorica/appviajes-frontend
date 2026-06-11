import { useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TripChart = () => {
  const trips = useSelector((state) => state.tripsSlice);
  const categories = useSelector((state) => state.categoriesSlice);

  // Agrupar viajes por categoría
  const data = categories.map((cat) => {
    const count = trips.filter((trip) => {
      const categoriaId = trip?.category?._id || trip?.category;
      return categoriaId === cat._id;
    }).length;
    return { name: cat.name, viajes: count };
  });

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>📈 Viajes por categoría</Card.Title>
        {trips.length === 0 ? (
          <p className="text-muted">Agregá viajes para ver el gráfico.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="viajes" fill="#0d6efd" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card.Body>
    </Card>
  );
};

export default TripChart;