import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { loginApi } from "../services/services.js";
import { startLoading, stopLoading } from "../redux/features/loadingSlice.js";

const loginSchema = Yup.object({
  email: Yup.string()
    .email("El email no es válido")
    .required("El email es obligatorio"),
  password: Yup.string().required("La contraseña es obligatoria"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState(null);

  const onSubmit = async (values) => {
    try {
      setErrorMsg(null);
      dispatch(startLoading());
      const data = await loginApi(values.email, values.password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Card style={{ width: "24rem" }} className="shadow">
        <Card.Body>
          <h3 className="text-center mb-4">✈️ AppViajes</h3>
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={onSubmit}
          >
            {({ values }) => (
              <FormikForm>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Field
                    as={Form.Control}
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                  />
                  <div className="text-danger">
                    <ErrorMessage name="email" />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Field
                    as={Form.Control}
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                  />
                  <div className="text-danger">
                    <ErrorMessage name="password" />
                  </div>
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={!values.email || !values.password}
                >
                  Ingresar
                </Button>
              </FormikForm>
            )}
          </Formik>
          <div className="text-center mt-3">
            <span>¿No tenés cuenta? </span>
            <Link to="/register">Registrate</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;