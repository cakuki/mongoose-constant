var util = require('util');


/**
 * @param {mongoose.Schema} schema
 * @param {?Object=} options
 */
module.exports = exports = function constantPlugin(schema, options) {
    options = options || {};
    options.ValidSchemaTypes = options.ValidSchemaTypes || ['String', 'Number', 'Date', 'ObjectID'];
    options.ErrorType = options.ErrorType || constantPlugin.ERROR_TYPE;

    function validateSchemaType(path, schemaType) {
        if (!~options.ValidSchemaTypes.indexOf(schemaType.instance))
            throw new Error(util.format(constantPlugin.ErrorMessages.ERRINVALIDTYPE, path, schemaType.instance,
                options.ValidSchemaTypes.join(', ')));
    }

    /* Register validations. */
    schema.eachPath(function (path, schemaType) {
        if (!schemaType.options.constant)
            return;
        validateSchemaType(path, schemaType);

        (function (path) {
            schemaType.validators.push([
                function () {
                    if (this.isNew || !this.isSelected(path))
                        return;
                    return !this.isModified(path);
                },
                constantPlugin.ErrorMessages.ERRCONSTRESET,
                options.ErrorType
            ]);
        })(path);
    });
};


exports.ErrorMessages = {
    ERRCONSTRESET: 'Constant `{PATH}` cannot be changed.',
    ERRINVALIDTYPE: 'Cannot use constant in path `%s` with type `%s`.\nConstant can only be used with: %s'
};


exports.ERROR_TYPE = 'constant plugin';
