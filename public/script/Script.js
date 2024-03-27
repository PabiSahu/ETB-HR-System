
// script/Script.js

function toggleSidebar() {
    const sidebarContainer = document.querySelector('.sidebar-container');
    const content = document.querySelector('.content');

    if (sidebarContainer.style.left === '0px') {
        sidebarContainer.style.left = '-200px';
        content.style.marginLeft = '0';
    } else {
        sidebarContainer.style.left = '0';
        content.style.marginLeft = '200px'; /* Adjust based on sidebar width */
    }
}

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const expandIcon = section.querySelector('#expand-icon');
    const collapseIcon = section.querySelector('#collapse-icon');

    if (section.style.display === 'none' || section.style.display === '') {
        section.style.display = 'block';
        expandIcon.style.display = 'none';
        collapseIcon.style.display = 'inline-block';
    } else {
        section.style.display = 'none';
        expandIcon.style.display = 'inline-block';
        collapseIcon.style.display = 'none';
    }
}

function logout() {
    // Implement your logout logic here
    alert('Logout clicked. Implement your logout logic here.');
}

document.addEventListener('DOMContentLoaded', function () {
    fetchRoles();

    function fetchRoles() {
        const sidebarContainer = document.querySelector('.sidebar-container');

        fetch('/api/roles')
            .then(response => response.json())
            .then(data => {
                data.forEach(role => {
                    const roleSidebar = createRoleSidebar(role.ROLE_NAME);
                    sidebarContainer.appendChild(roleSidebar);
                    fetchAndPopulateSidebarData(role.ROLE_NAME, roleSidebar);
                });
            })
            .catch(error => console.error('Error fetching roles:', error));
    }

    function createRoleSidebar(roleName) {
        const sidebar = document.createElement('div');
        sidebar.classList.add('sidebar');
        sidebar.id = `${roleName.toLowerCase()}-sidebar`;

        const h2 = document.createElement('h2');
        h2.innerHTML = `
            <button onclick="toggleSection('${roleName.toLowerCase()}-responsibility')">
                <span id="expand-icon">&#9654;</span>
                <span id="collapse-icon" style="display:none;">&#9660;</span>
            </button>
            ${roleName}
        `;
        sidebar.appendChild(h2);

        // Create a container div for responsibility and set its id
        const responsibilityContainer = document.createElement('div');
        responsibilityContainer.id = `${roleName.toLowerCase()}-responsibility`;
        sidebar.appendChild(responsibilityContainer);

        return sidebar;
    }

    function fetchAndPopulateSidebarData(roleName, sidebar) {
        fetch(`/api/sidebar_data?role=${roleName}`)
            .then(response => response.json())
            .then(data => {
                const responsibilityContainer = document.getElementById(`${roleName.toLowerCase()}-responsibility`);
                data.forEach(responsibility => {
                    const responsibilityItem = createSidebarItem(responsibility.RESPONSIBILITY_NAME);

                    responsibility.MENUS.forEach(menu => {
                        const menuItem = createSidebarItem(menu.MENU_NAME);

                        menu.FUNCTIONS.forEach(func => {
                            const functionItem = createSidebarItem(func.FUNCTION_NAME);
                            menuItem.appendChild(functionItem);
                        });

                        responsibilityItem.appendChild(menuItem);
                    });

                    responsibilityContainer.appendChild(responsibilityItem);
                });
            })
            .catch(error => console.error(`Error fetching data for ${roleName} sidebar:`, error));
    }

    function createSidebarItem(text) {
        const listItem = document.createElement('div');
        listItem.textContent = text;
        listItem.classList.add('sidebar-item');

        listItem.addEventListener('click', () => {
            listItem.classList.toggle('collapsed');
        });

        return listItem;
    }
});
