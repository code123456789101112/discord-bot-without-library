module.exports = (event) => {
    console.log(`I am ${event.d.user.username}#${event.d.user.discriminator}!`);
}