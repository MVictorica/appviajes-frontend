import { useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";
import { obtenerPaisApi } from "../services/services.js";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../redux/features/loadingSlice.js";

const CountryInfo = () => {
  const dispatch = useDispatch();
  const [pais, setPais] = useState("");
  const [info, setInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const buscarPais = async () => {
    if (!pais) return;
    try {
      setErrorMsg(null);
      setInfo(null);
      dispatch(startLoading());
      const data = await obtenerPaisApi(pais);
      setInfo(data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>🌍 Info del destino</Card.Title>
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
        <div className="d-flex gap-2 mb-3">
          <Form.Control
            type="text"
            placeholder="País en inglés (ej: france)"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarPais()}
          />
          <Button variant="primary" onClick={buscarPais} disabled={!pais}>
            Buscar
          </Button>
        </div>
        {info && (
          <ListGroup variant="flush">
            <ListGroup.Item>
              <img
                src={info?.flag}
                alt={`Bandera de ${info?.name}`}
                style={{ width: "30px", marginRight: "8px" }}
              />
              <strong>{info?.name}</strong>
            </ListGroup.Item>
            <ListGroup.Item>🏛️ Capital: {info?.capital}</ListGroup.Item>
            <ListGroup.Item>🌎 Región: {info?.region}</ListGroup.Item>
            <ListGroup.Item>
              👥 Población: {info?.population?.toLocaleString()}
            </ListGroup.Item>
            <ListGroup.Item>
              🗣️ Idiomas: {info?.languages?.join(", ")}
            </ListGroup.Item>
            <ListGroup.Item>
              💰 Moneda: {info?.currencies?.join(", ")}
            </ListGroup.Item>
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default CountryInfo;