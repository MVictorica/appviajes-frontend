import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { registerApi, loginApi } from "../services/services.js";
import { startLoading, stopLoading } from "../redux/features/loadingSlice.js";

const registerSchema = Yup.object({
  username: Yup.string().required("El username es obligatorio"),
  email: Yup.string()
    .email("El email no es válido")
    .required("El email es obligatorio"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Repetir la contraseña es obligatorio"),
  role: Yup.string()
    .oneOf(["traveler", "admin"])
    .required("El rol es obligatorio"),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState(null);

  const onSubmit = async (values) => {
    try {
      setErrorMsg(null);
      dispatch(startLoading());
      await registerApi({
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      // Auto-login después del registro (se valora en la letra)
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
          <h3 className="text-center mb-4">✈️ Crear cuenta</h3>
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              repeatPassword: "",
              role: "traveler",
            }}
            validationSchema={registerSchema}
            onSubmit={onSubmit}
          >
            {({ isValid, dirty }) => (
              <FormikForm>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Field as={Form.Control} type="text" name="username" />
                  <div className="text-danger">
                    <ErrorMessage name="username" />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Field as={Form.Control} type="email" name="email" />
                  <div className="text-danger">
                    <ErrorMessage name="email" />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Field as={Form.Control} type="password" name="password" />
                  <div className="text-danger">
                    <ErrorMessage name="password" />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Repetir contraseña</Form.Label>
                  <Field
                    as={Form.Control}
                    type="password"
                    name="repeatPassword"
                  />
                  <div className="text-danger">
                    <ErrorMessage name="repeatPassword" />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Rol</Form.Label>
                  <Field as={Form.Select} name="role">
                    <option value="traveler">Viajero</option>
                    <option value="admin">Administrador</option>
                  </Field>
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={!isValid || !dirty}
                >
                  Registrarse
                </Button>
              </FormikForm>
            )}
          </Formik>
          <div className="text-center mt-3">
            <span>¿Ya tenés cuenta? </span>
            <Link to="/login">Ingresá</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;