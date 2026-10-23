// Adds `change` (1 or -1) to a dish's quantity; a dish that reaches 0 leaves the cart
export const updateQuantities = (quantities, number, change) => {
    const quantity = (quantities[number] ?? 0) + change
    const { [number]: _removed, ...otherQuantities } = quantities
    return quantity > 0 ? { ...otherQuantities, [number]: quantity } : otherQuantities
}
