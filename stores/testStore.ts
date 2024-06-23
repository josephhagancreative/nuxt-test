export interface TestState {
  property: string
  bookings: Booking[]
}

export interface Booking { id: number, name: string, items: Item[] }

export interface Item { name: string, id: number, stock: number, selectedQuantity: number }

export const useTestStore = defineStore('test', () => {
  const testState = ref({
    property: 'PROP001',
    bookings: [
      { id: 1, name: 'Orchestra', items: [] as Item[] },
      { id: 2, name: 'Cooking Class', items: [] as Item[] },
    ],
  })

  const getCurrentBooking = (bookingId: number) => {
    return testState.value.bookings.find(booking => booking.id === bookingId)
  }

  return { testState, getCurrentBooking }
}, {
  persist: true,
})
