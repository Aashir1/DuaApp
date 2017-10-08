
var getElementThrowId = (elementId) => { return document.getElementById(elementId) },
    currentUser = JSON.parse(localStorage.getItem('currentUser'));;
/* **************************************** Validation Code***************************************** */
function forValidation(element) {
    element.style.boxShadow = '0px 0px 5px #80bdff';
    element.parentNode.children[2].classList.add('display-none');
}

function validationForBlur(element) {
    if (element.value.length > 1) {
        element.style.boxShadow = 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);';
        element.parentNode.children[2].classList.add('display-none');
    }
    else {
        element.style.boxShadow = '0px 0px 5px #FB3D40';
        element.parentNode.children[2].classList.remove('display-none');
    }
}


/* *************************************** Firebase Code ****************************************************** */

var auth = firebase.auth();

/* ***********************signup function *************************** */


var signup = (email, password, firstName, lastName) => {

    auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
            console.log(user);
            return user.updateProfile({
                displayName: `${firstName} ${lastName}`,

            })
                .then(() => {
                    console.log('user successfully created');
                })
                .catch((e) => {
                    alert(e.message);
                })
        })
        .catch((e) => {
            alert(e.message);
        })
}

/* ***********************login function *************************** */

var login = (email, password) => {

    auth.signInWithEmailAndPassword(email, password)
        .then((user) => {
            console.log(user, 'Welcome you are signed in');
            window.location.replace('dua home/index.html');
        })
        .catch((e) => {
            alert(e.message);
        })

}

/* **************************************************** signup Btn Pressed ******************************************* */
function signupBtn() {
    var firstName = getElementThrowId('f-name').value,
        lastName = getElementThrowId('l-name').value,
        email = getElementThrowId('email').value,
        password = getElementThrowId('password').value,
        signupBtn = getElementThrowId('signup');

    signup(email, password, firstName, lastName);
    signupBtn.removeAttribute('onClick');
    getElementThrowId('f-name').value = '';
    getElementThrowId('l-name').value = '';
    getElementThrowId('email').value = '';
    getElementThrowId('password').value = '';

}

/* **************************************************** signup Btn Pressed ******************************************* */
function signinBtn() {
    var email = getElementThrowId('email').value,
        password = getElementThrowId('password').value,
        loginBtn = getElementThrowId('login');
    login(email, password);
    loginBtn.removeAttribute('onClick');
    getElementThrowId('email').value = '';
    getElementThrowId('password').value = '';
}
