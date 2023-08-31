/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3s5mj8cplnr27ec")

  // update
  collection.schema.addField(new SchemaField({
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
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
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
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3s5mj8cplnr27ec")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
