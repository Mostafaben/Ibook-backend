const book_status = {
  OLD: 0,
  GOOD: 1,
  NEW: 2,
};
const user_role = {
  ADMIN: 0,
  USER: 1,
};

const book_state = {
  AVAILABLE: 0,
  SOLD: 1,
};

const respond_status = {
  PENDING: 0,
  ACCEPTED: 1,
};

const offer_status = {
  ACTIVE: 0,
  SOLD: 1,
  CANCELED: 2,
};

const offer_type = {
  SELL: 0,
  EXCHANGE: 1,
};

module.exports = {
  book_status,
  user_role,
  book_state,
  respond_status,
  offer_status,
  offer_type,
};
