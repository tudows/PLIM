app.service("PowerLine", function () {
    var powerline = null;

    this.setPowerline = function (powerline) {
        this.powerline = powerline;
    }

    this.getPowerline = function () {
        return this.powerline;
    }
});