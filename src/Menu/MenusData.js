// image: path under src/_new/images/ioyi, without .webp; to: the page its button opens
const menus = {
    day: {
        name: {
            es: 'Menú del día',
            cat: ''
        },
        description: {
            es: 'Tu pausa de mediodía entre semana: plato principal, bebida y postre, con raciones generosas.',
            cat: ''
        },
        time: {
            es: 'Lunes a viernes, mediodía',
            cat: ''
        },
        price: '13,50€',
        price2: 'Plato, bebida y postre',
        button: {
            es: 'Cómo llegar',
            cat: ''
        },
        image: 'dishes/tonkotsu-don',
        to: '/restaurant'
    },
    carta: {
        name: {
            es: 'Carta',
            cat: ''
        },
        description: {
            es: 'Diez ramen, donburis, baos y entrantes japoneses para pedir a tu ritmo, a mediodía o por la noche.',
            cat: ''
        },
        time: {
            es: '13:00 - 15:30 · 19:30 - 22:30',
            cat: ''
        },
        price: 'desde 12,95€',
        price2: 'Cada ramen',
        button: {
            es: 'Ver platos',
            cat: ''
        },
        image: 'dishes/shoyu-tonkotsu',
        to: '#platos'
    },
    pedidos: {
        name: {
            es: 'Para llevar',
            cat: ''
        },
        description: {
            es: 'Toda la carta recién hecha, para recoger en el local o recibir en casa.',
            cat: ''
        },
        button: {
            es: 'Pedir online',
            cat: ''
        },
        image: 'dishes/katsu-sando',
        to: '/pedidos'
    }
}
export default menus
