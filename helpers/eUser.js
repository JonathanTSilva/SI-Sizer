module.exports = {
    eUser: function loggedIn(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect('usuario/login');
        }
    },
    isUser: function(req, res){
        var roles, name;

        if (req.session && req.session.auth == true) {
            roles = ['member'];
            name = (req.session.user) ? req.session.user.name : 'Registered member';
            id = (req.session.user) ? req.session.user.id : 0;
        }
        else {
            roles = ['guest'];
            name = 'Guest';
            id = null;
        }

        return {
            name: name, 
            id: id,
            roles: roles,
            isGuest: roles.indexOf('guest') !== -1,
            isAdmin: roles.indexOf('admin') !== -1
        }
    }
}