import ('../less/conversation-detail.less');
import {formatDate, dateComparator} from "./utils";

const conversationId = window.location.pathname.split('/')[3];


function renderMessages(participants, messages) {
    const cards = $('.cards');
    cards.empty();
    messages.sort((a, b) => dateComparator(a.createdAt, b.createdAt));
    for (const message of messages) {
        cards.append(`
        <div class="card m-3 w-75">
            <div class="card-body">
              <h5 class="card-title">
                    <a class="" href="/admin/users/${message.from}">
                        ${participants.find(user => user.id === message.from).fullName}             
                    </a> 
                </h5>
             <h6 class="card-subtitle mb-3 text-muted">${formatDate(new Date(Date.parse(message.createdAt)))}</h6>
             <p class="card-text">${message.text}</p> 
            </div>
        </div>
    `)
    }
}


$(document).ready(async () => {
    $('.return-btn').prop('href',);
    const conversation = await $.getJSON(`/api/messages/${conversationId}`);
    const users = await $.getJSON('/api/users/');
    const participants = users.filter(user => conversation.participants.includes(user.id));
    renderMessages(participants, conversation.messages);
});