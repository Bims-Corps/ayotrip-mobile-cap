const WISHLIST_KEY = 'ayotrip_wishlist'

export const wishlistService = {
  getWishlist: (): string[] => {
    try {
      const data = localStorage.getItem(WISHLIST_KEY)
      if (data) return JSON.parse(data)
    } catch (e) {
      console.error(e)
    }
    return ['trip-1', 'trip-3'] // default saved trips
  },

  isInWishlist: (tripId: string): boolean => {
    const list = wishlistService.getWishlist()
    return list.includes(tripId)
  },

  toggleWishlist: (tripId: string): boolean => {
    const list = wishlistService.getWishlist()
    let updated: string[]
    let added = false
    if (list.includes(tripId)) {
      updated = list.filter((id) => id !== tripId)
      added = false
    } else {
      updated = [...list, tripId]
      added = true
    }
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated))
      window.dispatchEvent(new Event('ayotrip_wishlist_updated'))
    } catch (e) {
      console.error(e)
    }
    return added
  }
}

