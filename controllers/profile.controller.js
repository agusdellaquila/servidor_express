const getProfileController = (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        let userObject = req.session.userObject
        res.render('profile.ejs', {userObject})
    }
}

module.exports = {getProfileController}