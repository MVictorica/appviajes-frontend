import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {
    obtenerTripsApi,
    obtenerCategoriesApi,
} from "../services/services.js";
import { cargaInicialTrips } from "../redux/features/tripsSlice.js";
import { cargaInicialCategories } from "../redux/features/categoriesSlice.js";
import { startLoading, stopLoading } from "../redux/features/loadingSlice.js";
import TripForm from "./TripForm.jsx";
import TripList from "./TripList.jsx";
import UsageReport from "./UsageReport.jsx";
import PlanUpgrade from "./PlanUpgrade.jsx";
import TripChart from "./TripChart.jsx";
import CountryInfo from "./CountryInfo.jsx";

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [checkingAuth, setCheckingAuth] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (!decoded.exp || decoded.exp <= currentTime) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login", { replace: true });
                return;
            }
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCheckingAuth(false);

            const timeUntilExpire = (decoded.exp - currentTime) * 1000;
            const timeout = setTimeout(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login", { replace: true });
            }, timeUntilExpire);

            return () => clearTimeout(timeout);
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        if (checkingAuth) return;

        const controller = new AbortController();

        const cargarDatos = async () => {
            try {
                dispatch(startLoading());
                const [trips, categories] = await Promise.all([
                    obtenerTripsApi(controller.signal),
                    obtenerCategoriesApi(controller.signal),
                ]);
                dispatch(cargaInicialTrips(trips));
                dispatch(cargaInicialCategories(categories));
            } catch (error) {
                if (error.message !== "canceled") {
                    console.error("Error cargando datos:", error);
                }
            } finally {
                dispatch(stopLoading());
            }
        };

        cargarDatos();
        return () => controller.abort();
    }, [checkingAuth, dispatch]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    };

    if (checkingAuth) {
        return <h1>Cargando...</h1>;
    }

    return (
        <Container fluid className="py-4 px-4" style={{ maxWidth: "1400px" }}>
            <header className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-0">✈️ AppViajes</h1>
                    <small className="text-muted">
                        Hola, {user?.username} ({user?.plan})
                    </small>
                </div>
                <Button variant="outline-danger" onClick={handleLogout}>
                    Cerrar sesión
                </Button>
            </header>

            <Row className="g-4">
                <Col lg={4}>
                    <TripForm />
                    <div className="mt-4">
                        <UsageReport />
                    </div>
                    <div className="mt-4">
                        <PlanUpgrade />
                    </div>
                    <div className="mt-4">
                        <CountryInfo />
                    </div>
                </Col>

                <Col lg={8}>
                    <TripList />
                    <div className="mt-4">
                        <TripChart />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;