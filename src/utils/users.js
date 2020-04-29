let users = [];

const adduser = (id,username,room)=>{
    const user = {id,username,room};
    users.push(user);
}

const removeUser = (id)=>{
    let idx = users.findIndex((user)=>{
        return user.id === id;
    })
    
    const user = users[idx];
    //console.log(here,user);
    users.splice(idx,1);
    return user;
}

const getRoomUsers  = (room) => {
    const temp = users.filter((user)=>{
        return (user.room === room)

    })
}

const getUser = (id)=>{
    let idx = users.findIndex((user)=>{
        return user.id === id;
    })
    return users[idx];
}

module.exports = {
    adduser,
    removeUser,
    getRoomUsers,
    getUser
}