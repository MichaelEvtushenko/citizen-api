const throwInCase = (result, ex) => {
    if (result && ex)
        throw ex;
};

const trowInCaseLambda = (result, lambda) => {
    if (result && lambda) {
        const ex = lambda();
        if (ex) {
            throw ex;
        }
    }
};

module.exports = {
    throwInCase,
    trowInCaseLambda,
};
