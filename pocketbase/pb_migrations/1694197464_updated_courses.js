/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wcw18g1mmhth7sr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qlbdakbh",
    "name": "description",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wcw18g1mmhth7sr")

  // remove
  collection.schema.removeField("qlbdakbh")

  return dao.saveCollection(collection)
})
