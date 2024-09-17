export const paginate = (data, page, itemsPerPage) => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return data.slice(start, end);
};
