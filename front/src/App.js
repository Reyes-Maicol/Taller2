import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Swal from 'sweetalert2';

function App() {
  const [cantidadProductos, setCantidadProductos] = useState(0);
  const [productos, setProductos] = useState([]);
  const [mostrarFormularios, setMostrarFormularios] = useState(false);
  const [todosLosCamposLlenos, setTodosLosCamposLlenos] = useState(false);
  const [empresa, setEmpresa] = useState({
    nomempresa: '',
    nitempresa: '',
    emailempresa: '',
    fecha: '',
    nompersona: ''
  });

  useEffect(() => {
    // Verificar si todos los campos de los productos están llenos
    const todosLlenos = productos.every(producto => producto.nombre && producto.fechaVencimiento && producto.proveedor);
    setTodosLosCamposLlenos(todosLlenos);
  }, [productos]);

  const manejarCambioCantidad = (event) => {
    const cantidad = parseInt(event.target.value, 10) || 0;
    setCantidadProductos(cantidad);
  };

  const validarNombre = (nombre) => {
    // Permitir letras (mayúsculas y minúsculas), espacios y cadena vacía
    return /^[a-zA-Z\s]*$/.test(nombre);
  };

  const manejarCambioProducto = (index, name, value) => {
    // Si el campo es 'nombre' o 'nompersona' o 'proveedor', validamos que solo contenga letras
    if (name === 'nombre' || name === 'nompersona' || name === 'proveedor') {
      if (!validarNombre(value)) {
        return; // Si no es válido, no actualizamos el estado
      }
    }
    const nuevosProductos = [...productos];
    nuevosProductos[index][name] = value;
    setProductos(nuevosProductos);
  };

  const manejarCambioEmpresa = (event) => {
    const { name, value } = event.target;
    setEmpresa(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const manejarValidacion = (event) => {
    event.preventDefault();
    if (cantidadProductos <= 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debe ingresar un número mayor a 0"
      });
      return;
    }
    // Obtenemos todos los elementos del formulario excepto los botones de envío
    const inputs = [...event.target.elements].filter(element => element.type !== 'submit');
    // Verificar que ningún campo esté vacío
    const inputsValidos = inputs.every(input => input.value.trim() !== '');
    if (!inputsValidos) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor complete todos los campos.'
      });
      return;
    }
    setMostrarFormularios(true);
    setProductos(Array.from({ length: cantidadProductos }, () => ({ nombre: '', fechaVencimiento: '', proveedor: '' })));
  };

  const manejarSubmit = async (event) => {
    event.preventDefault();
    const datos = {
      empresa,
      productos
    };

    try {
      const respuesta = await axios.post("http://localhost:4000/registrar", datos);
      console.log('Respuesta del servidor:', respuesta.data);
      Swal.fire({
        icon: 'success',
        title: '¡Envío exitoso!',
        text: `Datos de la Empresa: ${JSON.stringify(empresa, null, 2)}\nCantidad de productos: ${cantidadProductos}\nProductos: ${JSON.stringify(productos, null, 2)}`
      });
    } catch (error) {
      console.log("Hubo un error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al enviar los datos.'
      });
    }
  };

  return (
    <div className="App">
      <div className='mainform'>
        <form className='company-form' onSubmit={manejarValidacion}>
          <label htmlFor='nomempresa'>Nombre de la empresa</label>
          <input type='text' id='nomempresa' name='nomempresa' onChange={manejarCambioEmpresa} required />

          <label htmlFor='nitempresa'>Nit de la empresa</label>
          <input type="number" id='nitempresa' name='nitempresa' onChange={manejarCambioEmpresa} required />

          <label htmlFor='emailempresa'>Correo de la empresa</label>
          <input type='email' id='emailempresa' name='emailempresa' onChange={manejarCambioEmpresa} required />

          <label htmlFor='fecha'>Fecha Actual</label>
          <input type='date' id='fecha' name='fecha' onChange={manejarCambioEmpresa} required />

          <label htmlFor='nompersona'>Nombre del reportador</label>
          <input 
            type='text' 
            id='nompersona' 
            name='nompersona' 
            onChange={(e) => {
              manejarCambioEmpresa(e);
              if (!validarNombre(e.target.value)) {
                e.target.setCustomValidity("Por favor ingrese solo letras y espacios.");
              } else {
                e.target.setCustomValidity("");
              }
            }}
            required 
          />

          <label htmlFor='cantproductos'>Cantidad de productos</label>
          <input 
            type='number' 
            id='cantproductos' 
            name='cantproductos'
            onChange={manejarCambioCantidad}
            required
          />
          <button className="boton" type="submit">Validar</button>
        </form>
      </div>
      {mostrarFormularios && (
        <div className='product_forms_container'>
          {productos.map((producto, index) => (
            <div className='product_form' key={index}>
              <form>
                <label htmlFor={`nombre-${index}`}>Nombre del Producto {index + 1}</label>
                <input 
                  type='text' 
                  id={`nombre-${index}`}
                  name='nombre'
                  onChange={(e) => manejarCambioProducto(index, e.target.name, e.target.value)}
                  value={producto.nombre}
                  required
                />

                <label htmlFor={`fechaVencimiento-${index}`}>Fecha de Vencimiento</label>
                <input 
                  type='date' 
                  id={`fechaVencimiento-${index}`}
                  name='fechaVencimiento'
                  value={producto.fechaVencimiento}
                  onChange={(e) => manejarCambioProducto(index, e.target.name, e.target.value)}
                  required
                />

                <label htmlFor={`proveedor-${index}`}>Proveedor</label>
                <input 
                  type='text' 
                  id={`proveedor-${index}`}
                  name='proveedor'
                  onChange={(e) => manejarCambioProducto(index, e.target.name, e.target.value)}
                  value={producto.proveedor}
                  required
                />
              </form>
            </div>
          ))}
          <button className="boton" onClick={manejarSubmit} disabled={!todosLosCamposLlenos}>Enviar Todo</button>
        </div>
      )}
    </div>
  );
}

export default App;