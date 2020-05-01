exports.up = knex =>
    knex.schema.raw(`
        CREATE OR REPLACE FUNCTION haversine(lat1 real, lng1 real, lat2 real, lng2 real)
            RETURNS double precision AS
        $BODY$
        SELECT 6371 * acos(cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lng1) - radians(lng2)) +
                           sin(radians(lat1)) * sin(radians(lat2))) AS distance
        $BODY$
            LANGUAGE sql;
    `);

exports.down = knex =>
    knex.raw(`DROP FUNCTION IF EXISTS haversine(lat1 real, lng1 real, lat2 real, lng2 real)`);
