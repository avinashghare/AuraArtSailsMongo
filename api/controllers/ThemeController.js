/**
 * ThemeController
 *
 * @description :: Server-side logic for managing Theme
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Theme.save(req.body, print);
    },
    find: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Theme.find(req.body, print);
    },
    findlimited: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Theme.findlimited(req.body, print);
    },
    findone: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Theme.findone(req.body, print);
    },
    delete: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Theme.delete(req.body, print);
    }
};