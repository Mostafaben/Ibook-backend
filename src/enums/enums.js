const book_status = {
    OLD: 0,
    GOOD: 1,
    NEW: 2,
  },
  user_role = {
    ADMIN: 0,
    USER: 1,
    SHOP: 2,
  },
  book_state = {
    AVAILABLE: 0,
    SOLD: 1,
  },
  respond_status = {
    PENDING: 0,
    ACCEPTED: 1,
  },
  offer_status = {
    ACTIVE: 0,
    SOLD: 1,
    CANCELED: 2,
  },
  offer_type = {
    SELL: 0,
    EXCHANGE: 1,
  },
  file_types = ['IMG', 'PDF', 'TXT', 'OTHER'];

module.exports = {
  book_status,
  user_role,
  book_state,
  respond_status,
  offer_status,
  offer_type,
  file_types,
};
