module.exports = {
    convertToMetres: (unit, value) => {
        switch (unit.toLowerCase()) {
            case 'm':
                return value;
            case 'ft':
                return value * .3048;
            default:
                throw {message: 'Unit not supported', status: 400};
        }
    },
};
