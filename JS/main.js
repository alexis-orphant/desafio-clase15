class PersonajesRyM{
    constructor(id, name, image){
        this.id = id;
        this.name = name;
        this.image = image;
    }
}

// constantes y variables 
const divPerosnajes = document.getElementById("divPersonajes");
let page = 8;
let personajesArray = []
let carritoCompra = []
const btnSiguiente = document.getElementById("btnSiguiente");
// desestructuracion de la clase
const {
    id,
    name,
    image,
} = PersonajesRyM;


// se concecta a la "api" y lo muestra en el html
const cargarPersonaje = async() => {
    try{
        const respuesta = await fetch(`https://rickandmortyapi.com/api/character/?page=${page}`);
        const datos = await respuesta.json()

    datos.results.forEach(personaje => {
        personajesArray.push(new PersonajesRyM(personaje.id, personaje.name, personaje.image))
        const div = document.createElement("div");
    div.className = "card mx-auto my-2 fw-semibold fs-4 fondo-card";
    div.id = `${personaje.id}`
    div.style.width = "18rem";

        div.innerHTML = `
        <img src=${personaje.image} class="card-img-top pt-2" alt=${personaje.name}>
        <div class="card-body" id=card-${personaje.id}
        <h5 class="card-title text-ligth">${personaje.name}</h5>
        <button type="button" class="btn btn-primary mt-2" id=boton-${personaje.id}>Agregar al carrito</button>`

        divPerosnajes.append(div)

        // evento de agregar al carrito
        const btnCarrito = document.getElementById(`boton-${personaje.id}`)
        btnCarrito.addEventListener("click", () => agregarAlCarrito(personaje))

    });
    } catch(error){
        console.log(error)
    }
};

// evento cargar mas personajes
btnSiguiente.addEventListener("click", () => mostrarMasPersonajes())

// funciones
function mostrarMasPersonajes(){
    if(page < 14){
    page += 2;
    cargarPersonaje()
    }else if( page >= 14){
        btnSiguiente.style.display="none"
    }
}

function agregarAlCarrito(personaje){
        Toastify({
            text: "Producto agregado al carrito",
            gravity: "bottom",
            className: "info",
            duration: 2000,
            close: true,
            className: "alerta",
            style: {
                background: "linear-gradient(to right, #EB0000, #B80000)",
            },
        }).showToast();

    // busco si el personaje que agrego ya existe en el carrito
    const personajeExistente = carritoCompra.findIndex((personajeCarrito) => {
        return personajeCarrito.nombre === personaje.nombre;
    });

    // si el personaje no existe
    if (personajeExistente === -1) {
        carritoCompra.push(new PersonajesRyM(personaje.id, personaje.name, personaje.image));
    }

    // agrego el producto al array y se guarda en localStorage
    localStorage.setItem("carrito", JSON.stringify(carritoCompra));

    // pongo la funcion aca para que funcione cuando se hace click
    mostrarPersonajesAgregadosAlCarrito();
}

function mostrarPersonajesAgregadosAlCarrito() {
    const divtotal = document.getElementById("total");
    divtotal.innerHTML = "";
    const carritoJson = JSON.parse(localStorage.getItem("carrito"));

    if (carritoJson) {
        for (const personaje of carritoJson) {
            const divComprado = document.createElement("div");
            divComprado.className = "row mx-auto pt-3 comprado";
            divComprado.innerHTML = `
                    <figure class="col mx-auto w-50">
                    <img src=${personaje.image} class="w-50" id=imagen-${personaje.id} alt=imagen-${personaje.name}>
                    </figure>
                    <h5 class="col mx-auto pt-4 fs-5"> ${personaje.name}</h5>
                    <div class="col mx-auto">
                    </div>`;
            divtotal.append(divComprado);
        }
    } else {
        return
    }
}
function cargarLocalStorage() {
    const carritoJson = JSON.parse(localStorage.getItem("carrito"));
    if (carritoJson) {
        for (const personaje of carritoJson) {
            carritoCompra.push(new PersonajesRyM(personaje.id, personaje.name, personaje.image)
        )}
    }
    mostrarPersonajesAgregadosAlCarrito(carritoJson);
}

cargarPersonaje();
cargarLocalStorage();