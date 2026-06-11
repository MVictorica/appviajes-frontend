import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";
import {
    eliminarTripApi,
    editarTripApi,
} from "../services/services.js";
import {
    eliminarTripRedux,
    editarTripRedux,
} from "../redux/features/tripsSlice.js";
import { startLoading, stopLoading } from "../redux/features/loadingSlice.js";

const TripList = () => {
    const dispatch = useDispatch();
    const trips = useSelector((state) => state.tripsSlice);
    const categories = useSelector((state) => state.categoriesSlice);

    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [filtroDestino, setFiltroDestino] = useState("");
    const [editandoId, setEditandoId] = useState(null);
    const [tituloEditado, setTituloEditado] = useState("");
    const [errorMsg, setErrorMsg] = useState(null);

    // Filtros (comentario 4.2.4 de la letra)
    const tripsFiltrados = trips.filter((trip) => {
        const categoriaId = trip?.category?._id || trip?.category;
        const okCategoria = !filtroCategoria || categoriaId === filtroCategoria;
        const okDestino =
            !filtroDestino ||
            trip?.destination?.toLowerCase().includes(filtroDestino.toLowerCase());
        return okCategoria && okDestino;
    });

    const handleEliminar = async (id) => {
        // Confirmación antes de borrar (comentario 16)
        const confirmar = window.confirm("¿Seguro que querés eliminar este viaje?");
        if (!confirmar) return;

        try {
            setErrorMsg(null);
            dispatch(startLoading());
            await eliminarTripApi(id);
            dispatch(eliminarTripRedux(id));
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            dispatch(stopLoading());
        }
    };

    const empezarEdicion = (trip) => {
        setEditandoId(trip._id);
        setTituloEditado(trip.title);
    };

    const guardarEdicion = async (id) => {
        if (!tituloEditado || tituloEditado.length < 3) {
            setErrorMsg("El título debe tener al menos 3 caracteres");
            return;
        }
        try {
            setErrorMsg(null);
            dispatch(startLoading());
            const tripActualizado = await editarTripApi(id, {
                title: tituloEditado,
            });
            dispatch(editarTripRedux(tripActualizado));
            setEditandoId(null);
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            dispatch(stopLoading());
        }
    };

    const nombreCategoria = (trip) => {
        if (trip?.category?.name) return trip.category.name;
        const cat = categories.find((c) => c._id === trip?.category);
        return cat?.name || "Sin categoría";
    };

    return (
        <Card className="shadow-sm">
            <Card.Body>
                <Card.Title>🧳 Mis viajes</Card.Title>
                {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

                {/* Filtros */}
                <div className="d-flex gap-2 mb-3">
                    <Form.Select
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                        style={{ maxWidth: "200px" }}
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por destino..."
                        value={filtroDestino}
                        onChange={(e) => setFiltroDestino(e.target.value)}
                        style={{ maxWidth: "250px" }}
                    />
                </div>

                {tripsFiltrados.length === 0 ? (
                    <p className="text-muted">No hay viajes para mostrar.</p>
                ) : (
                    <Table hover responsive>
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Título</th>
                                <th>Destino</th>
                                <th>Categoría</th>
                                <th>Fechas</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tripsFiltrados.map((trip) => (
                                <tr key={trip._id}>
                                    <td>
                                        {trip?.imageUrl ? (
                                            <img
                                                src={trip.imageUrl}
                                                alt={trip?.title || "Imagen del viaje"}
                                                style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                                            />
                                        ) : (
                                            <span className="text-muted small">Sin imagen</span>
                                        )}
                                    </td>
                                    <td>
                                        {editandoId === trip._id ? (
                                            <Form.Control
                                                type="text"
                                                size="sm"
                                                value={tituloEditado}
                                                onChange={(e) => setTituloEditado(e.target.value)}
                                            />
                                        ) : (
                                            trip?.title
                                        )}
                                    </td>
                                    <td>{trip?.destination}</td>
                                    <td>
                                        <Badge bg="info">{nombreCategoria(trip)}</Badge>
                                    </td>
                                    <td className="small">
                                        {trip?.startDate
                                            ? new Date(trip.startDate).toLocaleDateString()
                                            : "-"}{" "}
                                        →{" "}
                                        {trip?.endDate
                                            ? new Date(trip.endDate).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td>
                                        {editandoId === trip._id ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    className="me-1"
                                                    onClick={() => guardarEdicion(trip._id)}
                                                >
                                                    ✓
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => setEditandoId(null)}
                                                >
                                                    ✕
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    className="me-1"
                                                    onClick={() => empezarEdicion(trip)}
                                                >
                                                    ✏️
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => handleEliminar(trip._id)}
                                                >
                                                    🗑️
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    );
};

export default TripList;