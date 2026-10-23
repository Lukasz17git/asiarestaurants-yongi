import sections from './takeaway-menu.json'

// 'Ramen y Sopas' -> 'ramen-y-sopas'
const toSlug = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// 'uramaki-tiger' -> the built address of src/_new/images/menuMaker/uramaki-tiger.webp; null without a photo
const getPhotoUrl = (photo) => (photo ? require(`../images/menuMaker/${photo}.webp`) : null)

// Hides a description that only repeats the name ('Empanadillas de carne')
const getDescription = (dish) => {
    const description = dish.description?.es?.trim()
    return description && description.toLowerCase() !== dish.name.es.trim().toLowerCase() ? description : ''
}

export const menuSections = sections.map((section) => ({
    id: toSlug(section.name.es),
    name: section.name.es,
    note: section.note?.es ?? '',
    photoUrl: getPhotoUrl(section.photo),
    dishes: section.dishes.map((dish) => ({ ...dish, description: getDescription(dish), photoUrl: getPhotoUrl(dish.photo) })),
}))

export const dishesByNumber = Object.fromEntries(menuSections.flatMap((section) => section.dishes).map((dish) => [dish.number, dish]))

// 'Salmón' and 'salmon' find the same dishes
export const normalizeSearch = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

export const filterSections = (search) => {
    const normalizedSearch = normalizeSearch(search)
    if (!normalizedSearch) return menuSections
    return menuSections
        .map((section) => ({
            ...section,
            dishes: section.dishes.filter((dish) => normalizeSearch(`${dish.number} ${dish.name.es} ${dish.description} ${section.name}`).includes(normalizedSearch)),
        }))
        .filter((section) => section.dishes.length)
}
