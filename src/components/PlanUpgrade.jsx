import { useState } from "react";
import { useDispatch } from "react-redux";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";
import { upgradePlanApi } from "../services/services.js";
import { startLoading, stopLoading } from "../redux/features/loadingSlice.js";

const PlanUpgrade = () => {
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const esPlus = user?.plan === "plus";

  const handleUpgrade = async () => {
    try {
      setErrorMsg(null);
      dispatch(startLoading());
      await upgradePlanApi();
      const userActualizado = { ...user, plan: "premium" };
      localStorage.setItem("user", JSON.stringify(userActualizado));
      setUser(userActualizado);
      // Recargamos para que todos los componentes tomen el nuevo plan
      window.location.reload();
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>💎 Mi plan</Card.Title>
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
        <p>
          Plan actual:{" "}
          <Badge bg={esPlus ? "secondary" : "warning"} text={esPlus ? "" : "dark"}>
            {user?.plan?.toUpperCase()}
          </Badge>
        </p>
        {esPlus ? (
          <Button variant="warning" className="w-100" onClick={handleUpgrade}>
            ⭐ Pasar a Premium
          </Button>
        ) : (
          <p className="text-muted mb-0">
            Ya tenés el mejor plan. ¡Disfrutá tus viajes ilimitados!
          </p>
        )}
      </Card.Body>
    </Card>
  );
};

export default PlanUpgrade;