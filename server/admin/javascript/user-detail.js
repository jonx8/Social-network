import ('../less/user-detail.less');

const userId = location.pathname.split('/')[3];
const defaultAvatar = "/public/images/default-avatar.png";
let userData = {};

function fillUserForm(userData) {
    $("#username-input").val(userData.username);
    $("#name-input").val(userData.fullName);
    $("#birthdate-input").val(userData.birthDate);
    $("#admin-checkbox").prop("checked", userData.isAdmin);
    $("#status-select").val(userData.status);
    $("#email-input").val(userData.email);
    $(".user-avatar").prop('src', userData.avatar);
}


function deleteButtonClick() {
    $.ajax({
        type: "DELETE",
        url: `/api/users/${userId}`
    }).done((res) => {
        console.log(res);
        window.location.href = '/';
    }).fail(err => {
        console.log(err);
    });
}


function sendForm(ev) {
    ev.preventDefault();

    function sendFormWithoutAvatar(data, userId) {
        $.ajax(`/api/users/${userId}`, {
            type: "PUT",
            data: JSON.stringify(data),
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
        }).done(xhr => {
            console.log(xhr);
            fillUserForm(xhr)
        }).fail(() => alert("bad request"));
    }

    const formData = new FormData($("#user-settings-form")[0]);


    // Use only pathname
    const avatarImgSrc = $('.user-avatar')
        .prop('src')
        .replace(window.location.origin, '');

    let jsonData = {...userData}
    jsonData.isAdmin = formData.get('isAdmin') === 'on';
    jsonData.status = formData.get('status');
    jsonData.birthDate = formData.get('birthDate').toString();
    jsonData.fullName = formData.get('fullName').toString();
    jsonData.avatar = avatarImgSrc;


    // Send only non-empty file
    const avatarFile = formData.get('avatar');
    if (avatarFile.size) {
        const fileData = new FormData();
        fileData.append('avatar', avatarFile);
        $.ajax('/api/upload/avatar', {
            type: "POST",
            data: fileData,
            contentType: false,
            processData: false,
        }).done(xhr => {
            jsonData.avatar = xhr;
            sendFormWithoutAvatar(jsonData, userId);
        }).fail(() => alert("unable to upload"));
        return;
    }

    sendFormWithoutAvatar(jsonData, userId);
}

$(document).ready(async () => {

    $('.user-avatar').on('error', (ev) => {
        ev.target.src = defaultAvatar
    });

    $('#news-link').prop('href', `/admin/users/${userId}/news`);
    $('#friends-link').prop('href', `/admin/friends/${userId}`);
    $('#messages-link').prop('href', `/admin/users/${userId}/messages`);
    userData = await $.getJSON(`/api/users/${userId}`);
    console.log(userData);
    fillUserForm(userData);

    // Delete user modal configuration
    const deleteUserModal = $("#delete-btn-modal");
    $("#delete-user-button").on('click', () => deleteUserModal.show());
    $("#delete-btn-modal .btn-close").on('click', () => deleteUserModal.hide());
    $("#cancel-btn").on('click', () => deleteUserModal.hide());
    $("#confirm-btn").on('click', deleteButtonClick);
    $('#save-button').on('click', sendForm);
});
