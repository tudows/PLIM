app.service("User", function () {
    var user = null

    this.setUser = function (user) {
        this.user = user;
    }

    this.getUser = function () {
        return this.user;
    }
});