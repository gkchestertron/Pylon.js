(function (root) {
    var Pylon = root.Pylon = root.Pylon || function () {};

    Pylon.begets = function (children) {
        for (var child in children) {
            var Surrogate = function () {};
                this[child] = function () {};
            Surrogate.prototype = this.prototype;
            this[child].prototype = new Surrogate();
            this[child].begets = this.begets;
            this[child].create = this.create;
            this[child].group = children[child].group || Pylon.createGroup();
            for (var key in children[child]) {
                this[child].prototype[key] = children[child][key];
            }
        }
        return this[child];
    }

    Pylon.create = function (options) {
        var thing = function () {};
        thing.prototype = this.prototype;
        thing = new thing();
        for (var prop in options) {
            thing.set(prop, options[prop]);
        }
        this.group.things.push(thing);
        return thing;
    }

    Pylon.createGroup = function () {
        var group = function () {};

        group.prototype = {
            things: []
        }
        return new group();
    }
    
    Pylon.prototype = {
        attributes: {},
        get: function (attr) {
            return this.attributes[attr];
        },
        set: function (attr, val) {
            this.attributes[attr] = val;
        },
        name: "default",
        render: function () {},
        draw: function () {},
        context: {}, // contains reference to animation timer?
        navigation: "string" //or function representing context
    };
})(this);

NA = Pylon;

NA.begets({
    Animal: {
        run: function () {
            console.log('run!');
        }
    }
});
