const socket = io();


//elements

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#loc')
const messageTemplate = document.querySelector('#message-template').innerHTML;
const $messages = document.querySelector('#messages');
const locationMessageTemplate = document.querySelector('#location-template').innerHTML;



socket.on('recieve', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username : message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('loc', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username : message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const tobesent = e.target.elements.message.value;
    $messageFormButton.setAttribute('disabled', 'disabled')
    
    socket.emit('send',tobesent,(error)=>{
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if (error){
            console.log("Profane words");
        }
    });
})

document.querySelector('#loc').addEventListener('click',()=>{
    const location = navigator.geolocation.getCurrentPosition((postion)=>{
        socket.emit('sendLocation',{
            latitude : postion.coords.latitude,
            longitude : postion.coords.longitude
        });
    });
    
})

const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true});

socket.emit('join',{username,room});