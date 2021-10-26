## First step
### `npm install`

## Start Serve
### `npm start`

## Verify
- doc/tamm.postman_collection.json is the Postman collection script, please import it into Postman.
- run scripts of getApiProxy, getPubProxy, you will get result:

  `{
       "result": -1
   }`
  
   since not login.
   
- run script of login then repeat above operations, you will get result:

    `{
        "result": 0
    }`
    since login
    
- run scripts of saveData, getData to save or retrieve JSON file.
