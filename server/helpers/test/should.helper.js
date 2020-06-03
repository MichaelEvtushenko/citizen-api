const shouldHaveProperties = (properties, body) => {
    properties.forEach(prop => {
        body.should.have.property(prop);
    });
};

module.exports = {
    shouldHaveProperties,
}
