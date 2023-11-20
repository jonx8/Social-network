import ('../less/conversations.less');
const userId = parseInt(window.location.pathname.split('/')[3]);

function renderConversation(conversationsMap) {
    const list = $('.conversations > ul');
    list.empty();
    if (conversationsMap.size === 0) {
        $(`<p class="mt-5">У пользователя нет ни одного диалога</p>`).insertBefore(list);
        return;
    }

    for (const [conversationId, userFullName] of conversationsMap.entries()) {
        list.append(`
            <a href="/admin/messages/${conversationId}" class="list-group-item list-group-item-action">
                ${userFullName}
            </a>
        `);
    }
}


$(document).ready(async () => {
    $('.return-btn').prop('href', `/admin/users/${userId}`);
    const conversations = await $.getJSON(`/api/users/${userId}/messages`);
    const users = await $.getJSON('/api/users');
    const conversationUserMap = new Map();
    for (const conversation of conversations) {
        const otherId = conversation.participants.find(it => it !== userId);
        const user = users.find(user => user.id === otherId);
        conversationUserMap.set(conversation.id, user.fullName);
    }
    renderConversation(conversationUserMap);
});