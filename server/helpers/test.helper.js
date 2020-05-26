const shouldHaveProperties = (properties, res) => {
    properties.forEach(prop => {
        res.body.should.have.property(prop);
    });
};

module.exports = {
    shouldHaveProperties,
}
