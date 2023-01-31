# fampay1

## Brief Description:
All 3 basic requirements and the 1st additional requirement have been fulfilled.
Search Api is basic, searches if the query string is present as a substring in title or description.

## Starting the server:

1) install postgres version 15.1 on local.

2) change the file config/config.json accordingly

3) create a table in postgres with the name chosen in step2 config file attribute "database".

4) run -> npm install --save in the project directory

5) run -> npm start

6) verify the server has started (you will be able to see logs as follows):

Executing (default): select api_key from apikeys where is_stale = 'false' limit 1
Executing (default): SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'apikeys'
Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'apikeys' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
Executing (default): SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'videos'
Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'videos' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
scheduler ran @ -->  2023-01-31T14:17:30.982Z

7)  you will encounter the following logs initially:
scheduler ran @ -->  2023-01-31T14:19:45.288Z
API_KEY in use -  undefined
scheduler ran @ -->  2023-01-31T14:19:50.296Z
API_KEY in use -  undefined
Bad Request, check if active api keys exist!

this is because,
when starting the application for the 1st time, api keys need to be fed into the table,
so hit the following cURL in postman:


curl --location --request POST 'localhost:8081/api/apikey' \
--header 'Content-Type: application/json' \
--data-raw '{
    "api_key" : "AIzaSyBUb1G5sobnuO8xnax2Cswop3z_xvbvpjc"
}'


after which the logs will reflect 
scheduler ran @ -->  2023-01-31T14:27:55.756Z
API_KEY in use -  AIzaSyBUb1G5sobnuO8xnax2Cswop3z_xvbvpjc

8) note - this api key has 99 usages left and the scheduler is configured to run for every 5 seconds. so once it gets exhausted, the previous logs will come, then hit the cURL again with a new api key in the request body

## Testing the application

task 1 ->  Server should call the YouTube API continuously in background
testing -> visible in logs, check the video table in db, entries are inserted

task 2 -> A GET API which returns the stored video data in a paginated response sorted in descending order of published datetime.
testing -> use the following cURL :

curl --location --request GET 'localhost:8081/api/video?pageSize=3&pageNum=1'


task 3 -> A basic search API to search the stored videos using their title and description.
testing -> use the following cURL:

curl --location --request GET 'localhost:8081/api/video/search?searchQuery=cricket'

additional task 1 -> Add support for supplying multiple API keys so that if quota is exhausted on one, it automatically uses the next available key.
testing -> add multiple api keys using the following cURL:

curl --location --request POST 'localhost:8081/api/apikey' \
--header 'Content-Type: application/json' \
--data-raw '{
    "api_key" : "AIzaSyBUb1G5sobnuO8xnax2Cswop3z_xvbvpjc"
}'

when one gets used up the other one is picked up automatically
one can observe logs for it
OR
when one gets exausted, its stale column will become true in the table apikeys

--------------------------------------------------------------------------------------------------------------------------------------------------------
