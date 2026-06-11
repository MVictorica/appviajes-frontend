import { Link } from "react-router-dom";

const Pagina404 = () => {
  return (
    <div className="container text-center py-5">
      <h1 className="display-1">404</h1>
      <p className="lead">La página que buscás no existe.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
};

export default Pagina404;