// map result set for each row, fetched from db
const resultSetMapper = rowMapper => res => res.length ? res.map(rowMapper || (v => v)) : res;

module.exports = resultSetMapper;
