/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wcw18g1mmhth7sr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qa8u1ke1",
    "name": "parentLongRunningCourse",
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
  const collection = dao.findCollectionByNameOrId("wcw18g1mmhth7sr")

  // remove
  collection.schema.removeField("qa8u1ke1")

  return dao.saveCollection(collection)
})
