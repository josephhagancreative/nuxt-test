export function createExpirationDate() {
  const expirationDate = new Date() // Current date and time
  expirationDate.setDate(expirationDate.getDate() + 1) // Adds one day
  return expirationDate
}
