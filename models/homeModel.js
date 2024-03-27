// models/homeModel.js

const { getConnection } = require('./home_db');

const getHomePageData = async () => {
  const db = await getConnection();

  try {
    // Fetch data from all tables
    const [roles] = await db.query('SELECT * FROM COA_ROLES');
    const [responsibilities] = await db.query('SELECT * FROM COA_RESPONSIBILITY');
    const [menus] = await db.query('SELECT * FROM COA_MENU');
    const [functions] = await db.query('SELECT * FROM COA_FUNCTION');

    // Fetch data from COA_USER_ROLE_ASSIGNMENT
    const [userRoleAssignments] = await db.query('SELECT * FROM COA_USER_ROLE_ASSIGNMENT');

    // Organize the fetched data based on the desired format
    const formattedRoles = roles.map(role => {
      const formattedRole = { ...role };
      formattedRole.submenus = responsibilities
        .filter(responsibility => responsibility.RESPONSIBILITY_NAME === role.RESPONSIBILITY_NAME)
        .map(responsibility => {
          const formattedResponsibility = { ...responsibility };
          formattedResponsibility.menus = menus
            .filter(menu => menu.MENU_NAME === responsibility.MENU_NAME)
            .map(menu => {
              const formattedMenu = { ...menu };
              formattedMenu.functions = functions.filter(func => func.FUNCTION_NAME === menu.FUNCTION_NAME);
              return formattedMenu;
            });
          return formattedResponsibility;
        });
      return formattedRole;
    });

    return {
      roles: formattedRoles,
      userRoleAssignments: userRoleAssignments,
    };
  } finally {
    db.release();
  }
};

module.exports = {
  getHomePageData,
};
