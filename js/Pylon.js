(function (root) {
    var Pylon = root.Pylon = root.Pylon || function () {};

    Pylon.begets = function (children) {
        var self = this;
        for (var child in children) {
            self[child] = function () {};
            self[child].prototype = Object.create(self.prototype);
            self[child].begets = this.begets.bind(self[child]);
            self[child].create = this.create.bind(self[child]);
            self[child].group = children[child].group || Pylon.createGroup();

            if (children[child].context) {
                children[child].context.frameCount = children[child].context.frameCount || 0;
                children[child].context.layers = children[child].context.layers || [];
                children[child].context.startAnimation = function () {
                    var canvas = children[child].context.canvas;
                    children[child].context.interval = window.setInterval(function () {
                        children[child].context.clearRect(0, 0, canvas.width, canvas.height);
                        for (var layer in children[child].context.layers) {
                            children[child].context.layers[layer](children[child].context.frameCount);
                        }
                        children[child].context.frameCount++;
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
        var thing = this,
            newThing = new thing; 
            newThing.attrs = {};
        for (var prop in options) {
            if (typeof(options[prop]) === "function") {
                newThing.set(prop, options[prop].bind(newThing));
                newThing[prop] = options[prop].bind(newThing);
            } else {
                newThing.set(prop, options[prop]);
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
            if (this.context && this.get('draw')) {
                this.context.layers.push(this.get('draw'));
            }
        },
        get: function (attr) {
            return this.attrs[attr];
        },
        set: function (attr, val) {
            this.attrs[attr] = val;
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
        draw: function (frameCount) {
            console.log(frameCount);
            this.context.fillStyle = "#ff0000"
            this.x = (frameCount % 30 === 0 ) ? Math.random() * 500 : this.x;
            this.context.fillRect(0,0,this.x,this.x);
        },
        name: "thing1",
        x: 200
    })
    animal2 = NA.Animal.create({
        draw: function (frameCount) {
            this.context.fillStyle = "#000000"
            var x = Math.random() * 500;
            this.context.fillRect(0,0,x,x);
        },
        name: "thing2"
    })
});
