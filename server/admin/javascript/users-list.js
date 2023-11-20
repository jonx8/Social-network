import ('../less/users-list.less')

function renderTable(usersList) {
    let tableBody = $('#users-table > tbody');
    tableBody.empty();
    for (const user of usersList) {
        tableBody.append(`
            <tr>
                <th scope="row">${user.id}</th>     
                <td><a href="/admin/users/${user.id}">${user.username}</a></td>
                <td>${user.email}</td>
                <td>${user.fullName}</td>
                <td>${user.status}</td>
                <td>${user.isAdmin ? "Администратор" : "Пользователь"}</td>
            </tr>
        `);
    }
}

$(document).ready(async () => {

    $.getJSON('/api/users/', renderTable);
    $('#filter-select').on('change', ev => {
        const filterType = $(ev.target).val();
        $.getJSON(`/api/users/filter/`, {"type": filterType}, renderTable);
    });

});

