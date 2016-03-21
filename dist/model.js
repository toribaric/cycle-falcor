'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _falcor = require('falcor');

var _falcor2 = _interopRequireDefault(_falcor);

var _falcorHttpDatasource = require('falcor-http-datasource');

var _falcorHttpDatasource2 = _interopRequireDefault(_falcorHttpDatasource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataModel = new _falcor2.default.Model({
    source: new _falcorHttpDatasource2.default('./model.json', {
        timeout: 60000
    })
});

exports.default = dataModel;