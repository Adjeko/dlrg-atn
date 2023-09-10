/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wcw18g1mmhth7sr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "r33w0x7u",
    "name": "date",
    "type": "date",
    "required": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wcw18g1mmhth7sr")

  // remove
  collection.schema.removeField("r33w0x7u")

  return dao.saveCollection(collection)
})
