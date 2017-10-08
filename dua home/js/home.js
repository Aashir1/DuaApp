var auth = firebase.auth(),
    getElement = (id) =>{return document.getElementById(id)};

auth.onAuthStateChanged((user)=>{
    if(user){
        localStorage.setItem('currentUser', JSON.stringify(user))
        console.log(user)
        getElement('navbarDropdownMenuLink').innerHTML = user.displayName;
    }
    else{
        alert('something is going wrong');
    }
})
