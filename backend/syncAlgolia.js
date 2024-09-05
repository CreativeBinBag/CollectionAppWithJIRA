const { index } = require('./config/algoliaClient');
const {sequelize, Item} = require('.');

const syncAlgolia = async() => {
  try{
    const items = await Item.findAll();
    
    //prepare data for algolia
    const objects = items.map( item => ({
        objectID: item.id,
        name: item.name || '',
        collectionId: item.collectionId,
        custom_int1_value: item.custom_int1_value ?? 0,
        custom_int2_value: item.custom_int2_value ?? 0,
        custom_int3_value: item.custom_int3_value ?? 0,
        custom_string1_value: item.custom_string1_value || '',
        custom_string2_value: item.custom_string2_value || '',
        custom_string3_value: item.custom_string3_value || '',
        custom_text1_value: item.custom_text1_value || '',
        custom_text2_value: item.custom_text2_value || '',
        custom_text3_value: item.custom_text3_value || '',
        custom_bool1_value: item.custom_bool1_value ?? false,
        custom_bool2_value: item.custom_bool2_value ?? false,
        custom_bool3_value: item.custom_bool3_value ?? false,
        custom_date1_value: item.custom_date1_value ? item.custom_date1_value.toISOString() : null,
        custom_date2_value: item.custom_date2_value ? item.custom_date2_value.toISOString() : null,
        custom_date3_value: item.custom_date3_value ? item.custom_date3_value.toISOString() : null
    }))
    await index.saveObjects(objects);
    console.log("All items have been indexed in Algolia successfully");
  }catch(error){
      console.error('Error during algolia sync', error);
  } finally {
    //close db connection after sync
    await sequelize.close();
  }
};

syncAlgolia();