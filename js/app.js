'use strict';

//Enable search feature
let users;

/**
 * Make the Gallery HTML and append it to the Gallery
 * @param {Object} user 
 */
function makeGallery(user){
    const html = `
        <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${user.picture.medium}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
        </div>
        </div>
    `;
    //Add User card to the end of the gallery
    const gallery = document.getElementById('gallery');
    gallery.insertAdjacentHTML('beforeend',html);

    //Get handle of the newly inserted card from the gallery
    const currentElem = gallery.lastElementChild;

    //Exceed Expectaion randomized background colors for the card
    const colors = ['aliceblue','azure','beige','floralwhite','ghostwhite','honeydew','lavender','lavenderblush','lightcyan','lemonchiffon','skyeblue','wheat'];
    currentElem.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
    
    //When user clicks anywhere in the Card will show a modal with detailed info
    currentElem.addEventListener('click',(event)=>{
        //Enables modal
        makeModal(user,currentElem);
    });
}
/**
 * Creates a in-page modal and populate with the User information
 * @param {Object} user User information to be populated inside of the modal
 * @param {Element} fromElem Gets a handle of which Card the user clicked 
 */
function makeModal(user,fromElem){

    //Format the Birth Day of the given User
    const dob = new Date(user.dob.date);
    const dobMonth = dob.getMonth() +1;
    const birthDay = `${ (dobMonth < 10) ? '0' + dobMonth : dobMonth}/${ (dob.getDate()< 10) ? '0' + dob.getDate() : dob.getDate()}/${dob.getFullYear()}`;

    //Create the HTML with given User object
    const html = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${user.picture.medium}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="modal-text">${user.email}</p>
                    <p class="modal-text cap">${user.location.city}</p>
                    <hr>
                    <p class="modal-text">${user.phone}</p>
                    <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                    <p class="modal-text">Birthday: ${birthDay}</p>
                </div>
            </div>

            // IMPORTANT: Below is only for exceeds tasks 
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;
    //Add the modal to the UI
    document.body.insertAdjacentHTML('beforeend',html);

    //Removes the modal when the user clicks on the Close button of the modal
    document.getElementById('modal-close-btn').addEventListener('click',()=>{
        document.querySelector('.modal-container').remove();
    });
    
    // Removes Previous button if no more Cards prior to this Card
    if (fromElem.previousElementSibling === null){
        document.getElementById('modal-prev').classList.add('hide');
    }

    // Remove Next button from UI if no more Cards after this Card
    if (fromElem.nextElementSibling === null){
        document.getElementById('modal-next').classList.add('hide');
    }

    //Enables Previous button on the Modal
    document.getElementById('modal-prev').addEventListener('click',(event)=>{
        //Making sure is not the first Card in the Gallery
        if (fromElem.previousElementSibling !== null){
            //Removes the existing modal
            document.querySelector('.modal-container').remove();
            //Enables the modal from the previous Card
            fromElem.previousElementSibling.click();
        }
    });
    //Enables Next button on the Modal
    document.getElementById('modal-next').addEventListener('click',()=>{
        //Make sure is not the last Card in the Gallery
        if(fromElem.nextElementSibling !== null){
            //Remove the existing modal
            document.querySelector('.modal-container').remove();
            //Enables the modal from the next Card
            fromElem.nextElementSibling.click();
        }
    });
}
/**
 * Enable Search on the UI
 */
function enableSearch(){
    const html=`<form action="#" method="get">
                    <input type="search" id="search-input" class="search-input" placeholder="Search...">
                    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                </form>`;
    //Add search form in the UI
    const searchContainer = document.querySelector('.search-container');
    searchContainer.insertAdjacentHTML('beforeend',html);

    //Enable search event 
    const form = searchContainer.querySelector('form');
    form.addEventListener('submit',(event)=>{
        //Prevent default submit of the form
        event.preventDefault();

        //Gets the search keyword
        const q = document.getElementById('search-input').value;
        
        //Empty out the gallery
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';

        //If only whitespace or empty show all users
        if (q.trim()=== ''){
            //Show all Users
            users.map(user=>{makeGallery(user);});
        } else {
            //Filter out only User with first and last name matches with the search keyword
            const qExp = new RegExp(q,'i');
            const searched = users.filter((user)=>qExp.test(user.name.first) ||
                                 qExp.test(user.name.last));
            
            // Determine if User(s) found
            if (searched.length > 0){
                // Show those users in the Gallery
                 searched.map(user=>makeGallery(user));
            } else {
                //Show No match found and clickable link to Show all users again.
                gallery.innerHTML = '<h3>No match found! <a href="#" id="showAllUsers" alt="Show all Users">Show all Users</a> instead.</h3>';
                document.getElementById('showAllUsers').addEventListener('click',()=>{
                    const query = document.getElementById('search-input');
                    query.value = '';
                    document.getElementById('search-submit').click();
                });
            }
        }
    });

}

// When the Page content is fully Loaded 
document.addEventListener('DOMContentLoaded', ()=>{
    //Start fetching JSON from randomuser.me with only 12 users and in United States and Great Britian only.
    fetch('https://randomuser.me/api/?results=12&nat=us,gb')
        .then(res=>res.json()) // JSON deserailize the result
        .then(randomUser=>{
            // Sets the global users object to hold the result
            users = randomUser.results; 
            
            // For each user create a Card and add to the Gallery
            users.map(user=>{makeGallery(user);});

            // Enables search for Users base on match from either First or Last name.
            enableSearch();
        })
        .catch(err=>document.body.insertAdjacentHTML('beforeend',`<h3>Oops Error from fetching : ${err}`));

 
});
