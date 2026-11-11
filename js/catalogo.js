// Productos, categorías, tarjetas de producto y filtro por categoría.
import { centimosATexto, IMAGEN_GENERICA, normalizar, urlFoto } from "./formato.js";

// Textos visibles (fuente: contracts/textos-interfaz.md)
const TEXTOS = {
  todos: "Todos",
  otros: "Otros",
  agotado: "Agotado",
};

const CLAVE_TODOS = "__todos__";
const CLAVE_OTROS = "otros";

/* ---------- Categorías y orden (data-model.md, sección "Categoría") ---------- */

/** Clave para comparar categorías sin importar mayúsculas, tildes ni espacios sobrantes. */
function claveCategoria(producto) {
  return normalizar(producto.categoria) || CLAVE_OTROS;
}

/** Compara por `orden` (los que tienen número van antes) y, si empatan, por posición en la hoja. */
function compararProductos(a, b) {
  if (a.orden !== null && b.orden !== null && a.orden !== b.orden) return a.orden - b.orden;
  if ((a.orden === null) !== (b.orden === null)) return a.orden === null ? 1 : -1;
  return a.posicion - b.posicion;
}

/**
 * Deriva la lista de categorías, ya en el orden en que se muestran:
 * "Todos" primero; luego por el menor `orden` entre sus productos (las que no tienen ningún
 * `orden` van después, y en empate manda la primera aparición en la hoja); "Otros" al final.
 * Devuelve [{ clave, nombre }]. Se muestra el nombre escrito en la primera fila donde aparece.
 */
export function derivarCategorias(productos) {
  const porClave = new Map();
  for (const producto of productos) {
    const clave = claveCategoria(producto);
    let categoria = porClave.get(clave);
    if (!categoria) {
      categoria = {
        clave,
        nombre: clave === CLAVE_OTROS ? TEXTOS.otros : producto.categoria,
        menorOrden: null,
        primera: producto.posicion,
      };
      porClave.set(clave, categoria);
    }
    if (producto.orden !== null && (categoria.menorOrden === null || producto.orden < categoria.menorOrden)) {
      categoria.menorOrden = producto.orden;
    }
    categoria.primera = Math.min(categoria.primera, producto.posicion);
  }

  const resto = [...porClave.values()].filter((c) => c.clave !== CLAVE_OTROS);
  resto.sort((a, b) => {
    if ((a.menorOrden === null) !== (b.menorOrden === null)) return a.menorOrden === null ? 1 : -1;
    if (a.menorOrden !== b.menorOrden) return a.menorOrden - b.menorOrden;
    return a.primera - b.primera;
  });

  const lista = [{ clave: CLAVE_TODOS, nombre: TEXTOS.todos }];
  for (const c of resto) lista.push({ clave: c.clave, nombre: c.nombre });
  if (porClave.has(CLAVE_OTROS)) lista.push({ clave: CLAVE_OTROS, nombre: TEXTOS.otros });
  return lista;
}

/**
 * Devuelve los productos de una categoría (o todos, agrupados por categoría en el orden de
 * `derivarCategorias`), ordenados por `orden` y por posición en la hoja. Los agotados
 * conservan su lugar.
 */
export function productosDe(productos, categorias, claveElegida) {
  const ordenados = [...productos].sort(compararProductos);
  if (claveElegida !== CLAVE_TODOS) {
    return ordenados.filter((p) => claveCategoria(p) === claveElegida);
  }
  const resultado = [];
  for (const categoria of categorias) {
    if (categoria.clave === CLAVE_TODOS) continue;
    resultado.push(...ordenados.filter((p) => claveCategoria(p) === categoria.clave));
  }
  return resultado;
}

/* ---------- Tarjeta de producto ---------- */

function crear(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

/**
 * Crea la tarjeta de un producto: foto, nombre, descripción corta (máximo 2 líneas, el
 * recorte con "…" lo hace el CSS), precio y categoría. Un producto no disponible muestra
 * "Agotado". Esta historia no incluye forma de agregarlo al pedido.
 */
export function crearTarjeta(producto) {
  const tarjeta = crear("article", producto.disponible ? "tarjeta" : "tarjeta agotado");
  tarjeta.dataset.id = producto.id;

  // Foto: carga diferida, tamaño reservado y, si falla, la imagen genérica.
  // referrerpolicy="no-referrer" es obligatorio: sin él Google responde 429 a las fotos de Drive.
  const foto = document.createElement("img");
  foto.className = "tarjeta-foto";
  foto.alt = producto.nombre;
  foto.width = 96;
  foto.height = 96;
  foto.loading = "lazy";
  foto.decoding = "async";
  foto.referrerPolicy = "no-referrer";
  foto.addEventListener("error", () => {
    if (!foto.src.endsWith(IMAGEN_GENERICA)) foto.src = IMAGEN_GENERICA;
  });
  foto.src = urlFoto(producto.foto);

  const cuerpo = crear("div", "tarjeta-cuerpo");
  cuerpo.append(crear("h3", "tarjeta-nombre", producto.nombre));
  if (producto.descripcion) cuerpo.append(crear("p", "tarjeta-descripcion", producto.descripcion));

  const pie = crear("div", "tarjeta-pie");
  pie.append(crear("span", "tarjeta-precio", centimosATexto(producto.precioCentimos)));
  if (!producto.disponible) pie.append(crear("span", "etiqueta-agotado", TEXTOS.agotado));
  cuerpo.append(pie);

  const categoria = crear("p", "tarjeta-categoria", producto.categoria || TEXTOS.otros);
  cuerpo.append(categoria);

  tarjeta.append(foto, cuerpo);
  return tarjeta;
}

/* ---------- Filtro y lista ---------- */

/**
 * Muestra el filtro de categorías y la lista de productos. Tocar una categoría muestra solo
 * sus productos; "Todos" (la vista inicial) vuelve a mostrarlos todos.
 */
export function mostrarCatalogo(contenedorFiltro, contenedorLista, productos) {
  const categorias = derivarCategorias(productos);
  let elegida = CLAVE_TODOS;

  function pintarLista() {
    contenedorLista.replaceChildren(...productosDe(productos, categorias, elegida).map(crearTarjeta));
  }

  function pintarFiltro(enfocar = false) {
    const botones = categorias.map((categoria) => {
      const boton = crear("button", "filtro-boton", categoria.nombre);
      boton.type = "button";
      boton.setAttribute("aria-pressed", String(categoria.clave === elegida));
      boton.addEventListener("click", () => {
        elegida = categoria.clave;
        pintarFiltro(true);
        pintarLista();
      });
      return boton;
    });
    contenedorFiltro.replaceChildren(...botones);
    // Al volver a pintar se pierde el foco; se devuelve al botón tocado (útil con teclado).
    if (enfocar) botones[categorias.findIndex((c) => c.clave === elegida)]?.focus();
  }

  pintarFiltro();
  pintarLista();
}
