import React, { useState } from 'react';
import './App.css';

function App() {
  const [cantidadProductos, setCantidadProductos] = useState(0);
  const [productos, setProductos] = useState([]);
  const [mostrarFormularios, setMostrarFormularios] = useState(false);

  const manejarCambioCantidad = (event) => {
    const cantidad = parseInt(event.target.value, 10) || 0;
    setCantidadProductos(cantidad);
  };

  const manejarCambioProducto = (index, event) => {
    const { name, value } = event.target;
    const nuevosProductos = [...productos];
    nuevosProductos[index][name] = value;
    setProductos(nuevosProductos);
  };

  const manejarValidacion = (event) => {
    event.preventDefault();
    setMostrarFormularios(true);
    setProductos(Array.from({ length: cantidadProductos }, () => ({ nombre: '', fechaVencimiento: '', proveedor: '' })));
  };

  const manejarSubmit = (event) => {
    event.preventDefault();
    alert(`Cantidad de productos: ${cantidadProductos}\nProductos: ${JSON.stringify(productos, null, 2)}`);
  };

  return (
    <div className="App">
      <div className='mainform'>
        <form onSubmit={manejarValidacion}>
          <label htmlFor='nomempresa'>Nombre de la empresa</label>
          <input type='text' id='nomempresa' ></input>

          <label htmlFor='nitempresa'>Nit de la empresa</label>
          <input type="number" id='nitempresa' ></input>

          <label htmlFor='emailempresa'>Correo de la empresa</label>
          <input type='email' id='emailempresa' ></input>

          <label htmlFor='fecha'>Fecha Actual</label>
          <input type='date' id='fecha' ></input>

          <label htmlFor='nompersona'>Nombre del reportador</label>
          <input type='text' id='nompersona' ></input>

          <label htmlFor='cantproductos'>Cantidad de productos</label>
          <input 
            type='number' 
            id='cantproductos' 
            onChange={manejarCambioCantidad}
          ></input>
          <button type="submit">Validar</button>
        </form>
      </div>
      {mostrarFormularios && (
        <div className='product_form'>
          {Array.from({ length: cantidadProductos }, (_, index) => (
            <form key={index} onSubmit={manejarSubmit}>
              <label htmlFor={`nomprod-${index}`}>Nombre del producto</label>
              <input
                type='text'
                id={`nomprod-${index}`}
                name='nombre'
                value={productos[index]?.nombre || ''}
                onChange={(event) => manejarCambioProducto(index, event)}
              ></input>

              <label htmlFor={`fechaven-${index}`}>Fecha de vencimiento</label>
              <input
                type='date'
                id={`fechaven-${index}`}
                name='fechaVencimiento'
                value={productos[index]?.fechaVencimiento || ''}
                onChange={(event) => manejarCambioProducto(index, event)}
              ></input>

              <label htmlFor={`proveedor-${index}`}>Proveedor del producto</label>
              <input
                type='text'
                id={`proveedor-${index}`}
                name='proveedor'
                value={productos[index]?.proveedor || ''}
                onChange={(event) => manejarCambioProducto(index, event)}
              ></input>
            </form>
          ))}
          <button onClick={manejarSubmit}>Registrar Informe</button>
        </div>
      )}
    </div>
  );
}

export default App;
