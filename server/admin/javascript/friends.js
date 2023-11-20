import ('../less/friends.less')
const userId = window.location.pathname.split('/')[3];

function renderFriendsCards(friendsList) {
    const cards = $('.friends-cards');
    cards.empty();

    if (friendsList.length === 0) {
        $(`<p class="mt-5">Пользователь не добавлял друзей</p>`).insertBefore(cards);
        return;
    }

    for (const friend of friendsList) {
        cards.append(`
                <div class="card">
                  <img class="card-img-top" src="${friend.avatar}" alt="Фото пользователя">
                  <div class="card-body">
                    <h5 class="card-title">
                        <a href="/admin/users/${friend.id}">${friend.fullName}</a>
                    </h5>
                    <p class="card-text">@${friend.username}</p>
                  </div>
                  <div class="card-body">
                        <a href="" class="remove-friend-btn" data-user-id="${friend.id}">
                            Удалить из друзей
                        </a>
                  </div>
                </div>
        `);
    }
    updateRemoveFriendLinks();
}


function updateRemoveFriendLinks() {
    const removeButtons = $('.remove-friend-btn');
    for (const removeButton of removeButtons) {
        removeButton.onclick = deleteFriendRequest;
    }
}

function deleteFriendRequest(ev) {
    ev.preventDefault();
    // JSON patch style
    const data = {
        op: 'remove',
        path: 'friends',
        value: ev.target.getAttribute('data-user-id')
    }

    $.ajax(`/api/friends/${userId}`, {
        type: 'PATCH',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(data)
    }).done(async () => {
        await $.getJSON(`/api/friends/${userId}/`, renderFriendsCards);
    }).fail((xhr) => {
        alert(xhr.statusText);
    });

}


$(document).ready(async () => {
    $('.return-btn').prop('href', `/admin/users/${userId}`);
    await $.getJSON(`/api/friends/${userId}/`, renderFriendsCards);
});