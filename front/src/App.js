import React, { useState, useEffect } from 'react';
import './App.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, Shading } from 'docx';
import { saveAs } from 'file-saver';

function App() {
  const [cantidadProductos, setCantidadProductos] = useState(0);
  const [productos, setProductos] = useState([]);
  const [mostrarFormularios, setMostrarFormularios] = useState(false);
  const [todosLosCamposLlenos, setTodosLosCamposLlenos] = useState(false);
  const [datosEmpresa, setDatosEmpresa] = useState({
    nomempresa: '',
    nitempresa: '',
    emailempresa: '',
    fecha: '',
    nompersona: ''
  });
  const [mostrarBotones, setMostrarBotones] = useState(false); // Nuevo estado

  useEffect(() => {
    const todosLlenos = productos.every(producto => producto.nombre && producto.fechaVencimiento && producto.proveedor);
    setTodosLosCamposLlenos(todosLlenos);
  }, [productos]);

  const manejarCambioCantidad = (event) => {
    const cantidad = parseInt(event.target.value, 10) || 0;
    setCantidadProductos(cantidad);
  };

  const validarNombre = (nombre) => /^[a-zA-Z\s]*$/.test(nombre);

  const manejarCambioProducto = (index, name, value) => {
    if (name === 'nombre' || name === 'nompersona' || name === 'proveedor') {
      if (!validarNombre(value)) {
        return;
      }
    }
    const nuevosProductos = [...productos];
    nuevosProductos[index][name] = value;
    setProductos(nuevosProductos);
  };

  const manejarCambioEmpresa = (event) => {
    const { name, value } = event.target;
    setDatosEmpresa(prevDatos => ({
      ...prevDatos,
      [name]: value
    }));
  };

  const manejarValidacion = (event) => {
    event.preventDefault();
    if (cantidadProductos <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'La cantidad de productos debe ser mayor a cero.'
      });
      return;
    }

    const inputs = [...event.target.elements].filter(element => element.type !== 'submit');
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

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Informe de la Empresa', 10, 10);

    doc.autoTable({
      startY: 20,
      body: [
        ['Nombre de la empresa', datosEmpresa.nomempresa],
        ['NIT de la empresa', datosEmpresa.nitempresa],
        ['Correo de la empresa', datosEmpresa.emailempresa],
        ['Fecha', datosEmpresa.fecha],
        ['Nombre del repartidor', datosEmpresa.nompersona]
      ]
    });

    const lastPos = doc.previousAutoTable.finalY + 10;

    doc.autoTable({
      startY: lastPos,
      head: [['Nombre del Producto', 'Fecha de Vencimiento', 'Proveedor']],
      body: productos.map(producto => [producto.nombre, producto.fechaVencimiento, producto.proveedor])
    });

    doc.save('informe.pdf');
  };

  const generarWord = () => {
    const tableHeaderStyle = {
      font: { bold: true },
      Shading:{fill:"blue"},
      color: 'FFFFFF',
      width: { size: 5000, type: 'DXA' }
    };
  
    const cellStyle = {
      borders: {
        top: { size: 1, color: '000000' },
        bottom: { size: 1, color: '000000' },
        left: { size: 1, color: '000000' },
        right: { size: 1, color: '000000' },
      },
      width: { size: 5000, type: 'DXA' }
    };
  
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'Informe de la Empresa',
              heading: 'Title',
              thematicBreak: true,
            }),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph('Nombre de la empresa')],
                      ...tableHeaderStyle,
                    }),
                    new TableCell({
                      children: [new Paragraph(datosEmpresa.nomempresa)],
                      ...cellStyle,
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph('NIT de la empresa')],
                      ...tableHeaderStyle,
                    }),
                    new TableCell({
                      children: [new Paragraph(datosEmpresa.nitempresa)],
                      ...cellStyle,
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph('Correo de la empresa')],
                      ...tableHeaderStyle,
                    }),
                    new TableCell({
                      children: [new Paragraph(datosEmpresa.emailempresa)],
                      ...cellStyle,
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph('Fecha')],
                      ...tableHeaderStyle,
                    }),
                    new TableCell({
                      children: [new Paragraph(datosEmpresa.fecha)],
                      ...cellStyle,
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph('Nombre del repartidor')],
                      ...tableHeaderStyle,
                    }),
                    new TableCell({
                      children: [new Paragraph(datosEmpresa.nompersona)],
                      ...cellStyle,
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph({
              text: 'Productos',
              heading: 'Heading1',
              thematicBreak: true,
            }),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph('Nombre del Producto')],
                      ...tableHeaderStyle,
                    }),
                    new TableCell({
                      children: [new Paragraph('Fecha de Vencimiento')],
                      ...tableHeaderStyle,
                    }),
                    new TableCell({
                      children: [new Paragraph('Proveedor')],
                      ...tableHeaderStyle,
                    }),
                  ],
                }),
                ...productos.map(producto => new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph(producto.nombre)],
                      ...cellStyle,
                    }),
                    new TableCell({
                      children: [new Paragraph(producto.fechaVencimiento)],
                      ...cellStyle,
                    }),
                    new TableCell({
                      children: [new Paragraph(producto.proveedor)],
                      ...cellStyle,
                    }),
                  ],
                }))
              ],
            })
          ]
        }
      ]
    });
  
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, 'informe.docx');
    });
  };
  

  const manejarSubmit = async (event) => {
    event.preventDefault();
    const datos = {
      datosEmpresa,
      cantidadProductos,
      productos
    };

    try {
      console.log(datos);
      const respuesta = await axios.post("http://localhost:4000/registro", datos);
      console.log('Respuesta del servidor:', respuesta.data);
      Swal.fire({
        icon: 'success',
        title: '¡Envío exitoso!',
        text: `Datos de la Empresa: ${JSON.stringify(datosEmpresa, null, 2)}\nCantidad de productos: ${cantidadProductos}\nProductos: ${JSON.stringify(productos, null, 2)}`
      });
      setMostrarBotones(true); // Mostrar los botones
    } catch (error) {
      console.log("Hubo un error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al enviar los datos.'
      });
      setMostrarBotones(false); // Asegurarse de que los botones no se muestren si hay un error
    }
  };

  return (
    <div className="App">
      <div className='mainform'>
        <form className='company-form' onSubmit={manejarValidacion}>
          <label htmlFor='nomempresa'>Nombre de la empresa</label>
          <input 
            type='text' 
            id='nomempresa' 
            name='nomempresa' 
            onChange={manejarCambioEmpresa} 
            value={datosEmpresa.nomempresa} 
            required 
          />

          <label htmlFor='nitempresa'>Nit de la empresa</label>
          <input 
            type="number" 
            id='nitempresa' 
            name='nitempresa' 
            onChange={manejarCambioEmpresa} 
            value={datosEmpresa.nitempresa} 
            required 
          />

          <label htmlFor='emailempresa'>Correo de la empresa</label>
          <input 
            type='email' 
            id='emailempresa' 
            name='emailempresa' 
            onChange={manejarCambioEmpresa} 
            value={datosEmpresa.emailempresa} 
            required 
          />

          <label htmlFor='fecha'>Fecha Actual</label>
          <input 
            type='date' 
            id='fecha' 
            name='fecha' 
            onChange={manejarCambioEmpresa} 
            value={datosEmpresa.fecha} 
            required 
          />

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
            value={datosEmpresa.nompersona}
            required 
          />

          <label htmlFor='cantidad'>Cantidad de productos</label>
          <input 
            type='number' 
            id='cantidad' 
            name='cantidad' 
            onChange={manejarCambioCantidad} 
            value={cantidadProductos} 
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
                <label htmlFor={`nombre_${index}`}>Nombre del Producto</label>
                <input
                  type='text'
                  id={`nombre_${index}`}
                  name='nombre'
                  onChange={(e) => manejarCambioProducto(index, e.target.name, e.target.value)}
                  value={producto.nombre}
                  required
                />

                <label htmlFor={`fechaVencimiento_${index}`}>Fecha de Vencimiento</label>
                <input
                  type='date'
                  id={`fechaVencimiento_${index}`}
                  name='fechaVencimiento'
                  onChange={(e) => manejarCambioProducto(index, e.target.name, e.target.value)}
                  value={producto.fechaVencimiento}
                  required
                />

                <label htmlFor={`proveedor_${index}`}>Proveedor</label>
                <input
                  type='text'
                  id={`proveedor_${index}`}
                  name='proveedor'
                  onChange={(e) => manejarCambioProducto(index, e.target.name, e.target.value)}
                  value={producto.proveedor}
                  required
                />
              </form>
            </div>
          ))}
          <button className="boton" onClick={manejarSubmit} disabled={!todosLosCamposLlenos}>Enviar Todo</button>
          {mostrarBotones && (
            <div>
              <button className="boton" onClick={generarPDF}>Generar PDF</button>
              <button className="boton" onClick={generarWord}>Generar Word</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
