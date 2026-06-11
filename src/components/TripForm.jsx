import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { agregarTripApi } from "../services/services.js";
import { agregarTripRedux } from "../redux/features/tripsSlice.js";
import { startLoading, stopLoading } from "../redux/features/loadingSlice.js";
import { upload } from "@vercel/blob/client";
import { generarDescripcionApi } from "../services/services.js";

const tripSchema = Yup.object({
    title: Yup.string()
        .min(3, "El título debe tener al menos 3 caracteres")
        .required("El título es obligatorio"),
    destination: Yup.string().required("El destino es obligatorio"),
    description: Yup.string(),
    startDate: Yup.date(),
    endDate: Yup.date().min(
        Yup.ref("startDate"),
        "La fecha de fin debe ser posterior a la de inicio"
    ),
    category: Yup.string().required("La categoría es obligatoria"),
});

const TripForm = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categoriesSlice);
    const [errorMsg, setErrorMsg] = useState(null);
    const [imagen, setImagen] = useState(null);

    const onSubmit = async (values, { resetForm }) => {
        try {
            setErrorMsg(null);
            dispatch(startLoading());

            let imageUrl = "";
            if (imagen) {
                const blob = await upload(imagen.name, imagen, {
                    access: "public",
                    handleUploadUrl: `${import.meta.env.VITE_API_URL}/ai/img-token`,
                });
                imageUrl = blob.url;
            }

            const nuevoTrip = await agregarTripApi({ ...values, imageUrl });
            dispatch(agregarTripRedux(nuevoTrip));
            resetForm();
            setImagen(null);
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            dispatch(stopLoading());
        }
    };

    return (
        <Card className="shadow-sm">
            <Card.Body>
                <Card.Title>➕ Nuevo viaje</Card.Title>
                {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
                <Formik
                    initialValues={{
                        title: "",
                        destination: "",
                        description: "",
                        startDate: "",
                        endDate: "",
                        category: "",
                    }}
                    validationSchema={tripSchema}
                    onSubmit={onSubmit}
                >
                    {({ isValid, dirty, values, setFieldValue }) => (
                        <FormikForm>
                            <Form.Group className="mb-2">
                                <Form.Label>Título</Form.Label>
                                <Field as={Form.Control} type="text" name="title" />
                                <div className="text-danger small">
                                    <ErrorMessage name="title" />
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Destino</Form.Label>
                                <Field as={Form.Control} type="text" name="destination" />
                                <div className="text-danger small">
                                    <ErrorMessage name="destination" />
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Descripción</Form.Label>
                                <Field
                                    as="textarea"
                                    className="form-control"
                                    rows={2}
                                    name="description"
                                />
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="mb-2 w-100"
                                    disabled={!values.destination}
                                    onClick={async () => {
                                        try {
                                            dispatch(startLoading());
                                            const data = await generarDescripcionApi(values.destination, "atractivo");
                                            if (data?.success && data?.description) {
                                                setFieldValue("description", data.description);
                                            } else {
                                                setErrorMsg("La IA no está disponible en este momento, escribí la descripción manualmente");
                                            }
                                        } catch {
                                            setErrorMsg("La IA no está disponible en este momento, escribí la descripción manualmente");
                                        } finally {
                                            dispatch(stopLoading());
                                        }
                                    }}
                                >
                                    ✨ Generar descripción con IA
                                </Button>
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Fecha inicio</Form.Label>
                                <Field as={Form.Control} type="date" name="startDate" />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Fecha fin</Form.Label>
                                <Field as={Form.Control} type="date" name="endDate" />
                                <div className="text-danger small">
                                    <ErrorMessage name="endDate" />
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Categoría</Form.Label>
                                <Field as={Form.Select} name="category">
                                    <option value="">Seleccionar...</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </Field>
                                <div className="text-danger small">
                                    <ErrorMessage name="category" />
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Imagen del destino</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => setImagen(e.target.files[0] || null)}
                                />
                            </Form.Group>
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-100"
                                disabled={!isValid || !dirty}
                            >
                                Agregar viaje
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
            </Card.Body>
        </Card>
    );
};

export default TripForm;