"use strict";

define(['underscore', 'jquery', 'backbone', 'config'],
    function(_, $, Backbone, Config) {
        var Models = {};

        Models.User = Backbone.Model.extend({
            urlRoot: Config.uri.api.users,
            initialize: function () {
                this.on("sync", function (model) {
                    // ensure that password and password_confirm are
                    // only sync'd once.
                    model.unset("password", {silent: true});
                    model.unset("password_confirm", {silent: true});
                });
            },
            validate: function (attrs, options) {
                var key, val;
                for (key in attrs) {
                    val = attrs[key];
                    if (key === "name" && val.length < 3 || val.length > 32) {
                        return "Name must be greater than 2 characters and less than 33 characters.";
                    } else if ((key === "password" || key === "password_confirm") && 
                                (val.length < 4 || val.length > 32)) {
                        return "Password length must be 4 characters or longer and less than 33 characters.";
                    }
                }
                if ((attrs["password"] && attrs["password_confirm"]) &&
                    (attrs["password"] !== attrs["password_confirm"])) {
                    return "Passwords must match.";
                }
            }
        });

        Models.Users = Backbone.Collection.extend({
            url: Config.uri.api.users,
            model: Models.User
        });


        return Models;
    }
);