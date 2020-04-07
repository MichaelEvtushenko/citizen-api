module.exports = {
    convertToMetres: (unit, value) => {
        switch (unit.toLowerCase()) {
            case 'm':
                return value;
            case 'ft':
                return value * .3048;
            case 'km':
                return value * 1000;
            default:
                throw {message: 'Unit not supported', status: 400};
        }
    },
};
