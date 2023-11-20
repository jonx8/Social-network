import ('../less/news-list.less')
import {formatDate, dateComparator} from "./utils";

const userId = window.location.pathname.split('/')[3];

function renderNewsPosts(posts) {
    const cards = $('.news-list');
    cards.empty();

    if (posts.length === 0) {
        cards.append(`<p>Новостей пока нет</p>`);
        return;
    }
    posts.sort((a, b) => dateComparator(b.published, a.published))
    for (const post of posts) {
        cards.append(`
            <div class="card news-item">
                <div class="card-header d-flex">
                    <a href="/admin/users/${post.authorId}" class="author-link">
                        @${post.authorUsername}
                    </a>
                     <button class="btn-close delete-post-button" data-post-id="${post.id}"></button>
                </div>
                <div class="card-body">
                    <div class="published-datetime">
                        ${formatDate(new Date(Date.parse(post.published)))}
                    </div>
                    <div class="card-text"> 
                        ${post.text}
                    </div>
                </div>
            </div>
        `);
    }
    const removeButtons = $('.delete-post-button');
    for (const removeButton of removeButtons) {
        removeButton.onclick = deletePostRequest;
    }
}


function deletePostRequest(ev) {
    ev.preventDefault();
    const postId = ev.target.getAttribute('data-post-id');
    $.ajax(`/api/news/${postId}`, {type: 'DELETE'})
        .done(async () => {
            await $.getJSON(`/api/users/${userId}/news`, renderNewsPosts);
        }).fail((xhr) => {
        alert(xhr.statusText);
    });
}


$(document).ready(async () => {
    $('.return-btn').prop('href', `/admin/users/${userId}`);
    await $.getJSON(`/api/users/${userId}/news`, renderNewsPosts);

});