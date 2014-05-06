(function (root) {
    var Pylon = root.Pylon = root.Pylon || function () {};

    Pylon.begets = function (children) {
        for (var child in children) {
            var self = this;
                Surrogate = function () {},
                self[child] = function () {};
            Surrogate.prototype = this.prototype;
            self[child].prototype = new Surrogate();
            self[child].begets = this.begets.bind(self[child]);
            self[child].create = this.create.bind(self[child]);
            self[child].group = children[child].group || Pylon.createGroup();

            if (children[child].context) {
                children[child].context.layers = children[child].context.layers || [];
                children[child].context.startAnimation = function () {
                    var canvas = children[child].context.canvas;
                    children[child].context.interval = window.setInterval(function () {
                        children[child].context.clearRect(0, 0, canvas.width, canvas.height);
                        for (var layer in children[child].context.layers) {
                            children[child].context.layers[layer]();
                        }
                    }, 33);
                }

                children[child].context.stopAnimation = function () {
                    window.clearInterval(children[child].context.interval);
                }
            }

            for (var key in children[child]) {
                self[child].prototype[key] = children[child][key];
            }
        }
        return self[child];
    }

    Pylon.create = function (options) {
        var thing = function () {},
            newThing; 
        thing.prototype = new this;
        newThing = new thing();
        for (var prop in options) {
            if (typeof(options[prop]) === "function") {
                // newThing.set(prop, options[prop].bind(newThing));
                newThing[prop] = options[prop].bind(newThing);
            } else {
                // newThing.set(prop, options[prop]);
                newThing[prop] = options[prop];
            }

        }
        this.group.things.push(newThing);
        return newThing;
    }

    Pylon.createGroup = function () {
        var group = function () {};

        group.prototype = {
            things: []
        }
        return new group();
    }
    
    Pylon.prototype = {
        animate: function () {
            if (this.context && this.draw) {
                this.context.layers.push(this.draw);
            }
        },
        attributes: {},
        get: function (attr) {
            return this.attributes[attr];
        },
        set: function (attr, val) {
            this.attributes[attr] = val;
        },
        name: "default",
        render: function () {},
        navigation: "string" //or function representing context
    };
})(this);

NA = Pylon;
$(document).ready(function () {
    NA.begets({
        Animal: {
            context: $('canvas')[0].getContext("2d")
        }
    });
    
    animal1 = NA.Animal.create({
        draw: function () {
            this.context.fillStyle = "#ff0000"
            var x = Math.random() * 500;
            this.context.fillRect(0,0,x,x);
        },
        name: "thing1"
    })
    animal2 = NA.Animal.create({
        draw: function () {
            this.context.fillStyle = "#000000"
            var x = Math.random() * 500;
            this.context.fillRect(0,0,x,x);
        },
        name: "thing2"
    })
});
