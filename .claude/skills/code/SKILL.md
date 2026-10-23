---
name: code
description: Writes code the way the user writes it, in any framework or library - file layout, small arrow functions, guard-clause ladders, named step-by-step values, value-first types, results returned as values, sparse step comments. Load it ONLY when the user asks for it by name (e.g. "use code skill", "use the code skill for this", "usa la skill code", /code); never load it on your own for other coding work.
---

# Code style

Write code that looks like the user wrote it: the same file layout, function shapes, names, types, error handling and comments, whatever the framework. When a file already does something its own way, the file wins; these rules decide everything the file doesn't show.

## When it applies

- Any code Claude writes, changes or reviews: utilities, handlers, data access, state, components, types, scripts.
- Rules are written for TypeScript/JavaScript. In another language, keep the same ideas (guard clauses, named steps, lookup maps, results as values, naming) with that language's syntax and formatter.

## File layout

- **One main thing per file, named after it** in kebab-case: `get-order-status.ts` exports `getOrderStatus`. Files that only help others in the same folder are wrapped in parentheses (`(order-utils).ts`, `(shipping-types).ts`); folders private to a feature start with `_` (`_checkout/`).
- **Order inside a file:** imports, then types, then module constants and lookup maps, then private helpers, then the main export at the bottom. Small private pieces (helpers, sub-parts) go above the thing that uses them.
- **Named exports at the declaration** (`export const`). `export default` only where a framework requires it, declared first and exported on the last line (`export default OrdersPage`).
- **Related small variants share a file** (a `SaveButton` and a `DeleteButton`; a store and its update actions). Big files are split into sections with banner comments (see [Comments](#comments)).

## Functions

- **Arrow functions in consts**, always: `export const sortOrders = (orders: Order[]) => ...`. Use `function` only for overloads.
- **One expression, no braces**: `export const formatSku = (sku: string) => \`#${sku.slice(0, 6)}\``. Single parameters without parentheses in callbacks: `orders.filter(order => order.paid)`. Components are the exception (see UI components).
- **Guard clauses on one line, no braces, no `else`**: `if (!search) return orders`. Several cases become a ladder of `if (...) return ...` that ends in a default `return`, never `switch` or `else if`.
- **Skip with an early return, don't join conditions.** In a loop or `forEach` callback, each reason to skip or finish is its own line (`if (isGift) return`, `if (equal(a, b)) return`), then the work; not one `if (a || b)` around it.
- **A value that needs branches is an IIFE**, not a `let`, a nested ternary or a packed formula. This includes values kept inside limits: one `if` per edge instead of `Math.max(min, Math.min(max, x))`:
  ```ts
  const deliveryStatus = (() => {
     if (!order.shippedAt) return 'pending'
     if (!order.deliveredAt) return 'shipping'
     return 'delivered'
  })()
  ```
  A ternary is only for a simple two-way choice, never nested. A single `Math.min(...)` or a boolean joined with `||` / `&&` stays one expression (`const isCheckoutDisabled = !cartItems.length || isPaying`, `const visibleThumbnailsNumber = Math.min(thumbnails.length, maxVisibleThumbnails)`); the IIFE is for three or more cases.
- **Name every step.** Break a calculation or a pipeline into consts named after what each step produced, each on its own line: `filteredOrdersByStatus` -> `filteredOrdersByCustomer` -> `sortedOrders` -> `ordersToShip` (what was done, then by what); `distanceInMeters` -> `distanceInKm` -> `travelTimeInMinutes`. Keep each step next to the input it depends on and separate the groups with a blank line. When a step can end the function, its guard goes right under it (compute, check, compute the next, check), not after all the steps:
  ```ts
  const weightInGrams = Math.round(parcel.weight * 1000)
  if (weightInGrams < 1000) return `${weightInGrams} g`

  const weightInKg = Math.floor(weightInGrams / 1000)
  return `${weightInKg} kg`
  ```
- **Pure helpers outside, taking what they need**: filtering, sorting and formatting live in their own functions above the caller (`filterByStatus(orders, status)`), returning a new value, so the main function reads as a list of steps.
- **Derive numbers from named ones**: `const maxVisibleThumbnails = thumbnailsOnEachSide * 2 + 1 //7`. Name the numbers the code decides (limits, page sizes, as camelCase consts inside the function); well-known conversions (`1000`, `60`, `24`, `100`) stay as literals in the expression. Read the clock once (`const now = Date.now()`) and compare with `.getTime()`.
- **One implementation, thin bound versions.** When several things share logic but not data, write `doThingImplementation(data, ...)` once and export one-liners that bind it: `export const closeAllToasts = () => closeAllImplementation(TOASTS_SET)`.
- **One generic function driven by a dictionary** instead of a copy per entity: a `SCREAMING_CASE` config object keyed by name (`{ orders: { table, schema, deletionKey }, ... }`, checked with `satisfies`) and a function that takes the key (`deleteEntity('orders', id)`).
- **Factories that take a name return members named after it** (`createStore('Cart', initialState)` -> `{ CartStoreProvider, useCartStore }`), destructured and re-exported where they are called.
- **Curry to preset arguments** when it reads better at the call site: `createSchemas<Order>()('order', fields)`, `withRetry(fetchOrder)(id)`, small fluent helpers like `updateRow(table, data).whereEq({ id })`.

## Names

- **Long and exact, with units and steps**: `totalPriceInCents`, `firstVisibleProductIndex`, `maxNumberOfItemsPerCart`, `todayTimestamp`. Never `data2`, `tmp`, `res`. A count ends in `Number`: `unpaidOrdersNumber`, `maxProductsNumber`.
- **Booleans read as a question**: `isCheckoutDisabled`, `isExistentOrder`, `shouldShowShippingForm`, `hasDiscount`.
- **Functions start with the verb of what they do**: `formatPriceAsCurrency`, `filterByCustomer`, `sortProducts`, `getOrderStatus`, `mergeCartItems`. Data access says the source: `getOrdersFromDB`. Builders are `createX`. A function that returns a thing of a known kind ends with that kind: `addToCartAction` (returns a store action), `orderFormSchema`, `refundOrderHandler`. Tiny fallback helpers may be nouns: `text(value)`, `productImage(url)`.
- **`unsafe` for input not validated yet** (`unsafeData`, `unsafeOrderId`, `unsafeQuantity`), and the checked value gets a name for what it now is (`quantity`, `orderId`).
- **`_` prefix for the raw version of something you rename or wrap**: a prop `_orders` that becomes `orders` after slicing, `_value` before formatting, `_onChange` wrapping `onChange`, `[_products, _order]` from `Promise.all` before assigning.
- **`SCREAMING_SNAKE_CASE`** for module-level fixed keys, registries and shared config (`PARAM_CATEGORY_KEY`, `ORDERS_TABLE`, `TOASTS_SET`). **camelCase** for lookup maps and option lists (`sortOptions`, `statusText`) and for config numbers inside a function (`const maxNumberOfProductsPerRow = 4`).
- **Fallbacks are `defaultX`, right above their function**: `const defaultProductImage = '/img/product.svg'` then `export const productImage = (url?: string) => url || defaultProductImage`.
- **Generic type parameters start with `T`** (`TState`, `TPath`, `TEntityName`); mapped types use `Key in`.

## Types

- **`type`, not `interface`.** Local types sit right above what uses them (`type Props = {...}`).
- **Value first, type derived from it**, so there is one source of truth: `export const orderStatuses = ['pending', 'paid', 'refunded'] as const` + `export type OrderStatuses = typeof orderStatuses[number]`; `export const emptyAddress = { street: '', city: '' }` + `export type Address = typeof emptyAddress`; `keyof typeof sortOptions`.
- **Lookup maps instead of conditionals** to turn a union into values (text, styles, config), checked with `satisfies Record<Union, X>` (or typed `Record<Union, X>`) so a missing case fails to compile. When each case runs different logic (a different shipping cost formula per carrier), use the `if (...) return` ladder, not a map of functions. A string from outside (URL, form, storage) is still checked against a map of the union's values first (`const carriers = { ups: 'ups', dhl: 'dhl' } satisfies Record<Carriers, Carriers>` with an `Object.hasOwn` type guard), then the ladder runs.
- **Take only the fields you use**: `({ paidAt, refundedAt }: Pick<Order, 'paidAt' | 'refundedAt'>)`, destructured in the signature. Annotate the return type when it is a named union.
- **Type-only imports** use `import type` or inline `type`.
- **Export the types callers need to name** (a function's result or options type), and annotate the function's return with it.

## Errors and results

- **Validate at the edge, then return results as values.** Expected failures are returned, not thrown: a union like `{ result: 'error' | 'warning' | 'success', message, returnedData }` built by small helpers with default messages (`returnError()`, `returnSuccess(data, 'Successfully saved!')`).
- **Destructure and guard**: `const { error, userId, data } = await authorize(schema, unsafeData)` then `if (error) return returnError(error)`. In the UI, where every result is shown the same way, the result picks the handler: `notify[result](message)`.
- **`try/catch` only around the call that throws** (parsing), turning it into a result. `throw new Error(...)` only for programmer mistakes (a missing provider, a bad setup), with a message that says what to fix.
- **Message casing**: internal errors lowercase (`'not authenticated'`, `'invalid data'`); messages shown to people capitalized, success ones with `!` (`'Successfully deleted!'`).

## Data

- **Immutable updates**: `[order, ...orders]`, `orders.filter(o => o.id !== orderId)`, `orders.map(o => o.id === order.id ? order : o)`, `{ ...order, status }`.
- **Objects from lists** with `Object.fromEntries(list.map(p => [p.id, p.name]))` or `reduce`.
- `Promise.all` for independent async work, destructured. `!!x` to make a boolean, `??` for missing values, `||` only to replace empty strings. `Object.hasOwn(obj, key)` to check keys.

## UI components (any framework)

- **A const typed with the framework's component type**, props destructured in the signature: one or two props inline (`FC<{ order: Order }>`), more in a `type OrderCardProps` right above. Components take whole entities (`{ order }`); `Pick` is for helpers.
- **The body is a block ending in `return (` the markup**, even with no logic. Only files of fixed markup (an icon) use `=> (`. Everything is computed first, as named values (`isSelected`, `unpaidItemsNumber`, state next to what is derived from it), then a blank line, then the return.
- **Markup only uses simple conditions and maps**: `cond && ...`, `!!count && ...` (so `0` is never rendered), a two-way ternary (`cond ? (...) : (...)` for two blocks); handlers passed directly (`onClick={selectOrder}`). Filters, sorts and labels come from helpers and lookup maps above the component.
- **Class lists**: one class-joining call (`cn(`, `clsx(`) over several lines, one string per concern (layout, colors, dark mode), conditional classes as `isSelected && '...'`, the caller's `className` last so it wins. Short fixed lists stay one string.
- **Style variants are maps of class strings** above the component (`const buttonSizes = { sm: '...', md: '...' }`), and the variant prop's type comes from the map (`keyof typeof buttonSizes`).
- **Wrappers of a native element** alias the element (`type Ref = HTMLInputElement`), type props as its attributes plus their own (`type Props = InputHTMLAttributes<Ref> & { rounded?: boolean }`), destructure their own options with defaults (`rounded = false`) and pass the rest with `...props` last.

## Formatting

- 3-space indentation, no semicolons, keep the file's quote style.
- Long single-line expressions are fine (a filter with its whole condition on one line). Break lines only for object literals, markup and long parameter lists.
- A blank line after the opening line of a function with several steps; one or two blank lines between top-level blocks.

## Comments

- Few: most files have no `//` comments at all, and none explains what a named step or function already says. Names and named steps carry the meaning.
- **Step titles** in a function with several stages: a short `/* Title */` line before each one (`/* Check if user is authorized */`, `/* Return response */`).
- **Banners** for the big sections of a file. They are titles, not explanations, so the "few comments" rule doesn't remove them: a file with several groups (the shared implementation and then one group per kind, a store and its actions) gets a banner before each group, and each group keeps its own registry or constants under it:
  ```ts
  /**
   * --------------------------------------------------------------------
   *  CART STORE
   * --------------------------------------------------------------------
   */
  ```
- **Uppercase labels** to group long lists of props or arguments: `// ACCESSIBILITY`, `// STYLES`.
- A short `//` only for a non-obvious why, on the line or above it (`//7`, `// prices are in cents`); one or two in a file at most.

## Examples

### Pipeline of named steps with pure helpers

```ts
const sortOptions = {
   newest: 'Newest',
   cheapest: 'Price -',
}

const filterByCustomer = (orders: Order[], search: string) => {
   if (!search) return orders
   return orders.filter(order => order.customer.name.toLowerCase().includes(search.toLowerCase()))
}

const sortOrders = (orders: Order[], orderBy: keyof typeof sortOptions) => {
   if (orderBy === 'newest') return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
   if (orderBy === 'cheapest') return orders.sort((a, b) => a.total - b.total)
   return orders
}

export const getOrdersPage = (orders: Order[], search: string, orderBy: keyof typeof sortOptions, page: number) => {

   const maxNumberOfOrdersPerPage = 10

   const filteredOrdersByCustomer = filterByCustomer(orders, search)
   const sortedOrders = sortOrders(filteredOrdersByCustomer, orderBy)

   const ordersToShow = sortedOrders.slice((page - 1) * maxNumberOfOrdersPerPage, page * maxNumberOfOrdersPerPage)
   return { ordersToShow, filteredOrdersNumber: sortedOrders.length }
}
```

### Handler with step titles and results as values

```ts
export const refundOrder = async (unsafeOrderId: string) => {

   /* Check if user is authorized and retrieve its userId */
   const { error, userId, data: orderId } = await authorizeAction(z.string().uuid(), unsafeOrderId)
   if (error) return returnError(error)

   /* Refund order */
   const refundedOrders = await updateRow(ORDERS_TABLE, { status: 'refunded' }).whereEq({ id: orderId, userId })

   /* Return response */
   return returnFromDB(refundedOrders[0], {
      successMessage: 'Successfully refunded!',
      warningMessage: `Couldn't find and refund order with id ${orderId}`
   })
}
```

### Value-first types with a lookup map

```ts
export const paymentMethods = ['card', 'transfer', 'cash'] as const
export type PaymentMethods = typeof paymentMethods[number]

const paymentMethodText = {
   card: 'Credit card',
   transfer: 'Bank transfer',
   cash: 'Cash on delivery',
} satisfies Record<PaymentMethods, string>

export const formatPaymentMethod = (method: PaymentMethods) => paymentMethodText[method]
```

### Component with computed values and class lists

```tsx
type OrderCardProps = {
   order: Order,
   isSelected: boolean,
   onSelect: (orderId: string) => void,
   className?: string
}

export const OrderCard: FC<OrderCardProps> = ({ order, isSelected, onSelect, className }) => {

   const unpaidItemsNumber = order.items.filter(item => !item.paidAt).length

   return (
      <div
         className={cn(
            'p-16. br-12. fc g-8.',
            'bg-white d:bg-black',
            isSelected && 'bw-2. bc-primary',
            className
         )}
         onClick={() => onSelect(order.id)}
      >
         <b>{order.customer.name}</b>
         {!!unpaidItemsNumber && <Badge>{unpaidItemsNumber}</Badge>}
      </div>
   )
}
```
