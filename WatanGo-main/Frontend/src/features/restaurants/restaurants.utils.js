export function formatDeliveryTime(min, max) {
  return `${min} - ${max} دقيقة`;
}

export function formatDeliveryFee(fee) {
  return fee === 0 ? "مجاني" : `${fee} شيكل`;
}

export function formatPrice(price) {
  return `${price} شيكل`;
}

export function formatRating(rating) {
  return Number(rating).toFixed(1);
}

export function getRestaurantInitials(name) {
  if (!name) return "م";
  const words = name.trim().split(/\s+/);
  return words.length >= 2 ? words[0][0] + words[1][0] : words[0].slice(0, 2);
}
