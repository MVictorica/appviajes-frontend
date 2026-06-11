import { useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";

const PLUS_LIMIT = 4;

const UsageReport = () => {
  // Lee del store con useSelector (comentario 12 del docente)
  const trips = useSelector((state) => state.tripsSlice);
  const user = JSON.parse(localStorage.getItem("user"));

  const cantidad = trips.length;
  const esPlus = user?.plan === "plus";
  const porcentaje = Math.min((cantidad / PLUS_LIMIT) * 100, 100);

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>📊 Uso de la aplicación</Card.Title>
        {esPlus ? (
          <>
            <p className="mb-1">
              {cantidad} de {PLUS_LIMIT} viajes utilizados ({Math.round(porcentaje)}%)
            </p>
            <ProgressBar
              now={porcentaje}
              variant={porcentaje >= 100 ? "danger" : "primary"}
              label={`${Math.round(porcentaje)}%`}
            />
            {porcentaje >= 100 && (
              <small className="text-danger d-block mt-2">
                Alcanzaste el límite del plan plus. Pasate a premium para
                viajes ilimitados.
              </small>
            )}
          </>
        ) : (
          <p className="mb-0">
            Tenés <strong>{cantidad}</strong> viajes registrados. Plan premium:
            viajes ilimitados ✨
          </p>
        )}
      </Card.Body>
    </Card>
  );
};

export default UsageReport;