/**
 * @param {mongoose.Schema} schema
 * @param {?Object=} options
 */
module.exports = exports = function constantPlugin(schema, options) {
    var validSchemaTypes = ['String', 'Number', 'Date', 'ObjectID'];

    function validateSchemaType(path, schemaType) {
        if (!~validSchemaTypes.indexOf(schemaType.instance)) {
            throw new Error('Cannot use constant in path ' + path + '.\nConstant can only be used with: ' +
            validSchemaTypes.join(', '));
        }
    }

    /* Register validations. */
    schema.eachPath(function (path, schemaType) {
        if (!schemaType.options.constant)
            return;
        validateSchemaType(path, schemaType);

        (function (path) {
            schemaType.validators.push(
                [
                    function () {
                        if (this.isNew || !this.isSelected(path))
                            return;
                        return !this.isModified(path);
                    },
                    constantPlugin.ErrorMessages.ERRRESETCONST,
                    'constant plugin'
                ]
            );
        })(path);
    });
};


exports.ErrorMessages = {
    ERRRESETCONST: 'Constant `{PATH}` cannot be changed.'
};
