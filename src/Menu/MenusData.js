// image: path under src/images, without .webp
// stamp: the red seal on the photo; price and price2 are shown on Home's MenusTeaser
const menus = {
    day: {
        name: {
            es: 'Menú Mediodía',
            cat: ''
        },
        description: {
            es: 'Tu pausa de mediodía, a lo grande: sushi, cocina japonesa y china para disfrutar sin prisa.',
            cat: ''
        },
        time: {
            es: '12:30 - 16:00',
            cat: ''
        },
        price: '15,90€',
        stamp: { value: '15,90€', note: 'Sushi, wok y más' },
        button: {
            es: 'Ver Carta',
            cat: ''
        },
        image: 'home/home1',
        pdf: './pdfs/CartaDia2024_compressed.pdf'
    },
    night: {
        name: {
            es: 'Menú Noche',
            cat: ''
        },
        description: {
            es: 'La noche es para darse un homenaje: especiales, sushi y platos calientes para compartir.',
            cat: ''
        },
        time: {
            es: '20:00 - 23:00',
            cat: ''
        },
        price: '21,90€',
        price2: 'Viernes y festivos +1€',
        stamp: { value: '21,90€', note: 'Viernes y festivos +1€' },
        button: {
            es: 'Ver Carta',
            cat: ''
        },
        image: 'home/home3',
        pdf: './pdfs/CartaNoche2024_compressed.pdf'
    },
    festive: {
        name: {
            es: 'Menú Festivos',
            cat: ''
        },
        description: {
            es: 'Nuestro menú nocturno pero con un precio adicional de 1€, viernes cuenta como festivo',
            cat: ''
        }
    },
    pedidos: {
        name: {
            es: 'Carta Pedidos',
            cat: ''
        },
        description: {
            es: 'Todos tus favoritos recién hechos, para llevar a casa o al sitio que prefieras.',
            cat: ''
        },
        button: {
            es: 'Ver Carta',
            cat: ''
        },
        stamp: { kanji: '持ち帰り', note: 'Para llevar' },
        image: 'menus/takeAway',
        pdf: './pdfs/CartaLlevar2024_compressed.pdf'
    }
}
export default menus
