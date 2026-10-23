// «Editar con IA» -> «Ver cambios», newest first, in Spanish for the client (date: 'YYYY-MM-DD')
// Lists only the entries whose `branch` is the one the site was built from; without it, the issue's branch, else 'main'
// issue: GitHub issue number; no link/linkText on changes (the client asked for none in #3)
const releaseNotes = [
    {
        date: '2026-10-23',
        issue: 12,
        branch: 'main',
        title: 'Nuevo aspecto de «Pedir online»',
        summary: '«Pedir online» sube en el menú y la página tiene platos más compactos, con foto más grande, y botones más suaves.',
        changes: [
            { text: '«Pedir online» es ahora la tercera opción del menú de arriba, antes de «Restaurantes».' },
            { text: 'Los avisos «Envío gratis en Vilafranca (08720) desde 20 €» y «Recogida sin pedido mínimo» son más grandes y destacan más.' },
            { text: 'Los títulos «Pide online» y «Tu pedido» usan otra letra, la de los títulos de Inicio.' },
            { text: 'En el ordenador caben 3 platos por fila en vez de 2, con una foto cuadrada más grande arriba a la izquierda, el nombre y el precio a su lado y la descripción debajo.' },
            { text: 'En «Tu pedido» cada plato ocupa una sola línea más baja, así caben más platos sin bajar.' },
            { text: 'Los botones dorados de la página (añadir plato, cantidades, secciones y «Ver mi pedido») tienen un color más suave.' },
            { text: 'El «+» del botón para añadir un plato está ahora justo en el centro.' },
        ],
    },
    {
        date: '2026-10-24',
        branch: 'main',
        title: 'Historial de versiones en «Editar con IA»',
        summary: 'Puedes ver las últimas versiones de la web o del diseño con un click y volver a cualquiera de ellas.',
        changes: [
            { text: 'Debajo de la dirección, en «Estás en», está «Versión actual»: al pulsarla salen las 10 últimas versiones, con su fecha y la petición que las hizo.' },
            { text: 'Cada versión se abre en la misma página en la que estás, al momento. Quien entra en la web sigue viendo la versión actual.' },
            { text: 'Desde una versión anterior, «Volver a esta versión» (con una segunda confirmación) hace que la web vuelva a ser así para todos. Se publica como un cambio nuevo, así que la versión que había se guarda y puedes volver a ella.' },
            { text: '«Tus peticiones» enseña solo las peticiones de la web o del diseño en el que estás.' },
            { text: 'Solo puedes responder a una petición desde su propio diseño; desde otro sitio, el chat te da un botón para abrirlo.' },
            { text: 'Las versiones anteriores ya no están en «Ver cambios»: ahora están en «Versión actual».' },
        ],
    },
    {
        date: '2026-10-24',
        branch: 'main',
        title: 'Página «Pedir online»',
        summary: 'Los clientes pueden elegir platos de la carta para llevar y enviar el pedido por WhatsApp desde la web.',
        changes: [
            { text: 'Se ha añadido la página «Pedir online», en el menú de arriba, con todos los platos de la carta para llevar, sus precios y fotos.' },
            { text: 'Cada plato se añade con «+» y el pedido se revisa en «Ver mi pedido», abajo en el móvil y a la derecha en el ordenador.' },
            { text: 'El cliente elige entrega a domicilio o recogida, pone su nombre, teléfono, dirección y código postal, y el pedido llega al WhatsApp del restaurante ya escrito.' },
            { text: 'Los gastos de envío y el pedido mínimo se calculan por código postal (envío gratis en Vilafranca, 08720, desde 20 €).' },
            { text: 'Se puede buscar un plato por nombre o número, y saltar a cada sección desde la barra de arriba.' },
        ],
    },
    {
        date: '2026-10-22',
        branch: 'main',
        title: 'Cambios dentro de «Editar con IA»',
        summary: 'La ventana de novedades ya no se abre al entrar: los cambios están ahora en «Editar con IA».',
        changes: [
            { text: 'Se ha quitado la ventana de novedades que se abría al entrar en la web.' },
            { text: '«Editar con IA» tiene una opción nueva, «Ver cambios», con los cambios de la web o del diseño en el que estás, no los de los demás.' },
            { text: 'Las versiones anteriores de la web también están en «Ver cambios».' },
            { text: 'El botón «Editar con IA» se puede pulsar de nuevo; antes no abría nada.' },
        ],
    },
    {
        date: '2026-10-22',
        title: 'Botón «Editar con IA» abajo a la derecha',
        summary: 'El editor con IA ahora es un botón flotante, siempre visible abajo a la derecha, como el de un chat.',
        changes: [
            { text: 'El botón «Editar con IA» ya no está en el menú de arriba: está siempre abajo a la derecha, en todas las páginas.' },
            { text: 'Al pulsarlo eliges qué hacer: «Editar esta web» (o «Editar este diseño»), «Crear un diseño nuevo» o «Ver diseños».' },
            { text: 'Desde un diseño, «Usar este diseño como principal» hace que la web principal pase a ser ese diseño.' },
            { text: '«Ver diseños» enseña la web principal y los 10 últimos diseños, y abre cada uno en la misma página en la que estás.' },
            { text: 'Mientras la IA trabaja, el botón gira y dice qué está haciendo; cuando acaba, te avisa para recargar.' },
            { text: 'La pestaña «Diseños» de esta ventana se ha quitado: ahora está en «Ver diseños».' },
        ],
    },
    {
        date: '2026-10-22',
        title: 'Pestaña «Diseños»',
        summary: 'Desde esta ventana puedes ver otros diseños de la web sin cambiar la principal.',
        changes: [
            { text: 'Esta ventana tiene una pestaña nueva, «Diseños», con los otros diseños de la web. Cada uno tiene su propia dirección y se actualiza solo cuando cambia.' },
            { text: 'Desde un diseño, la misma pestaña te lleva de vuelta al «Diseño principal».' },
        ],
    },
    {
        date: '2026-10-21',
        issue: 3,
        title: 'Novedades sin enlaces «Ver en Inicio»',
        summary: 'Esta ventana de novedades ya no muestra los enlaces «Ver en Inicio».',
        changes: [
            { text: 'Se han quitado los enlaces «Ver en Inicio» de todas las novedades.' },
        ],
    },
    {
        date: '2026-10-21',
        issue: 3,
        title: 'Botón «Editar con IA», opción «Automático» y versiones anteriores',
        summary: 'El botón de editar funciona como un botón, el formulario deja que la IA elija las páginas y puedes abrir las últimas versiones de la web.',
        changes: [
            { text: 'El botón «EDITAR CON IA» ahora es un botón de verdad: al pasar el ratón por encima sale la mano.' },
            { text: 'En el formulario de cambios, «¿En qué página?» tiene una primera opción nueva, «Automático», para que la IA decida qué páginas cambiar.' },
            { text: 'Esta ventana tiene una pestaña nueva, «Versiones», con las 5 versiones anteriores de la web. Cada una se abre en otra pestaña tal como era, sin cambiar la web actual.' },
        ],
    },
    {
        date: '2026-10-21',
        title: 'Aviso mientras la IA trabaja y esta ventana de novedades',
        summary: 'Ahora puedes saber en todo momento si la IA está cambiando la web y qué ha cambiado al terminar.',
        changes: [
            { text: 'Mientras la IA aplica un cambio, abajo en la web aparece «Aplicando cambios con IA...». Cuando la nueva versión ya está publicada, cambia a «¡Cambios aplicados!» y, al pulsarlo, se recarga la página.' },
            { text: 'Cada vez que abres o recargas la web, esta ventana te enseña los últimos cambios. Ciérrala con la × de arriba, con la tecla Esc o pulsando fuera.' },
            { text: 'Las respuestas en las peticiones ahora traen un resumen corto, la lista de cambios y el enlace a la web.' },
        ],
    },
    {
        date: '2026-10-21',
        issue: 2,
        title: 'Botón «Editar con IA» y formulario de cambios más sencillo',
        summary: 'El botón para pedir cambios tiene un nombre nuevo y el formulario es más corto y claro.',
        changes: [
            { text: 'El botón de arriba ahora dice «EDITAR CON IA» (antes «PEDIR CAMBIO»).' },
            { text: 'En el formulario de cambios, el título sale vacío para que escribas el tuyo.' },
            { text: '«¿En qué página?» es obligatorio y puedes marcar varias páginas a la vez.' },
            { text: 'Se ha quitado la sección «Fotos o PDFs»: puedes arrastrarlos al cuadro «¿Qué quieres cambiar?».' },
        ],
    },
    {
        date: '2026-10-20',
        issue: 1,
        title: 'Año del pie de página',
        summary: 'El pie de página muestra el año correcto.',
        changes: [
            { text: 'Ahora pone «© 2025 Asia Restaurants», con el espacio entre el año y el nombre.' },
        ],
    },
]

export default releaseNotes
