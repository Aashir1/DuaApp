var likeButton;
var database = firebase.database().ref('/'),
    getElement = (id) => { return document.getElementById(id) },
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
database.child('dua-data').on('child_added', (newChild) => {
    renderDua(newChild);
});
database.child('dua-data').on('child_removed', (snapshot) => {
    console.log(snapshot.key);
    document.getElementById(snapshot.key).remove();
});

function renderDua(data) {
    var duaFromName;
    var dataKey = data.key;
    console.log(dataKey);
    console.log(data.val());

    var ul = getElement('all-dua'),
        li = document.createElement('LI'),
        h3 = document.createElement('H3'),
        h3InnerSpan = document.createElement('SPAN'),
        small = document.createElement('SMALL'),
        smallInnerSpan = document.createElement('SPAN'),
        para = document.createElement('P'),
        div = document.createElement('DIV'),
        input = document.createElement('INPUT'),
        btn = document.createElement('BUTTON'),
        commentsDiv = document.createElement('DIV'),
        h3TextNode = document.createTextNode('Dua For: '),
        spanTextNode = document.createTextNode(`${data.val().name}`),
        smallTextNode = document.createTextNode(`From `),
        smallInnerSpanTextNode = document.createTextNode(`${data.val().duaFrom}`),
        paraTextNode = document.createTextNode(`${data.val().dua}`),
        btnTextNode = document.createTextNode(`Comment`),
        likeBtn = document.createElement('BUTTON'),
        likeBtnPara = document.createElement('P'),
        likeBtnText = document.createTextNode('Like'),
        likesTextNode = document.createTextNode('Likes')
        noOfLikesSpan = document.createElement('SPAN'),
        likeBtnSpanTextNode = document.createTextNode(data.val().likes);

    likeBtn.setAttribute('class', 'btn btn-primary');
    likeBtn.setAttribute('id', 'like-btn');

    noOfLikesSpan.setAttribute('id', 'likes');
    likeBtn.appendChild(likeBtnText)

    likeButton = likeBtn;


    noOfLikesSpan.setAttribute('id', 'no-of-likes');
    likeBtnPara.setAttribute('class', 'likes');
    noOfLikesSpan.appendChild(likeBtnSpanTextNode)
    likeBtnPara.appendChild(likesTextNode);
    likeBtnPara.appendChild(noOfLikesSpan);


    li.setAttribute('class', 'col-md-6 col-lg-6 mx-auto w-100 justify-content-center dua-li card card-custom');
    li.setAttribute('id', `${data.key}`);

    h3InnerSpan.setAttribute('id', `name`);
    h3InnerSpan.appendChild(spanTextNode);
    h3.appendChild(h3TextNode);
    h3.appendChild(h3InnerSpan);
    smallInnerSpan.setAttribute('id', `dua-form`);
    smallInnerSpan.appendChild(smallInnerSpanTextNode);
    small.appendChild(smallTextNode);
    small.appendChild(smallInnerSpan);



    para.setAttribute('id', 'dua');
    para.appendChild(paraTextNode)

    div.setAttribute('id', 'comment-input');
    div.setAttribute('class', 'input-group');
    input.setAttribute('type', 'text');
    input.setAttribute('id', `comment${data.key}`);
    input.setAttribute('class', 'form-control');
    btn.setAttribute('class', 'btn btn-primary');
    btn.setAttribute('id', 'comment-btn');
    btn.onclick = () => {
        submitCom(data.key);
    }
    btn.appendChild(btnTextNode);
    div.appendChild(input);
    div.appendChild(btn);

    commentsDiv.setAttribute('id', 'all-comments');
    commentsDiv.setAttribute('class', 'ca')

    li.appendChild(h3);
    li.appendChild(small);
    li.appendChild(para);
    li.appendChild(likeBtn);
    li.appendChild(likeBtnPara);
    li.appendChild(div);
    li.appendChild(commentsDiv);

    ul.appendChild(li);

    likeBtn.onclick = function () {   // likes btn function ;
        likes(this, dataKey);

    }


    // document.getElementById('like-btn').onclick = function() {
    //     console.log(this)
    // }
}

/* ************************************** updating likes function ************************************* */

function likes(currentElement, listKey) {
    var likeText = currentElement.nextSibling.children[0].innerHTML;
    if (isNaN(likeText)) {
        if (likeText === "") {

            likeText = 0;
        }
        else {
            likeText = Number(likeText);
        }
    }
    var increment = num => ++num;


    // database.child('dua-data/' + listKey + '/likes').set(increment(likeText));
    database.child('dua-data/' + listKey).update({ likes: increment(likeText) });

    currentElement.onclick = function () {
        disLike(currentElement, listKey);
    }
    var unlikeTextNode = document.createTextNode('Unlike');
    currentElement.innerHTML = "";
    currentElement.appendChild(unlikeTextNode);
}

// Dislike Function

function disLike(currentElement, listKey) {

    var likeText = currentElement.nextSibling.children[0].innerHTML;
    likeText = Number(likeText);
    var decrement = (num) => {
        return --num;
    }
    // database.child('dua-data/' + listKey + '/likes').set(increment(likeText));
    database.child('dua-data/' + listKey).update({ likes: decrement(likeText) });

    currentElement.onclick = function () {
        likes(currentElement, listKey);
    }
    var unlikeTextNode = document.createTextNode('Like');
    currentElement.innerHTML = "";
    currentElement.appendChild(unlikeTextNode);
}







/* ************************************** updating likes function End ************************************* */

/* *************************** child change event*************************************** */


database.child('dua-data').on('child_changed', function (snapshot) {
    var li = getElement(snapshot.key);
    li.children[4].children[0].innerHTML = snapshot.val().likes;
});

database.child('likes').on('child_added', (snapshot) => {
    var li = getElement(snapshot.val().likeId);
    li.children[4].children[0].innerHTML = snapshot.val().noOfLikes;
    console.log('coming data is', snapshot.val().noOfLikes)
    console.log(li.children[4].children[0].innerHTML);
})

function submitCom(dataSnapshotId) {
    console.log(dataSnapshotId);
    console.log('comment function is called now');
    var obj = {
        comment: getElement(`comment${dataSnapshotId}`).value,
        sender: currentUser.displayName,
        commentId: dataSnapshotId
    };
    database.child('comments').push(obj);
    getElement(`comment${dataSnapshotId}`).value = "";
}

database.child('comments').on('child_added', (dataSnapshot) => {
    console.log('i am called');
    console.log(dataSnapshot.val());
    var div = document.createElement('DIV');
    var li = getElement(dataSnapshot.val().commentId);
    var comment = li.lastElementChild;
    var commentFrom = document.createElement('H5');
    var commentFromName = document.createTextNode(dataSnapshot.val().sender + " :")
    var textNode = document.createTextNode(dataSnapshot.val().comment);
    commentFrom.appendChild(commentFromName);
    div.setAttribute('class', 'card-body card-body-custom');
    div.appendChild(commentFrom);
    div.appendChild(textNode);
    comment.appendChild(div);
});