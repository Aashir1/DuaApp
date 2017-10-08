// getElement('body').childNodes[0].remove();
function getElement(id) {
    return document.getElementById(id);
}
$(function () {

    var duaText = $("#duatext"),
        duaFor = $('#dua-for'),
        submitBtn = $('#submit-btn'),
        timeObj, flag = false;
    submitBtn.prop('disabled', true),
        currentUser = JSON.parse(localStorage.getItem('currentUser'));;

    $('#duatext, #dua-for').on('change keyup paste', function () {
        var timeObj = setInterval(() => { checkTextFields(); }, 1000);
        function checkTextFields() {
            if (duaFor.val().length > 2 && duaText.val().length > 5) {
                submitBtn.prop('disabled', false);
                clearInterval(timeObj);
                getElement('submit-btn').addEventListener('click', submitData);
                flag = true;
            }
            else {
                console.log('requirements are not full fill');
            }
            if (flag)
                clearInterval(timeObj);
        }
    });


    /* ******************************** Firebase Work ******************************************* */
    function getElement(id) {
        return document.getElementById(id);
    }

    firebase.auth().onAuthStateChanged(function (user) {
        console.log(getElement("navbarDropdownMenuLink"), user);
        if (user) {

            getElement("navbarDropdownMenuLink").innerHTML = user.displayName;
            getElement('name').innerHTML = user.displayName;
            getElement('email').innerHTML = user.email;
            getElement('gender').innerHTML = "Male";
            // getElement('age').innerHTML = "50";

        } else {
            // User is signed out.
            // ...
        }
    });
    // login-btn
    getElement("logout-btn").addEventListener('click', () => {
        firebase.auth().signOut()
            .then(() => {
                firebase.auth().onAuthStateChanged((user) => {

                    location.replace('../login.html');
                });
            })
            .catch((e) => {
                
            })
    });
    var database = firebase.database().ref('/dua-data');
    function submitData() {
        var obj = {
            dua: duaText.val(),
            name: duaFor.val(),
            likes: "",
            duaFrom: currentUser.displayName
        };
        database.push(obj);
        getElement('submit-btn').removeEventListener('click', submitData);
        submitBtn.prop('disabled', true);
        getElement('duatext').value = "";
        getElement('dua-for').value = '';
    }
    getElement('feeds-btn').addEventListener('click', () => {
        window.location.replace('feeds.html');
    });
    // getElement('delete-classes').addEventListener('click', ()=>{
    //     getElement('user-w').classList.remove('')
    //     getElement('feeds-btn')
    //     getElement('ka-ul')
    //     getElement('ka-li')
    // })
});

