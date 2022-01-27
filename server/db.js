const base = [{ id: 1, name: "Admin", email: "admin@gmail.com" }];

module.exports.db = {
  post: (data) => {
    const id = base[base.length - 1].id + 1;
    base.push({ id, ...data });
    const [result] = base.filter((item) => item.id === id);
    return result;
  },

  get: (id) => {
    const [result] = base.filter((item) => item.id === Number(id));
    return result;
  },

  list: () => {
    return base;
  },
};
