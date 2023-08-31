/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "3s5mj8cplnr27ec",
    "created": "2023-08-31 16:08:30.867Z",
    "updated": "2023-08-31 16:08:30.867Z",
    "name": "isMemberOf",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "w5lji9qc",
        "name": "user",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "va6v9b13",
        "name": "course",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "wcw18g1mmhth7sr",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": []
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("3s5mj8cplnr27ec");

  return dao.deleteCollection(collection);
})
