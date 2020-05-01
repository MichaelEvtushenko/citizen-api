module.exports = {
    convertToMetres: (unit, value) => {
        switch (unit.toLowerCase()) {
            case 'm':
                return value;
            case 'ft':
                return value * .3048;
            case 'km':
                return value * 1000;
            case 'mi':
                return value * 1609;
            default:
                throw {message: 'Unit not supported', status: 400};
        }
    },
};
