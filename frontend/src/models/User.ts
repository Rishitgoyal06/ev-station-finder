let users: any[] = [];

const User = {
  findOne: async (query: any) => {
    let identifier = "";
    if (query.email) identifier = query.email;
    if (query.$or) {
      identifier = query.$or[0].email || query.$or[1].name || "";
    }
    const user = users.find(u => (u.email && u.email.toLowerCase() === identifier.toLowerCase()) || (u.name && u.name.toLowerCase() === identifier.toLowerCase()));
    if (!user) return null;
    return {
      ...user,
      select: function(fields: string) { return this; }
    };
  },
  findById: async (id: string) => {
    return users.find(u => u._id === id);
  },
  create: async (data: any) => {
    const newUser = { ...data, _id: Math.random().toString(36).substring(7) };
    users.push(newUser);
    return newUser;
  }
};

export default User;
